export const EXCHANGE_RATES = {
    GHS: 1,      // Base currency
    GBP: 0.051,  // 1 GHS to GBP (Approximate, will update)
    NGN: 104.5,   // 1 GHS to NGN (Approximate, will update)
};

export type CurrencyCode = keyof typeof EXCHANGE_RATES;

export const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string, label: string, locale: string }> = {
    GHS: { symbol: "GH₵", label: "GHS", locale: "en-GH" },
    GBP: { symbol: "£", label: "GBP", locale: "en-GB" },
    NGN: { symbol: "₦", label: "NGN", locale: "en-NG" },
};
