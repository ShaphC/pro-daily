"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <section className="glass glass-highlight w-full rounded-3xl p-7 sm:p-8">
      <div className="relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">
          Reset password.
        </h1>

        <p className="mt-2 text-stone-500 dark:text-stone-400">
          We’ll send you a secure link to choose a new password.
        </p>

        <form action={requestPasswordReset} className="mt-7 grid gap-4">
          <input type="hidden" name="origin" value={origin} />

          <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-200">
            Email
            <input
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="rounded-2xl border border-black/10 bg-white/35 px-4 py-3 text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/50 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.07] dark:focus:ring-white/5"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-2xl border border-black/10 bg-stone-950 px-4 py-3 font-medium text-white shadow-[0_12px_35px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white dark:text-stone-950"
          >
            Send reset email
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-stone-500 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-white"
        >
          Back to sign in
        </Link>
      </div>
    </section>
  );
}
