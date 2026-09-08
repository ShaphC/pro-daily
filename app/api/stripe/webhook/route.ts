import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

const stripeWebhookSecret: string = webhookSecret;

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
      case "customer.subscription.updated": {
        const subscription = event.data.object;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) {
          console.error("Missing Stripe customer ID:", subscription.id);

          return NextResponse.json(
            { error: "Missing Stripe customer ID" },
            { status: 500 },
          );
        }

        const supabaseUserId = subscription.metadata?.supabase_user_id;

        if (!supabaseUserId) {
          console.error(
            "Missing supabase_user_id in subscription metadata:",
            subscription.id,
          );

          return NextResponse.json(
            { error: "Missing Supabase user ID" },
            { status: 500 },
          );
        }

        const subscriptionItem = subscription.items.data[0];

        if (!subscriptionItem) {
          console.error(
            "Subscription has no subscription items:",
            subscription.id,
          );

          return NextResponse.json(
            { error: "Subscription has no items" },
            { status: 500 },
          );
        }

        const interval = subscriptionItem.price.recurring?.interval;

        const plan =
          interval === "year"
            ? "yearly"
            : interval === "month"
              ? "monthly"
              : null;

        if (!plan) {
          console.error(
            "Unable to determine subscription plan:",
            subscription.id,
          );

          return NextResponse.json(
            { error: "Unable to determine subscription plan" },
            { status: 500 },
          );
        }

        const currentPeriodEnd = subscriptionItem.current_period_end;

        const currentPeriodEndIso =
          typeof currentPeriodEnd === "number"
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : null;

        const trialEnd = subscription.trial_end;

        const trialEndIso =
          typeof trialEnd === "number"
            ? new Date(trialEnd * 1000).toISOString()
            : null;

        const { error } = await supabaseAdmin.from("pro_user_settings").upsert(
          {
            user_id: supabaseUserId,
            stripe_customer_id: customerId,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_plan: plan,
            subscription_current_period_end: currentPeriodEndIso,
            subscription_trial_end: trialEndIso,
          },
          {
            onConflict: "user_id",
          },
        );

        if (error) {
          console.error("Failed to sync subscription to Supabase:", error);

          return NextResponse.json(
            { error: "Failed to sync subscription" },
            { status: 500 },
          );
        }

        console.log("Subscription synced:", {
          userId: supabaseUserId,
          subscriptionId: subscription.id,
          status: subscription.status,
          plan,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const supabaseUserId = subscription.metadata?.supabase_user_id;

        if (!supabaseUserId) {
          console.error(
            "Missing supabase_user_id in deleted subscription metadata:",
            subscription.id,
          );

          return NextResponse.json(
            { error: "Missing Supabase user ID" },
            { status: 500 },
          );
        }

        const { error } = await supabaseAdmin
          .from("pro_user_settings")
          .update({
            subscription_status: "canceled",
          })
          .eq("user_id", supabaseUserId);

        if (error) {
          console.error("Failed to sync canceled subscription:", error);

          return NextResponse.json(
            { error: "Failed to sync canceled subscription" },
            { status: 500 },
          );
        }

        console.log("Subscription canceled:", subscription.id);

        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("Checkout completed:", session.id);

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;

        console.log("Invoice paid:", invoice.id);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        console.log("Invoice payment failed:", invoice.id);

        break;
      }

      default:
        console.log("Unhandled Stripe event:", event.type);
    }
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
