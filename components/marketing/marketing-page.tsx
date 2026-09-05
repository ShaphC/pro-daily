import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  History,
  Menu,
  Minus,
  MoveRight,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

function ProductPreview() {
  const priorities = [
    { text: "Finish the product landing page", completed: true },
    { text: "Review customer feedback", completed: true },
    { text: "Ship the daily workflow", completed: false },
    { text: "Prepare onboarding flow", completed: false },
  ];

  const tasks = [
    { text: "Write onboarding copy", completed: false },
    { text: "Clean up dashboard spacing", completed: false },
    { text: "Review open pull requests", completed: true },
    { text: "Prepare tomorrow's outline", completed: false },
  ];

  return (
    <div className="relative mx-auto w-full max-w-5xl animate-preview-enter">
      <div className="absolute -inset-5 rounded-[2rem] bg-black/[0.035] blur-3xl dark:bg-white/[0.025]" />

      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#f7f6f2] shadow-2xl shadow-black/10 transition-shadow duration-700 hover:shadow-black/15 dark:border-white/10 dark:bg-[#0c0c0b] dark:shadow-black/40 dark:hover:shadow-black/60">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-7 sm:py-9">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-preview-header">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/45 dark:text-white/40">
                Wednesday, September 9, 2026
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-black dark:text-white sm:text-3xl">
                What matters today?
              </h3>
            </div>

            <div className="w-fit rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-bold text-black/55 dark:border-white/10 dark:text-white/50">
              <span className="inline-block animate-progress-number">
                2/3 top priorities complete
              </span>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(210px,.72fr)]">
            <div className="space-y-7">
              <div className="animate-preview-section [animation-delay:180ms]">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-black dark:text-white">
                      Top Priorities
                    </h4>

                    <p className="mt-1 text-[9px] font-medium text-black/45 dark:text-white/40">
                      Aim for 3–5. Maximum 7. Drag to change priority order.
                    </p>
                  </div>

                  <span className="text-[9px] font-bold text-black/35 dark:text-white/30">
                    4/7
                  </span>
                </div>

                <PriorityReorderPreview priorities={priorities} />

                <div className="mt-2 flex gap-1.5 animate-preview-control [animation-delay:900ms]">
                  <div className="min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[10px] font-medium text-black/35 dark:border-white/10 dark:bg-stone-950 dark:text-white/30">
                    Add a priority
                  </div>

                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-black/10 bg-white transition-transform duration-300 hover:scale-105 dark:border-white/10 dark:bg-stone-950">
                    <Plus className="h-3.5 w-3.5 text-black/40 dark:text-white/35" />
                  </div>
                </div>
              </div>

              <div className="animate-preview-section [animation-delay:350ms]">
                <div className="mb-3">
                  <h4 className="text-sm font-bold text-black dark:text-white">
                    Tasks
                  </h4>

                  <p className="mt-1 text-[9px] font-medium text-black/45 dark:text-white/40">
                    Work through the details. Incomplete tasks continue forward.
                  </p>
                </div>

                <div className="grid gap-1.5">
                  {tasks.map((task, index) => (
                    <PreviewDailyRow
                      key={task.text}
                      text={task.text}
                      completed={task.completed}
                      animationDelay={index * 1200 + 400}
                    />
                  ))}
                </div>

                <div className="mt-2 flex gap-1.5 animate-preview-control [animation-delay:1100ms]">
                  <div className="min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[10px] font-medium text-black/35 dark:border-white/10 dark:bg-stone-950 dark:text-white/30">
                    Add a task
                  </div>

                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-black/10 bg-white transition-transform duration-300 hover:scale-105 dark:border-white/10 dark:bg-stone-950">
                    <Plus className="h-3.5 w-3.5 text-black/40 dark:text-white/35" />
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-preview-notes [animation-delay:500ms]">
              <div className="mb-3">
                <h4 className="text-sm font-bold text-black dark:text-white">
                  Notes
                </h4>

                <p className="mt-1 text-[9px] font-medium text-black/45 dark:text-white/40">
                  Capture what happened while you worked.
                </p>
              </div>

              <div className="min-h-[300px] overflow-hidden rounded-xl border border-black/10 bg-stone-100/70 p-4 dark:border-white/10 dark:bg-stone-900/60 md:min-h-[395px]">
                <PreviewTyping
                  text="The simpler workflow is working."
                  delay={900}
                />

                <PreviewTyping
                  text="Keep the daily page focused and avoid turning it into another project management system."
                  delay={2400}
                  className="mt-3"
                />

                <PreviewTyping
                  text="Review the remaining priorities tomorrow and continue from where the work left off."
                  delay={4700}
                  className="mt-3"
                />

                <span className="mt-2 inline-block h-3 w-px animate-caret bg-black/40 dark:bg-white/40" />
              </div>

              <p className="mt-1.5 text-right text-[8px] font-medium text-black/30 dark:text-white/25">
                Saved when you leave the notes field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityReorderPreview({
  priorities,
}: {
  priorities: {
    text: string;
    completed: boolean;
  }[];
}) {
  return (
    <div className="relative h-[174px]">
      <div className="absolute inset-0 grid gap-1.5">
        {priorities.map((priority, index) => (
          <div
            key={`initial-${priority.text}`}
            className={`animate-preview-row ${
              index === 1
                ? "animate-priority-row-two"
                : index === 2
                  ? "animate-priority-row-three"
                  : ""
            }`}
            style={
              {
                "--animation-delay": `${index * 900}ms`,
              } as React.CSSProperties
            }
          >
            <PreviewDailyRow
              text={priority.text}
              completed={priority.completed}
              emphasis={index < 3}
              rank={index}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 grid gap-1.5 animate-priority-swapped">
        {[priorities[0], priorities[2], priorities[1], priorities[3]].map(
          (priority, index) => (
            <PreviewDailyRow
              key={`swapped-${priority.text}`}
              text={priority.text}
              completed={priority.completed}
              emphasis={index < 3}
              rank={index}
            />
          ),
        )}
      </div>

      <div className="pointer-events-none absolute right-1 top-[45px] animate-drag-indicator">
        <div className="rounded-md border border-black/10 bg-white px-2 py-1 shadow-lg dark:border-white/10 dark:bg-stone-950">
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-black/45 dark:text-white/40">
            dragging
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewDailyRow({
  text,
  completed = false,
  emphasis = false,
  rank,
}: {
  text: string;
  completed?: boolean;
  emphasis?: boolean;
  rank?: number;
}) {
  return (
    <div
      className={`group flex h-[39px] items-center gap-2 rounded-lg border px-2.5 py-2 transition-all duration-300 hover:-translate-y-px hover:shadow-sm ${
        emphasis
          ? "border-black/10 bg-white dark:border-white/10 dark:bg-stone-950"
          : "border-black/6 bg-white/50 dark:border-white/6 dark:bg-white/[0.015]"
      }`}
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-500 ${
          completed
            ? "animate-checkbox-check border-black bg-black text-white shadow-sm dark:border-white dark:bg-white dark:text-black"
            : "border-black/15 dark:border-white/15"
        }`}
      >
        {completed && (
          <Check className="h-2.5 w-2.5 animate-checkmark" strokeWidth={2.5} />
        )}
      </div>

      {typeof rank === "number" && (
        <span className="w-3 shrink-0 font-mono text-[8px] font-bold text-black/25 dark:text-white/20">
          {rank + 1}
        </span>
      )}

      <span
        className={`min-w-0 truncate text-[10px] transition-all duration-500 ${
          completed
            ? "text-black/35 line-through dark:text-white/30"
            : emphasis
              ? "font-semibold text-black/70 dark:text-white/65"
              : "font-medium text-black/55 dark:text-white/50"
        }`}
      >
        {text}
      </span>

      <div className="ml-auto h-3 w-3 shrink-0 rounded-sm border border-black/8 transition-transform duration-300 group-hover:scale-110 dark:border-white/8" />
    </div>
  );
}

function PreviewTyping({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-medium leading-5 text-black/55 dark:text-white/45 ${className}`}
      aria-hidden="true"
    >
      {Array.from(text).map((character, index) => (
        <span
          key={`${text}-${index}`}
          className="animate-note-character"
          style={
            {
              "--char-delay": `${delay + index * 24}ms`,
            } as React.CSSProperties
          }
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </p>
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
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
            {title}
          </span>

          {count && (
            <span className="font-mono text-[9px] font-bold text-black/35 dark:text-white/35">
              {count}
            </span>
          )}
        </div>

        <Plus className="h-3 w-3 text-black/35 dark:text-white/35" />
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
            : "border-black/20 dark:border-white/20"
        }`}
      >
        {checked && <Check className="h-2.5 w-2.5" />}
      </div>

      <span
        className={`text-xs ${
          checked
            ? "text-black/40 line-through dark:text-white/35"
            : "font-medium text-black/70 dark:text-white/65"
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
    <div className="group grid gap-5 border-t border-black/10 py-8 transition-all duration-500 hover:translate-x-1 dark:border-white/10 md:grid-cols-[80px_220px_1fr] md:gap-8">
      <span className="font-mono text-xs font-bold text-black/40 transition-colors duration-300 group-hover:text-black/70 dark:text-white/40 dark:group-hover:text-white/70">
        {number}
      </span>

      <h3 className="text-lg font-bold tracking-[-0.02em] text-black dark:text-white">
        {title}
      </h3>

      <div className="max-w-xl text-sm font-medium leading-7 text-black/60 dark:text-white/55">
        {children}
      </div>
    </div>
  );
}

export async function MarketingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const ctaHref = isAuthenticated ? "/today" : "/signup";
  const ctaLabel = isAuthenticated ? "Go to Today" : "Start for free";

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes preview-enter {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes preview-header {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes preview-section {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes preview-row {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes priority-row-two {
          0%,
          22% {
            transform: translateY(0);
          }
          28% {
            transform: translateY(3px);
          }
          38% {
            transform: translateY(43px);
          }
          52%,
          76% {
            transform: translateY(43px);
          }
          84% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes priority-row-three {
          0%,
          22% {
            transform: translateY(0);
          }
          28% {
            transform: translateY(-3px);
          }
          38% {
            transform: translateY(-43px);
          }
          52%,
          76% {
            transform: translateY(-43px);
          }
          84% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes priority-swapped {
          0%,
          48% {
            opacity: 0;
          }
          55%,
          77% {
            opacity: 1;
          }
          84%,
          100% {
            opacity: 0;
          }
        }

        @keyframes drag-indicator {
          0%,
          20% {
            opacity: 0;
            transform: translate(0, 0) scale(0.9);
          }
          25%,
          34% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          44% {
            opacity: 1;
            transform: translate(-2px, 43px) scale(1.02);
          }
          52%,
          70% {
            opacity: 0;
            transform: translate(-2px, 43px) scale(0.95);
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes checkbox-check {
          0% {
            transform: scale(0.8);
          }
          35% {
            transform: scale(1.18);
          }
          55% {
            transform: scale(0.94);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            opacity: 0;
            transform: scale(0.4) rotate(-12deg);
          }
          60% {
            opacity: 1;
            transform: scale(1.15) rotate(4deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes note-character {
          0% {
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          82%,
          100% {
            opacity: 0;
          }
        }

        @keyframes caret {
          0%,
          45% {
            opacity: 1;
          }
          46%,
          70% {
            opacity: 0;
          }
          71%,
          100% {
            opacity: 1;
          }
        }

        @keyframes progress-number {
          0%,
          30% {
            opacity: 0.5;
          }
          45% {
            opacity: 1;
          }
          65%,
          100% {
            opacity: 0.75;
          }
        }

        @keyframes preview-control {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes preview-notes {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float-soft {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pricing-pulse {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-preview-enter {
          animation: preview-enter 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-preview-header {
          animation: preview-header 700ms cubic-bezier(0.16, 1, 0.3, 1) 250ms both;
        }

        .animate-preview-section {
          animation: preview-section 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-preview-row {
          animation: preview-row 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--animation-delay) both;
        }

        .animate-priority-row-two {
          animation:
            preview-row 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--animation-delay) both,
            priority-row-two 8500ms cubic-bezier(0.65, 0, 0.35, 1) 2200ms infinite;
        }

        .animate-priority-row-three {
          animation:
            preview-row 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--animation-delay) both,
            priority-row-three 8500ms cubic-bezier(0.65, 0, 0.35, 1) 2200ms infinite;
        }

        .animate-priority-swapped {
          animation: priority-swapped 8500ms ease-in-out 2200ms infinite;
        }

        .animate-drag-indicator {
          animation: drag-indicator 8500ms ease-in-out 2200ms infinite;
        }

        .animate-checkbox-check {
          animation: checkbox-check 700ms cubic-bezier(0.16, 1, 0.3, 1) 900ms both;
        }

        .animate-checkmark {
          animation: checkmark 500ms cubic-bezier(0.16, 1, 0.3, 1) 900ms both;
        }

        .animate-note-character {
          opacity: 0;
          animation: note-character 11500ms linear var(--char-delay) infinite;
        }

        .animate-caret {
          animation: caret 900ms steps(1) 800ms infinite;
        }

        .animate-progress-number {
          animation: progress-number 4200ms ease-in-out infinite;
        }

        .animate-preview-control {
          animation: preview-control 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-preview-notes {
          animation: preview-notes 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-float-soft {
          animation: float-soft 5s ease-in-out infinite;
        }

        .animate-pricing-pulse {
          animation: pricing-pulse 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#111110] dark:bg-[#0c0c0b] dark:text-[#f4f3ef]">
        <header className="relative z-20 border-b border-black/10 dark:border-white/10">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-bold tracking-[-0.02em]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-[10px] font-bold text-white transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 dark:bg-white dark:text-black">
                P
              </span>
              Pro Daily
            </Link>

            <nav className="hidden items-center gap-7 text-xs sm:flex">
              <a
                href="#how-it-works"
                className="font-bold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                How it works
              </a>

              <a
                href="#workflow"
                className="font-bold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                Workflow
              </a>

              <a
                href="#pricing"
                className="font-bold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                Pricing
              </a>

              <a
                href="#testimonials"
                className="font-bold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                Testimonials
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  href="/today"
                  className="hidden font-bold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white sm:block"
                >
                  Today
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden font-bold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white sm:block"
                >
                  Sign in
                </Link>
              )}

              <Link
                href={ctaHref}
                className="group flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-black"
              >
                {ctaLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition hover:bg-black/[0.04] sm:hidden dark:border-white/15 dark:hover:bg-white/[0.04]"
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
              <div className="mb-7 inline-flex animate-preview-header items-center gap-2 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/55 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black dark:bg-white" />
                A better daily work page
              </div>

              <h1 className="animate-preview-header text-[3.2rem] font-bold leading-[0.98] tracking-[-0.055em] [animation-delay:120ms] sm:text-6xl md:text-7xl">
                Plan today.
                <br />
                <span className="text-black/40 dark:text-white/35">
                  Remember tomorrow.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl animate-preview-section text-base font-medium leading-7 text-black/65 [animation-delay:260ms] dark:text-white/55 sm:text-lg">
                Pro Daily turns your daily paper workflow into a focused digital
                workspace for priorities, tasks, notes, and the work you
                actually want to remember.
              </p>

              <div className="mt-9 flex animate-preview-section flex-col items-center justify-center gap-3 [animation-delay:380ms] sm:flex-row">
                <Link
                  href={ctaHref}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-black sm:w-auto"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#how-it-works"
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-bold text-black/70 transition duration-300 hover:-translate-y-0.5 hover:border-black/30 hover:text-black dark:border-white/15 dark:text-white/70 dark:hover:border-white/30 dark:hover:text-white sm:w-auto"
                >
                  See how it works
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                The idea
              </p>

              <h2 className="mt-4 max-w-sm text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                Your workday shouldn't need a project management system.
              </h2>
            </div>

            <div>
              <FeatureNumber number="01" title="Choose what matters">
                Start the day with a short list of priorities. Keep the
                important work visible instead of burying it underneath dozens
                of tasks.
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
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                One page
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Priorities → Tasks → Notes.
              </h2>

              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-black/60 dark:text-white/50">
                The hierarchy is deliberate. Decide what matters first. Then
                figure out what needs doing. Then capture whatever happens along
                the way.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-3">
              <div className="group bg-[#f7f6f2] p-7 transition duration-500 hover:-translate-y-1 dark:bg-[#0c0c0b] sm:p-9">
                <Target
                  className="h-5 w-5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  strokeWidth={1.5}
                />

                <p className="mt-14 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  01 / Priorities
                </p>

                <h3 className="mt-3 text-xl font-bold tracking-[-0.03em]">
                  Pick the few things that matter.
                </h3>

                <p className="mt-4 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
                  Up to seven priorities. Your top three define whether the day
                  was accomplished.
                </p>
              </div>

              <div className="group bg-[#f7f6f2] p-7 transition duration-500 hover:-translate-y-1 dark:bg-[#0c0c0b] sm:p-9">
                <CheckCircle2
                  className="h-5 w-5 transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />

                <p className="mt-14 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  02 / Tasks
                </p>

                <h3 className="mt-3 text-xl font-bold tracking-[-0.03em]">
                  Turn priorities into movement.
                </h3>

                <p className="mt-4 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
                  Keep the detailed to-do list separate from the work that
                  defines the day.
                </p>
              </div>

              <div className="group bg-[#f7f6f2] p-7 transition duration-500 hover:-translate-y-1 dark:bg-[#0c0c0b] sm:p-9">
                <FileText
                  className="h-5 w-5 transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />

                <p className="mt-14 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  03 / Notes
                </p>

                <h3 className="mt-3 text-xl font-bold tracking-[-0.03em]">
                  Keep the context.
                </h3>

                <p className="mt-4 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
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
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  Less system
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                  Built around the day, not the database.
                </h2>
              </div>

              <div className="space-y-0">
                <div className="border-t border-black/10 py-7 transition-transform duration-500 hover:translate-x-1 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <Minus className="mt-1 h-4 w-4 shrink-0 text-black/40 dark:text-white/35" />
                    <div>
                      <h3 className="font-bold">No Kanban boards</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
                        You don't need to move cards between columns to know
                        what you're doing today.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/10 py-7 transition-transform duration-500 hover:translate-x-1 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <Minus className="mt-1 h-4 w-4 shrink-0 text-black/40 dark:text-white/35" />
                    <div>
                      <h3 className="font-bold">No endless project setup</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
                        Open the page and start working. The structure is
                        already there.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/10 py-7 transition-transform duration-500 hover:translate-x-1 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <Minus className="mt-1 h-4 w-4 shrink-0 text-black/40 dark:text-white/35" />
                    <div>
                      <h3 className="font-bold">No productivity theater</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
                        The goal isn't to maintain a perfect system. It's to do
                        meaningful work and remember what happened.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/10 py-7 transition-transform duration-500 hover:translate-x-1 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <Check className="mt-1 h-4 w-4 shrink-0" />
                    <div>
                      <h3 className="font-bold">A record you can return to</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-black/60 dark:text-white/50">
                        Your days become a history of what you worked on, what
                        you learned, and what carried forward.
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
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 transition-transform duration-500 hover:-rotate-3 hover:scale-105 dark:border-white/10">
                  <History className="h-4 w-4" strokeWidth={1.5} />
                </div>

                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  Your work has a memory
                </p>

                <h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                  Stop losing the context between days.
                </h2>

                <p className="mt-5 max-w-lg text-sm font-medium leading-7 text-black/60 dark:text-white/50">
                  Yesterday shouldn't disappear just because the calendar moved
                  forward. Pro Daily keeps each day as its own record while
                  carrying unfinished work into the next one.
                </p>

                <Link
                  href={ctaHref}
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-bold"
                >
                  {isAuthenticated
                    ? "Go to your daily page"
                    : "Build your daily record"}
                  <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="relative">
                <div className="rounded-2xl border border-black/10 bg-white/50 p-5 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04] dark:border-white/10 dark:bg-white/[0.03] dark:hover:shadow-black/20 sm:p-7">
                  <div className="flex items-center justify-between border-b border-black/8 pb-4 dark:border-white/8">
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/40 dark:text-white/35">
                        History
                      </p>
                      <p className="mt-1 text-sm font-bold">September 2026</p>
                    </div>

                    <History className="h-4 w-4 animate-float-soft text-black/30 dark:text-white/30" />
                  </div>

                  <div className="mt-5 space-y-2">
                    {[
                      ["Sep 4", "3 / 3", "Day accomplished"],
                      ["Sep 3", "2 / 3", "2 priorities carried"],
                      ["Sep 2", "3 / 3", "Day accomplished"],
                      ["Sep 1", "1 / 3", "2 priorities carried"],
                    ].map(([date, progress, status], index) => (
                      <div
                        key={date}
                        className="group flex items-center justify-between rounded-lg border border-black/6 px-4 py-3 transition-all duration-300 hover:-translate-y-px hover:border-black/15 hover:bg-black/[0.02] dark:border-white/6 dark:hover:border-white/15 dark:hover:bg-white/[0.02]"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div>
                          <p className="text-xs font-bold">{date}</p>
                          <p className="mt-1 text-[10px] font-medium text-black/45 dark:text-white/35">
                            {status}
                          </p>
                        </div>

                        <span className="font-mono text-[10px] font-bold text-black/50 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-white/40">
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

        <section
          id="pricing"
          className="border-y border-black/10 dark:border-white/10"
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                Pricing
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Simple now. More later.
              </h2>

              <p className="mt-5 text-sm font-medium leading-7 text-black/60 dark:text-white/50">
                Pro Daily is still being shaped around real usage. Start with
                the core daily workflow while the rest of the product develops.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white/50 p-7 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04] dark:border-white/10 dark:bg-white/[0.03] sm:p-9">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  Start
                </p>

                <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">
                  Free
                </h3>

                <p className="mt-2 text-sm font-medium text-black/50 dark:text-white/40">
                  The daily workflow, without the clutter.
                </p>

                <div className="mt-7 border-t border-black/8 pt-6 dark:border-white/8">
                  <div className="space-y-3 text-sm font-medium text-black/65 dark:text-white/55">
                    <div className="flex gap-3">
                      <Check className="h-4 w-4 shrink-0" />
                      Daily priorities
                    </div>

                    <div className="flex gap-3">
                      <Check className="h-4 w-4 shrink-0" />
                      Tasks and notes
                    </div>

                    <div className="flex gap-3">
                      <Check className="h-4 w-4 shrink-0" />
                      Automatic carry-forward
                    </div>

                    <div className="flex gap-3">
                      <Check className="h-4 w-4 shrink-0" />
                      Daily history
                    </div>
                  </div>
                </div>

                <Link
                  href={ctaHref}
                  className="mt-8 flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-black"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-black/15 bg-black p-7 text-white shadow-xl shadow-black/10 dark:border-white/15 dark:bg-white dark:text-black dark:shadow-black/30 sm:p-9">
                <div className="absolute right-5 top-5 rounded-full border border-white/15 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/55 dark:border-black/10 dark:text-black/45">
                  Coming later
                </div>

                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 dark:text-black/45">
                  Pro
                </p>

                <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">
                  More capability
                </h3>

                <p className="mt-2 text-sm font-medium text-white/55 dark:text-black/50">
                  Pricing and premium features will be finalized after early
                  users shape the product.
                </p>

                <div className="mt-7 border-t border-white/10 pt-6 dark:border-black/10">
                  <div className="space-y-3 text-sm font-medium text-white/70 dark:text-black/65">
                    <div className="flex gap-3">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      Future capture tools
                    </div>

                    <div className="flex gap-3">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      Reminders and notifications
                    </div>

                    <div className="flex gap-3">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      Deeper history and insights
                    </div>

                    <div className="flex gap-3">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      Future mobile experience
                    </div>
                  </div>
                </div>

                <p className="mt-8 animate-pricing-pulse text-center font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/35 dark:text-black/35">
                  Pricing to be announced
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10">
                <Sparkles
                  className="h-4 w-4 animate-float-soft"
                  strokeWidth={1.5}
                />
              </div>

              <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                Testimonials
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Built from real feedback.
              </h2>

              <p className="mt-5 text-sm font-medium leading-7 text-black/60 dark:text-white/50">
                Once people start using Pro Daily, this is where their
                experiences will live.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  label: "Your first testimonial",
                  prompt: "What changed about the way they work?",
                },
                {
                  label: "Your second testimonial",
                  prompt: "What did they stop doing because of Pro Daily?",
                },
                {
                  label: "Your third testimonial",
                  prompt: "What made the daily workflow stick?",
                },
              ].map((testimonial, index) => (
                <div
                  key={testimonial.label}
                  className="group rounded-2xl border border-black/10 bg-white/40 p-7 transition duration-500 hover:-translate-y-1 hover:border-black/15 hover:shadow-xl hover:shadow-black/[0.04] dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-white/15 dark:hover:shadow-black/20 sm:p-8"
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/30 dark:text-white/25">
                    0{index + 1}
                  </span>

                  <div className="mt-12">
                    <p className="text-sm font-bold text-black/60 dark:text-white/55">
                      {testimonial.label}
                    </p>

                    <p className="mt-3 text-sm font-medium leading-6 text-black/40 transition-colors duration-300 group-hover:text-black/55 dark:text-white/30 dark:group-hover:text-white/45">
                      {testimonial.prompt}
                    </p>
                  </div>

                  <div className="mt-8 h-px w-10 bg-black/10 transition-all duration-500 group-hover:w-16 dark:bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Sparkles
                className="mx-auto h-5 w-5 animate-float-soft"
                strokeWidth={1.5}
              />

              <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                The bigger idea
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Start with a better daily page.
              </h2>

              <p className="mt-5 text-sm font-medium leading-7 text-black/60 dark:text-white/50">
                Capture what matters. Work through it. Leave a record. Build a
                system that gets better because you actually use it.
              </p>

              <Link
                href={ctaHref}
                className="group mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-black"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <footer>
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[9px] font-bold text-white transition-transform duration-300 hover:rotate-3 dark:bg-white dark:text-black">
                P
              </span>

              <span className="text-xs font-bold">Pro Daily</span>
            </div>

            <div className="flex items-center gap-5 text-[10px] font-bold text-black/50 dark:text-white/40">
              <Link
                href="/login"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Create account
              </Link>

              <span>© 2026</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
