"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

type Props = {
  id: string;
  text: string;
  completed: boolean;
  emphasis?: boolean;
  rank?: number;
  onToggle: (completed: boolean) => Promise<void>;
  onText: (text: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function SortableRow({
  id,
  text,
  completed,
  emphasis,
  rank,
  onToggle,
  onText,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [value, setValue] = useState(text);
  const [pending, startTransition] = useTransition();

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={[
        "group flex min-h-12 items-center gap-2.5 rounded-2xl border px-3 py-2.5",
        "backdrop-blur-xl transition-all",
        completed
          ? "border-stone-950 bg-stone-950 text-white dark:border-white dark:bg-white dark:text-stone-950"
          : emphasis
            ? "border-black/[0.13] bg-white/[0.62] shadow-[0_8px_25px_rgba(0,0,0,0.035)] dark:border-white/[0.13] dark:bg-white/[0.065]"
            : "border-black/[0.07] bg-white/[0.30] dark:border-white/[0.07] dark:bg-white/[0.025]",
        !completed
          ? "hover:-translate-y-px hover:border-black/[0.13] hover:bg-white/[0.55] hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)] dark:hover:border-white/[0.13] dark:hover:bg-white/[0.055]"
          : "",
        isDragging
          ? "z-20 scale-[1.015] shadow-[0_25px_70px_rgba(0,0,0,0.16)]"
          : "",
        pending ? "opacity-60" : "",
      ].join(" ")}
    >
      <button
        type="button"
        className={`shrink-0 cursor-grab touch-none rounded-md transition active:cursor-grabbing ${
          completed
            ? "text-white/60 hover:text-white dark:text-stone-500 dark:hover:text-stone-800"
            : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        }`}
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {rank !== undefined && (
        <span
          className={`w-4 shrink-0 text-xs font-semibold ${
            completed
              ? "text-white/60 dark:text-stone-500"
              : emphasis
                ? "text-stone-700 dark:text-stone-300"
                : "text-stone-400 dark:text-stone-500"
          }`}
        >
          {rank + 1}
        </span>
      )}

      <input
        type="checkbox"
        checked={completed}
        onChange={(event) =>
          startTransition(() => onToggle(event.target.checked))
        }
        className={`h-4 w-4 shrink-0 cursor-pointer rounded border ${
          completed
            ? "border-white accent-white dark:border-stone-950 dark:accent-stone-950"
            : "border-stone-300 accent-stone-950 dark:border-stone-600 dark:accent-stone-100"
        }`}
      />

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => {
          const trimmed = value.trim();

          if (trimmed && trimmed !== text) {
            startTransition(() => onText(trimmed));
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`min-w-0 flex-1 bg-transparent text-sm font-medium outline-none ${
          completed
            ? "text-white line-through dark:text-stone-500"
            : "text-stone-800 dark:text-stone-200"
        }`}
      />

      <button
        type="button"
        onClick={() => startTransition(() => onDelete())}
        className={`shrink-0 rounded-lg p-1 transition ${
          completed
            ? "text-white/50 opacity-0 hover:bg-white/10 hover:text-white group-hover:opacity-100 focus:opacity-100 dark:text-stone-500 dark:hover:bg-stone-950/10 dark:hover:text-stone-950"
            : "text-stone-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        }`}
        aria-label="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
