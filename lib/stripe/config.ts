const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;
const yearlyPriceId = process.env.STRIPE_YEARLY_PRICE_ID;

if (!monthlyPriceId) {
  throw new Error("Missing STRIPE_MONTHLY_PRICE_ID environment variable");
}

if (!yearlyPriceId) {
  throw new Error("Missing STRIPE_YEARLY_PRICE_ID environment variable");
}

export const STRIPE_PRICES = {
  monthly: monthlyPriceId,
  yearly: yearlyPriceId,
} as const;
