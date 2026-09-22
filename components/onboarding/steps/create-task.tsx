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
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import {
  addTask,
  deleteTask,
  getTasks,
  reorderTasks,
  toggleTask,
  updateTaskText,
} from "@/lib/actions/daily";
import type { Task } from "@/types/database";
import { SortableRow } from "@/components/daily/sortable-row";

type CreateTaskStepProps = {
  dayId: string;
  onNext: () => void;
  pending: boolean;
};

export function CreateTaskStep({
  dayId,
  onNext,
  pending,
}: CreateTaskStepProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDraft, setTaskDraft] = useState("");
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

    async function loadTasks() {
      try {
        const existing = await getTasks(dayId);

        if (!cancelled) {
          setTasks(existing as Task[]);
        }
      } catch (error) {
        console.error("Unable to load onboarding tasks:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [dayId]);

  function createTask() {
    const text = taskDraft.trim();

    if (!text || saving || pending) {
      return;
    }

    setTaskDraft("");

    startSaving(async () => {
      try {
        const created = await addTask(dayId, text);

        if (created) {
          setTasks((items) => [...items, created as Task]);
        }
      } catch (error) {
        console.error("Unable to create onboarding task:", error);

        setTaskDraft(text);
      }
    });
  }

  async function handleToggle(task: Task, completed: boolean) {
    setTasks((items) =>
      items.map((item) =>
        item.id === task.id
          ? {
              ...item,
              completed,
            }
          : item,
      ),
    );

    try {
      await toggleTask(task.id, completed);
    } catch (error) {
      console.error("Unable to update task:", error);

      setTasks((items) =>
        items.map((item) =>
          item.id === task.id
            ? {
                ...item,
                completed: !completed,
              }
            : item,
        ),
      );
    }
  }

  async function handleText(task: Task, text: string) {
    setTasks((items) =>
      items.map((item) =>
        item.id === task.id
          ? {
              ...item,
              text,
            }
          : item,
      ),
    );

    try {
      await updateTaskText(task.id, text);
    } catch (error) {
      console.error("Unable to update task text:", error);

      setTasks((items) =>
        items.map((item) =>
          item.id === task.id
            ? {
                ...item,
                text: task.text,
              }
            : item,
        ),
      );
    }
  }

  async function handleDelete(task: Task) {
    const previous = tasks;

    setTasks((items) => items.filter((item) => item.id !== task.id));

    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error("Unable to delete task:", error);

      setTasks(previous);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || saving || pending) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task.id === active.id);

    const newIndex = tasks.findIndex((task) => task.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(tasks, oldIndex, newIndex);

    setTasks(reordered);

    try {
      await reorderTasks(
        dayId,
        reordered.map((task) => task.id),
      );
    } catch (error) {
      console.error("Unable to reorder tasks:", error);

      setTasks(tasks);
    }
  }

  if (loading) {
    return (
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
          Your first task
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          What needs to get done?
        </h1>

        <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
          Loading your tasks…
        </p>
      </section>
    );
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your first task
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        What needs to get done?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Turn one of your priorities into a smaller, actionable task. This step
        is optional.
      </p>

      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900 sm:p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-950 text-[11px] font-bold text-white dark:bg-white dark:text-stone-950">
              02
            </span>

            <h2 className="text-lg font-semibold">Tasks</h2>
          </div>

          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Keep tasks small enough that you know exactly what to do next.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-2">
              {tasks.map((task, index) => (
                <SortableRow
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  completed={task.completed}
                  rank={index}
                  onToggle={(completed) => handleToggle(task, completed)}
                  onText={(text) => handleText(task, text)}
                  onDelete={() => handleDelete(task)}
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
                event.preventDefault();
                createTask();
              }
            }}
            disabled={saving || pending}
            maxLength={200}
            placeholder="Add a task"
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-black/20 focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20"
          />

          <button
            type="button"
            disabled={!taskDraft.trim() || saving || pending}
            onClick={createTask}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
            aria-label="Add task"
          >
            <Plus size={17} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={saving || pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        Continue
      </button>

      <p className="mt-3 text-center text-[11px] text-stone-400">
        You can skip this and add tasks later.
      </p>
    </section>
  );
}
