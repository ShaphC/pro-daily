"use client";

import { useState } from "react";

type Plan = "monthly" | "yearly";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout");
      }

      if (!data.url) {
        throw new Error("Checkout URL was not returned");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
      setLoadingPlan(null);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">Pro Daily</p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Choose your plan
          </h1>

          <p className="mt-4 text-muted-foreground">
            Start with a 3-day free trial. Cancel anytime.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold">Monthly</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Flexible monthly billing.
            </p>

            <button
              type="button"
              onClick={() => startCheckout("monthly")}
              disabled={loadingPlan !== null}
              className="mt-6 w-full rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingPlan === "monthly"
                ? "Starting trial..."
                : "Start 3-day trial"}
            </button>
          </div>

          <div className="rounded-2xl border border-foreground p-6">
            <h2 className="text-xl font-semibold">Yearly</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Best value for long-term use.
            </p>

            <button
              type="button"
              onClick={() => startCheckout("yearly")}
              disabled={loadingPlan !== null}
              className="mt-6 w-full rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingPlan === "yearly"
                ? "Starting trial..."
                : "Start 3-day trial"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
