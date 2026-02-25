"use client";

import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WishlistPage() {
    const { items, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleAddAllToCart = () => {
        items.forEach(item => addItem(item));
        toast.success(`Added ${items.length} items to cart`);
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Your Wishlist</h1>
                        <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px]">
                            {items.length === 0 ? "Saved items will appear here" : `${items.length} items saved for later`}
                        </p>
                    </div>
                    
                    {items.length > 0 && (
                        <div className="flex gap-4">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddAllToCart}
                                className="rounded-none border-black hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[10px] h-12 px-8"
                            >
                                Add All to Cart
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearWishlist}
                                className="text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-widest text-[10px]"
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                            <Heart size={32} className="text-muted-foreground opacity-30" />
                        </div>
                        <h2 className="text-2xl font-light mb-4 text-slate-800">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                            Discover our collection and save your favorite beauty essentials for later.
                        </p>
                        <Link href="/shop/all">
                            <Button variant="premium-dark" size="lg" className="rounded-none group h-14 px-10 gap-3">
                                Start Shopping
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
