"use client";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CheckCircle2, Plus } from "lucide-react";
import { useState, useTransition } from "react";

import type {
  CarryForwardSource,
  DailyPage as DailyPageType,
  Priority,
  Task,
} from "@/types/database";

import {
  addPriority,
  addTask,
  deletePriority,
  deleteTask,
  getPreviousDayTransferSource,
  reorderPriorities,
  reorderTasks,
  saveNote,
  togglePriority,
  toggleTask,
  updatePriorityText,
  updateTaskText,
} from "@/lib/actions/daily";

import { CarryForwardDialog } from "@/components/daily/carry-forward-dialog";
import { SortableRow } from "@/components/daily/sortable-row";

function formatDailyDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function DailyPage({ initial }: { initial: DailyPageType }) {
  const [priorities, setPriorities] = useState(initial.priorities);

  const [tasks, setTasks] = useState(initial.tasks);

  const [priorityDraft, setPriorityDraft] = useState("");

  const [taskDraft, setTaskDraft] = useState("");

  const [note, setNote] = useState(initial.note?.content ?? "");

  const [showCarryForward, setShowCarryForward] = useState(
    initial.carryForwardAvailable,
  );

  const [manualCarryForwardSource, setManualCarryForwardSource] =
    useState<CarryForwardSource | null>(null);

  const [showManualCarryForward, setShowManualCarryForward] = useState(false);

  const [manualCarryForwardLoading, setManualCarryForwardLoading] =
    useState(false);

  const [manualCarryForwardError, setManualCarryForwardError] = useState("");

  const [pending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 5,
      },
    }),
  );

  const topThreeComplete = priorities
    .slice(0, 3)
    .filter((item) => item.completed).length;

  const accomplished = priorities.length >= 3 && topThreeComplete === 3;

  function priorityDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = priorities.findIndex((item) => item.id === active.id);

    const newIndex = priorities.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(priorities, oldIndex, newIndex).map(
      (item, position) => ({
        ...item,
        position,
      }),
    );

    setPriorities(reordered);

    startTransition(() =>
      reorderPriorities(
        initial.day.id,
        reordered.map((item) => item.id),
      ),
    );
  }

  function taskDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex((item) => item.id === active.id);

    const newIndex = tasks.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(tasks, oldIndex, newIndex).map(
      (item, position) => ({
        ...item,
        position,
      }),
    );

    setTasks(reordered);

    startTransition(() =>
      reorderTasks(
        initial.day.id,
        reordered.map((item) => item.id),
      ),
    );
  }

  async function createPriority() {
    const text = priorityDraft.trim();

    if (!text || priorities.length >= 7) {
      return;
    }

    setPriorityDraft("");

    const created = await addPriority(initial.day.id, text);

    if (created) {
      setPriorities((items) => [...items, created as Priority]);
    }
  }

  async function createTask() {
    const text = taskDraft.trim();

    if (!text) {
      return;
    }

    setTaskDraft("");

    const created = await addTask(initial.day.id, text);

    if (created) {
      setTasks((items) => [...items, created as Task]);
    }
  }

  function updateLocalPriority(id: string, patch: Partial<Priority>) {
    setPriorities((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  function updateLocalTask(id: string, patch: Partial<Task>) {
    setTasks((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  function handleCarryForwardComplete() {
    setShowCarryForward(false);

    startTransition(() => {
      window.location.reload();
    });
  }

  async function handleOpenManualCarryForward() {
    setManualCarryForwardError("");
    setManualCarryForwardLoading(true);

    try {
      const source = await getPreviousDayTransferSource(initial.day.id);

      if (!source) {
        setManualCarryForwardError(
          "There is no transferable content from yesterday.",
        );
        return;
      }

      setManualCarryForwardSource(source);

      setShowManualCarryForward(true);
    } catch (error) {
      setManualCarryForwardError(
        error instanceof Error ? error.message : "Unable to check yesterday.",
      );
    } finally {
      setManualCarryForwardLoading(false);
    }
  }

  return (
    <>
      {showCarryForward && initial.carryForwardSource && (
        <CarryForwardDialog
          source={initial.carryForwardSource}
          targetDayId={initial.day.id}
          defaultPriorities={initial.carryForwardPriorities}
          defaultTasks={initial.carryForwardTasks}
          defaultNotes={initial.carryForwardNotes}
          onComplete={handleCarryForwardComplete}
        />
      )}

      {showManualCarryForward && manualCarryForwardSource && (
        <CarryForwardDialog
          source={manualCarryForwardSource}
          targetDayId={initial.day.id}
          defaultPriorities={initial.carryForwardPriorities}
          defaultTasks={initial.carryForwardTasks}
          defaultNotes={initial.carryForwardNotes}
          mode="manual"
          existingPriorities={priorities.length}
          existingTasks={tasks.length}
          hasExistingNote={Boolean(note.trim())}
          onComplete={() => {
            setShowManualCarryForward(false);

            setManualCarryForwardSource(null);

            window.location.reload();
          }}
        />
      )}

      <main className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-stone-300/20 blur-3xl dark:bg-white/[0.035]" />

        <div className="pointer-events-none absolute right-0 top-64 h-80 w-80 rounded-full bg-stone-200/25 blur-3xl dark:bg-white/[0.025]" />

        <div className="relative">
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                Today
              </p>

              <p className="mt-2 text-sm font-medium text-stone-500 dark:text-stone-400">
                {formatDailyDate(initial.day.date)}
              </p>

              <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.035em] text-stone-950 dark:text-white sm:text-4xl">
                What matters today?
              </h1>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div
                className={`flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium backdrop-blur-xl ${
                  accomplished
                    ? "border-emerald-300/60 bg-emerald-50/70 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "border-black/10 bg-white/45 text-stone-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-stone-400"
                }`}
              >
                {accomplished && <CheckCircle2 size={14} />}

                <span>
                  {topThreeComplete}/3 top priorities complete
                  {accomplished ? " · Day accomplished" : ""}
                </span>
              </div>

              <button
                type="button"
                onClick={handleOpenManualCarryForward}
                disabled={manualCarryForwardLoading}
                className="text-xs font-medium text-stone-500 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-white"
              >
                {manualCarryForwardLoading
                  ? "Checking yesterday…"
                  : "Transfer from previous day"}
              </button>

              {manualCarryForwardError && (
                <p className="max-w-xs text-right text-xs text-stone-400 dark:text-stone-500">
                  {manualCarryForwardError}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.72fr)]">
            <div className="space-y-5">
              <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
                <div className="relative z-10">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-950 text-[11px] font-bold text-white dark:bg-white dark:text-stone-950">
                          01
                        </span>

                        <h2 className="text-lg font-semibold text-stone-950 dark:text-white">
                          Top Priorities
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                        Aim for 3–5. Maximum 7. Drag to reorder.
                      </p>
                    </div>

                    <span className="text-xs font-medium text-stone-400 dark:text-stone-500">
                      {priorities.length}/7
                    </span>
                  </div>

                  <DndContext
                    id="priorities-dnd"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={priorityDragEnd}
                  >
                    <SortableContext
                      items={priorities.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid gap-2">
                        {priorities.map((priority, index) => (
                          <SortableRow
                            key={priority.id}
                            id={priority.id}
                            text={priority.text}
                            completed={priority.completed}
                            emphasis={index < 3}
                            rank={index}
                            onToggle={async (completed) => {
                              updateLocalPriority(priority.id, {
                                completed,
                              });

                              await togglePriority(priority.id, completed);
                            }}
                            onText={async (text) => {
                              updateLocalPriority(priority.id, {
                                text,
                              });

                              await updatePriorityText(priority.id, text);
                            }}
                            onDelete={async () => {
                              setPriorities((items) =>
                                items.filter((item) => item.id !== priority.id),
                              );

                              await deletePriority(priority.id);
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div className="mt-3 flex gap-2">
                    <input
                      value={priorityDraft}
                      onChange={(event) => setPriorityDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          startTransition(createPriority);
                        }
                      }}
                      disabled={priorities.length >= 7}
                      placeholder={
                        priorities.length >= 7
                          ? "Maximum of 7 priorities reached"
                          : "Add a priority"
                      }
                      className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white/45 px-3.5 py-2.5 text-sm text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/65 focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.075]"
                    />

                    <button
                      type="button"
                      disabled={
                        !priorityDraft.trim() ||
                        priorities.length >= 7 ||
                        pending
                      }
                      onClick={() => startTransition(createPriority)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                      aria-label="Add priority"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>
              </section>

              <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-white/50 text-[11px] font-bold text-stone-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-stone-300">
                        02
                      </span>

                      <h2 className="text-lg font-semibold text-stone-950 dark:text-white">
                        Tasks
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                      Work through the details and carry forward what remains.
                    </p>
                  </div>

                  <DndContext
                    id="tasks-dnd"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={taskDragEnd}
                  >
                    <SortableContext
                      items={tasks.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid gap-2">
                        {tasks.map((task) => (
                          <SortableRow
                            key={task.id}
                            id={task.id}
                            text={task.text}
                            completed={task.completed}
                            onToggle={async (completed) => {
                              updateLocalTask(task.id, {
                                completed,
                              });

                              await toggleTask(task.id, completed);
                            }}
                            onText={async (text) => {
                              updateLocalTask(task.id, {
                                text,
                              });

                              await updateTaskText(task.id, text);
                            }}
                            onDelete={async () => {
                              setTasks((items) =>
                                items.filter((item) => item.id !== task.id),
                              );

                              await deleteTask(task.id);
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div className="mt-3 flex gap-2">
                    <input
                      value={taskDraft}
                      onChange={(event) => setTaskDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          startTransition(createTask);
                        }
                      }}
                      placeholder="Add a task"
                      className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white/45 px-3.5 py-2.5 text-sm text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/65 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.075]"
                    />

                    <button
                      type="button"
                      disabled={!taskDraft.trim() || pending}
                      onClick={() => startTransition(createTask)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                      aria-label="Add task"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <section className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass glass-strong rounded-3xl p-5 sm:p-6">
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-white/50 text-[11px] font-bold text-stone-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-stone-300">
                        03
                      </span>

                      <h2 className="text-lg font-semibold text-stone-950 dark:text-white">
                        Notes
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                      Capture what happened while you worked.
                    </p>
                  </div>

                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    onBlur={() =>
                      startTransition(() => saveNote(initial.day.id, note))
                    }
                    placeholder="Meeting notes, decisions, progress, observations…"
                    className="min-h-[340px] w-full resize-y rounded-2xl border border-black/10 bg-white/45 p-4 text-sm leading-7 text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/65 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.075] lg:min-h-[500px]"
                  />

                  <p className="mt-2 text-right text-xs text-stone-400 dark:text-stone-500">
                    Saved when you leave the notes field.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
