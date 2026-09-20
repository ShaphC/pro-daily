"use client";

type WhyThreeStepProps = {
  onNext: () => void;
  pending: boolean;
};

export function WhyThreeStep({ onNext, pending }: WhyThreeStepProps) {
  return (
    <section className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        A deliberate limit
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Why only three?
      </h1>

      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        Because a list of twenty priorities doesn't tell you what to do. It
        tells you that everything matters.
      </p>

      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        Three gives you enough room to make meaningful progress without turning
        your day into another overwhelming list.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-black/10 bg-white p-5 text-left dark:border-white/10 dark:bg-stone-900">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
          The rule
        </div>

        <div className="mt-2 text-lg font-semibold">
          Choose what matters.
          <br />
          Let the rest wait.
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="mt-8 inline-flex rounded-full bg-stone-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        I understand
      </button>
    </section>
  );
}
