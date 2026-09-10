"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check } from "lucide-react";

import { startFreshDay, transferDayContent } from "@/lib/actions/daily";
import type { CarryForwardSource } from "@/types/database";

type CarryForwardDialogProps = {
  source: CarryForwardSource;
  targetDayId: string;
  defaultPriorities: boolean;
  defaultTasks: boolean;
  defaultNotes: boolean;
  onComplete: () => void;
};

export function CarryForwardDialog({
  source,
  targetDayId,
  defaultPriorities,
  defaultTasks,
  defaultNotes,
  onComplete,
}: CarryForwardDialogProps) {
  const [priorities, setPriorities] = useState(defaultPriorities);

  const [tasks, setTasks] = useState(defaultTasks);

  const [notes, setNotes] = useState(defaultNotes);

  const [pending, startTransition] = useTransition();

  const [error, setError] = useState("");

  const incompletePriorities = source.priorities.filter(
    (priority) => !priority.completed,
  );

  const incompleteTasks = source.tasks.filter((task) => !task.completed);

  const hasNote = Boolean(source.note?.content.trim());

  const selectedCount = [priorities, tasks, notes].filter(Boolean).length;

  function toggle(type: "priorities" | "tasks" | "notes") {
    const setters = {
      priorities: setPriorities,
      tasks: setTasks,
      notes: setNotes,
    };

    const values = {
      priorities,
      tasks,
      notes,
    };

    if (values[type]) {
      if (selectedCount === 1) {
        return;
      }

      setters[type](false);
      return;
    }

    setters[type](true);
    setError("");
  }

  function handleTransfer() {
    if (!priorities && !tasks && !notes) {
      setError("Select at least one item to transfer.");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await transferDayContent(
          source.day.id,
          targetDayId,
          priorities,
          tasks,
          notes,
        );

        onComplete();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to transfer content.",
        );
      }
    });
  }

  function handleStartFresh() {
    setError("");

    startTransition(async () => {
      try {
        await startFreshDay(targetDayId);
        onComplete();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to start a fresh day.",
        );
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="carry-forward-title"
        className="w-full max-w-lg rounded-3xl border bg-white p-6 shadow-2xl dark:bg-stone-950"
      >
        <div className="mb-6">
          <p className="text-sm font-medium text-stone-500">New day</p>

          <h2
            id="carry-forward-title"
            className="mt-1 text-2xl font-semibold tracking-tight"
          >
            Bring previous work forward?
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            Choose what you want to carry into today. Nothing will be
            transferred automatically.
          </p>
        </div>

        <div className="space-y-3">
          <CarryForwardOption
            label="Priorities"
            description={`${incompletePriorities.length} incomplete ${
              incompletePriorities.length === 1 ? "priority" : "priorities"
            }`}
            checked={priorities}
            disabled={pending || incompletePriorities.length === 0}
            onChange={() => toggle("priorities")}
          />

          <CarryForwardOption
            label="Tasks"
            description={`${incompleteTasks.length} incomplete ${
              incompleteTasks.length === 1 ? "task" : "tasks"
            }`}
            checked={tasks}
            disabled={pending || incompleteTasks.length === 0}
            onChange={() => toggle("tasks")}
          />

          <CarryForwardOption
            label="Notes"
            description={hasNote ? "Previous note" : "No note to transfer"}
            checked={notes}
            disabled={pending || !hasNote}
            onChange={() => toggle("notes")}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleStartFresh}
            disabled={pending}
            className="rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-stone-900"
          >
            Start Fresh
          </button>

          <button
            type="button"
            onClick={handleTransfer}
            disabled={pending || selectedCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            {pending ? "Saving…" : "Transfer Selected"}

            {!pending && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function CarryForwardOption({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        checked
          ? "border-stone-400 bg-stone-50 dark:border-stone-600 dark:bg-stone-900"
          : "border-stone-200 dark:border-stone-800"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-stone-50 dark:hover:bg-stone-900"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          checked
            ? "border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900"
            : "border-stone-300 dark:border-stone-700"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>

        <span className="mt-1 block text-xs text-stone-500">{description}</span>
      </span>
    </button>
  );
}
