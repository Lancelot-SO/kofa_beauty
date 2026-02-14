"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useProductStore } from "@/lib/store/useProductStore";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, SlidersHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function CategoryPage() {
    const params = useParams();
    const category = params?.category as string;
    const { products, fetchProducts, isLoading } = useProductStore();
    const [isMounted, setIsMounted] = useState(false);
    const [sortBy, setSortBy] = useState("featured");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, 300);
    const productsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        fetchProducts();
    }, [fetchProducts]);

    const getTitle = (cat: string) => {
        if (!cat || cat === "all") return "The Collection";
        if (cat === "best-sellers") return "Best Sellers";
        return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            // Category filter
            let matchesCategory = false;
            if (category === "all") matchesCategory = true;
            else if (category === "best-sellers") matchesCategory = product.stock < 10;
            else matchesCategory = product.category?.toLowerCase() === category?.toLowerCase();

            // Search filter
            if (!matchesCategory) return false;
            if (!debouncedQuery) return true;

            const query = debouncedQuery.toLowerCase();
            return (
                (product.name || "").toLowerCase().includes(query) ||
                (product.description || "").toLowerCase().includes(query) ||
                (product.category || "").toLowerCase().includes(query)
            );
        });

        if (sortBy === "price-low-high") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high-low") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortBy === "newest") {
            result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return result;
    }, [products, category, sortBy, debouncedQuery]);

    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay */}
                    <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[2s] hover:scale-105"
                        style={{ backgroundImage: 'url(/hero-image.jpeg)' }}
                    />
                </div>

                <div className="container relative z-20 px-4 text-center">
                    <nav className="flex justify-center items-center gap-3 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/80 mb-8">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-white font-semibold">{category === 'all' ? 'Shop' : getTitle(category)}</span>
                    </nav>

                    <Reveal>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 tracking-widest uppercase">
                            {getTitle(category)}
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p className="text-base md:text-lg text-white/90 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                            Discover our curated range of premium beauty essentials. <br className="hidden md:block"/>
                            Crafted to celebrate your natural radiance.
                        </p>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <button 
                            onClick={scrollToProducts}
                            className="bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                        >
                            View Products
                        </button>
                    </Reveal>
                </div>
            </div>

            {/* Product Grid Section */}
            <div ref={productsRef} className="container mx-auto px-4 py-24">
                {/* Filters and Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 pb-6 border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <Button variant="premium-outline-dark" size="sm" className="gap-2">
                            <SlidersHorizontal size={14} />
                            Filters
                        </Button>
                        
                        {/* Search Input */}
                        <div className="relative w-full md:w-64">
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-xs uppercase tracking-widest border-black/10 focus-visible:ring-black rounded-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                        </div>

                        <p className="text-xs text-muted-foreground uppercase tracking-widest hidden md:block">
                            {filteredProducts.length} Products
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">Sort By:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px] border-none shadow-none text-xs uppercase tracking-widest font-medium focus:ring-0">
                                <SelectValue placeholder="Featured" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-black/10">
                                <SelectItem value="featured" className="text-xs uppercase tracking-widest">Featured</SelectItem>
                                <SelectItem value="newest" className="text-xs uppercase tracking-widest">Newest</SelectItem>
                                <SelectItem value="price-low-high" className="text-xs uppercase tracking-widest">Price: Low to High</SelectItem>
                                <SelectItem value="price-high-low" className="text-xs uppercase tracking-widest">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-lg font-light text-muted-foreground uppercase tracking-widest">No products found in this category.</p>
                        <Link href="/shop/all">
                            <button className="mt-6 text-xs uppercase tracking-[0.2em] font-bold border-b-2 border-black pb-1 hover:text-accent transition-colors">
                                View All Products
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {filteredProducts.map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.05} y={30}>
                                <ProductCard product={product} />
                            </Reveal>
                        ))}
                    </div>
                )}
                
                <div className="flex justify-center pt-24 mt-12 border-t border-border/20">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">End of Collection</p>
                </div>
            </div>
        </div>
    );
}
