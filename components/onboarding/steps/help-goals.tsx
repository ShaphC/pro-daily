"use client";

import { useState } from "react";

import type { OnboardingHelpGoal } from "@/types/database";

const options: {
  value: OnboardingHelpGoal;
  title: string;
  description: string;
}[] = [
  {
    value: "priorities",
    title: "Know what matters most",
    description:
      "Choose a small number of priorities instead of carrying everything at once.",
  },
  {
    value: "tasks",
    title: "Actually finish tasks",
    description: "Turn priorities into concrete things you can complete.",
  },
  {
    value: "consistency",
    title: "Build consistency",
    description: "Create a simple daily rhythm you can actually maintain.",
  },
  {
    value: "focus",
    title: "Stay focused",
    description: "Reduce the noise and concentrate on what's important.",
  },
  {
    value: "organization",
    title: "Get organized",
    description: "Keep your day, tasks, and notes in one place.",
  },
  {
    value: "follow-through",
    title: "Follow through",
    description: "Stop carrying unfinished intentions from day to day.",
  },
];

type HelpGoalsStepProps = {
  initialGoals: OnboardingHelpGoal[];
  onNext: (goals: OnboardingHelpGoal[]) => void;
  pending: boolean;
};

export function HelpGoalsStep({
  initialGoals,
  onNext,
  pending,
}: HelpGoalsStepProps) {
  const [selected, setSelected] = useState<OnboardingHelpGoal[]>(initialGoals);

  function toggleGoal(goal: OnboardingHelpGoal) {
    setSelected((current) => {
      if (current.includes(goal)) {
        return current.filter((item) => item !== goal);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, goal];
    });
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        What would help?
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        What do you want to get better at?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Pick up to 3. We'll use your answers to personalize what comes next.
      </p>

      <div className="mt-8 space-y-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          const isDisabled = !isSelected && selected.length >= 3;

          return (
            <button
              key={option.value}
              type="button"
              disabled={pending || isDisabled}
              onClick={() => toggleGoal(option.value)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
                  : "border-black/10 bg-white hover:border-black/20 hover:bg-stone-50 dark:border-white/10 dark:bg-stone-900 dark:hover:border-white/20 dark:hover:bg-stone-800"
              } ${isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">{option.title}</div>

                  <div
                    className={`mt-1 text-xs leading-5 ${
                      isSelected
                        ? "text-white/65 dark:text-stone-950/60"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    {option.description}
                  </div>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                    isSelected
                      ? "border-white bg-white text-stone-950 dark:border-stone-950 dark:bg-stone-950 dark:text-white"
                      : "border-stone-300 dark:border-stone-700"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={selected.length === 0 || pending}
        onClick={() => onNext(selected)}
        className="mt-5 w-full rounded-full bg-stone-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>

      <p className="mt-3 text-center text-[11px] text-stone-400">
        {selected.length}/3 selected
      </p>
    </section>
  );
}
