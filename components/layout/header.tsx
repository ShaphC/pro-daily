import { signOut } from "@/lib/actions/auth";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { ThemeMode } from "@/types/database";

type HeaderProps = {
  dateLabel?: string;
  theme?: ThemeMode;
};

export function Header({ dateLabel, theme = "system" }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-black/10 bg-stone-50/80 backdrop-blur-xl dark:border-white/10 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <div className="flex items-center gap-2">
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
            >
              Sign out
            </button>
          </form>

          <ThemeToggle initialTheme={theme} authenticated />
        </div>
      </div>
    </header>
  );
}
