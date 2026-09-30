import { Clock3, LockKeyhole, Palette, SlidersHorizontal } from "lucide-react";
import { redirect } from "next/navigation";

import { CarryForwardSettings } from "@/components/settings/carry-forward-settings";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { changePassword } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateSettings } from "@/lib/services/settings";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const settings = await getOrCreateSettings(data.user.id);

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-stone-300/20 blur-3xl dark:bg-white/[0.035]" />

      <div className="relative">
        <div className="mb-8">
          <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.035em] text-stone-950 dark:text-white sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
            Customize how CheckMarkr works for you.
          </p>
        </div>

        {params.error && (
          <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {params.error}
          </p>
        )}

        {params.message && (
          <p className="mb-5 rounded-xl bg-stone-100 p-3 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-200">
            {params.message}
          </p>
        )}

        <div className="grid gap-5">
          <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
            <div className="relative z-10">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white/50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <Palette
                    size={17}
                    className="text-stone-600 dark:text-stone-300"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-950 dark:text-white">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                    Choose how CheckMarkr should look across your devices.
                  </p>
                </div>
              </div>

              <ThemeSelector initialTheme={settings.theme} />
            </div>
          </section>

          <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
            <div className="relative z-10">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white/50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <SlidersHorizontal
                    size={17}
                    className="text-stone-600 dark:text-stone-300"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-950 dark:text-white">
                    New Day Defaults
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-stone-500 dark:text-stone-400">
                    Choose what should be selected by default when carrying
                    content into a new day.
                  </p>
                </div>
              </div>

              <CarryForwardSettings
                initialPriorities={settings.carry_forward_priorities}
                initialTasks={settings.carry_forward_tasks}
                initialNotes={settings.carry_forward_notes}
              />
            </div>
          </section>

          <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
            <div className="relative z-10">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white/50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <LockKeyhole
                    size={17}
                    className="text-stone-600 dark:text-stone-300"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-950 dark:text-white">
                    Password
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                    Change the password you use to sign in to CheckMarkr.
                  </p>
                </div>
              </div>

              <form action={changePassword} className="grid max-w-md gap-4">
                <div>
                  <label
                    htmlFor="settings-password"
                    className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
                  >
                    New password
                  </label>

                  <input
                    id="settings-password"
                    name="password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white/60 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950/60 dark:text-white dark:focus:border-stone-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="settings-confirm-password"
                    className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="settings-confirm-password"
                    name="confirmPassword"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white/60 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950/60 dark:text-white dark:focus:border-stone-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                  >
                    Change password
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="glass glass-subtle rounded-3xl p-5 sm:p-6">
            <div className="relative z-10 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white/50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                <Clock3
                  size={17}
                  className="text-stone-600 dark:text-stone-300"
                />
              </div>

              <div>
                <h2 className="font-semibold text-stone-950 dark:text-white">
                  Timezone
                </h2>

                <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">
                  {settings.timezone}
                </p>

                <p className="mt-2 max-w-xl text-xs leading-5 text-stone-400 dark:text-stone-500">
                  Automatically synchronized from this browser so each daily
                  page uses your local date.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
