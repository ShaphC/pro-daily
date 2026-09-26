import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

const stripeWebhookSecret: string = webhookSecret;

function getCustomerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
}

function getPlan(subscription: Stripe.Subscription) {
  const subscriptionItem = subscription.items.data[0];

  if (!subscriptionItem) {
    return null;
  }

  const interval = subscriptionItem.price.recurring?.interval;

  if (interval === "month") {
    return "monthly";
  }

  if (interval === "year") {
    return "yearly";
  }

  return null;
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const subscriptionItem = subscription.items.data[0];

  if (!subscriptionItem) {
    return null;
  }

  const currentPeriodEnd = subscriptionItem.current_period_end;

  return typeof currentPeriodEnd === "number"
    ? new Date(currentPeriodEnd * 1000).toISOString()
    : null;
}

function getTrialEnd(subscription: Stripe.Subscription) {
  return typeof subscription.trial_end === "number"
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;
}

async function getSupabaseUserId(subscription: Stripe.Subscription) {
  const metadataUserId = subscription.metadata?.supabase_user_id;

  if (metadataUserId) {
    return metadataUserId;
  }

  const customerId = getCustomerId(subscription);

  const { data, error } = await supabaseAdmin
    .from("pro_user_settings")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.user_id ?? null;
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription);
  const supabaseUserId = await getSupabaseUserId(subscription);

  if (!supabaseUserId) {
    throw new Error(
      `Unable to determine Supabase user for subscription ${subscription.id}`,
    );
  }

  const plan = getPlan(subscription);

  if (!plan) {
    throw new Error(
      `Unable to determine plan for subscription ${subscription.id}`,
    );
  }

  const { error } = await supabaseAdmin.from("pro_user_settings").upsert(
    {
      user_id: supabaseUserId,
      stripe_customer_id: customerId,
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_plan: plan,
      subscription_current_period_end: getCurrentPeriodEnd(subscription),
      subscription_trial_end: getTrialEnd(subscription),
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    throw error;
  }

  console.log("Stripe subscription synced:", {
    userId: supabaseUserId,
    subscriptionId: subscription.id,
    status: subscription.status,
    plan,
  });
}

async function syncDeletedSubscription(subscription: Stripe.Subscription) {
  const supabaseUserId = await getSupabaseUserId(subscription);

  if (!supabaseUserId) {
    throw new Error(
      `Unable to determine Supabase user for deleted subscription ${subscription.id}`,
    );
  }

  const { error } = await supabaseAdmin
    .from("pro_user_settings")
    .update({
      subscription_status: "canceled",
      subscription_current_period_end: getCurrentPeriodEnd(subscription),
      subscription_trial_end: getTrialEnd(subscription),
    })
    .eq("user_id", supabaseUserId);

  if (error) {
    throw error;
  }

  console.log("Stripe subscription deleted:", {
    userId: supabaseUserId,
    subscriptionId: subscription.id,
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  console.log("Stripe webhook received:", event.type);

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await syncSubscription(event.data.object);
        break;

      case "customer.subscription.deleted":
        await syncDeletedSubscription(event.data.object);
        break;

      case "checkout.session.completed":
        console.log("Stripe Checkout completed:", event.data.object.id);
        break;

      case "invoice.paid":
        console.log("Stripe invoice paid:", event.data.object.id);
        break;

      case "invoice.payment_failed":
        console.log("Stripe invoice payment failed:", event.data.object.id);
        break;

      default:
        console.log("Unhandled Stripe event:", event.type);
    }
  } catch (error) {
    console.error(`Stripe webhook processing failed for ${event.type}:`, error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
