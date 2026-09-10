"use client";

import { useState, useTransition } from "react";

import { saveCarryForwardDefaults } from "@/lib/actions/settings";

type CarryForwardSettingsProps = {
  initialPriorities: boolean;
  initialTasks: boolean;
  initialNotes: boolean;
};

export function CarryForwardSettings({
  initialPriorities,
  initialTasks,
  initialNotes,
}: CarryForwardSettingsProps) {
  const [priorities, setPriorities] = useState(initialPriorities);

  const [tasks, setTasks] = useState(initialTasks);

  const [notes, setNotes] = useState(initialNotes);

  const [pending, startTransition] = useTransition();

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function save(
    nextPriorities: boolean,
    nextTasks: boolean,
    nextNotes: boolean,
  ) {
    if (!nextPriorities && !nextTasks && !nextNotes) {
      return;
    }

    setError("");
    setSaved(false);

    startTransition(async () => {
      try {
        await saveCarryForwardDefaults(nextPriorities, nextTasks, nextNotes);

        setSaved(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to save settings",
        );
      }
    });
  }

  function toggle(type: "priorities" | "tasks" | "notes") {
    const nextPriorities = type === "priorities" ? !priorities : priorities;

    const nextTasks = type === "tasks" ? !tasks : tasks;

    const nextNotes = type === "notes" ? !notes : notes;

    if (!nextPriorities && !nextTasks && !nextNotes) {
      setError("At least one option must remain selected.");
      return;
    }

    setPriorities(nextPriorities);
    setTasks(nextTasks);
    setNotes(nextNotes);

    save(nextPriorities, nextTasks, nextNotes);
  }

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-stone-50 dark:hover:bg-stone-900">
        <div>
          <p className="text-sm font-medium">Priorities</p>

          <p className="mt-1 text-xs text-stone-500">
            Bring incomplete priorities into the new day.
          </p>
        </div>

        <input
          type="checkbox"
          checked={priorities}
          onChange={() => toggle("priorities")}
          disabled={pending}
          className="h-5 w-5 accent-current"
        />
      </label>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-stone-50 dark:hover:bg-stone-900">
        <div>
          <p className="text-sm font-medium">Tasks</p>

          <p className="mt-1 text-xs text-stone-500">
            Bring incomplete tasks into the new day.
          </p>
        </div>

        <input
          type="checkbox"
          checked={tasks}
          onChange={() => toggle("tasks")}
          disabled={pending}
          className="h-5 w-5 accent-current"
        />
      </label>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-stone-50 dark:hover:bg-stone-900">
        <div>
          <p className="text-sm font-medium">Notes</p>

          <p className="mt-1 text-xs text-stone-500">
            Bring your previous note into the new day.
          </p>
        </div>

        <input
          type="checkbox"
          checked={notes}
          onChange={() => toggle("notes")}
          disabled={pending}
          className="h-5 w-5 accent-current"
        />
      </label>

      <div className="min-h-5 pt-1 text-xs">
        {pending && <span className="text-stone-400">Saving…</span>}

        {!pending && saved && (
          <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
        )}

        {!pending && error && (
          <span className="text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
    </div>
  );
}
