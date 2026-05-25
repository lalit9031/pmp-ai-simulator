/**
 * Determines if the user is likely in India based on their browser timezone.
 * Uses Intl API — no external API key required.
 */
export function isIndia(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone === "Asia/Kolkata" || timezone === "India/Calcutta" || timezone.startsWith("Asia/Calcutta");
  } catch {
    return false;
  }
}

export type PricingInfo = {
  /** Numeric price value (e.g. 199, 399, 2.49, 3.99) */
  price: number;
  /** Currency code (e.g. "INR", "USD") */
  currency: string;
  /** Currency symbol (e.g. "₹", "$") */
  symbol: string;
  /** Human-readable label (e.g. "Rs. 199", "$2.49") */
  label: string;
};

const INDIA_PRICES = {
  founder: { price: 199, currency: "INR", symbol: "₹" },
  annual: { price: 399, currency: "INR", symbol: "₹" },
} as const;

const GLOBAL_PRICES = {
  founder: { price: 2.49, currency: "USD", symbol: "$" },
  annual: { price: 3.99, currency: "USD", symbol: "$" },
} as const;

/**
 * Returns pricing info based on whether the user is in India and
 * whether the first-100 founder pricing is still available.
 */
export function getPricingInfo(founderAvailable: boolean, userInIndia: boolean): PricingInfo {
  const tier = founderAvailable ? "founder" : "annual";
  const prices = userInIndia ? INDIA_PRICES : GLOBAL_PRICES;
  const p = prices[tier];

  const label = userInIndia
    ? `Rs. ${p.price}`
    : `$${p.price.toFixed(2)}`;

  return {
    ...p,
    label,
  };
}
