"use client";

import type { OnboardingHelpGoal } from "@/types/database";

const goalContent: Record<
  OnboardingHelpGoal,
  {
    title: string;
    description: string;
  }
> = {
  priorities: {
    title: "Know what matters most",
    description:
      "Keep your attention on a small number of things that genuinely matter today.",
  },
  tasks: {
    title: "Turn intentions into action",
    description:
      "Break important work into concrete tasks you can actually finish.",
  },
  consistency: {
    title: "Build a rhythm you can maintain",
    description:
      "Make progress through a simple daily practice instead of relying on motivation.",
  },
  focus: {
    title: "Protect your attention",
    description:
      "Give yourself fewer things to think about so you can give more attention to what matters.",
  },
  organization: {
    title: "Get everything into one place",
    description:
      "Keep your priorities, tasks, and notes together instead of scattered across different systems.",
  },
  "follow-through": {
    title: "Finish what you start",
    description:
      "Make unfinished work visible without letting it take over your entire day.",
  },
};

type GoalCardsStepProps = {
  goals: OnboardingHelpGoal[];
  onNext: () => void;
  pending: boolean;
};

export function GoalCardsStep({ goals, onNext, pending }: GoalCardsStepProps) {
  const cards = goals.map((goal) => goalContent[goal]).filter(Boolean);

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your focus
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Here's what we'll help you work on.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Based on what you told us, we'll keep the system focused on these areas.
      </p>

      <div className="mt-8 space-y-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-stone-900"
          >
            <h2 className="text-sm font-semibold">{card.title}</h2>

            <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-6 w-full rounded-full bg-stone-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
