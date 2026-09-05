import Link from 'next/link'
import { AuthFormFields } from '@/components/auth/auth-form'
import { signUp } from '@/lib/actions/auth'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  return (
    <section className="rounded-3xl border bg-white p-7 shadow-sm dark:bg-stone-900">
      <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Pro Daily</p>
      <h1 className="text-3xl font-semibold tracking-tight">Create your daily page.</h1>
      <p className="mt-2 text-stone-500">Priorities first. Tasks next. Notes as you work.</p>
      {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{params.error}</p>}
      <form action={signUp} className="mt-7 grid gap-4">
        <AuthFormFields buttonLabel="Create account" />
      </form>
      <p className="mt-6 text-sm text-stone-500">Already have an account? <Link href="/login" className="font-medium text-stone-900 dark:text-white">Sign in</Link></p>
    </section>
  )
}
