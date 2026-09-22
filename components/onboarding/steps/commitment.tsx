"use client";

import { useState } from "react";

type CommitmentStepProps = {
  initialValue: string;
  onNext: (value: string) => void;
  pending: boolean;
};

export function CommitmentStep({
  initialValue,
  onNext,
  pending,
}: CommitmentStepProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Make it yours
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        What do you want to commit to?
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        Keep it simple. This isn't a promise to be perfect. It's a reminder of
        how you want to approach your days.
      </p>

      <div className="mt-8">
        <label htmlFor="onboarding-commitment" className="sr-only">
          Your commitment
        </label>

        <textarea
          id="onboarding-commitment"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={300}
          rows={4}
          placeholder="For example: I will focus on what matters instead of trying to do everything."
          className="w-full resize-none rounded-2xl border bg-white px-5 py-4 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:bg-stone-900 dark:placeholder:text-stone-600 dark:focus:border-stone-600"
        />
      </div>

      <button
        type="button"
        onClick={() => onNext(value.trim())}
        disabled={!value.trim() || pending}
        className="mt-5 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
