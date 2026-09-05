import Link from 'next/link'
import { AuthFormFields } from '@/components/auth/auth-form'
import { signIn } from '@/lib/actions/auth'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams
  return (
    <section className="rounded-3xl border bg-white p-7 shadow-sm dark:bg-stone-900">
      <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Pro Daily</p>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back.</h1>
      <p className="mt-2 text-stone-500">Open today’s page and focus on what matters.</p>
      {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{params.error}</p>}
      {params.message && <p className="mt-5 rounded-xl bg-stone-100 p-3 text-sm dark:bg-stone-800">{params.message}</p>}
      <form action={signIn} className="mt-7 grid gap-4">
        <AuthFormFields buttonLabel="Sign in" />
      </form>
      <div className="mt-6 flex justify-between text-sm text-stone-500">
        <Link href="/signup" className="hover:text-stone-950 dark:hover:text-white">Create account</Link>
        <Link href="/reset-password" className="hover:text-stone-950 dark:hover:text-white">Forgot password?</Link>
      </div>
    </section>
  )
}
