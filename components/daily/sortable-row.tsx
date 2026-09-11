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
        "group flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2",
        "backdrop-blur-xl transition",
        emphasis
          ? "border-black/15 bg-white/50 dark:border-white/15 dark:bg-white/[0.06]"
          : "border-black/10 bg-white/30 dark:border-white/10 dark:bg-white/[0.035]",
        "hover:bg-white/50 dark:hover:bg-white/[0.06]",
        isDragging
          ? "z-20 scale-[1.01] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          : "",
        pending ? "opacity-60" : "",
      ].join(" ")}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none text-stone-400 transition hover:text-stone-600 active:cursor-grabbing dark:hover:text-stone-200"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {rank !== undefined && (
        <span
          className={`w-4 shrink-0 text-xs font-medium ${
            emphasis ? "text-stone-700 dark:text-stone-300" : "text-stone-400"
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
        className="h-4 w-4 shrink-0 rounded border-stone-300 accent-stone-950 dark:border-stone-600 dark:accent-stone-100"
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
        className={`min-w-0 flex-1 bg-transparent text-sm text-stone-800 outline-none dark:text-stone-200 ${
          completed ? "text-stone-400 line-through dark:text-stone-500" : ""
        }`}
      />

      <button
        type="button"
        onClick={() => startTransition(() => onDelete())}
        className="shrink-0 text-stone-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100 focus:opacity-100 dark:hover:text-red-400"
        aria-label="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
