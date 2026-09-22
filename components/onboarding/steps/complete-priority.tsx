"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import {
  addPriority,
  deletePriority,
  getOrCreateOnboardingPriority,
  getPriorities,
  reorderPriorities,
  togglePriority,
  updatePriorityText,
} from "@/lib/actions/daily";
import type { Priority } from "@/types/database";
import { SortableRow } from "@/components/daily/sortable-row";

const HARDCODED_PRIORITY = "Write down one thing that you need to finish";

type CompletePriorityStepProps = {
  dayId: string;
  onNext: () => void;
  pending: boolean;
};

export function CompletePriorityStep({
  dayId,
  onNext,
  pending,
}: CompletePriorityStepProps) {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [priorityDraft, setPriorityDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPriorities() {
      try {
        await getOrCreateOnboardingPriority(dayId, HARDCODED_PRIORITY);

        const existing = await getPriorities(dayId);

        if (!cancelled) {
          setPriorities(existing as Priority[]);
        }
      } catch (error) {
        console.error("Unable to load onboarding priorities:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPriorities();

    return () => {
      cancelled = true;
    };
  }, [dayId]);

  const hardcodedPriority = priorities.find(
    (priority) => priority.text === HARDCODED_PRIORITY,
  );

  const hardcodedPriorityId = hardcodedPriority?.id;

  const userPriorities = priorities.filter(
    (priority) => priority.id !== hardcodedPriorityId,
  );

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

  async function handleToggle(priority: Priority, completed: boolean) {
    setPriorities((items) =>
      items.map((item) =>
        item.id === priority.id
          ? {
              ...item,
              completed,
            }
          : item,
      ),
    );

    try {
      await togglePriority(priority.id, completed);
    } catch (error) {
      console.error("Unable to update priority:", error);

      setPriorities((items) =>
        items.map((item) =>
          item.id === priority.id
            ? {
                ...item,
                completed: !completed,
              }
            : item,
        ),
      );
    }
  }

  async function handleText(priority: Priority, text: string) {
    setPriorities((items) =>
      items.map((item) =>
        item.id === priority.id
          ? {
              ...item,
              text,
            }
          : item,
      ),
    );

    try {
      await updatePriorityText(priority.id, text);
    } catch (error) {
      console.error("Unable to update priority text:", error);

      setPriorities((items) =>
        items.map((item) =>
          item.id === priority.id
            ? {
                ...item,
                text: priority.text,
              }
            : item,
        ),
      );
    }
  }

  async function handleDelete(priority: Priority) {
    if (priority.id === hardcodedPriorityId) {
      return;
    }

    const previous = priorities;

    setPriorities((items) => items.filter((item) => item.id !== priority.id));

    try {
      await deletePriority(priority.id);
    } catch (error) {
      console.error("Unable to delete priority:", error);

      setPriorities(previous);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || saving || pending) {
      return;
    }

    const oldIndex = priorities.findIndex(
      (priority) => priority.id === active.id,
    );

    const newIndex = priorities.findIndex(
      (priority) => priority.id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(priorities, oldIndex, newIndex);

    setPriorities(reordered);

    try {
      await reorderPriorities(
        dayId,
        reordered.map((priority) => priority.id),
      );
    } catch (error) {
      console.error("Unable to reorder priorities:", error);

      setPriorities(priorities);
    }
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
          Loading your priorities…
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={priorities.map((priority) => priority.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-2">
              {priorities.map((priority, index) => {
                const isHardcoded = priority.id === hardcodedPriorityId;

                return (
                  <SortableRow
                    key={priority.id}
                    id={priority.id}
                    text={priority.text}
                    completed={priority.completed}
                    emphasis={isHardcoded}
                    rank={index}
                    onToggle={(completed) => handleToggle(priority, completed)}
                    onText={(text) => handleText(priority, text)}
                    onDelete={() => handleDelete(priority)}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

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
