import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { STRIPE_PRICES } from "@/lib/stripe/config";
import { STRIPE_TRIAL_DAYS, type StripePlan } from "@/lib/stripe/plans";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const plan = body.plan as StripePlan;

    if (plan !== "monthly" && plan !== "yearly") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from("pro_user_settings")
      .select("stripe_customer_id, subscription_id, subscription_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (settingsError) {
      console.error(settingsError);

      return NextResponse.json(
        { error: "Unable to load account settings" },
        { status: 500 },
      );
    }

    let customerId = settings?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = customer.id;

      const { error: updateError } = await supabase
        .from("pro_user_settings")
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: customerId,
          },
          {
            onConflict: "user_id",
          },
        );

      if (updateError) {
        console.error(updateError);

        return NextResponse.json(
          { error: "Unable to save billing information" },
          { status: 500 },
        );
      }
    }

    const existingSubscription =
      settings?.subscription_status === "active" ||
      settings?.subscription_status === "trialing" ||
      settings?.subscription_status === "past_due";

    if (existingSubscription) {
      return NextResponse.json(
        { error: "You already have a subscription." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: STRIPE_PRICES[plan],
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: STRIPE_TRIAL_DAYS,
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
      success_url: `${origin}/today?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
