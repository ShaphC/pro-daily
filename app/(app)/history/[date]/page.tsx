import { notFound } from "next/navigation";

import { DailyPage } from "@/components/daily/daily-page";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateDailyPage } from "@/lib/services/daily";

export default async function HistoricalDayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("pro_days")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (!existing) {
    notFound();
  }

  const daily = await getOrCreateDailyPage(date);

  return <DailyPage initial={daily} />;
}
