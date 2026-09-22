"use client";

import { useState } from "react";

type AdditionalQuestionsStepProps = {
  initialValue: string;
  onNext: (value: string) => void;
  pending: boolean;
};

export function AdditionalQuestionsStep({
  initialValue,
  onNext,
  pending,
}: AdditionalQuestionsStepProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        One last question
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Is there anything else we should know?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        This is completely optional. Tell us what you're hoping to change,
        what's getting in your way, or anything else that feels relevant.
      </p>

      <div className="mt-8">
        <label htmlFor="additional-questions" className="sr-only">
          Anything else
        </label>

        <textarea
          id="additional-questions"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="Anything you want us to know..."
          className="w-full resize-none rounded-2xl border bg-white px-5 py-4 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:bg-stone-900 dark:placeholder:text-stone-600 dark:focus:border-stone-600"
        />
      </div>

      <div className="mt-2 text-right text-[11px] text-stone-400">
        {value.length}/1000
      </div>

      <button
        type="button"
        onClick={() => onNext(value.trim())}
        disabled={pending}
        className="mt-4 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>

      {!value.trim() && (
        <button
          type="button"
          onClick={() => onNext("")}
          disabled={pending}
          className="mt-3 w-full text-xs font-medium text-stone-400 transition hover:text-stone-700 disabled:opacity-50 dark:hover:text-stone-200"
        >
          Skip this question
        </button>
      )}
    </section>
  );
}
