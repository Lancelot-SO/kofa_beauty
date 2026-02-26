"use client";

import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { formatPrice } from "@/lib/utils/price";
import { CurrencyCode } from "@/lib/constants/currency";
import { useState, useEffect } from "react";

interface LocalizedPriceProps {
    amount: number;
    baseCurrency?: CurrencyCode; // Usually GHS
    className?: string;
    showBase?: boolean;
}

export function LocalizedPrice({ 
    amount, 
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

    return (
        <span className={className}>
            {formatPrice(amount, currency, rates)}
            {showBase && currency !== 'GHS' && (
                <span className="ml-1 text-[0.8em] opacity-60">
                    ({formatPrice(amount, 'GHS')})
                </span>
            )}
        </span>
    );
}
