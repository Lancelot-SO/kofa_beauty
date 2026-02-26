"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries: ("places")[] = ["places"];

interface AddressAutocompleteProps {
    onSelect: (address: {
        address: string;
        city: string;
        postcode: string;
    }) => void;
    defaultValue?: string;
    className?: string;
    controlledQuery?: string;
    countryCode?: string; // e.g. 'GB', 'NG'
}

interface Suggestion {
    id: string;
    description: string;
    mainText: string;
    secondaryText: string;
    source: 'google-places' | 'google-geocoding' | 'postcodes-io';
}

export function AddressAutocomplete({ onSelect, defaultValue = "", className, controlledQuery, countryCode = "GB" }: AddressAutocompleteProps) {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const geocoder = useRef<google.maps.Geocoder | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);

    // Update query when controlledQuery changes
    useEffect(() => {
        if (controlledQuery) {
            setQuery(controlledQuery);
            setIsOpen(true);
        }
    }, [controlledQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const ukPostcodeRegex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;

    useEffect(() => {
        const timer = setTimeout(async () => {
            const trimmedQuery = query.trim();
            if (trimmedQuery.length < 3 || !isOpen) {
                setSuggestions([]);
                setHasError(false);
                setDebugInfo(null);
                return;
            }

            setIsLoading(true);
            setHasError(false);
            setDebugInfo(null);

            if (loadError) {
                setDebugInfo(`Google Maps Load Error: ${loadError.message}`);
            }

            const isUK = countryCode.toUpperCase() === 'GB';
            const isPostcode = isUK && ukPostcodeRegex.test(trimmedQuery);

            if (isPostcode) {
                // Priority 1: postcodes.io for instant UK validation
                try {
                    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(trimmedQuery)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.result) {
                            const { postcode, admin_district, region } = data.result;
                            const items: Suggestion[] = [{
                                id: `pcio-${postcode}`,
                                description: `${postcode}, ${admin_district}, ${region || 'UK'}`,
                                mainText: postcode,
                                secondaryText: `${admin_district}, ${region || 'UK'}`,
                                source: 'postcodes-io'
                            }];

                            if (isLoaded && window.google) {
                                if (!geocoder.current) geocoder.current = new window.google.maps.Geocoder();
                                geocoder.current.geocode(
                                    { address: trimmedQuery, componentRestrictions: { country: 'GB' } },
                                    (results, status) => {
                                        if (status === 'OK' && results && results[0]) {
                                            const gResult = results[0];
                                            items.push({
                                                id: `ggeo-${gResult.place_id}`,
                                                description: gResult.formatted_address,
                                                mainText: trimmedQuery,
                                                secondaryText: gResult.formatted_address.replace(trimmedQuery, '').trim().replace(/^,/, '').trim(),
                                                source: 'google-geocoding'
                                            });
                                        } else if (status === 'REQUEST_DENIED' || status === 'OVER_QUERY_LIMIT') {
                                            setDebugInfo(`Geocoding failed: ${status}. Check API activation.`);
                                        }
                                        setSuggestions(items);
                                        setIsLoading(false);
                                    }
                                );
                                return;
                            }
                            setSuggestions(items);
                            setIsLoading(false);
                            return;
                        }
                    }
                } catch (err) {
                    console.error("postcodes.io failed:", err);
                }
            }

            // Priority 2: Google Places Autocomplete for street addresses
            if (isLoaded && GOOGLE_MAPS_API_KEY && window.google) {
                if (!autocompleteService.current) {
                    autocompleteService.current = new window.google.maps.places.AutocompleteService();
                }

                autocompleteService.current.getPlacePredictions(
                    {
                        input: query,
                        componentRestrictions: { country: countryCode.toLowerCase() },
                        types: ["address"]
                    },
                    (predictions, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                            setSuggestions(predictions.map(p => ({
                                id: p.place_id,
                                description: p.description,
                                mainText: p.structured_formatting.main_text,
                                secondaryText: p.structured_formatting.secondary_text,
                                source: 'google-places'
                            })));
                        } else {
                            if (status !== 'ZERO_RESULTS') {
                                setDebugInfo(`Places API Status (${countryCode}): ${status}`);
                            }
                            if (!isPostcode && status === 'ZERO_RESULTS') setHasError(true);
                        }
                        setIsLoading(false);
                    }
                );
            } else {
                setIsLoading(false);
                if (!isLoaded && GOOGLE_MAPS_API_KEY) {
                    setDebugInfo("Google Maps is still loading...");
                } else if (!GOOGLE_MAPS_API_KEY) {
                    setDebugInfo("Google Maps API Key missing in .env.local");
                }
                if (!isPostcode) setHasError(true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, isOpen, isLoaded, loadError, countryCode]);

    const handleSelect = async (suggestion: Suggestion) => {
        if (suggestion.source === 'google-places' || suggestion.source === 'google-geocoding') {
            if (isLoaded && window.google) {
                const div = document.createElement('div');
                if (!placesService.current) {
                    placesService.current = new window.google.maps.places.PlacesService(div);
                }

                placesService.current.getDetails(
                    { placeId: suggestion.id.replace('ggeo-', ''), fields: ["address_components", "formatted_address"] },
                    (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                            const components = place.address_components || [];
                            let streetNumber = "";
                            let route = "";
                            let town = "";
                            let city = "";
                            let postcode = "";

                            components.forEach(c => {
                                if (c.types.includes("street_number")) streetNumber = c.long_name;
                                if (c.types.includes("route")) route = c.long_name;
                                if (c.types.includes("postal_town")) town = c.long_name;
                                if (c.types.includes("locality")) city = c.long_name;
                                if (c.types.includes("postal_code")) postcode = c.long_name;
                            });

                            const finalCity = town || city || "";
                            const fullStreet = `${streetNumber} ${route}`.trim();
                            
                            onSelect({
                                address: fullStreet || place.formatted_address || suggestion.description,
                                city: finalCity,
                                postcode: postcode || "",
                            });
                            setQuery(fullStreet || place.formatted_address || suggestion.description);
                        } else {
                            setDebugInfo(`Place Details Error: ${status}`);
                        }
                    }
                );
            }
        } else if (suggestion.source === 'postcodes-io') {
            onSelect({
                address: "",
                city: suggestion.secondaryText.split(',')[0].trim(),
                postcode: suggestion.mainText,
            });
            setQuery(suggestion.mainText);
        }

        setIsOpen(false);
        setSuggestions([]);
        setHasError(false);
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="relative">
                <Input
                    placeholder="Enter postcode or street address..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setHasError(false);
                        setDebugInfo(null);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className={cn(
                        "rounded-none h-14 border-border/60 pl-10 transition-all focus:border-[#B88E2F] focus:ring-0 shadow-sm",
                        (hasError || debugInfo) && "border-red-500 bg-red-50 text-red-900 focus-visible:ring-red-500"
                    )}
                />
                <Search className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    (hasError || debugInfo) ? "text-red-500" : "text-muted-foreground"
                )} />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#B88E2F] w-4 h-4" />
                )}
            </div>

            {hasError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <p className="text-[10px] text-red-600 uppercase tracking-widest font-bold">
                        No matching UK addresses found.
                    </p>
                    <p className="text-[9px] text-red-500 mt-1">
                        Try typing more, double-check your postcode, or enter the address manually below.
                    </p>
                </div>
            )}

            {debugInfo && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 text-[9px] text-yellow-800 font-mono">
                    ⚠️ Debug: {debugInfo}
                </div>
            )}

            {isOpen && (suggestions.length > 0 || (isLoading && query.length >= 3)) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border/60 shadow-2xl max-h-80 overflow-y-auto rounded-none border-t-0 animate-in fade-in zoom-in-95">
                    {isLoading && suggestions.length === 0 ? (
                        <div className="p-8 text-[10px] text-muted-foreground text-center uppercase tracking-[0.3em] animate-pulse">
                            Searching UK Registry...
                        </div>
                    ) : (
                        <>
                            <div className="p-2 bg-secondary/5 border-b border-border/20 flex items-center">
                                <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground font-semibold px-2">Suggestions</span>
                            </div>
                            {suggestions.map((s, i) => (
                                <button
                                    key={`${s.source}-${s.id}-${i}`}
                                    type="button"
                                    onClick={() => handleSelect(s)}
                                    className="w-full text-left p-4 hover:bg-secondary/10 transition-colors border-b border-border/40 last:border-0 flex gap-4 items-start group"
                                >
                                    <MapPin className={cn(
                                        "w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform",
                                        s.source.includes('google') ? "text-[#B88E2F]" : "text-blue-500"
                                    )} />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-black group-hover:text-[#B88E2F] transition-colors">
                                            {s.mainText}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                            {s.secondaryText}
                                        </div>
                                    </div>
                                    <div className="self-center">
                                        <span className="text-[7px] text-muted-foreground opacity-40 uppercase tracking-tighter border border-border/50 px-1 rounded-sm">
                                            {s.source.split('-')[0]}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
