"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { OnboardingHelpGoal } from "@/types/database";

const VALID_GOALS: OnboardingHelpGoal[] = [
  "priorities",
  "tasks",
  "consistency",
  "focus",
  "organization",
  "follow-through",
];

async function requireUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Authentication required");
  }

  return {
    supabase,
    user: data.user,
  };
}

export async function saveOnboardingStep(
  nextStep: number,
  values: {
    name?: string;
    taskHabits?: string;
    helpGoals?: OnboardingHelpGoal[];
  },
) {
  if (nextStep < 1 || nextStep > 19) {
    throw new Error("Invalid onboarding step");
  }

  const { supabase, user } = await requireUser();

  const updates: Record<string, unknown> = {
    current_step: nextStep,
  };

  if (values.name !== undefined) {
    const name = values.name.trim();

    if (!name) {
      throw new Error("Name is required");
    }

    updates.name = name.slice(0, 100);
  }

  if (values.taskHabits !== undefined) {
    const taskHabits = values.taskHabits.trim();

    if (!taskHabits) {
      throw new Error("Please select an option");
    }

    updates.task_habits = taskHabits;
  }

  if (values.helpGoals !== undefined) {
    const goals = values.helpGoals.filter((goal) => VALID_GOALS.includes(goal));

    if (goals.length === 0) {
      throw new Error("Select at least one goal");
    }

    if (goals.length > 3) {
      throw new Error("Select up to three goals");
    }

    updates.help_goals = goals;
  }

  const { error } = await supabase
    .from("pro_onboarding")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/onboarding");
}

export async function setOnboardingStep(step: number) {
  if (step < 1 || step > 19) {
    throw new Error("Invalid onboarding step");
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("pro_onboarding")
    .update({
      current_step: step,
    })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/onboarding");
}

export async function completeOnboarding() {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("pro_onboarding")
    .update({
      completed: true,
      current_step: 19,
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/onboarding");
  revalidatePath("/today");
}

export async function skipOnboarding() {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("pro_onboarding")
    .update({
      skipped: true,
      completed: false,
    })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/onboarding");
  revalidatePath("/today");
}
