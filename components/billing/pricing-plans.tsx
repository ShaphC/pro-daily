"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";

type Plan = "monthly" | "yearly";

type PricingPlansProps = {
  isAppTrial: boolean;
  appTrialEnd: string | null;
};

export function PricingPlans({ isAppTrial, appTrialEnd }: PricingPlansProps) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  async function startCheckout(plan: Plan) {
    if (loadingPlan) {
      return;
    }

    setError("");
    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      if (!data.url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Unable to start Stripe checkout:", error);

      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );

      setLoadingPlan(null);
    }
  }

  const trialEndLabel =
    isAppTrial && appTrialEnd
      ? new Date(appTrialEnd).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-50 px-5 pb-20 pt-16 text-stone-950 dark:bg-stone-950 dark:text-white sm:px-8 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-64 w-64 rounded-full bg-stone-300/20 blur-3xl dark:bg-white/[0.025]" />
        <div className="absolute bottom-[5%] right-[8%] h-72 w-72 rounded-full bg-stone-200/30 blur-3xl dark:bg-white/[0.02]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
            CheckMarkr Pro
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            {isAppTrial ? "Choose your plan" : "Continue with CheckMarkr"}
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-500 dark:text-stone-400 sm:text-base">
            {isAppTrial
              ? "Your free trial is active. You can keep using CheckMarkr until it ends or subscribe now."
              : "Your free trial has ended. Choose a plan to keep using your CheckMarkr workspace."}
          </p>

          {isAppTrial && (
            <div className="mx-auto mt-5 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-stone-600 shadow-sm dark:border-white/10 dark:bg-stone-900 dark:text-stone-300">
              {trialEndLabel
                ? `Free trial active until ${trialEndLabel}`
                : "Free trial active"}
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:mt-12 md:grid-cols-2">
          <PlanCard
            label="Monthly"
            price="$9.97"
            interval="/ month"
            description="Flexible monthly billing. Keep your daily system simple and cancel whenever you want."
            buttonLabel="Choose monthly"
            loadingLabel="Opening checkout..."
            loading={loadingPlan === "monthly"}
            disabled={loadingPlan !== null}
            onClick={() => startCheckout("monthly")}
          />

          <PlanCard
            label="Yearly"
            price="$59.99"
            interval="/ year"
            description="Best value for long-term use. One payment gives you a full year of CheckMarkr."
            buttonLabel="Choose yearly"
            loadingLabel="Opening checkout..."
            loading={loadingPlan === "yearly"}
            disabled={loadingPlan !== null}
            onClick={() => startCheckout("yearly")}
            badge="Best value"
          />
        </div>

        <div className="mx-auto mt-5 max-w-3xl rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900 sm:p-6">
          <p className="text-sm font-semibold">Included with CheckMarkr</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Feature text="Daily priorities, tasks, and notes" />
            <Feature text="Carry unfinished work forward" />
            <Feature text="History of your daily work" />
            <Feature text="Full CheckMarkr access" />
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-5 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/10 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {isAppTrial && (
          <div className="mt-6 text-center">
            <Link
              href="/today"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-bold text-stone-700 transition hover:bg-stone-100 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Continue free trial
            </Link>
          </div>
        )}

        <div className="mx-auto mt-6 max-w-xl text-center">
          <p className="text-xs leading-5 text-stone-400 dark:text-stone-500">
            Payment is handled securely through Stripe. Your subscription begins
            when you complete checkout. Cancel anytime.
          </p>

          <p className="mt-1 text-[10px] text-stone-400 dark:text-stone-500">
            Prices shown in USD.
          </p>
        </div>
      </div>
    </main>
  );
}

function PlanCard({
  label,
  price,
  interval,
  description,
  buttonLabel,
  loadingLabel,
  loading,
  disabled,
  onClick,
  badge,
}: {
  label: string;
  price: string;
  interval: string;
  description: string;
  buttonLabel: string;
  loadingLabel: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900 sm:p-6">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              {label}
            </p>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-[-0.04em]">
                {price}
              </span>

              <span className="text-xs text-stone-400">{interval}</span>
            </div>
          </div>

          {badge && (
            <span className="shrink-0 rounded-full border border-black/10 bg-stone-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-4 flex-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
          {description}
        </p>

        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
        >
          {loading ? loadingLabel : buttonLabel}
        </button>
      </div>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white dark:bg-white dark:text-stone-950">
        <Check size={11} strokeWidth={3} />
      </span>

      <span className="text-xs leading-5 text-stone-500 dark:text-stone-400">
        {text}
      </span>
    </div>
  );
}
