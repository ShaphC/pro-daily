"use client";

import { useEffect, useState } from "react";

const REMEMBERED_EMAIL_KEY = "checkmarkr_remembered_email";

type AuthFormFieldsProps = {
  buttonLabel: string;
  rememberEmail?: boolean;
};

export function AuthFormFields({
  buttonLabel,
  rememberEmail = false,
}: AuthFormFieldsProps) {
  const [timezone, setTimezone] = useState("UTC");
  const [origin, setOrigin] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    setOrigin(window.location.origin);

    if (rememberEmail) {
      const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);

      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    }
  }, [rememberEmail]);

  function handleSubmit() {
    if (!rememberEmail) return;

    if (rememberMe && email.trim()) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  }

  return (
    <>
      <input type="hidden" name="timezone" value={timezone} />

      <input type="hidden" name="origin" value={origin} />

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
        value={email}
        onChange={(event) => setEmail(event.target.value)}
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
        minLength={8}
        className="rounded-2xl border border-black/10 bg-white/35 px-4 py-3 text-stone-950 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white/50 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-white/20 dark:focus:bg-white/[0.07] dark:focus:ring-white/5"
      />

      {rememberEmail && (
        <label className="flex cursor-pointer items-center gap-2.5 px-1 text-sm text-stone-500 dark:text-stone-400">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-stone-950 dark:accent-white"
          />

          <span>Remember me</span>
        </label>
      )}

      <button
        type="submit"
        onClick={handleSubmit}
        className="mt-2 rounded-2xl border border-black/10 bg-stone-950 px-4 py-3 font-medium text-white shadow-[0_12px_35px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white dark:text-stone-950"
      >
        {buttonLabel}
      </button>
    </>
  );
}
