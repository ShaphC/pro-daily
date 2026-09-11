import { signOut } from "@/lib/actions/auth";
import { Logo } from "@/components/brand/logo";

export function Header({ dateLabel }: { dateLabel?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-black/10 bg-stone-50/80 backdrop-blur-xl dark:border-white/10 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-stone-500 transition hover:text-stone-950 dark:text-stone-400 dark:hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
