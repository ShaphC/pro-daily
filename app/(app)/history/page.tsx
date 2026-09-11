import { ArrowRight, CalendarDays } from "lucide-react";
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
    <main className="relative mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -top-16 right-1/4 h-72 w-72 rounded-full bg-stone-300/20 blur-3xl dark:bg-white/[0.035]" />

      <div className="relative">
        <div className="mb-8">
          {/* <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/55 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
            <CalendarDays
              size={18}
              className="text-stone-700 dark:text-stone-300"
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
            Journal
          </p> */}

          <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.035em] text-stone-950 dark:text-white sm:text-4xl">
            History
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500 dark:text-stone-400">
            Browse your daily work pages as a journal of what actually happened.
          </p>
        </div>

        <div className="glass glass-highlight overflow-hidden rounded-3xl">
          <div className="relative z-10 p-2">
            {(days ?? []).length === 0 && (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/50 dark:border-white/10 dark:bg-white/[0.04]">
                  <CalendarDays size={17} className="text-stone-400" />
                </div>

                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  No daily pages yet.
                </p>

                <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
                  Your previous daily pages will appear here.
                </p>
              </div>
            )}

            {(days ?? []).map((day, index) => (
              <Link
                key={day.id}
                href={`/history/${day.date}`}
                className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-white/45 dark:hover:bg-white/[0.045]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.07] bg-white/45 text-xs font-semibold text-stone-500 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-stone-400">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>

                  <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                    Daily work page
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-700 dark:group-hover:text-stone-200"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
