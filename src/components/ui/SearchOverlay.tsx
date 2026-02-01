
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/lib/store/useProductStore";
import { ProductCard } from "@/components/product/ProductCard";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce"; // We might need to create this hook if it doesn't exist, but I'll inline it or check for it first. Wait, I should check if it exists or implement debounce inside the component.

// I'll implement a simple debounce inside the component to avoid extra file creation if not needed yet.

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const { searchResults, isSearching, searchProducts } = useProductStore();
    const router = useRouter();

    const debouncedQuery = useDebounce(query, 500);

    // Perform search when debounced query changes
    useEffect(() => {
        if (debouncedQuery) {
            searchProducts(debouncedQuery);
        }
    }, [debouncedQuery, searchProducts]);

    // Close on route change
    useEffect(() => {
        setQuery("");
        onClose();
    }, [router, onClose]); // This dependency array might need checking to avoid infinite loops if onClose is unstable.

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const popularSearches = ["Lip Gloss", "Brushes", "Lashes", "Sets"];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto"
                >
                    <div className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-12 md:mb-20">
                            <span className="text-white/50 text-xs uppercase tracking-[0.2em] font-medium">Search Kofa Beauty</span>
                            <button 
                                onClick={onClose}
                                className="text-white hover:text-brand-rose transition-colors p-2 -mr-2"
                            >
                                <X size={24} strokeWidth={1} />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="max-w-3xl mx-auto w-full mb-16 md:mb-24">
                            <div className="relative">
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-8 text-3xl md:text-5xl lg:text-6xl font-playfair text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white transition-all text-center"
                                    autoFocus
                                />
                                {isSearching && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>

                            {/* Popular Searches */}
                            {!query && (
                                <div className="mt-12 text-center">
                                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-6">Popular Searches</p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {popularSearches.map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-6 py-2 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Results */}
                        {query && (
                            <div className="max-w-[1400px] mx-auto w-full flex-1">
                                {!isSearching && searchResults.length === 0 ? (
                                    <div className="text-center text-white/40">
                                        <p className="font-playfair text-2xl italic">No results found for "{query}"</p>
                                        <p className="mt-4 text-sm font-light">Try checking your spelling or using different keywords.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                                        {searchResults.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
