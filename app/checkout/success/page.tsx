import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId || !sessionId.startsWith("cs_")) {
    redirect("/pricing");
  }

  let session;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Unable to retrieve Stripe Checkout session:", error);

    redirect("/pricing");
  }

  if (
    session.mode !== "subscription" ||
    session.status !== "complete" ||
    session.metadata?.supabase_user_id !== user.id ||
    !session.subscription
  ) {
    redirect("/pricing");
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (subscription.status !== "trialing" && subscription.status !== "active") {
    redirect("/pricing");
  }

  const subscriptionItem = subscription.items.data[0];

  if (!subscriptionItem) {
    redirect("/pricing");
  }

  const interval = subscriptionItem.price.recurring?.interval;

  const plan =
    interval === "year" ? "yearly" : interval === "month" ? "monthly" : null;

  if (!plan) {
    redirect("/pricing");
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const currentPeriodEnd =
    typeof subscriptionItem.current_period_end === "number"
      ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
      : null;

  const trialEnd =
    typeof subscription.trial_end === "number"
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

  const { error: settingsError } = await supabase
    .from("pro_user_settings")
    .update({
      stripe_customer_id: customerId,
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_plan: plan,
      subscription_current_period_end: currentPeriodEnd,
      subscription_trial_end: trialEnd,
    })
    .eq("user_id", user.id);

  if (settingsError) {
    console.error(
      "Unable to synchronize billing after Checkout:",
      settingsError,
    );

    throw settingsError;
  }

  const { data: onboarding, error: onboardingError } = await supabase
    .from("pro_onboarding")
    .select("completed, skipped, current_step")
    .eq("user_id", user.id)
    .maybeSingle();

  if (onboardingError) {
    console.error("Unable to load onboarding after Checkout:", onboardingError);

    throw onboardingError;
  }

  if (onboarding && !onboarding.completed && !onboarding.skipped) {
    redirect("/onboarding");
  }

  redirect("/today");
}
