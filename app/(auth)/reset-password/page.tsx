"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return (
    <section className="rounded-3xl border bg-white p-7 shadow-sm dark:bg-stone-900">
      <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
        Checkmarkr
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Reset password.</h1>
      <form action={requestPasswordReset} className="mt-7 grid gap-4">
        <input type="hidden" name="origin" value={origin} />
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border bg-white px-4 py-3 dark:bg-stone-900"
          />
        </label>
        <button className="rounded-xl bg-stone-950 px-4 py-3 font-medium text-white dark:bg-stone-100 dark:text-stone-950">
          Send reset email
        </button>
      </form>
      <Link href="/login" className="mt-6 inline-block text-sm text-stone-500">
        Back to sign in
      </Link>
    </section>
  );
}
