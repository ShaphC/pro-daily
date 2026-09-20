"use client";

type WelcomeStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function WelcomeStep({ onNext, pending }: WelcomeStepProps) {
  return (
    <section className="text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Welcome to CheckMarkr
      </p>

      <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
        Make your day
        <br />
        easier to finish.
      </h1>

      <p className="mx-auto mt-6 max-w-md text-base leading-7 text-stone-500 dark:text-stone-400">
        A simple system for deciding what matters, getting things done, and
        keeping a record of your day.
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-10 inline-flex rounded-full bg-stone-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Let's get started
      </button>
    </section>
  );
}
