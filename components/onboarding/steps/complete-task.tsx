"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { addPriority, togglePriority } from "@/lib/actions/daily";
import type { Priority } from "@/types/database";

const HARDCODED_PRIORITY = "Write down one thing that you need to finish";

type CompleteTaskStepProps = {
  dayId: string;
  onNext: () => void;
  pending: boolean;
};

export function CompleteTaskStep({
  dayId,
  onNext,
  pending,
}: CompleteTaskStepProps) {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [priorityDraft, setPriorityDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function createStartingPriority() {
      try {
        const created = await addPriority(dayId, HARDCODED_PRIORITY);

        if (!cancelled && created) {
          setPriorities([created as Priority]);
        }
      } catch (error) {
        console.error("Unable to create onboarding priority:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    createStartingPriority();

    return () => {
      cancelled = true;
    };
  }, [dayId]);

  const hardcodedPriority = priorities[0];

  const userPriorities = priorities.slice(1);

  const hardcodedCompleted = hardcodedPriority?.completed === true;

  const hasUserPriority = userPriorities.length >= 1;

  const atLimit = priorities.length >= 7;

  const canContinue = hasUserPriority && hardcodedCompleted && !loading;

  function createPriority() {
    const text = priorityDraft.trim();

    if (!text || atLimit || saving || pending) {
      return;
    }

    setPriorityDraft("");

    startSaving(async () => {
      try {
        const created = await addPriority(dayId, text);

        if (created) {
          setPriorities((items) => [...items, created as Priority]);
        }
      } catch (error) {
        console.error("Unable to create priority:", error);

        setPriorityDraft(text);
      }
    });
  }

  function handleToggleHardcoded(completed: boolean) {
    if (!hardcodedPriority || saving || pending) {
      return;
    }

    setPriorities((items) =>
      items.map((item) =>
        item.id === hardcodedPriority.id
          ? {
              ...item,
              completed,
            }
          : item,
      ),
    );

    startSaving(async () => {
      try {
        await togglePriority(hardcodedPriority.id, completed);
      } catch (error) {
        console.error("Unable to update priority:", error);

        setPriorities((items) =>
          items.map((item) =>
            item.id === hardcodedPriority.id
              ? {
                  ...item,
                  completed: !completed,
                }
              : item,
          ),
        );
      }
    });
  }

  if (loading) {
    return (
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
          Your priorities
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Let's make your first list.
        </h1>

        <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
          Setting up your first priority…
        </p>
      </section>
    );
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your priorities
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Let's make your first list.
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Start with one thing you need to finish. Then add at least one more
        priority for today.
      </p>

      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900 sm:p-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-950 text-[11px] font-bold text-white dark:bg-white dark:text-stone-950">
                01
              </span>

              <h2 className="text-lg font-semibold">Top Priorities</h2>
            </div>

            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Aim for 3–5. Maximum 7.
            </p>
          </div>

          <span className="text-xs font-medium text-stone-400 dark:text-stone-500">
            {priorities.length}/7
          </span>
        </div>

        <div className="grid gap-2">
          {hardcodedPriority && (
            <div
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                hardcodedPriority.completed
                  ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
                  : "border-black/10 bg-stone-50 dark:border-white/10 dark:bg-stone-950"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  handleToggleHardcoded(!hardcodedPriority.completed)
                }
                disabled={saving || pending}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                  hardcodedPriority.completed
                    ? "border-white bg-white text-stone-950 dark:border-stone-950 dark:bg-stone-950 dark:text-white"
                    : "border-stone-300 hover:border-stone-500 dark:border-stone-700 dark:hover:border-stone-500"
                }`}
                aria-label={
                  hardcodedPriority.completed
                    ? "Mark priority incomplete"
                    : "Mark priority complete"
                }
              >
                {hardcodedPriority.completed && (
                  <Check size={14} strokeWidth={3} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-bold uppercase tracking-[0.14em] ${
                    hardcodedPriority.completed
                      ? "text-white/60 dark:text-stone-500"
                      : "text-stone-400"
                  }`}
                >
                  Priority 1
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    hardcodedPriority.completed ? "line-through opacity-70" : ""
                  }`}
                >
                  {hardcodedPriority.text}
                </p>
              </div>
            </div>
          )}

          {userPriorities.map((priority, index) => (
            <div
              key={priority.id}
              className="flex items-center gap-3 rounded-xl border border-black/10 bg-stone-50 px-3 py-3 dark:border-white/10 dark:bg-stone-950"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-black/10 text-[10px] font-bold text-stone-500 dark:border-white/10 dark:text-stone-400">
                {index + 2}
              </div>

              <p className="min-w-0 flex-1 text-sm font-medium">
                {priority.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={priorityDraft}
            onChange={(event) => setPriorityDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                createPriority();
              }
            }}
            disabled={atLimit || saving || pending}
            maxLength={200}
            placeholder={
              atLimit
                ? "Maximum of 7 priorities reached"
                : userPriorities.length === 0
                  ? "Write another priority"
                  : "Add another priority"
            }
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-black/20 focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20"
          />

          <button
            type="button"
            disabled={!priorityDraft.trim() || atLimit || saving || pending}
            onClick={createPriority}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
            aria-label="Add priority"
          >
            <Plus size={17} />
          </button>
        </div>
      </div>

      {hasUserPriority && !hardcodedCompleted && (
        <div className="mt-5 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-600 dark:bg-stone-950 dark:text-stone-300">
          Nice. Now check off the first priority to show that you understand how
          completing a priority works.
        </div>
      )}

      {canContinue && (
        <div className="mt-5 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-600 dark:bg-stone-950 dark:text-stone-300">
          Nice. You added your priorities and completed your first one.
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canContinue || saving || pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>

      {!hasUserPriority && (
        <p className="mt-3 text-center text-[11px] text-stone-400">
          Add at least one priority to continue.
        </p>
      )}

      {hasUserPriority && !hardcodedCompleted && (
        <p className="mt-3 text-center text-[11px] text-stone-400">
          Complete the first priority to continue.
        </p>
      )}
    </section>
  );
}
