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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-md dark:bg-black/55">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="carry-forward-title"
        className="w-full max-w-lg rounded-2xl border border-black/10 bg-white/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-stone-950/80 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-6"
      >
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
            New day
          </p>

          <h2
            id="carry-forward-title"
            className="mt-1.5 text-2xl font-semibold tracking-tight text-stone-950 dark:text-white"
          >
            Bring previous work forward?
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
            Choose what you want to carry into today. Nothing is transferred
            automatically.
          </p>
        </div>

        <div className="grid gap-1.5">
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
          <p className="mt-3 rounded-xl border border-red-200/70 bg-red-50/60 px-3.5 py-2.5 text-sm text-red-700 backdrop-blur-xl dark:border-red-400/10 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleStartFresh}
            disabled={pending}
            className="rounded-xl border border-black/10 bg-white/30 px-4 py-2.5 text-sm font-medium text-stone-600 backdrop-blur-xl transition hover:bg-white/55 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
          >
            Start Fresh
          </button>

          <button
            type="button"
            onClick={handleTransfer}
            disabled={pending || selectedCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-stone-950 px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
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
      className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
        checked
          ? "border-black/15 bg-white/50 dark:border-white/15 dark:bg-white/[0.06]"
          : "border-black/10 bg-white/25 dark:border-white/10 dark:bg-white/[0.025]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-45"
          : "hover:bg-white/50 dark:hover:bg-white/[0.06]"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          checked
            ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
            : "border-stone-300 dark:border-stone-700"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-stone-800 dark:text-stone-200">
          {label}
        </span>

        <span className="mt-0.5 block text-xs text-stone-400 dark:text-stone-500">
          {description}
        </span>
      </span>
    </button>
  );
}
