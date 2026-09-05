'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, History, Mic, Settings } from 'lucide-react'

const items = [
  { href: '/today', label: 'Today', icon: CalendarDays },
  { href: '/history', label: 'History', icon: History },
  { href: '/capture', label: 'Capture', icon: Mic, disabled: true },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border bg-white/95 p-1.5 shadow-float backdrop-blur dark:bg-stone-900/95">
      <div className="grid grid-cols-4 gap-1">
        {items.map(({ href, label, icon: Icon, disabled }) => {
          const active = pathname.startsWith(href)
          const classes = `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${active ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'} ${disabled ? 'pointer-events-none opacity-40' : ''}`
          return disabled ? (
            <div key={href} className={classes} aria-disabled="true" title="Capture arrives in a later phase">
              <Icon size={17} /><span>{label}</span>
            </div>
          ) : (
            <Link key={href} href={href} className={classes}>
              <Icon size={17} /><span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
