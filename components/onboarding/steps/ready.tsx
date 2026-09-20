"use client";

type ReadyStepProps = {
  name: string | null;
  onNext: () => void;
  pending: boolean;
};

export function ReadyStep({ name, onNext, pending }: ReadyStepProps) {
  const firstName = name?.trim() || "you";

  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        One step at a time
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Ready to make this
        <br />a little easier, {firstName}?
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        You don't need a perfect system. You just need a simple place to decide
        what matters and make progress.
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-9 inline-flex rounded-full bg-stone-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Let's build your day
      </button>
    </section>
  );
}
