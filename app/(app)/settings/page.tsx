import { redirect } from 'next/navigation'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateSettings } from '@/lib/services/settings'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/login')
  const settings = await getOrCreateSettings(data.user.id)

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
      <section className="mt-8 rounded-2xl border bg-white p-5 dark:bg-stone-950">
        <h2 className="font-semibold">Appearance</h2>
        <p className="mt-1 mb-4 text-sm text-stone-500">Choose exactly how the daily page should follow your device.</p>
        <ThemeSelector initialTheme={settings.theme} />
      </section>
      <section className="mt-4 rounded-2xl border bg-white p-5 dark:bg-stone-950">
        <h2 className="font-semibold">Timezone</h2>
        <p className="mt-1 text-sm text-stone-500">{settings.timezone}</p>
        <p className="mt-2 text-xs text-stone-400">Automatically synchronized from this browser so each daily page uses your local date.</p>
      </section>
    </main>
  )
}
