export const STRIPE_TRIAL_DAYS = 3;

export const STRIPE_PLANS = {
  monthly: {
    name: "Pro Monthly",
    interval: "month",
  },
  yearly: {
    name: "Pro Yearly",
    interval: "year",
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;
