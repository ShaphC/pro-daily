import Link from "next/link";

import { updatePassword } from "@/lib/actions/auth";

export default async function UpdatePasswordPage({
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
        Choose a new password.
      </h1>

      <p className="mt-2 text-stone-500 dark:text-stone-400">
        Enter and confirm your new CheckMarkr password.
      </p>

      {params.error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {params.error}
        </p>
      )}

      <form action={updatePassword} className="mt-7 grid gap-4">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            New password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:focus:border-stone-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Confirm new password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:focus:border-stone-500"
          />
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
        >
          Update password
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
