"use client";

import { useState, useTransition } from "react";

import {
  saveOnboardingStep,
  setOnboardingStep,
  skipOnboarding,
} from "@/lib/actions/onboarding";
import type { Onboarding, OnboardingHelpGoal } from "@/types/database";
import { OnboardingProgress } from "./onboarding-progress";
import { HelpGoalsStep } from "./steps/help-goals";
import { NameStep } from "./steps/name";
import { TaskHabitsStep } from "./steps/task-habits";
import { WelcomeStep } from "./steps/welcome";
import { GoalCardsStep } from "./steps/goal-cards";
import { PrioritiesStep } from "./steps/priorities";
import { ReadyStep } from "./steps/ready";
import { WhyThreeStep } from "./steps/why-three";

const TOTAL_STEPS = 19;

type OnboardingShellProps = {
  initial: Onboarding;
};

export function OnboardingShell({ initial }: OnboardingShellProps) {
  const [onboarding, setOnboarding] = useState(initial);

  const [step, setStep] = useState(initial.current_step);

  const [error, setError] = useState("");

  const [pending, startTransition] = useTransition();

  function goToStep(nextStep: number) {
    if (nextStep < 1 || nextStep > TOTAL_STEPS) {
      return;
    }

    setError("");
    setStep(nextStep);

    startTransition(async () => {
      try {
        await setOnboardingStep(nextStep);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function handleNext(values: {
    name?: string;
    taskHabits?: string;
    helpGoals?: OnboardingHelpGoal[];
  }) {
    setError("");

    const nextStep = Math.min(step + 1, TOTAL_STEPS);

    setOnboarding((current) => ({
      ...current,
      ...(values.name !== undefined ? { name: values.name } : {}),
      ...(values.taskHabits !== undefined
        ? { task_habits: values.taskHabits }
        : {}),
      ...(values.helpGoals !== undefined
        ? { help_goals: values.helpGoals }
        : {}),
      current_step: nextStep,
    }));

    setStep(nextStep);

    startTransition(async () => {
      try {
        await saveOnboardingStep(nextStep, values);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to save your progress.",
        );
      }
    });
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <WelcomeStep onNext={() => handleNext({})} pending={pending} />;

      case 2:
        return (
          <NameStep
            initialName={onboarding.name ?? ""}
            onNext={(name) => handleNext({ name })}
            pending={pending}
          />
        );

      case 3:
        return (
          <TaskHabitsStep
            initialValue={onboarding.task_habits ?? ""}
            onNext={(taskHabits) => handleNext({ taskHabits })}
            pending={pending}
          />
        );

      case 4:
        return (
          <HelpGoalsStep
            initialGoals={onboarding.help_goals}
            onNext={(helpGoals) => handleNext({ helpGoals })}
            pending={pending}
          />
        );

      case 5:
        return (
          <GoalCardsStep
            goals={onboarding.help_goals}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 6:
        return (
          <ReadyStep
            name={onboarding.name}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 7:
        return (
          <PrioritiesStep onNext={() => handleNext({})} pending={pending} />
        );

      case 8:
        return <WhyThreeStep onNext={() => handleNext({})} pending={pending} />;

      default:
        return (
          <div className="text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              This part of onboarding is coming next.
            </p>

            <button
              type="button"
              onClick={() => goToStep(Math.max(1, step - 1))}
              className="mt-6 rounded-full bg-stone-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
            >
              Back
            </button>
          </div>
        );
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950 dark:bg-stone-950 dark:text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col">
        <header className="mb-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-stone-950 dark:border-white/10 dark:bg-white">
                <span className="text-[10px] font-bold tracking-[-0.08em] text-white dark:text-stone-950">
                  CMkr
                </span>
              </div>

              <span className="text-[15px] font-semibold tracking-[-0.025em]">
                CheckMarkr
              </span>
            </div>

            {step > 1 && (
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                disabled={pending}
                className="text-xs font-medium text-stone-500 transition hover:text-stone-950 disabled:opacity-50 dark:text-stone-400 dark:hover:text-white"
              >
                Back
              </button>
            )}
          </div>

          <OnboardingProgress step={step} total={TOTAL_STEPS} />
        </header>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            {renderStep()}
          </div>
        </div>

        <footer className="pt-10 text-center">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  await skipOnboarding();
                  window.location.href = "/today";
                } catch (error) {
                  setError(
                    error instanceof Error
                      ? error.message
                      : "Unable to skip onboarding.",
                  );
                }
              });
            }}
            className="text-xs text-stone-400 transition hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300"
          >
            Skip for now
          </button>
        </footer>
      </div>
    </main>
  );
}
