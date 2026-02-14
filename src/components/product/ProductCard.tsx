"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/store/useProductStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { useState } from "react";
import { ShoppingCart, Eye, ArrowUpRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { isSaleActive } from "@/lib/utils/price";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.stock === 0) return;

        addItem(product);
        setIsAdded(true);
        toast.success(`Added ${product.name} to cart`);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Diagnostic log for development
    if (product.sale_price) {
        console.log(`Product "${product.name}" sale info:`, {
            price: product.price,
            sale_price: product.sale_price,
            isSaleActive: isSaleActive(product),
            sale_end_date: product.sale_end_date
        });
    }

    return (
        <motion.div
            className="group relative bg-[#EBE5D9] p-2.5 rounded-[32px] transition-transform hover:-translate-y-1 duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {/* Top Left Arrow Trigger - Swapped position */}
            <Link 
                href={`/shop/product/${product.id}`}
                className="absolute top-5 left-5 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-900 transition-transform group-hover:scale-110 hover:bg-slate-50"
            >
                 <ArrowUpRight size={16} />
            </Link>

            {/* Inner White Card */}
            <div className="bg-white rounded-[24px] p-4 flex flex-col h-full relative overflow-hidden">
                
                {/* Status Badges - Top Right for Promo */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                    {product.stock === 0 ? (
                        <span className="bg-slate-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md">
                            Sold Out
                        </span>
                    ) : isSaleActive(product) ? (
                        <div className="bg-white border border-slate-900 text-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-sm">
                            {Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100)}% OFF
                        </div>
                    ) : null}
                </div>

                {/* Product Image */}
                <Link href={`/shop/product/${product.id}`} className="block relative w-full aspect-square mb-6 rounded-2xl overflow-hidden">
                    <Image
                        src={product.image || "/kofa-logo.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                </Link>

                {/* Icons: Cart & Eye (Replaces rating) */}
                <div className="flex justify-center items-center gap-4 mb-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center text-slate-400 transition-colors",
                            isAdded ? "text-green-600" : "hover:text-slate-900",
                            product.stock === 0 && "opacity-50 cursor-not-allowed hover:text-slate-400"
                        )}
                        title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    >
                        {isAdded ? (
                            <Check size={18} />
                        ) : (
                            <ShoppingCart size={18} fill={isAdded ? "currentColor" : "none"} />
                        )}
                    </button>
                    
                    <Link
                        href={`/shop/product/${product.id}`}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                        title="View Details"
                    >
                         <Eye size={18} />
                    </Link>
                </div>

                {/* Info */}
                <div className="text-center mt-auto">
                    <Link href={`/shop/product/${product.id}`}>
                        <h3 className="text-lg font-serif font-semibold text-[#8B7355] mb-1 group-hover:text-[#6d5a43] transition-colors line-clamp-1">
                            {product.name || "Unnamed Product"}
                        </h3>
                    </Link>
                    <p className="flex items-center justify-center gap-4 font-medium">
                        {isSaleActive(product) ? (
                            <>
                                <span className="line-through text-slate-400 text-sm">
                                     GH₵{Number(product.price).toFixed(2)}
                                </span>
                                <span className="text-slate-900 font-bold">
                                     GH₵{Number(product.sale_price).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-slate-900">
                                GH₵{Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
