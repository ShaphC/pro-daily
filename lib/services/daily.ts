import { createClient } from '@/lib/supabase/server'
import type { DailyPage, Day, Note, Priority, Task } from '@/types/database'

export function dateInTimezone(timezone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export async function getOrCreateDailyPage(date: string): Promise<DailyPage> {
  const supabase = await createClient()
  const { data: dayId, error: dayError } = await supabase.rpc('pro_get_or_create_day', { target_date: date })
  if (dayError || !dayId) throw dayError ?? new Error('Could not create daily page')

  const [dayResult, prioritiesResult, tasksResult, noteResult] = await Promise.all([
    supabase.from('pro_days').select('*').eq('id', dayId).single(),
    supabase.from('pro_priorities').select('*').eq('day_id', dayId).order('position'),
    supabase.from('pro_tasks').select('*').eq('day_id', dayId).order('position'),
    supabase.from('pro_notes').select('*').eq('day_id', dayId).eq('position', 0).maybeSingle(),
  ])

  const error = dayResult.error ?? prioritiesResult.error ?? tasksResult.error ?? noteResult.error
  if (error) throw error

  return {
    day: dayResult.data as Day,
    priorities: (prioritiesResult.data ?? []) as Priority[],
    tasks: (tasksResult.data ?? []) as Task[],
    note: (noteResult.data as Note | null) ?? null,
  }
}
