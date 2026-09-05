import type { ThemeMode, UserSettings } from '@/types/database'
import { createClient } from '@/lib/supabase/server'

export async function getOrCreateSettings(userId: string): Promise<UserSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pro_user_settings')
    .upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true })
    .select('*')
    .single()

  if (!error && data) return data as UserSettings

  const fallback = await supabase.from('pro_user_settings').select('*').eq('user_id', userId).single()
  if (fallback.error || !fallback.data) throw fallback.error ?? new Error('Unable to load settings')
  return fallback.data as UserSettings
}

export async function updateTheme(userId: string, theme: ThemeMode) {
  const supabase = await createClient()
  const { error } = await supabase.from('pro_user_settings').update({ theme }).eq('user_id', userId)
  if (error) throw error
}

export async function updateTimezone(userId: string, timezone: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pro_user_settings').update({ timezone }).eq('user_id', userId)
  if (error) throw error
}
