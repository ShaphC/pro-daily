'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import type { ThemeMode } from '@/types/database'

export function ThemeSync({ theme }: { theme: ThemeMode }) {
  const { setTheme } = useTheme()
  useEffect(() => setTheme(theme), [setTheme, theme])
  return null
}
