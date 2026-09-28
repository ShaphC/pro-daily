import { redirect } from "next/navigation";

import { PricingPlans } from "@/components/billing/pricing-plans";
import { createClient } from "@/lib/supabase/server";
import { getBillingAccess } from "@/lib/services/billing";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const billing = await getBillingAccess(user.id);

  if (billing.hasOverride || billing.isSubscribed || billing.isStripeTrial) {
    redirect("/today");
  }

  return (
    <PricingPlans
      isAppTrial={billing.isAppTrial}
      appTrialEnd={billing.appTrialEnd}
    />
  );
}
