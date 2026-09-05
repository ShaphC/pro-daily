import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: days, error } = await supabase.from('pro_days').select('id,date').order('date', { ascending: false }).limit(90)
  if (error) throw error

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">History</h1>
      <p className="mt-2 text-stone-500">Browse your daily work pages as a journal of what actually happened.</p>
      <div className="mt-8 divide-y rounded-2xl border bg-white px-5 dark:bg-stone-950">
        {(days ?? []).length === 0 && <p className="py-8 text-sm text-stone-500">Your previous daily pages will appear here.</p>}
        {(days ?? []).map((day) => (
          <Link key={day.id} href={`/history/${day.date}`} className="flex items-center justify-between py-4 transition hover:pl-1">
            <span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-sm text-stone-400">Open page →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
