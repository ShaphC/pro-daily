"use client";

type FinalSnapshotStepProps = {
  name: string | null;
  goals: string[];
  commitment: string | null;
  onNext: () => void;
  pending: boolean;
};

export function FinalSnapshotStep({
  name,
  goals,
  commitment,
  onNext,
  pending,
}: FinalSnapshotStepProps) {
  const firstName = name?.trim() || "you";

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your system
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        You're ready, {firstName}.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Here's the simple system you'll use.
      </p>

      <div className="mt-8 space-y-3">
        <div className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            1. Choose
          </div>

          <p className="mt-2 text-sm font-semibold">
            Decide what matters today.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            2. Act
          </div>

          <p className="mt-2 text-sm font-semibold">
            Turn priorities into clear tasks.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            3. Finish
          </div>

          <p className="mt-2 text-sm font-semibold">
            Complete what you can and let the day be enough.
          </p>
        </div>
      </div>

      {commitment && (
        <div className="mt-5 rounded-2xl border bg-stone-50 p-4 dark:bg-stone-950">
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400">
            Your commitment
          </div>

          <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-300">
            “{commitment}”
          </p>
        </div>
      )}

      {goals.length > 0 && (
        <p className="mt-4 text-xs text-stone-500 dark:text-stone-400">
          We'll keep your experience focused around what you selected during
          setup.
        </p>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
