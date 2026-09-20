"use client";

type PrioritiesStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function PrioritiesStep({ onNext, pending }: PrioritiesStepProps) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your day
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Start with what matters most.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Every day starts with a small set of priorities. These aren't everything
        you could do. They're the things you most want to move forward.
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-xs font-bold text-white dark:bg-white dark:text-stone-950">
            1
          </div>

          <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-xs font-bold text-stone-400 dark:border-stone-700">
            2
          </div>

          <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-xs font-bold text-stone-400 dark:border-stone-700">
            3
          </div>
        </div>

        <p className="mt-5 text-sm font-medium">
          Three is enough to give your day direction.
        </p>

        <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">
          We'll help you choose them next.
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-6 w-full rounded-full bg-stone-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
