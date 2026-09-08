// import Link from 'next/link'
// import { AuthFormFields } from '@/components/auth/auth-form'
// import { signUp } from '@/lib/actions/auth'

// export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
//   const params = await searchParams
//   return (
//     <section className="rounded-3xl border bg-white p-7 shadow-sm dark:bg-stone-900">
//       <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Checkmarkr</p>
//       <h1 className="text-3xl font-semibold tracking-tight">Create your daily page.</h1>
//       <p className="mt-2 text-stone-500">Priorities first. Tasks next. Notes as you work.</p>
//       {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{params.error}</p>}
//       <form action={signUp} className="mt-7 grid gap-4">
//         <AuthFormFields buttonLabel="Create account" />
//       </form>
//       <p className="mt-6 text-sm text-stone-500">Already have an account? <Link href="/login" className="font-medium text-stone-900 dark:text-white">Sign in</Link></p>
//     </section>
//   )
// }

"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6 text-[#111110] dark:bg-[#0c0c0b] dark:text-[#f4f3ef]">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/50 font-mono text-sm font-bold dark:border-white/10 dark:bg-white/[0.03]">
            P
          </div>

          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
            Checkmarkr
          </p>

          <h1 className="text-3xl font-bold tracking-[-0.04em]">
            Currently in beta
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-black/55 dark:text-white/45">
            Checkmarkr is currently being tested with a small group of users.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-sm font-medium leading-6 text-black/55 dark:text-white/45">
            New accounts are temporarily unavailable while we test the app and
            improve the experience.
          </p>

          <p className="mt-4 text-sm font-medium leading-6 text-black/40 dark:text-white/35">
            If you already have a beta account, you can sign in below.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full bg-black px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-black"
        >
          Sign in
        </Link>

        <Link
          href="/"
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-black/10 px-4 py-3 text-sm font-bold text-black/60 transition hover:border-black/20 hover:text-black dark:border-white/10 dark:text-white/50 dark:hover:border-white/20 dark:hover:text-white"
        >
          Back to Checkmarkr
        </Link>

        <p className="mt-7 text-center font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/25 dark:text-white/20">
          BETA ACCESS ONLY
        </p>
      </div>
    </main>
  );
}
