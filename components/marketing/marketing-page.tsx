import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  FileText,
  History,
  Menu,
  Minus,
  MoveRight,
  Plus,
  Sparkles,
  Target,
  CheckCircle2,
} from "lucide-react";

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-black/[0.03] blur-2xl dark:bg-white/[0.03]" />

      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#faf9f6] shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#111110] dark:shadow-black/40">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/10 dark:bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10 dark:bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10 dark:bg-white/10" />
            </div>
          </div>

          <div className="hidden items-center gap-6 text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40 sm:flex">
            <span>Today</span>
            <span>History</span>
            <span>Settings</span>
          </div>

          <div className="h-2 w-10 rounded-full bg-black/5 dark:bg-white/5" />
        </div>

        <div className="grid md:grid-cols-[1fr_0.35fr]">
          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                  Wednesday
                </p>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white sm:text-3xl">
                  September 9
                </h3>
              </div>

              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                  Day
                </p>
                <p className="mt-1 text-xs font-medium text-black/60 dark:text-white/60">
                  2 / 3
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <PreviewSection title="Priorities" count="3">
                <PreviewRow checked text="Finish the product landing page" />
                <PreviewRow checked text="Review customer feedback" />
                <PreviewRow text="Ship the daily workflow" />
              </PreviewSection>

              <PreviewSection title="Tasks" count="4">
                <PreviewRow text="Write onboarding copy" />
                <PreviewRow text="Clean up dashboard spacing" />
                <PreviewRow checked text="Review open pull requests" />
                <PreviewRow text="Prepare tomorrow's outline" />
              </PreviewSection>

              <PreviewSection title="Notes">
                <div className="rounded-lg border border-black/8 bg-white/60 p-4 text-sm leading-6 text-black/55 dark:border-white/8 dark:bg-white/[0.03] dark:text-white/50">
                  The simpler workflow is working. Keep the daily page focused
                  and avoid turning it into another project management system.
                </div>
              </PreviewSection>
            </div>
          </div>

          <div className="hidden border-l border-black/10 bg-black/[0.015] p-6 dark:border-white/10 dark:bg-white/[0.015] md:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
              Progress
            </p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/8 dark:bg-white/8">
              <div className="h-full w-2/3 rounded-full bg-black dark:bg-white" />
            </div>

            <p className="mt-3 text-xs leading-5 text-black/45 dark:text-white/45">
              Complete your top three priorities to accomplish the day.
            </p>

            <div className="mt-12 border-t border-black/8 pt-5 dark:border-white/8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                Carry forward
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-md border border-black/10 dark:border-white/10" />
                  <div className="h-2 w-24 rounded-full bg-black/8 dark:bg-white/8" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-md border border-black/10 dark:border-white/10" />
                  <div className="h-2 w-20 rounded-full bg-black/8 dark:bg-white/8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 bg-black/[0.02] px-6 py-4 dark:border-white/10 dark:bg-white/[0.02] sm:px-10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
              Pro Daily
            </span>

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
              Focus / Record / Repeat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between border-b border-black/8 pb-2 dark:border-white/8">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
            {title}
          </span>

          {count && (
            <span className="font-mono text-[9px] text-black/25 dark:text-white/25">
              {count}
            </span>
          )}
        </div>

        <Plus className="h-3 w-3 text-black/25 dark:text-white/25" />
      </div>

      <div className="space-y-2">{children}</div>
    </section>
  );
}

