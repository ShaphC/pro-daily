"use client";

import { useState, useTransition } from "react";

import {
  completeOnboarding,
  saveOnboardingStep,
  setOnboardingStep,
  skipOnboarding,
} from "@/lib/actions/onboarding";
import type { Onboarding, OnboardingHelpGoal } from "@/types/database";
import { OnboardingProgress } from "./onboarding-progress";
import { CommitmentStep } from "./steps/commitment";
import { CompletePriorityStep } from "./steps/complete-priority";
import { AdditionalQuestionsStep } from "./steps/additional-questions";
import { FinalSnapshotStep } from "./steps/final-snapshot";
import { GoalCardsStep } from "./steps/goal-cards";
import { HelpGoalsStep } from "./steps/help-goals";
import { MakeTasksSmallerStep } from "./steps/make-tasks-smaller";
import { MomentumStep } from "./steps/momentum";
import { NameStep } from "./steps/name";
import { CreateTaskStep } from "./steps/create-task";
import { NotesStep } from "./steps/notes";
import { PrioritiesStep } from "./steps/priorities";
import { ReadyStep } from "./steps/ready";
import { ReflectionStep } from "./steps/reflection";
import { RestStep } from "./steps/rest";
import { StartTrialStep } from "./steps/start-trial";
import { TaskHabitsStep } from "./steps/task-habits";
import { TasksStep } from "./steps/tasks";
import { WelcomeStep } from "./steps/welcome";
import { WhyThreeStep } from "./steps/why-three";

const TOTAL_STEPS = 20;

type OnboardingShellProps = {
  initial: Onboarding;
  dayId: string;
};

export function OnboardingShell({ initial, dayId }: OnboardingShellProps) {
  const [onboarding, setOnboarding] = useState(initial);

  const [step, setStep] = useState(initial.current_step);

  const [error, setError] = useState("");

  const [pending, startTransition] = useTransition();

  function goToStep(nextStep: number) {
    if (pending || nextStep < 1 || nextStep > TOTAL_STEPS) {
      return;
    }

    setError("");
    setStep(nextStep);

    setOnboarding((current) => ({
      ...current,
      current_step: nextStep,
    }));

    startTransition(async () => {
      try {
        await setOnboardingStep(nextStep);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to save your progress.",
        );
      }
    });
  }

  function handleNext(values: {
    name?: string;
    taskHabits?: string;
    helpGoals?: OnboardingHelpGoal[];
    additionalQuestions?: string;
    commitment?: string;
  }) {
    if (pending) {
      return;
    }

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
      ...(values.additionalQuestions !== undefined
        ? {
            additional_questions: values.additionalQuestions,
          }
        : {}),
      ...(values.commitment !== undefined
        ? {
            commitment: values.commitment,
          }
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

  function handleComplete() {
    if (pending) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await completeOnboarding();

        window.location.href = "/today";
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to finish onboarding.",
        );
      }
    });
  }

  function handleSkip() {
    if (pending) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await skipOnboarding();

        setOnboarding((current) => ({
          ...current,
          skipped: true,
          completed: false,
        }));

        window.location.href = "/today";
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to skip onboarding.",
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

      case 9:
        return <TasksStep onNext={() => handleNext({})} pending={pending} />;

      case 10:
        return (
          <MakeTasksSmallerStep
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 11:
        return (
          <CompletePriorityStep
            dayId={dayId}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 12:
        return <MomentumStep onNext={() => handleNext({})} pending={pending} />;

      case 13:
        return (
          <CreateTaskStep
            dayId={dayId}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 14:
        return (
          <NotesStep
            dayId={dayId}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 15:
        return <RestStep onNext={() => handleNext({})} pending={pending} />;

      case 16:
        return (
          <AdditionalQuestionsStep
            initialValue={onboarding.additional_questions ?? ""}
            onNext={(additionalQuestions) =>
              handleNext({
                additionalQuestions,
              })
            }
            pending={pending}
          />
        );

      case 17:
        return (
          <ReflectionStep
            name={onboarding.name}
            taskHabits={onboarding.task_habits}
            goals={onboarding.help_goals}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 18:
        return (
          <CommitmentStep
            initialValue={onboarding.commitment ?? ""}
            onNext={(commitment) => handleNext({ commitment })}
            pending={pending}
          />
        );

      case 19:
        return (
          <FinalSnapshotStep
            name={onboarding.name}
            goals={onboarding.help_goals}
            commitment={onboarding.commitment}
            onNext={() => handleNext({})}
            pending={pending}
          />
        );

      case 20:
        return <StartTrialStep pending={pending} onComplete={handleComplete} />;

      default:
        return (
          <div className="text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              This part of onboarding is coming next.
            </p>

            <button
              type="button"
              onClick={() => goToStep(Math.max(1, step - 1))}
              disabled={pending}
              className="mt-6 rounded-xl border bg-stone-950 px-5 py-3 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
            >
              Back
            </button>
          </div>
        );
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950 dark:bg-stone-950 dark:text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col rounded-3xl border bg-white p-7 shadow-sm dark:bg-stone-900 sm:p-9">
        <header className="mb-8">
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-stone-950 dark:bg-white">
                <span className="text-[10px] font-bold tracking-[-0.08em] text-white dark:text-stone-950">
                  CMkr
                </span>
              </div>

              <span className="text-[15px] font-semibold tracking-[-0.025em]">
                CheckMarkr
              </span>
            </div>

            {step > 1 && step < TOTAL_STEPS && (
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
              <div className="mb-6 rounded-xl border bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            {renderStep()}
          </div>
        </div>

        {step < TOTAL_STEPS && (
          <footer className="pt-8 text-center">
            <button
              type="button"
              disabled={pending}
              onClick={handleSkip}
              className="text-xs text-stone-400 transition hover:text-stone-700 disabled:opacity-50 dark:text-stone-500 dark:hover:text-stone-300"
            >
              Skip for now
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
