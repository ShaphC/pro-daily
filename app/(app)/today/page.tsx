import { redirect } from 'next/navigation'
import { DailyPage } from '@/components/daily/daily-page'
import { createClient } from '@/lib/supabase/server'
import { dateInTimezone, getOrCreateDailyPage } from '@/lib/services/daily'
import { getOrCreateSettings } from '@/lib/services/settings'

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/login')
  const settings = await getOrCreateSettings(data.user.id)
  const date = dateInTimezone(settings.timezone)
  const daily = await getOrCreateDailyPage(date)
  return <DailyPage initial={daily} />
}
