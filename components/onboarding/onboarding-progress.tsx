"use client";

type OnboardingProgressProps = {
  step: number;
  total: number;
};

export function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  const percentage = Math.round(((step - 1) / (total - 1)) * 100);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
        <span>
          Step {step} of {total}
        </span>
        <span>{percentage}%</span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div
          className="h-full rounded-full bg-stone-950 transition-all duration-300 dark:bg-white"
          style={{ width: `${Math.max(3, percentage)}%` }}
        />
      </div>
    </div>
  );
}
