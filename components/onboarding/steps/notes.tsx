"use client";

type NotesStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function NotesStep({ onNext, pending }: NotesStepProps) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Capture the rest
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Not everything is a task.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Use notes for thoughts, context, reminders, observations, or anything
        you want to remember without turning it into another task.
      </p>

      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
          Example note
        </p>

        <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-300">
          The client prefers the shorter version. Follow up after the next
          review.
        </p>
      </div>

      <p className="mt-5 text-xs leading-5 text-stone-500 dark:text-stone-400">
        Notes give you somewhere to put things without cluttering your task
        list.
      </p>

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
