import { createClient } from "@/lib/supabase/server";
import type {
  CarryForwardSource,
  DailyPage,
  Day,
  Note,
  Priority,
  Task,
} from "@/types/database";

export function dateInTimezone(timezone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function previousDate(date: string) {
  const value = new Date(`${date}T00:00:00Z`);

  value.setUTCDate(value.getUTCDate() - 1);

  return value.toISOString().slice(0, 10);
}

async function getDayContent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  dayId: string,
) {
  const [dayResult, prioritiesResult, tasksResult, noteResult] =
    await Promise.all([
      supabase.from("pro_days").select("*").eq("id", dayId).single(),

      supabase
        .from("pro_priorities")
        .select("*")
        .eq("day_id", dayId)
        .order("position")
        .order("created_at"),

      supabase
        .from("pro_tasks")
        .select("*")
        .eq("day_id", dayId)
        .order("position")
        .order("created_at"),

      supabase
        .from("pro_notes")
        .select("*")
        .eq("day_id", dayId)
        .eq("position", 0)
        .maybeSingle(),
    ]);

  const error =
    dayResult.error ??
    prioritiesResult.error ??
    tasksResult.error ??
    noteResult.error;

  if (error) throw error;

  return {
    day: dayResult.data as Day,
    priorities: (prioritiesResult.data ?? []) as Priority[],
    tasks: (tasksResult.data ?? []) as Task[],
    note: (noteResult.data as Note | null) ?? null,
  };
}

function hasTransferableContent(
  priorities: Priority[],
  tasks: Task[],
  note: Note | null,
) {
  const hasIncompletePriority = priorities.some(
    (priority) => !priority.completed,
  );

  const hasIncompleteTask = tasks.some((task) => !task.completed);

  const hasNote = Boolean(note?.content?.trim());

  return hasIncompletePriority || hasIncompleteTask || hasNote;
}

export async function getOrCreateDailyPage(
  date: string,
  carryForwardPriorities = true,
  carryForwardTasks = true,
  carryForwardNotes = false,
): Promise<DailyPage> {
  const supabase = await createClient();

  const { data: existingDay, error: existingDayError } = await supabase
    .from("pro_days")
    .select("*")
    .eq("date", date)
    .maybeSingle();

  if (existingDayError) {
    throw existingDayError;
  }

  const { data: dayId, error: dayError } = await supabase.rpc(
    "pro_get_or_create_day",
    {
      target_date: date,
    },
  );

  if (dayError || !dayId) {
    throw dayError ?? new Error("Could not create daily page");
  }

  const current = await getDayContent(supabase, dayId);

  let carryForwardSource: CarryForwardSource | null = null;

  /*
   * Only the immediately previous calendar day can
   * be considered for the initial carry-forward prompt.
   *
   * Nothing is transferred automatically.
   */
  if (!existingDay && !current.day.carry_forward_decided) {
    const sourceDate = previousDate(date);

    const { data: sourceDay, error: sourceDayError } = await supabase
      .from("pro_days")
      .select("*")
      .eq("date", sourceDate)
      .maybeSingle();

    if (sourceDayError) {
      throw sourceDayError;
    }

    if (sourceDay) {
      const sourceContent = await getDayContent(supabase, sourceDay.id);

      if (
        hasTransferableContent(
          sourceContent.priorities,
          sourceContent.tasks,
          sourceContent.note,
        )
      ) {
        carryForwardSource = {
          day: sourceContent.day,
          priorities: sourceContent.priorities,
          tasks: sourceContent.tasks,
          note: sourceContent.note,
        };
      }
    }
  }

  return {
    day: current.day,
    priorities: current.priorities,
    tasks: current.tasks,
    note: current.note,
    carryForwardSource,
    carryForwardAvailable:
      carryForwardSource !== null && !current.day.carry_forward_decided,
    carryForwardPriorities,
    carryForwardTasks,
    carryForwardNotes,
  };
}
