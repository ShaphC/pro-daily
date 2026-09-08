import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
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
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  console.log("Stripe webhook received:", event.type);

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Checkout completed:", event.data.object.id);
      break;

    case "customer.subscription.updated":
      console.log("Subscription updated:", event.data.object.id);
      break;

    case "customer.subscription.deleted":
      console.log("Subscription deleted:", event.data.object.id);
      break;

    case "invoice.paid":
      console.log("Invoice paid:", event.data.object.id);
      break;

    case "invoice.payment_failed":
      console.log("Invoice payment failed:", event.data.object.id);
      break;

    default:
      console.log("Unhandled Stripe event:", event.type);
  }

  return NextResponse.json({ received: true });
}
