import { createClient } from "@/lib/supabase/server";

export type BillingAccess = {
  hasAccess: boolean;
  hasOverride: boolean;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
};

export async function getBillingAccess(userId: string): Promise<BillingAccess> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pro_user_settings")
    .select(
      `
        billing_access_override,
        subscription_status,
        subscription_plan,
        subscription_trial_end,
        subscription_current_period_end
      `,
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const hasOverride = data?.billing_access_override === true;
  const subscriptionStatus = data?.subscription_status ?? null;

  const hasSubscriptionAccess =
    subscriptionStatus === "trialing" || subscriptionStatus === "active";

  return {
    hasAccess: hasOverride || hasSubscriptionAccess,
    hasOverride,
    subscriptionStatus,
    subscriptionPlan: data?.subscription_plan ?? null,
    trialEnd: data?.subscription_trial_end ?? null,
    currentPeriodEnd: data?.subscription_current_period_end ?? null,
  };
}
