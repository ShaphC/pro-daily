import { createClient } from "@/lib/supabase/server";

const APP_TRIAL_DAYS = 3;

export type BillingAccess = {
  hasAccess: boolean;
  hasOverride: boolean;
  isAppTrial: boolean;
  isStripeTrial: boolean;
  isSubscribed: boolean;
  isPaidThroughPeriod: boolean;
  appTrialStartedAt: string | null;
  appTrialEnd: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  subscriptionTrialEnd: string | null;
  currentPeriodEnd: string | null;
};

export async function startAppTrialIfNeeded(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pro_user_settings")
    .select(
      `
        app_trial_started_at,
        app_trial_end,
        billing_access_override,
        subscription_status
      `,
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const startedAt = new Date();
    const endsAt = new Date(
      startedAt.getTime() + APP_TRIAL_DAYS * 24 * 60 * 60 * 1000,
    );

    const { error: insertError } = await supabase
      .from("pro_user_settings")
      .insert({
        user_id: userId,
        app_trial_started_at: startedAt.toISOString(),
        app_trial_end: endsAt.toISOString(),
      });

    if (insertError) {
      throw insertError;
    }

    return;
  }

  if (
    data.app_trial_started_at ||
    data.app_trial_end ||
    data.billing_access_override ||
    data.subscription_status
  ) {
    return;
  }

  const startedAt = new Date();
  const endsAt = new Date(
    startedAt.getTime() + APP_TRIAL_DAYS * 24 * 60 * 60 * 1000,
  );

  const { error: updateError } = await supabase
    .from("pro_user_settings")
    .update({
      app_trial_started_at: startedAt.toISOString(),
      app_trial_end: endsAt.toISOString(),
    })
    .eq("user_id", userId);

  if (updateError) {
    throw updateError;
  }
}

export async function getBillingAccess(userId: string): Promise<BillingAccess> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pro_user_settings")
    .select(
      `
        billing_access_override,
        app_trial_started_at,
        app_trial_end,
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

  const now = Date.now();

  const hasOverride = data?.billing_access_override === true;

  const appTrialStartedAt = data?.app_trial_started_at ?? null;

  const appTrialEnd = data?.app_trial_end ?? null;

  const subscriptionStatus = data?.subscription_status ?? null;

  const subscriptionTrialEnd = data?.subscription_trial_end ?? null;

  const currentPeriodEnd = data?.subscription_current_period_end ?? null;

  const isAppTrial =
    appTrialEnd !== null && new Date(appTrialEnd).getTime() > now;

  const isStripeTrial =
    subscriptionStatus === "trialing" &&
    subscriptionTrialEnd !== null &&
    new Date(subscriptionTrialEnd).getTime() > now;

  const isSubscribed = subscriptionStatus === "active";

  const isPaidThroughPeriod =
    subscriptionStatus === "canceled" &&
    currentPeriodEnd !== null &&
    new Date(currentPeriodEnd).getTime() > now;

  return {
    hasAccess:
      hasOverride ||
      isAppTrial ||
      isStripeTrial ||
      isSubscribed ||
      isPaidThroughPeriod,
    hasOverride,
    isAppTrial,
    isStripeTrial,
    isSubscribed,
    isPaidThroughPeriod,
    appTrialStartedAt,
    appTrialEnd,
    subscriptionStatus,
    subscriptionPlan: data?.subscription_plan ?? null,
    subscriptionTrialEnd,
    currentPeriodEnd,
  };
}
