"use client";

import { useState } from "react";

const options = [
  {
    value: "lists",
    title: "I keep lists",
    description: "I usually write things down somewhere.",
  },
  {
    value: "mental",
    title: "I keep it in my head",
    description: "I mostly remember what I need to do.",
  },
  {
    value: "inconsistent",
    title: "It depends on the day",
    description: "Sometimes I plan. Sometimes I just react.",
  },
  {
    value: "overwhelmed",
    title: "I have too much going on",
    description: "I make lists, but staying on top of them is hard.",
  },
];

type TaskHabitsStepProps = {
  initialValue: string;
  onNext: (value: string) => void;
  pending: boolean;
};

export function TaskHabitsStep({
  initialValue,
  onNext,
  pending,
}: TaskHabitsStepProps) {
  const [selected, setSelected] = useState(initialValue);

  function handleContinue() {
    if (!selected || pending) {
      return;
    }

    onNext(selected);
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your current system
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        How do you usually keep track of things?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        There is no right answer. We just want to understand where you're
        starting.
      </p>

      <div className="mt-8 space-y-3">
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={pending}
              onClick={() => setSelected(option.value)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
                  : "border-black/10 bg-white hover:border-black/20 hover:bg-stone-50 dark:border-white/10 dark:bg-stone-900 dark:hover:border-white/20 dark:hover:bg-stone-800"
              }`}
            >
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
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected || pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>

      {!selected && (
        <p className="mt-3 text-center text-[11px] text-stone-400">
          Choose the option that best describes you.
        </p>
      )}
    </section>
  );
}
