import { redirect } from "next/navigation";

import { CarryForwardSettings } from "@/components/settings/carry-forward-settings";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateSettings } from "@/lib/services/settings";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const settings = await getOrCreateSettings(data.user.id);

  return (
    <main className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
          Preferences
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Settings</h1>

        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Customize how Checkmarkr works for you.
        </p>
      </div>

      <div className="grid gap-4">
        <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
          <div className="relative z-10">
            <h2 className="font-semibold">Appearance</h2>

            <p className="mb-5 mt-1 text-sm text-stone-500 dark:text-stone-400">
              Choose exactly how the daily page should follow your device.
            </p>

            <ThemeSelector initialTheme={settings.theme} />
          </div>
        </section>

        <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
          <div className="relative z-10">
            <h2 className="font-semibold">New Day Defaults</h2>

            <p className="mb-5 mt-1 max-w-xl text-sm text-stone-500 dark:text-stone-400">
              Choose what should be selected by default when carrying content
              into a new day.
            </p>

            <CarryForwardSettings
              initialPriorities={settings.carry_forward_priorities}
              initialTasks={settings.carry_forward_tasks}
              initialNotes={settings.carry_forward_notes}
            />
          </div>
        </section>

        <section className="glass glass-highlight rounded-3xl p-5 sm:p-6">
          <div className="relative z-10">
            <h2 className="font-semibold">Timezone</h2>

            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {settings.timezone}
            </p>

            <p className="mt-2 text-xs leading-relaxed text-stone-400 dark:text-stone-500">
              Automatically synchronized from this browser so each daily page
              uses your local date.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
