'use client'

import { useEffect, useState } from 'react'

export function AuthFormFields({ buttonLabel }: { buttonLabel: string }) {
  const [timezone, setTimezone] = useState('UTC')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
    setOrigin(window.location.origin)
  }, [])

  return (
    <>
      <input type="hidden" name="timezone" value={timezone} />
      <input type="hidden" name="origin" value={origin} />
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400 dark:bg-stone-900" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input name="password" type="password" required minLength={8} autoComplete="current-password" className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400 dark:bg-stone-900" />
      </label>
      <button className="rounded-xl bg-stone-950 px-4 py-3 font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white">
        {buttonLabel}
      </button>
    </>
  )
}
