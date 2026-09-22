"use client";

type RestStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function RestStep({ onNext, pending }: RestStepProps) {
  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        The other half
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Your day isn't only about getting things done.
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        A useful system should help you work with intention without making you
        feel like you should always be doing more.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-3xl border bg-stone-50 p-6 text-left dark:bg-stone-950">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
          Remember
        </div>

        <p className="mt-3 text-base font-semibold leading-6">
          Rest is not an unfinished task.
        </p>

        <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">
          Some days will be productive. Some won't. The system should work with
          both.
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
