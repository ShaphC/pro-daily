"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { CarryForwardSource } from "@/types/database";

async function requireUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Authentication required");
  }

  return { supabase, user: data.user };
}

export async function addPriority(dayId: string, text: string) {
  const value = text.trim();

  if (!value) return;

  const { supabase, user } = await requireUser();

  const { count, error: countError } = await supabase
    .from("pro_priorities")
    .select("*", { count: "exact", head: true })
    .eq("day_id", dayId);

  if (countError) throw countError;

  if ((count ?? 0) >= 7) {
    throw new Error("A day cannot contain more than 7 priorities");
  }

  const { data: existing, error: listError } = await supabase
    .from("pro_priorities")
    .select("id")
    .eq("day_id", dayId)
    .order("position")
    .order("created_at");

  if (listError) throw listError;

  await Promise.all(
    (existing ?? []).map((row, position) =>
      supabase.from("pro_priorities").update({ position }).eq("id", row.id),
    ),
  );

  const { data, error } = await supabase
    .from("pro_priorities")
    .insert({
      user_id: user.id,
      day_id: dayId,
      text: value,
      position: count ?? 0,
    })
    .select("*")
    .single();

  if (error) throw error;

  revalidatePath("/today");

  return data;
}

export async function updatePriorityText(id: string, text: string) {
  const value = text.trim();

  if (!value) return;

  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("pro_priorities")
    .update({ text: value })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/today");
}

export async function togglePriority(id: string, completed: boolean) {
  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("pro_set_priority_completed", {
    priority_id: id,
    is_completed: completed,
  });

  if (error) throw error;

  revalidatePath("/today");
}

export async function deletePriority(id: string) {
  const { supabase } = await requireUser();

  const { data: target, error: targetError } = await supabase
    .from("pro_priorities")
    .select("day_id")
    .eq("id", id)
    .single();

  if (targetError) throw targetError;

  const { error } = await supabase.from("pro_priorities").delete().eq("id", id);

  if (error) throw error;

  const { data: remaining, error: listError } = await supabase
    .from("pro_priorities")
    .select("id")
    .eq("day_id", target.day_id)
    .order("position")
    .order("created_at");

  if (listError) throw listError;

  await Promise.all(
    (remaining ?? []).map((row, position) =>
      supabase.from("pro_priorities").update({ position }).eq("id", row.id),
    ),
  );

  revalidatePath("/today");
}

export async function reorderPriorities(dayId: string, orderedIds: string[]) {
  const { supabase, user } = await requireUser();

  if (orderedIds.length > 7) {
    throw new Error("Invalid priority order");
  }

  const updates = orderedIds.map((id, position) =>
    supabase
      .from("pro_priorities")
      .update({ position })
      .eq("id", id)
      .eq("day_id", dayId)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);

  const failure = results.find((result) => result.error);

  if (failure?.error) throw failure.error;

  revalidatePath("/today");
}

export async function addTask(dayId: string, text: string) {
  const value = text.trim();

  if (!value) return;

  const { supabase, user } = await requireUser();

  const { data, error: positionError } = await supabase
    .from("pro_tasks")
    .select("position")
    .eq("day_id", dayId)
    .order("position", { ascending: false })
    .limit(1);

  if (positionError) throw positionError;

  const { data: inserted, error } = await supabase
    .from("pro_tasks")
    .insert({
      user_id: user.id,
      day_id: dayId,
      text: value,
      position: (data?.[0]?.position ?? -1) + 1,
    })
    .select("*")
    .single();

  if (error) throw error;

  revalidatePath("/today");

  return inserted;
}

export async function updateTaskText(id: string, text: string) {
  const value = text.trim();

  if (!value) return;

  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("pro_tasks")
    .update({ text: value })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/today");
}

export async function toggleTask(id: string, completed: boolean) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("pro_tasks")
    .update({ completed })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/today");
}

export async function deleteTask(id: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase.from("pro_tasks").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/today");
}

export async function reorderTasks(dayId: string, orderedIds: string[]) {
  const { supabase, user } = await requireUser();

  const updates = orderedIds.map((id, position) =>
    supabase
      .from("pro_tasks")
      .update({ position })
      .eq("id", id)
      .eq("day_id", dayId)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);

  const failure = results.find((result) => result.error);

  if (failure?.error) throw failure.error;

  revalidatePath("/today");
}

