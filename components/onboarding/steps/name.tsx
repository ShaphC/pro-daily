"use client";

import { useState } from "react";

type NameStepProps = {
  initialName: string;
  onNext: (name: string) => void;
  pending: boolean;
};

export function NameStep({ initialName, onNext, pending }: NameStepProps) {
  const [name, setName] = useState(initialName);

  const canContinue = name.trim().length > 0;

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        A quick question
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        What should we call you?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        We'll use your name to make the experience feel a little more personal.
      </p>

      <div className="mt-8">
        <label htmlFor="onboarding-name" className="sr-only">
          Your name
        </label>

        <input
          id="onboarding-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canContinue) {
              onNext(name.trim());
            }
          }}
          autoFocus
          maxLength={100}
          placeholder="Your name"
          className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-base outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:border-white/10 dark:bg-stone-900 dark:placeholder:text-stone-600 dark:focus:border-stone-600"
        />
      </div>

      <button
        type="button"
        onClick={() => onNext(name.trim())}
        disabled={!canContinue || pending}
        className="mt-5 w-full rounded-full bg-stone-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
