"use client";

import { useState } from "react";

type AuthFormFieldsProps = {
  buttonLabel: string;
};

export function AuthFormFields({ buttonLabel }: AuthFormFieldsProps) {
  const [pending, setPending] = useState(false);

  return (
    <>
      <label className="sr-only" htmlFor="auth-email">
        Email
      </label>
      <input
        id="auth-email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        required
        className="rounded-2xl border border-black/10 bg-white/35 px-4 py-3 text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/50 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.07] dark:focus:ring-white/5"
      />

      <label className="sr-only" htmlFor="auth-password">
        Password
      </label>
      <input
        id="auth-password"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="rounded-2xl border border-black/10 bg-white/35 px-4 py-3 text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/50 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.07] dark:focus:ring-white/5"
      />

      <button
        type="submit"
        disabled={pending}
        onClick={() => setPending(true)}
        className="mt-2 rounded-2xl border border-black/10 bg-stone-950 px-4 py-3 font-medium text-white shadow-[0_12px_35px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white dark:text-stone-950"
      >
        {pending ? "Please wait..." : buttonLabel}
      </button>
    </>
  );
}
