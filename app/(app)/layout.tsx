import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOrCreateSettings } from "@/lib/services/settings";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { TimezoneSync } from "@/components/theme/timezone-sync";
import { ThemeSync } from "@/components/theme/theme-sync";
import { dateInTimezone } from "@/lib/services/daily";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const settings = await getOrCreateSettings(data.user.id);

  const currentDate = dateInTimezone(settings.timezone);

  const dateLabel = new Date(`${currentDate}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <>
      <ThemeSync theme={settings.theme} />

      <TimezoneSync storedTimezone={settings.timezone} />

      <div className="min-h-dvh">
        <Header dateLabel={dateLabel} theme={settings.theme} />

        <div className="safe-bottom pt-20">{children}</div>

        <BottomNav />
      </div>
    </>
  );
}
