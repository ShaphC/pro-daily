import { signOut } from "@/lib/actions/auth";

export function Header({ dateLabel }: { dateLabel?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-stone-50/90 backdrop-blur dark:bg-stone-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em]">
            Pro Daily
          </div>
          {/* {dateLabel && <div className="mt-0.5 text-xs text-stone-500">{dateLabel}</div>} */}
        </div>
        <form action={signOut}>
          <button className="text-sm text-stone-500 transition hover:text-stone-950 dark:hover:text-white">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
