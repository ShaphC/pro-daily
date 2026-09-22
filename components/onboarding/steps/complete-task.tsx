"use client";

import { useState } from "react";

type CompleteTaskStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function CompleteTaskStep({ onNext, pending }: CompleteTaskStepProps) {
  const [completed, setCompleted] = useState(false);

  function handleComplete() {
    setCompleted(true);
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Try it yourself
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Let's finish one.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        This is the basic loop: choose something concrete, do it, and mark it
        complete.
      </p>

      <div
        className={`mt-8 rounded-3xl border p-5 shadow-sm transition ${
          completed
            ? "bg-stone-50 dark:bg-stone-950"
            : "bg-white dark:bg-stone-900"
        }`}
      >
        <button
          type="button"
          onClick={handleComplete}
          disabled={completed || pending}
          className="flex w-full items-start gap-4 text-left"
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
              completed
                ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
                : "border-stone-300 dark:border-stone-700"
            }`}
          >
            {completed ? "✓" : ""}
          </div>

          <div>
            <p
              className={`text-sm font-semibold ${
                completed ? "text-stone-400 line-through" : ""
              }`}
            >
              Write down one thing you need to finish
            </p>

            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              It doesn't have to be important. Just make it concrete.
            </p>
          </div>
        </button>
      </div>

      {completed && (
        <div className="mt-5 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-700 dark:bg-stone-950 dark:text-stone-300">
          Done. That's the whole idea.
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!completed || pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
