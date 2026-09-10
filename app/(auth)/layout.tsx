import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-stone-950 dark:text-white">
      <header className="glass-header fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-6">
          <Logo />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-xl px-3 py-2 text-sm text-stone-500 transition-colors hover:text-stone-950 sm:block dark:text-stone-400 dark:hover:text-white"
            >
              Back to home
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-24 pt-28 sm:px-6">
        <div className="pointer-events-none absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-stone-400/10 blur-3xl dark:bg-white/[0.035]" />
        <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-80 w-80 rounded-full bg-stone-300/20 blur-3xl dark:bg-white/[0.025]" />

        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-black/5 bg-white/20 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 text-xs text-stone-500 sm:px-6 dark:text-stone-500">
          <Logo
            href="/"
            showWordmark={false}
            className="scale-75 origin-left"
          />

          <span>© {new Date().getFullYear()} Checkmarkr</span>
        </div>
      </footer>
    </div>
  );
}
