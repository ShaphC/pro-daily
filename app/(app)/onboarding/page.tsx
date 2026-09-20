import { redirect } from "next/navigation";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOnboarding } from "@/lib/services/onboarding";

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

  return <OnboardingShell initial={onboarding} />;
}
