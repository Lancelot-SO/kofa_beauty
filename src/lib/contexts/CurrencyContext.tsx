"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode } from '@/lib/constants/currency';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    rates: Record<string, number>;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>('GHS');
    const [rates, setRates] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCurrencyData = async () => {
            try {
                // 1. Detect Location
                const locResponse = await fetch('https://ipapi.co/json/');
                if (locResponse.ok) {
                    const data = await locResponse.json();
                    const countryCode = data.country_code;
                    
                    if (countryCode === 'GB') {
                        setCurrency('GBP');
                    } else if (countryCode === 'NG') {
                        setCurrency('NGN');
                    }
                }

                // 2. Fetch Live Rates
                const ratesResponse = await fetch('/api/currency/rates');
                if (ratesResponse.ok) {
                    const ratesData = await ratesResponse.json();
                    if (ratesData.rates) {
                        setRates(ratesData.rates);
                    }
                }
            } catch (error) {
                console.error('Error loading currency data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCurrencyData();
    }, []);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
