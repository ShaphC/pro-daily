'use client'

import { useTheme } from 'next-themes'
import { useState, useTransition } from 'react'
import { saveTheme } from '@/lib/actions/settings'
import type { ThemeMode } from '@/types/database'

const themes: ThemeMode[] = ['system', 'light', 'dark']

export function ThemeSelector({ initialTheme }: { initialTheme: ThemeMode }) {
  const { setTheme } = useTheme()
  const [selected, setSelected] = useState(initialTheme)
  const [pending, startTransition] = useTransition()

  return (
    <div className="grid grid-cols-3 gap-2">
      {themes.map((theme) => (
        <button
          key={theme}
          type="button"
          disabled={pending}
          onClick={() => {
            setSelected(theme)
            setTheme(theme)
            startTransition(() => saveTheme(theme))
          }}
          className={`rounded-xl border px-4 py-3 text-sm capitalize transition hover:bg-stone-100 dark:hover:bg-stone-800 ${selected === theme ? 'border-stone-950 font-semibold dark:border-stone-100' : ''}`}
        >
          {theme}
        </button>
      ))}
    </div>
  )
}
