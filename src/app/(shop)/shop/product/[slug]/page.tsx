"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useProductStore } from "@/lib/store/useProductStore";
import { useCartStore } from "@/lib/store/useCartStore";
import {
    Minus,
    Plus,
    Heart,
    Truck,
    Clock,
    Box,
    ChevronDown,
    Percent
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { isSaleActive } from "@/lib/utils/price";

// --- Components ---

function SaleTimer({ endDate }: { endDate: string }) {
    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(endDate) - +new Date();
            let timeLeft = null;

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mb-6 font-medium">
            <Clock size={16} className="text-red-500" />
            <span>
                Sale ends in: <span className="font-bold">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
            </span>
        </div>
    );
}



function AccordionItem({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
    return (
        <div className="border-b border-slate-100">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full py-5 text-left group"
            >
                <span className="font-semibold text-slate-900 text-lg group-hover:text-black/70 transition-colors">{title}</span>
                <ChevronDown
                    className={cn("transition-transform duration-300 text-slate-400", isOpen && "rotate-180")}
                    size={20}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-slate-600 leading-relaxed text-sm">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.slug as string;
    const { products, fetchProducts, isLoading } = useProductStore();
    const { addItem } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    // Accordion states
    const [openSection, setOpenSection] = useState<string | null>("description");

    useEffect(() => {
        setIsMounted(true);
        fetchProducts();
    }, [fetchProducts]);

    const product = products.find(p => p.id === productId);

    useEffect(() => {
        if (isMounted && !isLoading && !product && products.length > 0) {
            router.push('/shop/all');
        }
    }, [product, products, isLoading, isMounted, router]);

    if (!isMounted || isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!product) return null;

    const mainImage = product.image || "/kofa-logo.png";

    const handleAddToCart = () => {
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const displayImages = product.images && product.images.length > 0 
        ? product.images 
        : [product.image || "/kofa-logo.png"];

    const activeImageUrl = displayImages[activeImage] || displayImages[0];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 pt-32 pb-8 lg:pt-40 lg:pb-12 max-w-7xl">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* LEFT COLUMN: Images */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <Reveal>
                            <div className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                                <Image
                                    src={activeImageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {product.status === 'Out of Stock' || product.stock === 0 ? (
                                    <div className="absolute top-4 left-4 bg-black text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                                        Sold Out
                                    </div>
                                ) : product.status === 'Draft' ? (
                                     <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                                        Draft
                                    </div>
                                ) : isSaleActive(product) ? (
                                    <div className="absolute top-4 left-4 bg-white border border-slate-900 text-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                                       {Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100)}% OFF
                                   </div>
                                ) : null}
                            </div>
                        </Reveal>

                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <Reveal delay={0.1}>
                                <div className="grid grid-cols-4 gap-4">
                                    {displayImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={cn(
                                                "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                                                activeImage === i 
                                                    ? "border-black ring-2 ring-black/5" 
                                                    : "border-transparent hover:border-slate-200"
                                            )}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${i}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </Reveal>
                        )}
                    </div>


                        {/* RIGHT COLUMN: Details */}
                    <div className="pt-4 lg:pt-8 space-y-8">
                        <Reveal delay={0.2}>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        {product.category}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium tracking-wider">
                                        SKU: {product.sku || 'N/A'}
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3">
                                    {isSaleActive(product) ? (
                                        <>
                                            <p className="text-2xl font-semibold text-slate-900">GH₵{Number(product.sale_price).toFixed(2)}</p>
                                            <p className="text-lg text-slate-400 line-through">GH₵{Number(product.price).toFixed(2)}</p>
                                        </>
                                    ) : (
                                        <p className="text-2xl font-semibold text-slate-900">GH₵{Number(product.price).toFixed(2)}</p>
                                    )}
                                </div>
                            </div>
                        </Reveal>


                        <Reveal delay={0.3}>
                            {isSaleActive(product) && product.sale_end_date && (
                                <SaleTimer endDate={product.sale_end_date} />
                            )}
                            
                            <div className="space-y-6">
                                {/* Color Selector (if present) */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-sm font-medium text-slate-700">Select Color</label>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.colors.map((color) => (
                                                <button 
                                                    key={color}
                                                    // Add selection logic here if we tracked selected variant
                                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all bg-white text-slate-900 border-slate-200 hover:border-slate-900`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            className="w-3 h-3 rounded-full border border-slate-200" 
                                                            style={{ backgroundColor: color.match(/^#[0-9A-Fa-f]{6}$/) ? color : 'transparent' }} // Simple logic to show color if hex
                                                        />
                                                        {color}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Info details like Weight */}
                                {product.weight && (
                                     <div className="text-sm text-slate-500">
                                        Weight: {product.weight}kg
                                     </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className={cn(
                                            "flex-1 h-14 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
                                            isAdded ? "bg-green-600 hover:bg-green-700 text-white" : "bg-black hover:bg-slate-800 text-white"
                                        )}
                                    >
                                        {isAdded ? 'Added to Bag' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                    </Button>
                                    <button className="h-14 w-14 flex items-center justify-center rounded-full border border-slate-200 text-slate-900 hover:border-black hover:bg-slate-50 transition-all">
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.4}>
                            <div className="pt-8 space-y-2">
                                <AccordionItem 
                                    title="Description & Ingredients" 
                                    isOpen={openSection === 'description'} 
                                    onToggle={() => toggleSection('description')}
                                >
                                    <p className="mb-4">{product.description || "No description available."}</p>
                                </AccordionItem>

                                <AccordionItem 
                                    title="Shipping & Returns" 
                                    isOpen={openSection === 'shipping'} 
                                    onToggle={() => toggleSection('shipping')}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-50 rounded-full">
                                                <Percent size={16} className="text-slate-900" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Discount</p>
                                                <p className="text-xs text-slate-500">First time customers get 10% off</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-50 rounded-full">
                                                <Box size={16} className="text-slate-900" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Package</p>
                                                <p className="text-xs text-slate-500">Premium Eco-Friendly Box</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-50 rounded-full">
                                                <Truck size={16} className="text-slate-900" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Delivery</p>
                                                <p className="text-xs text-slate-500">3-4 Working Days</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItem>
                            </div>
                        </Reveal>

                    </div>
                </div>
            </div>
        </div>
    );
}
