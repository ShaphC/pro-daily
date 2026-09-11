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

import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function SignupPage() {
  return (
    <section className="glass glass-highlight w-full rounded-3xl p-7 sm:p-8">
      <div className="relative z-10">
        <div className="mb-8 sm:hidden">
          <Logo />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">
          Currently in beta.
        </h1>

        <p className="mt-2 text-stone-500 dark:text-stone-400">
          CheckMarkr is currently being tested with a small group of users.
        </p>

        <div className="mt-7 rounded-2xl border border-black/10 bg-white/25 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
            New accounts are temporarily unavailable while we test the app and
            improve the experience.
          </p>

          <p className="mt-3 text-sm leading-6 text-stone-500 dark:text-stone-400">
            If you already have a beta account, you can sign in below.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-stone-950 px-4 py-3 font-medium text-white shadow-[0_12px_35px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:bg-white dark:text-stone-950"
        >
          Sign in
        </Link>

        <Link
          href="/"
          className="mt-3 flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white/25 px-4 py-3 font-medium text-stone-600 backdrop-blur-xl transition hover:bg-white/45 hover:text-stone-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
        >
          Back to CheckMarkr
        </Link>
      </div>
    </section>
  );
}
