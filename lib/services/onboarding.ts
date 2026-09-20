import { createClient } from "@/lib/supabase/server";
import type { Onboarding } from "@/types/database";

export async function getOrCreateOnboarding(
  userId: string,
): Promise<Onboarding> {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("pro_onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return {
      ...existing,
      help_goals: Array.isArray(existing.help_goals) ? existing.help_goals : [],
    } as Onboarding;
  }

  const { data, error } = await supabase
    .from("pro_onboarding")
    .insert({
      user_id: userId,
      current_step: 1,
      completed: false,
      help_goals: [],
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    help_goals: Array.isArray(data.help_goals) ? data.help_goals : [],
  } as Onboarding;
}
