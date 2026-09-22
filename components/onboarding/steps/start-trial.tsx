"use client";

type StartTrialStepProps = {
  pending: boolean;
  onComplete: () => void;
};

export function StartTrialStep({ pending, onComplete }: StartTrialStepProps) {
  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        You're ready
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Start making your days easier.
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        Your CheckMarkr workspace is ready. Start with today's priorities, turn
        them into tasks, and take it one step at a time.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-3xl border bg-white p-6 text-left shadow-sm dark:bg-stone-900">
        <div className="text-sm font-semibold">Your first day</div>

        <div className="mt-4 space-y-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white dark:bg-white dark:text-stone-950">
              1
            </span>
            Choose your priorities
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white dark:bg-white dark:text-stone-950">
              2
            </span>
            Add your tasks
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white dark:bg-white dark:text-stone-950">
              3
            </span>
            Finish what matters
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        disabled={pending}
        className="mt-7 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        {pending ? "Setting things up..." : "Start free trial"}
      </button>

      <p className="mt-3 text-[11px] text-stone-400">
        You can change your setup later.
      </p>
    </section>
  );
}
