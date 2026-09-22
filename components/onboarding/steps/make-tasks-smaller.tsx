"use client";

type MakeTasksSmallerStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function MakeTasksSmallerStep({
  onNext,
  pending,
}: MakeTasksSmallerStepProps) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Make it actionable
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Smaller tasks are easier to finish.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        If a task feels vague or heavy, it probably needs to be smaller. The
        goal is to make the next action obvious.
      </p>

      <div className="mt-8 space-y-3">
        <div className="rounded-3xl border bg-stone-50 p-5 dark:bg-stone-950">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Too big
          </p>

          <p className="mt-2 text-sm font-semibold">Build the website</p>
        </div>

        <div className="flex justify-center text-stone-400">↓</div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Better
          </p>

          <p className="mt-2 text-sm font-semibold">
            Write the homepage headline
          </p>

          <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">
            Clear enough to start without figuring out the whole project first.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Got it
      </button>
    </section>
  );
}
