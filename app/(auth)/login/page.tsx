import Link from "next/link";
import { AuthFormFields } from "@/components/auth/auth-form";
import { Logo } from "@/components/brand/logo";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="glass glass-highlight w-full rounded-3xl p-7 sm:p-8">
      <div className="relative z-10">
        <div className="mb-8 sm:hidden">
          <Logo />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">
          Welcome back.
        </h1>

        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Open today’s page and focus on what matters.
        </p>

        {params.error && (
          <p className="mt-5 rounded-2xl border border-red-200/70 bg-red-50/60 p-3 text-sm text-red-700 backdrop-blur-xl dark:border-red-400/10 dark:bg-red-950/30 dark:text-red-300">
            {params.error}
          </p>
        )}

        {params.message && (
          <p className="mt-5 rounded-2xl border border-black/5 bg-white/30 p-3 text-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            {params.message}
          </p>
        )}

        <form action={signIn} className="mt-7 grid gap-4">
          <AuthFormFields buttonLabel="Sign in" />
        </form>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-stone-500 dark:text-stone-400">
          <Link
            href="/signup"
            className="transition-colors hover:text-stone-950 dark:hover:text-white"
          >
            Create account
          </Link>

          <Link
            href="/reset-password"
            className="transition-colors hover:text-stone-950 dark:hover:text-white"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </section>
  );
}
