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
    <main className="relative min-h-screen overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-64 w-64 rounded-full bg-stone-300/20 blur-3xl dark:bg-white/[0.025]" />
        <div className="absolute bottom-[5%] right-[8%] h-72 w-72 rounded-full bg-stone-200/30 blur-3xl dark:bg-white/[0.02]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
            CheckMarkr Pro
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-stone-950 dark:text-white sm:text-5xl">
            Choose your plan
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-500 dark:text-stone-400 sm:text-base">
            Build a daily system that keeps your priorities, tasks, and notes in
            one place. Start with a 3-day free trial. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:mt-12 md:grid-cols-2">
          <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
            <div className="relative z-10 flex h-full flex-col">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Monthly
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 dark:text-white">
                  Monthly
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                  Flexible monthly billing. Keep your daily system simple and
                  cancel whenever you want.
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => startCheckout("monthly")}
                  disabled={loadingPlan !== null}
                  className="inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                >
                  {loadingPlan === "monthly"
                    ? "Starting trial..."
                    : "Start 3-day trial"}
                </button>
              </div>
            </div>
          </section>

          <section className="glass-strong rounded-3xl p-5 sm:p-6">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                    Yearly
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 dark:text-white">
                    Yearly
                  </h2>
                </div>

                <span className="shrink-0 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300">
                  Best value
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                Best value for long-term use. One less monthly decision to worry
                about.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => startCheckout("yearly")}
                  disabled={loadingPlan !== null}
                  className="inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                >
                  {loadingPlan === "yearly"
                    ? "Starting trial..."
                    : "Start 3-day trial"}
                </button>
              </div>
            </div>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-stone-400 dark:text-stone-500">
          Your 3-day trial starts immediately. You can cancel before the trial
          ends.
        </p>
      </div>
    </main>
  );
}
