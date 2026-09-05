'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

type Props = {
  id: string
  text: string
  completed: boolean
  emphasis?: boolean
  rank?: number
  onToggle: (completed: boolean) => Promise<void>
  onText: (text: string) => Promise<void>
  onDelete: () => Promise<void>
}

export function SortableRow({ id, text, completed, emphasis, rank, onToggle, onText, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const [value, setValue] = useState(text)
  const [pending, startTransition] = useTransition()

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 ${emphasis ? 'border-stone-400 bg-stone-100/80 dark:border-stone-600 dark:bg-stone-900' : 'bg-white dark:bg-stone-950'} ${isDragging ? 'z-20 shadow-lg' : ''} ${pending ? 'opacity-60' : ''}`}
    >
      <button type="button" className="cursor-grab touch-none text-stone-400 active:cursor-grabbing" aria-label="Drag to reorder" {...attributes} {...listeners}>
        <GripVertical size={17} />
      </button>
      {rank !== undefined && <span className={`w-5 text-xs font-semibold ${emphasis ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}>{rank + 1}</span>}
      <input
        type="checkbox"
        checked={completed}
        onChange={(event) => startTransition(() => onToggle(event.target.checked))}
        className="h-4 w-4 rounded border-stone-400 accent-stone-950 dark:accent-stone-100"
      />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => value.trim() && value.trim() !== text && startTransition(() => onText(value))}
        onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
        className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${completed ? 'text-stone-400 line-through' : ''}`}
      />
      <button type="button" onClick={() => startTransition(() => onDelete())} className="opacity-0 text-stone-400 transition hover:text-red-600 group-hover:opacity-100 focus:opacity-100" aria-label="Delete">
        <Trash2 size={15} />
      </button>
    </div>
  )
}
