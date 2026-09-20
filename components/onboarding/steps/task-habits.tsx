"use client";

const options = [
  {
    value: "lists",
    title: "I keep lists",
    description: "I usually write things down somewhere.",
  },
  {
    value: "mental",
    title: "I keep it in my head",
    description: "I mostly remember what I need to do.",
  },
  {
    value: "inconsistent",
    title: "It depends on the day",
    description: "Sometimes I plan. Sometimes I just react.",
  },
  {
    value: "overwhelmed",
    title: "I have too much going on",
    description: "I make lists, but staying on top of them is hard.",
  },
];

type TaskHabitsStepProps = {
  initialValue: string;
  onNext: (value: string) => void;
  pending: boolean;
};

export function TaskHabitsStep({
  initialValue,
  onNext,
  pending,
}: TaskHabitsStepProps) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your current system
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        How do you usually keep track of things?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        There is no right answer. We just want to understand where you're
        starting.
      </p>

      <div className="mt-8 space-y-3">
        {options.map((option) => {
          const selected = initialValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={pending}
              onClick={() => onNext(option.value)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
                  : "border-black/10 bg-white hover:border-black/20 hover:bg-stone-50 dark:border-white/10 dark:bg-stone-900 dark:hover:border-white/20 dark:hover:bg-stone-800"
              }`}
            >
              <div className="text-sm font-semibold">{option.title}</div>

              <div
                className={`mt-1 text-xs leading-5 ${
                  selected
                    ? "text-white/65 dark:text-stone-950/60"
                    : "text-stone-500 dark:text-stone-400"
                }`}
              >
                {option.description}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
