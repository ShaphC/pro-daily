import { redirect } from "next/navigation";

import { PricingPlans } from "@/components/billing/pricing-plans";
import { signOut } from "@/lib/actions/auth";
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

  const hasExistingBillingAccess =
    billing.hasOverride ||
    billing.isSubscribed ||
    billing.isStripeTrial ||
    billing.isPaidThroughPeriod;

  if (hasExistingBillingAccess) {
    redirect("/today");
  }

  return (
    <>
      <div className="fixed right-5 top-5 z-50 sm:right-8 sm:top-6">
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2.5 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-stone-950 dark:border-white/10 dark:bg-stone-900/80 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <PricingPlans
        isAppTrial={billing.isAppTrial}
        appTrialEnd={billing.appTrialEnd}
      />
    </>
  );
}
