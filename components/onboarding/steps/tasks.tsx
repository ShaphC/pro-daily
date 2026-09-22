"use client";

type TasksStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function TasksStep({ onNext, pending }: TasksStepProps) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Turn priorities into action
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Now turn priorities into tasks.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        A priority tells you what matters. A task gives you something concrete
        to do about it.
      </p>

      <div className="mt-8 rounded-3xl border bg-stone-50 p-5 dark:bg-stone-950">
        <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-stone-900">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Priority
          </div>

          <div className="mt-2 text-sm font-semibold">
            Launch the new website
          </div>

          <div className="mt-5 border-t pt-4 dark:border-stone-800">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
              Task
            </div>

            <div className="mt-2 flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-stone-300 dark:border-stone-700" />

              <span className="text-sm text-stone-700 dark:text-stone-300">
                Write the homepage headline
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-stone-500 dark:text-stone-400">
        You don't need to plan every step. Just give yourself a clear next
        action.
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>
    </section>
  );
}
