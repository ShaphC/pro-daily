import { redirect } from "next/navigation";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateDailyPage } from "@/lib/services/daily";
import { getOrCreateOnboarding } from "@/lib/services/onboarding";
import { getOrCreateSettings } from "@/lib/services/settings";
import { dateInTimezone } from "@/lib/services/daily";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const onboarding = await getOrCreateOnboarding(data.user.id);

  if (onboarding.completed) {
    redirect("/today");
  }

  const settings = await getOrCreateSettings(data.user.id);
  const date = dateInTimezone(settings.timezone);

  const daily = await getOrCreateDailyPage(date, false, false, false);

  return <OnboardingShell initial={onboarding} dayId={daily.day.id} />;
}
