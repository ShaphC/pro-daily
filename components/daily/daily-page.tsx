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
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

import type {
  DailyPage as DailyPageType,
  Priority,
  Task,
} from "@/types/database";

import {
  addPriority,
  addTask,
  deletePriority,
  deleteTask,
  reorderPriorities,
  reorderTasks,
  saveNote,
  togglePriority,
  toggleTask,
  updatePriorityText,
  updateTaskText,
} from "@/lib/actions/daily";

import { SortableRow } from "@/components/daily/sortable-row";
import { CarryForwardDialog } from "@/components/daily/carry-forward-dialog";

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

  const updateLocalPriority = (id: string, patch: Partial<Priority>) => {
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
  };

  const updateLocalTask = (id: string, patch: Partial<Task>) => {
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
  };

  function handleCarryForwardComplete() {
    setShowCarryForward(false);

    startTransition(() => {
      window.location.reload();
    });
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

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">
              {formatDailyDate(initial.day.date)}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              What matters today?
            </h1>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-sm ${
              accomplished
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "text-stone-500"
            }`}
          >
            {topThreeComplete}/3 top priorities complete
            {accomplished ? " — Day accomplished" : ""}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
          <div className="space-y-10">
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Top Priorities</h2>

                  <p className="mt-1 text-sm text-stone-500">
                    Aim for 3–5. Maximum 7. Drag to change priority order.
                  </p>
                </div>

                <span className="text-xs text-stone-400">
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
                  className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-300 disabled:cursor-not-allowed disabled:bg-stone-100 dark:bg-stone-950 dark:disabled:bg-stone-900"
                />

                <button
                  type="button"
                  disabled={
                    !priorityDraft.trim() || priorities.length >= 7 || pending
                  }
                  onClick={() => startTransition(createPriority)}
                  className="rounded-xl border bg-white px-4 disabled:opacity-40 dark:bg-stone-950"
                  aria-label="Add priority"
                >
                  <Plus size={18} />
                </button>
              </div>
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Tasks</h2>

                <p className="mt-1 text-sm text-stone-500">
                  Work through the details. Choose what carries into each new
                  day.
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
                  className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-300 dark:bg-stone-950"
                />

                <button
                  type="button"
                  disabled={!taskDraft.trim() || pending}
                  onClick={() => startTransition(createTask)}
                  className="rounded-xl border bg-white px-4 disabled:opacity-40 dark:bg-stone-950"
                  aria-label="Add task"
                >
                  <Plus size={18} />
                </button>
              </div>
            </section>
          </div>

          <section className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Notes</h2>

              <p className="mt-1 text-sm text-stone-500">
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
              className="min-h-[420px] w-full resize-y rounded-2xl border bg-stone-100/70 p-5 leading-7 outline-none focus:ring-2 focus:ring-stone-300 dark:bg-stone-900/60 lg:min-h-[600px]"
            />

            <p className="mt-2 text-right text-xs text-stone-400">
              Saved when you leave the notes field.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
