"use client";

import { Check } from "lucide-react";
import { useState } from "react";

type CommitmentStepProps = {
  initialValue: string;
  onNext: (commitment: string) => void;
  pending: boolean;
};

const OPTIONS = [
  {
    title: "All in",
    description:
      "I’m ready to make this a daily system and consistently finish what matters.",
  },
  {
    title: "Staying consistent",
    description:
      "I’m committed to using it most days and following through on what I set out to do.",
  },
  {
    title: "Building the habit",
    description:
      "I’ll check in regularly and work on making this part of my routine.",
  },
  {
    title: "Just getting started",
    description:
      "I’ll use CheckMarkr when I need a little help getting organized.",
  },
];

export function CommitmentStep({
  initialValue,
  onNext,
  pending,
}: CommitmentStepProps) {
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
        Your commitment
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        How committed are you?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        There’s no wrong answer. Choose the level that feels honest for where
        you are right now.
      </p>

      <div className="mt-8 grid gap-3">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.title;

          return (
            <button
              key={option.title}
              type="button"
              onClick={() => setSelected(option.title)}
              disabled={pending}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-stone-950 bg-stone-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-stone-950"
                  : "bg-white hover:border-stone-300 hover:bg-stone-50 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:bg-stone-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    isSelected
                      ? "border-white bg-white text-stone-950 dark:border-stone-950 dark:bg-stone-950 dark:text-white"
                      : "border-stone-300 dark:border-stone-700"
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">{option.title}</p>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      isSelected
                        ? "text-white/65 dark:text-stone-500"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
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
          Choose the commitment that feels right for you.
        </p>
      )}
    </section>
  );
}