function PreviewRow({
  text,
  checked = false,
}: {
  text: string;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
          checked
            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : "border-black/15 dark:border-white/15"
        }`}
      >
        {checked && <Check className="h-2.5 w-2.5" />}
      </div>

      <span
        className={`text-xs ${
          checked
            ? "text-black/35 line-through dark:text-white/30"
            : "text-black/65 dark:text-white/65"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

function FeatureNumber({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 border-t border-black/10 py-8 dark:border-white/10 md:grid-cols-[80px_220px_1fr] md:gap-8">
      <span className="font-mono text-xs text-black/30 dark:text-white/30">
        {number}
      </span>

      <h3 className="text-lg font-semibold tracking-[-0.02em] text-black dark:text-white">
        {title}
      </h3>

      <div className="max-w-xl text-sm leading-7 text-black/55 dark:text-white/50">
        {children}
      </div>
    </div>
  );
}

export function MarketingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#111110] dark:bg-[#0c0c0b] dark:text-[#f4f3ef]">
      <header className="relative z-20 border-b border-black/8 dark:border-white/8">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-[-0.02em]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
              P
            </span>
            Pro Daily
          </Link>

          <nav className="hidden items-center gap-7 text-xs text-black/50 dark:text-white/50 sm:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-black dark:hover:text-white"
            >
              How it works
            </a>
            <a
              href="#why"
              className="transition hover:text-black dark:hover:text-white"
            >
              Why Pro Daily
            </a>
            <a
              href="#workflow"
              className="transition hover:text-black dark:hover:text-white"
            >
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-xs font-medium text-black/55 transition hover:text-black dark:text-white/55 dark:hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-medium text-white transition hover:translate-y-[-1px] dark:bg-white dark:text-black"
            >
              Start your day
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 sm:hidden dark:border-white/10"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-black/[0.025] blur-3xl dark:bg-white/[0.025]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-black/45 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
              A better daily work page
            </div>

            <h1 className="text-[3.2rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl">
              Plan today.
              <br />
              <span className="text-black/35 dark:text-white/30">
                Remember tomorrow.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-black/55 dark:text-white/50 sm:text-lg">
              Pro Daily turns your daily paper workflow into a focused digital
              workspace for priorities, tasks, notes, and the work you actually
              want to remember.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:translate-y-[-1px] dark:bg-white dark:text-black sm:w-auto"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#how-it-works"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium text-black/60 transition hover:border-black/20 hover:text-black dark:border-white/10 dark:text-white/60 dark:hover:border-white/20 dark:hover:text-white sm:w-auto"
              >
                See how it works
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-black/10 dark:border-white/10"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[0.7fr_1.3fr] md:py-28">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
              The idea
            </p>

            <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              Your workday shouldn't need a project management system.
            </h2>
          </div>

          <div>
            <FeatureNumber number="01" title="Choose what matters">
              Start the day with a short list of priorities. Keep the important
              work visible instead of burying it underneath dozens of tasks.
            </FeatureNumber>

            <FeatureNumber number="02" title="Work underneath them">
              Tasks give you the room to break work down without confusing
              everything you need to do with everything that actually matters.
            </FeatureNumber>

            <FeatureNumber number="03" title="Leave a record">
              Notes capture the context that usually disappears at the end of
              the day — decisions, observations, progress, and unfinished
              thoughts.
            </FeatureNumber>

            <FeatureNumber number="04" title="Come back tomorrow">
              Incomplete work carries forward automatically, so you don't have
              to rebuild your day from memory every morning.
            </FeatureNumber>
          </div>
        </div>
      </section>

      <section id="workflow">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
              One page
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Priorities → Tasks → Notes.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-black/50 dark:text-white/45">
              The hierarchy is deliberate. Decide what matters first. Then
              figure out what needs doing. Then capture whatever happens along
              the way.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-3">
            <div className="bg-[#f7f6f2] p-7 dark:bg-[#0c0c0b] sm:p-9">
              <Target className="h-5 w-5" strokeWidth={1.5} />

              <p className="mt-14 font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                01 / Priorities
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                Pick the few things that matter.
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/50 dark:text-white/45">
                Up to seven priorities. Your top three define whether the day
                was accomplished.
              </p>
            </div>

            <div className="bg-[#f7f6f2] p-7 dark:bg-[#0c0c0b] sm:p-9">
              <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />

              <p className="mt-14 font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                02 / Tasks
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                Turn priorities into movement.
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/50 dark:text-white/45">
                Keep the detailed to-do list separate from the work that defines
                the day.
              </p>
            </div>

            <div className="bg-[#f7f6f2] p-7 dark:bg-[#0c0c0b] sm:p-9">
              <FileText className="h-5 w-5" strokeWidth={1.5} />

              <p className="mt-14 font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                03 / Notes
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                Keep the context.
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/50 dark:text-white/45">
                A flexible space for everything worth remembering from the
                workday.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why"
        className="border-y border-black/10 dark:border-white/10"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                Less system
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Built around the day, not the database.
              </h2>
            </div>

            <div className="space-y-0">
              <div className="border-t border-black/10 py-7 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-black/30 dark:text-white/30" />
                  <div>
                    <h3 className="font-semibold">No Kanban boards</h3>
                    <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/45">
                      You don't need to move cards between columns to know what
                      you're doing today.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/10 py-7 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-black/30 dark:text-white/30" />
                  <div>
                    <h3 className="font-semibold">No endless project setup</h3>
                    <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/45">
                      Open the page and start working. The structure is already
                      there.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/10 py-7 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-black/30 dark:text-white/30" />
                  <div>
                    <h3 className="font-semibold">No productivity theater</h3>
                    <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/45">
                      The goal isn't to maintain a perfect system. It's to do
                      meaningful work and remember what happened.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/10 py-7 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <Check className="mt-1 h-4 w-4 shrink-0" />
                  <div>
                    <h3 className="font-semibold">
                      A record you can return to
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/45">
                      Your days become a searchable history of what you worked
                      on, what you learned, and what carried forward.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10">
                <History className="h-4 w-4" strokeWidth={1.5} />
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                Your work has a memory
              </p>

              <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Stop losing the context between days.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-black/50 dark:text-white/45">
                Yesterday shouldn't disappear just because the calendar moved
                forward. Pro Daily keeps each day as its own record while
                carrying unfinished work into the next one.
              </p>

              <Link
                href="/signup"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-medium"
              >
                Build your daily record
                <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-black/10 bg-white/50 p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7">
                <div className="flex items-center justify-between border-b border-black/8 pb-4 dark:border-white/8">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
                      History
                    </p>
                    <p className="mt-1 text-sm font-medium">September 2026</p>
                  </div>

                  <History className="h-4 w-4 text-black/25 dark:text-white/25" />
                </div>

                <div className="mt-5 space-y-2">
                  {[
                    ["Sep 4", "3 / 3", "Day accomplished"],
                    ["Sep 3", "2 / 3", "2 priorities carried"],
                    ["Sep 2", "3 / 3", "Day accomplished"],
                    ["Sep 1", "1 / 3", "2 priorities carried"],
                  ].map(([date, progress, status]) => (
                    <div
                      key={date}
                      className="flex items-center justify-between rounded-lg border border-black/6 px-4 py-3 dark:border-white/6"
                    >
                      <div>
                        <p className="text-xs font-medium">{date}</p>
                        <p className="mt-1 text-[10px] text-black/35 dark:text-white/30">
                          {status}
                        </p>
                      </div>

                      <span className="font-mono text-[10px] text-black/40 dark:text-white/35">
                        {progress}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Sparkles className="mx-auto h-5 w-5" strokeWidth={1.5} />

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
              The bigger idea
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Start with a better daily page.
            </h2>

            <p className="mt-5 text-sm leading-7 text-black/50 dark:text-white/45">
              Capture what matters. Work through it. Leave a record. Build a
              system that gets better because you actually use it.
            </p>

            <Link
              href="/signup"
              className="group mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:translate-y-[-1px] dark:bg-white dark:text-black"
            >
              Start using Pro Daily
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[9px] font-bold text-white dark:bg-white dark:text-black">
              P
            </span>
            <span className="text-xs font-medium">Pro Daily</span>
          </div>

          <div className="flex items-center gap-5 text-[10px] text-black/35 dark:text-white/30">
            <Link
              href="/login"
              className="hover:text-black dark:hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="hover:text-black dark:hover:text-white"
            >
              Create account
            </Link>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
