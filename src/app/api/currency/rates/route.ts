import { NextResponse } from 'next/server';

const API_KEY = process.env.EXCHANGERATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/GHS`;

// Simple in-memory cache for rates
let cachedRates: any = null;
let lastFetched: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
    try {
        const now = Date.now();

        // Return cached rates if valid
        if (cachedRates && (now - lastFetched < CACHE_DURATION)) {
            return NextResponse.json({ rates: cachedRates, source: 'cache' });
        }

        if (!API_KEY) {
            console.error('EXCHANGERATE_API_KEY is not defined in environment variables');
            return NextResponse.json(
                { error: 'API Key not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch rates: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.result === 'success') {
            cachedRates = data.conversion_rates;
            lastFetched = now;
            return NextResponse.json({ rates: cachedRates, source: 'network' });
        } else {
            throw new Error(data['error-type'] || 'Unknown API error');
        }

    } catch (error: any) {
        console.error('Currency API Error:', error.message);
        return NextResponse.json(
            { error: 'Failed to fetch currency rates' },
            { status: 500 }
        );
    }
}
