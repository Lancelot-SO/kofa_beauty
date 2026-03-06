"use client";

import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { formatPrice, formatDirectPrice } from "@/lib/utils/price";
import { CurrencyCode } from "@/lib/constants/currency";
import { useState, useEffect } from "react";

interface LocalizedPriceProps {
    amount: number;
    baseCurrency?: CurrencyCode; // Usually GHS
    ukPrice?: number | null; // Fixed UK price in GBP
    ngnPrice?: number | null; // Fixed Nigeria price in NGN
    className?: string;
    showBase?: boolean;
}

export function LocalizedPrice({ 
    amount, 
    ukPrice,
    ngnPrice,
    className = "", 
    showBase = false 
}: LocalizedPriceProps) {
    const { currency, rates } = useCurrency();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // If not mounted, render the base currency (GHS) or a placeholder to match SSR
    // This prevents hydration mismatches if server and client Intl outputs differ
    if (!isMounted) {
        return (
            <span className={className}>
                {formatPrice(amount, 'GHS')}
            </span>
        );
    }

    // Determine which price to use
    const useFixedUkPrice = currency === 'GBP' && ukPrice != null && ukPrice > 0;
    const useFixedNgnPrice = currency === 'NGN' && ngnPrice != null && ngnPrice > 0;
    const useFixedPrice = useFixedUkPrice || useFixedNgnPrice;
    const directPrice = useFixedUkPrice ? ukPrice! : (useFixedNgnPrice ? ngnPrice! : null);

    return (
        <span className={className}>
            {useFixedPrice 
                ? formatDirectPrice(directPrice!, currency)
                : formatPrice(amount, currency, rates)
            }
            {showBase && currency !== 'GHS' && !useFixedPrice && (
                <span className="ml-1 text-[0.8em] opacity-60">
                    ({formatPrice(amount, 'GHS')})
                </span>
            )}
        </span>
    );
}