export async function saveNote(dayId: string, content: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("pro_notes").upsert(
    {
      user_id: user.id,
      day_id: dayId,
      position: 0,
      content,
    },
    {
      onConflict: "user_id,day_id,position",
    },
  );

  if (error) throw error;

  revalidatePath("/today");
}

export async function transferDayContent(
  sourceDayId: string,
  targetDayId: string,
  transferPriorities: boolean,
  transferTasks: boolean,
  transferNotes: boolean,
) {
  if (!transferPriorities && !transferTasks && !transferNotes) {
    throw new Error("Select at least one item to transfer");
  }

  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("pro_transfer_day_content", {
    source_day_id: sourceDayId,
    target_day_id: targetDayId,
    transfer_priorities: transferPriorities,
    transfer_tasks: transferTasks,
    transfer_notes: transferNotes,
  });

  if (error) throw error;

  const { error: decisionError } = await supabase.rpc(
    "pro_mark_carry_forward_decided",
    {
      target_day_id: targetDayId,
    },
  );

  if (decisionError) throw decisionError;

  revalidatePath("/today");
}

export async function startFreshDay(dayId: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("pro_mark_carry_forward_decided", {
    target_day_id: dayId,
  });

  if (error) throw error;

  revalidatePath("/today");
}

export async function getPreviousDayTransferSource(
  targetDayId: string,
): Promise<CarryForwardSource | null> {
  const { supabase, user } = await requireUser();

  const { data: targetDay, error: targetError } = await supabase
    .from("pro_days")
    .select("id,date")
    .eq("id", targetDayId)
    .eq("user_id", user.id)
    .single();

  if (targetError) throw targetError;

  const targetDate = new Date(`${targetDay.date}T00:00:00Z`);

  targetDate.setUTCDate(targetDate.getUTCDate() - 1);

  const sourceDate = targetDate.toISOString().slice(0, 10);

  const { data: sourceDay, error: sourceError } = await supabase
    .from("pro_days")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", sourceDate)
    .maybeSingle();

  if (sourceError) throw sourceError;

  if (!sourceDay) {
    return null;
  }

  const [prioritiesResult, tasksResult, noteResult] = await Promise.all([
    supabase
      .from("pro_priorities")
      .select("*")
      .eq("day_id", sourceDay.id)
      .eq("user_id", user.id)
      .order("position")
      .order("created_at"),

    supabase
      .from("pro_tasks")
      .select("*")
      .eq("day_id", sourceDay.id)
      .eq("user_id", user.id)
      .order("position")
      .order("created_at"),

    supabase
      .from("pro_notes")
      .select("*")
      .eq("day_id", sourceDay.id)
      .eq("user_id", user.id)
      .eq("position", 0)
      .maybeSingle(),
  ]);

  const error = prioritiesResult.error ?? tasksResult.error ?? noteResult.error;

  if (error) throw error;

  const priorities = prioritiesResult.data ?? [];
  const tasks = tasksResult.data ?? [];
  const note = noteResult.data ?? null;

  const hasTransferableContent =
    priorities.some((priority) => !priority.completed) ||
    tasks.some((task) => !task.completed) ||
    Boolean(note?.content?.trim());

  if (!hasTransferableContent) {
    return null;
  }

  return {
    day: sourceDay,
    priorities,
    tasks,
    note,
  };
}

export async function transferPreviousDayContent(
  sourceDayId: string,
  targetDayId: string,
  transferPriorities: boolean,
  transferTasks: boolean,
  transferNotes: boolean,
  replaceExisting: boolean,
) {
  if (!transferPriorities && !transferTasks && !transferNotes) {
    throw new Error("Select at least one item to transfer");
  }

  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("pro_transfer_previous_day_content", {
    source_day_id: sourceDayId,
    target_day_id: targetDayId,
    transfer_priorities: transferPriorities,
    transfer_tasks: transferTasks,
    transfer_notes: transferNotes,
    replace_existing: replaceExisting,
  });

  if (error) throw error;

  // Manual transfers are independent of the initial
  // new-day carry-forward decision.
  revalidatePath("/today");
}
