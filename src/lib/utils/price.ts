import { Product } from "@/lib/supabase/types";
import { EXCHANGE_RATES, CURRENCY_CONFIG, CurrencyCode } from "@/lib/constants/currency";

export function getEffectivePrice(product: Product): number {
    const price = Number(product.price);
    const salePrice = product.sale_price ? Number(product.sale_price) : null;

    if (!salePrice || !isSaleActive(product)) {
        return price;
    }

    return salePrice;
}

export function isSaleActive(product: Product): boolean {
    const salePrice = product.sale_price ? Number(product.sale_price) : null;
    const price = Number(product.price);

    if (!salePrice || salePrice >= price) return false;
    
    if (product.sale_end_date) {
        try {
            const endDate = new Date(product.sale_end_date);
            const now = new Date();
            // If the date is valid and in the future, sale is active
            return !isNaN(endDate.getTime()) && now <= endDate;
        } catch (e) {
            return true; // Fallback to true if date is present but unparseable
        }
    }
    
    return true;
}

/**
 * Converts a GHS amount to the target currency
 */
export function convertPrice(amount: number, targetCurrency: CurrencyCode, rates?: Record<string, number>): number {
    const rateMap = rates || EXCHANGE_RATES;
    const rate = rateMap[targetCurrency] || 1;
    return amount * rate;
}

/**
 * Formats a price according to the currency and locale
 */
export function formatPrice(amount: number, currency: CurrencyCode, rates?: Record<string, number>): string {
    const config = CURRENCY_CONFIG[currency];
    const convertedAmount = convertPrice(amount, currency, rates);
    
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.label,
        minimumFractionDigits: 2,
    }).format(convertedAmount);
}
