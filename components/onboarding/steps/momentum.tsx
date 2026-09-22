"use client";

type MomentumStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function MomentumStep({ onNext, pending }: MomentumStepProps) {
  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Momentum
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        That's how progress starts.
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        Not with a perfect plan. Not with a huge checklist. With one clear thing
        that gets finished.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-3xl border bg-white p-6 shadow-sm dark:bg-stone-900">
        <div className="text-3xl font-semibold tracking-[-0.04em]">
          1 → 1 → 1
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500 dark:text-stone-400">
          Small completed actions add up.
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-7 inline-flex rounded-xl border bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
