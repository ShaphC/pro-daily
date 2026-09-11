import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: days, error } = await supabase
    .from("pro_days")
    .select("id,date")
    .order("date", { ascending: false })
    .limit(90);

  if (error) throw error;

  return (
    <main className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
          Journal
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">History</h1>

        <p className="mt-2 max-w-xl text-stone-500 dark:text-stone-400">
          Browse your daily work pages as a journal of what actually happened.
        </p>
      </div>

      <div className="glass glass-highlight overflow-hidden rounded-3xl">
        <div className="relative z-10 divide-y divide-black/5 dark:divide-white/[0.06]">
          {(days ?? []).length === 0 && (
            <p className="px-5 py-10 text-sm text-stone-500">
              Your previous daily pages will appear here.
            </p>
          )}

          {(days ?? []).map((day) => (
            <Link
              key={day.id}
              href={`/history/${day.date}`}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/30 dark:hover:bg-white/[0.035]"
            >
              <span className="font-medium transition-transform group-hover:translate-x-0.5">
                {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>

              <span className="shrink-0 text-sm text-stone-400 transition-colors group-hover:text-stone-700 dark:group-hover:text-stone-200">
                Open page →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
