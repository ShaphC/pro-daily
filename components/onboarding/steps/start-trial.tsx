"use client";

import { Check } from "lucide-react";
import { useState } from "react";

type StripePlan = "monthly" | "yearly";

type StartTrialStepProps = {
  pending: boolean;
};

export function StartTrialStep({ pending }: StartTrialStepProps) {
  const [plan, setPlan] = useState<StripePlan>("yearly");
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [error, setError] = useState("");

  const isPending = pending || checkoutPending;

  async function handleStartTrial() {
    if (isPending) {
      return;
    }

    setError("");
    setCheckoutPending(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Unable to start Stripe checkout:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.",
      );

      setCheckoutPending(false);
    }
  }

  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        You're ready
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Start your 3-day free trial.
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        Your CheckMarkr workspace is ready. Choose the plan you'd like to
        continue with after your free trial.
      </p>

      <div className="mx-auto mt-8 max-w-md">
        <div
          role="radiogroup"
          aria-label="Choose a subscription plan"
          className="grid gap-3 sm:grid-cols-2"
        >
          <PlanOption
            title="Monthly"
            price="$9.97"
            interval="/ month"
            description="Flexible monthly billing"
            selected={plan === "monthly"}
            disabled={isPending}
            onClick={() => setPlan("monthly")}
          />

          <PlanOption
            title="Yearly"
            price="$59.99"
            interval="/ year"
            description="About $5 per month"
            selected={plan === "yearly"}
            disabled={isPending}
            onClick={() => setPlan("yearly")}
            badge="Best value"
          />
        </div>

        <div className="mt-5 rounded-3xl border bg-white p-5 text-left shadow-sm dark:bg-stone-900">
          <p className="text-sm font-semibold">Included with CheckMarkr</p>

          <div className="mt-4 space-y-3">
            <TrialFeature text="Daily priorities, tasks, and notes" />
            <TrialFeature text="Carry unfinished work into the next day" />
            <TrialFeature text="Keep a history of your work" />
            <TrialFeature text="Full CheckMarkr access during your trial" />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs text-red-700 dark:border-red-400/10 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleStartTrial}
          disabled={isPending}
          className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
        >
          {checkoutPending
            ? "Opening secure checkout..."
            : "Start 3-day free trial"}
        </button>

        <p className="mt-3 text-[11px] leading-5 text-stone-400">
          You'll continue to Stripe to securely add your payment method. You
          won't be charged today. Your selected plan begins after your 3-day
          trial unless you cancel.
        </p>

        <p className="mt-1 text-[10px] text-stone-400">Prices shown in USD.</p>
      </div>
    </section>
  );
}

function PlanOption({
  title,
  price,
  interval,
  description,
  selected,
  disabled,
  onClick,
  badge,
}: {
  title: string;
  price: string;
  interval: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`relative rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-stone-950 bg-stone-50 dark:border-white dark:bg-white/[0.06]"
          : "border-stone-200 bg-white hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {badge && (
        <span className="absolute right-3 top-3 rounded-full bg-stone-950 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white dark:bg-white dark:text-stone-950">
          {badge}
        </span>
      )}

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          selected
            ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
            : "border-stone-300 dark:border-stone-700"
        }`}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>

      <span className="mt-5 block text-sm font-semibold text-stone-950 dark:text-white">
        {title}
      </span>

      <span className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-[-0.04em] text-stone-950 dark:text-white">
          {price}
        </span>

        <span className="text-[10px] text-stone-400">{interval}</span>
      </span>

      <span className="mt-2 block text-xs text-stone-500 dark:text-stone-400">
        {description}
      </span>
    </button>
  );
}

function TrialFeature({ text }: { text: string }) {
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
