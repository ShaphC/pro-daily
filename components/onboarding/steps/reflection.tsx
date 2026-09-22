"use client";

type ReflectionStepProps = {
  name: string | null;
  taskHabits: string | null;
  goals: string[];
  onNext: () => void;
  pending: boolean;
};

export function ReflectionStep({
  name,
  taskHabits,
  goals,
  onNext,
  pending,
}: ReflectionStepProps) {
  const firstName = name?.trim() || "you";

  const habitMessage =
    taskHabits === "lists"
      ? "You already have a habit of writing things down."
      : taskHabits === "mental"
        ? "You've mostly been carrying things in your head."
        : taskHabits === "overwhelmed"
          ? "You already have things to track, but keeping up with them can be difficult."
          : "Your planning habits depend on the day.";

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your starting point
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Here's what we're building around you, {firstName}.
      </h1>

      <div className="mt-8 space-y-3">
        <div className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            Where you are
          </div>

          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
            {habitMessage}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">
            What matters to you
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <span
                  key={goal}
                  className="rounded-full border bg-stone-50 px-3 py-1.5 text-xs font-medium dark:bg-stone-950"
                >
                  {goal.replace("-", " ")}
                </span>
              ))
            ) : (
              <span className="text-sm text-stone-500 dark:text-stone-400">
                A simpler way to manage your day.
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-stone-500 dark:text-stone-400">
        CheckMarkr will stay focused on helping you decide, act, and keep moving
        without adding unnecessary complexity.
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
