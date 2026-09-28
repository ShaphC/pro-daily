import { redirect } from "next/navigation";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { createClient } from "@/lib/supabase/server";
import { getBillingAccess } from "@/lib/services/billing";
import { dateInTimezone, getOrCreateDailyPage } from "@/lib/services/daily";
import { getOrCreateOnboarding } from "@/lib/services/onboarding";
import { getOrCreateSettings } from "@/lib/services/settings";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const billing = await getBillingAccess(data.user.id);

  if (!billing.hasAccess) {
    redirect("/pricing");
  }

  const onboarding = await getOrCreateOnboarding(data.user.id);

  if (onboarding.completed) {
    redirect("/today");
  }

  const settings = await getOrCreateSettings(data.user.id);

  const date = dateInTimezone(settings.timezone);

  const daily = await getOrCreateDailyPage(date, false, false, false);

  return (
    <OnboardingShell
      initial={onboarding}
      dayId={daily.day.id}
      billing={{
        hasOverride: billing.hasOverride,
        isAppTrial: billing.isAppTrial,
        isStripeTrial: billing.isStripeTrial,
        isSubscribed: billing.isSubscribed,
        appTrialEnd: billing.appTrialEnd,
        subscriptionTrialEnd: billing.subscriptionTrialEnd,
        subscriptionPlan: billing.subscriptionPlan,
      }}
    />
  );
}
