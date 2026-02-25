"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { Input } from "@/components/ui/input";
import { Loader2, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
    onSelect: (address: {
        address: string;
        city: string;
        postcode: string;
    }) => void;
    defaultValue?: string;
    className?: string;
}

interface Suggestion {
    properties: {
        name?: string;
        housenumber?: string;
        street?: string;
        city?: string;
        postcode?: string;
        state?: string;
        countrycode?: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

function getFlagPath(countryCode: string) {
    if (!countryCode) return null;
    return `/flags/${countryCode.toLowerCase()}.png`;
}

export function AddressAutocomplete({ onSelect, defaultValue = "", className }: AddressAutocompleteProps) {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 3 || !isOpen) {
                setSuggestions([]);
                setHasError(false);
                return;
            }

            setIsLoading(true);
            setHasError(false);
            try {
                // Photon API (OpenStreetMap based)
                const response = await fetch(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(query + " UK")}&limit=5`
                );
                
                if (!response.ok) throw new Error("API failed");
                
                const data = await response.json();
                const features = data.features || [];
                
                // Filter to ensure we only get UK results
                const ukFeatures = features.filter((f: any) => 
                    f.properties.countrycode === "GB" || 
                    f.properties.country === "United Kingdom"
                );

                setSuggestions(ukFeatures);
                
                if (ukFeatures.length === 0 && query.length > 5) {
                    setHasError(true);
                }
            } catch (error) {
                console.error("Error fetching UK addresses:", error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    const handleSelect = (suggestion: Suggestion) => {
        const p = suggestion.properties;
        const street = p.street || "";
        const house = p.housenumber ? `${p.housenumber} ` : "";
        const landmark = p.name && p.name !== street && p.name !== p.housenumber ? `${p.name}, ` : "";
        
        // If there's no street but there is a name, use name as the street
        const finalStreet = street || p.name || "";
        const fullAddress = `${landmark}${house}${finalStreet}`.trim().replace(/,$/, "");
        
        onSelect({
            address: fullAddress,
            city: p.city || "",
            postcode: p.postcode || "",
        });

        setQuery(fullAddress);
        setIsOpen(false);
        setSuggestions([]);
        setHasError(false);
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="relative">
                <Input
                    placeholder="Start typing your address..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setHasError(false);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className={cn(
                        "rounded-none h-14 border-border/60 pl-10 transition-all",
                        hasError && "border-red-500 bg-red-50 text-red-900 focus-visible:ring-red-500"
                    )}
                />
                <Search className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    hasError ? "text-red-500" : "text-muted-foreground"
                )} />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground w-4 h-4" />
                )}
                {hasError && !isLoading && (
                    <button 
                        onClick={() => {
                            setQuery("");
                            setHasError(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                    >
                        <span className="text-xl">×</span>
                    </button>
                )}
            </div>

            {hasError && (
                <p className="text-[10px] text-red-500 mt-2 ml-1 uppercase tracking-widest font-medium">
                    Invalid address, try again or enter manually.
                </p>
            )}

            {isOpen && (suggestions.length > 0 || (isLoading && query.length >= 3)) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border/60 shadow-xl max-h-72 overflow-y-auto rounded-none">
                    {isLoading && suggestions.length === 0 ? (
                        <div className="p-6 text-[10px] text-muted-foreground text-center uppercase tracking-[0.2em] animate-pulse">
                            Searching for matches...
                        </div>
                    ) : (
                        <>
                            {suggestions.map((s, i) => {
                                const isLandmark = s.properties.name && s.properties.name !== s.properties.street && s.properties.name !== s.properties.housenumber;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSelect(s)}
                                        className="w-full text-left p-4 hover:bg-secondary/10 transition-colors border-b border-border/40 last:border-0 flex gap-4 items-start group"
                                    >
                                        <MapPin className="w-4 h-4 mt-0.5 text-[#B88E2F] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-black">
                                                {isLandmark && (
                                                    <span className="block text-[#B88E2F] text-[10px] mb-0.5 uppercase tracking-widest leading-none">
                                                        {s.properties.name}
                                                    </span>
                                                )}
                                                <span className="inline-flex items-center gap-2">
                                                    {s.properties.countrycode && (
                                                        <div className="relative w-4 h-3 shrink-0 overflow-hidden border border-border/10">
                                                            <NextImage
                                                                src={getFlagPath(s.properties.countrycode) || ""}
                                                                alt={s.properties.countrycode}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    )}
                                                    <span>
                                                        {s.properties.housenumber ? `${s.properties.housenumber} ` : ""}
                                                        {s.properties.street || s.properties.name}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                                {s.properties.city}{s.properties.postcode ? `, ${s.properties.postcode}` : ""}{s.properties.state ? `, ${s.properties.state}` : ""}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                            <div className="p-3 bg-secondary/5 border-t border-border/20 flex items-center justify-between">
                                <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Powered by OpenStreetMap</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
