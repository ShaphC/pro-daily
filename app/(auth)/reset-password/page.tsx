import Link from "next/link";

import { OriginField } from "@/components/auth/origin-field";
import { requestPasswordReset } from "@/lib/actions/auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <section className="rounded-3xl border bg-white p-7 shadow-sm dark:bg-stone-900">
      <h1 className="text-3xl font-semibold tracking-tight">
        Reset your password.
      </h1>

      <p className="mt-2 text-stone-500">
        Enter your email and we&apos;ll send you a link to choose a new
        password.
      </p>

      {params.error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {params.error}
        </p>
      )}

      <form action={requestPasswordReset} className="mt-7 grid gap-4">
        <OriginField />

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:focus:border-stone-500"
          />
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
        >
          Send reset link
        </button>
      </form>

      <div className="mt-6 text-sm">
        <Link
          href="/login"
          className="text-stone-500 transition hover:text-stone-950 dark:text-stone-400 dark:hover:text-white"
        >
          Back to sign in
        </Link>
      </div>
    </section>
  );
}
