'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const timezone = String(formData.get('timezone') ?? 'UTC')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  if (data.user) {
    await supabase.from('pro_user_settings').upsert(
      { user_id: data.user.id, timezone },
      { onConflict: 'user_id' },
    )
  }

  revalidatePath('/', 'layout')
  redirect('/today')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const timezone = String(formData.get('timezone') ?? 'UTC')
  const origin = String(formData.get('origin') ?? '')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  })
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`)

  if (data.user && data.session) {
    await supabase.from('pro_user_settings').upsert(
      { user_id: data.user.id, timezone },
      { onConflict: 'user_id' },
    )
    redirect('/today')
  }

  redirect('/login?message=Check%20your%20email%20to%20confirm%20your%20account.')
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const origin = String(formData.get('origin') ?? '')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/settings`,
  })
  if (error) redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  redirect('/login?message=Password%20reset%20email%20sent.')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
