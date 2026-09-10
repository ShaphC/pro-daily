"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type { ThemeMode } from "@/types/database";

export async function saveTheme(theme: ThemeMode) {
  if (!["system", "light", "dark"].includes(theme)) {
    throw new Error("Invalid theme");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) throw new Error("Authentication required");

  const { error } = await supabase.from("pro_user_settings").upsert(
    {
      user_id: data.user.id,
      theme,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function syncTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
    }).format();
  } catch {
    return;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  await supabase.from("pro_user_settings").upsert(
    {
      user_id: data.user.id,
      timezone,
    },
    {
      onConflict: "user_id",
    },
  );

  revalidatePath("/today");
}

export async function saveCarryForwardDefaults(
  carryForwardPriorities: boolean,
  carryForwardTasks: boolean,
  carryForwardNotes: boolean,
) {
  if (!carryForwardPriorities && !carryForwardTasks && !carryForwardNotes) {
    throw new Error("At least one option must be enabled");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Authentication required");
  }

  const { error } = await supabase.from("pro_user_settings").upsert(
    {
      user_id: data.user.id,
      carry_forward_priorities: carryForwardPriorities,
      carry_forward_tasks: carryForwardTasks,
      carry_forward_notes: carryForwardNotes,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) throw error;

  revalidatePath("/settings");
  revalidatePath("/today");
}
