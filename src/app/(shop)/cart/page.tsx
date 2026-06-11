"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronLeft } from "lucide-react";
import { useCartStore, getCartSubtotal } from "@/lib/store/useCartStore";
import { useState, useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SHIPPING_FEE, TAX_RATE } from "@/lib/constants";
import { getEffectivePrice, getEffectivePriceForCurrency, formatPrice, formatDirectPrice } from "@/lib/utils/price";
import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { useProductStore } from "@/lib/store/useProductStore";
import { AlertCircle } from "lucide-react";

export default function CartPage() {
    const { items, updateQuantity, removeItem } = useCartStore();
    const { products, fetchProducts } = useProductStore();
    const [isMounted, setIsMounted] = useState(false);
    const { currency, rates } = useCurrency();

    const subtotal = getCartSubtotal(items);
    const shippingFee = currency === "GBP" ? 133 : SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shippingFee + tax;

    useEffect(() => {
        setIsMounted(true);
        fetchProducts();
    }, [fetchProducts]);

    const isCartValid = items.every(item => {
        const productData = products.find(p => p.id === item.product.id);
        // Use fresh data if available, otherwise fallback to store data
        const stock = productData !== undefined ? productData.stock : item.product.stock;
        const status = productData !== undefined ? productData.status : item.product.status;
        return stock >= item.quantity && status !== 'Out of Stock' && status !== 'Draft';
    });

    if (!isMounted) return null;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
                <Reveal>
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-8 mx-auto">
                        <ShoppingBag size={32} strokeWidth={1} className="text-muted-foreground" />
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl font-light mb-4 uppercase tracking-widest">Your Bag is Empty</h1>
                </Reveal>
                <Reveal delay={0.2}>
                    <p className="mb-12 text-muted-foreground font-light max-w-md mx-auto">
                        It looks like you haven't added any premium beauty essentials to your bag yet.
                    </p>
                </Reveal>
                <Reveal delay={0.3}>
                    <Link href="/shop/all">
                        <Button variant="premium-outline-dark" size="lg" className="px-16">
                            Start Shopping
                        </Button>
                    </Link>
                </Reveal>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 pt-32 pb-16 md:pt-48 md:pb-24">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-border/40 pb-8">
                    <div>
                        <Link href="/shop/all" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-black transition-colors mb-4">
                            <ChevronLeft size={12} />
                            Back to Shop
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Your Bag</h1>
                    </div>
                    <p className="text-sm font-light text-muted-foreground italic">
                        {items.reduce((acc, item) => acc + item.quantity, 0)} Items in your bag
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-20">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="space-y-10">
                            {items.map(({ product, quantity }, index) => (
                                <Reveal key={product.id} delay={index * 0.05} y={20}>
                                    <div className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-border/40 last:border-0 last:pb-0">
                                        <Link href={`/shop/product/${product.id}`} className="relative w-full sm:w-40 aspect-4/5 bg-secondary/20 overflow-hidden shrink-0 group">
                                            <Image
                                                src={product.image || "/kofa-logo.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </Link>

                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase tracking-widest text-accent font-bold">{product.category}</p>
                                                    <Link href={`/shop/product/${product.id}`} className="hover:text-accent transition-colors">
                                                        <h3 className="text-xl font-light uppercase tracking-widest">{product.name}</h3>
                                                    </Link>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm text-muted-foreground font-light">
                                                            Unit Price: {(() => {
                                                                const { price: effPrice, isLocalPrice } = getEffectivePriceForCurrency(product, currency);
                                                                return isLocalPrice ? formatDirectPrice(effPrice, currency) : formatPrice(getEffectivePrice(product), currency, rates);
                                                            })()}
                                                        </p>
                                                        {!getEffectivePriceForCurrency(product, currency).isLocalPrice && getEffectivePrice(product) < product.price && (
                                                            <span className="text-xs line-through text-muted-foreground/60">
                                                                {formatPrice(product.price, currency, rates)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-light">{(() => {
                                                        const { price: effPrice, isLocalPrice } = getEffectivePriceForCurrency(product, currency);
                                                        return isLocalPrice ? formatDirectPrice(effPrice * quantity, currency) : formatPrice(getEffectivePrice(product) * quantity, currency, rates);
                                                    })()}</p>
                                                    {(() => {
                                                        const productData = products.find(p => p.id === product.id);
                                                        const stock = productData !== undefined ? productData.stock : product.stock;
                                                        const status = productData !== undefined ? productData.status : product.status;
                                                        
                                                        if (status === 'Out of Stock' || stock === 0) {
                                                            return <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 block">Sold Out</span>;
                                                        }
                                                        if (stock < quantity) {
                                                            return <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 block">Only {stock} Left</span>;
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-8">
                                                <div className="flex items-center border border-black/10 h-10 w-28">
                                                    <button
                                                        className="flex-1 h-full hover:bg-secondary flex items-center justify-center transition-colors"
                                                        onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="flex-1 text-center text-xs font-medium">{quantity}</span>
                                                    <button
                                                        className="flex-1 h-full hover:bg-secondary flex items-center justify-center transition-colors"
                                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                <button
                                                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                                                    onClick={() => removeItem(product.id)}
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full xl:w-[400px]">
                        <Reveal>
                            <div className="bg-secondary/10 p-8 md:p-10 space-y-8 sticky top-32 border border-border/20">
                                <h2 className="text-2xl font-light uppercase tracking-widest">Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm uppercase tracking-widest text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className="text-black font-medium">{formatPrice(subtotal, currency, rates)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                                        <span>Delivery Fee {currency === "GBP" ? "" : "(Pay to Rider)"}</span>
                                        <span className="text-[#B88E2F] font-bold italic">
                                            {shippingFee > 0 ? formatPrice(shippingFee, currency, rates) : "TBD"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm uppercase tracking-widest text-muted-foreground">
                                        <span>Estimated Tax</span>
                                        <span className="text-black font-medium">{formatPrice(tax, currency, rates)}</span>
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                <div className="flex justify-between items-end">
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Estimated Total</span>
                                    <span className="text-3xl font-light">{formatPrice(total, currency, rates)}</span>
                                </div>

                                {!isCartValid && (
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 mb-6">
                                        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-red-700 uppercase tracking-widest font-bold leading-relaxed">
                                            Some items in your bag are no longer available or have insufficient stock. Please adjust your bag to continue.
                                        </p>
                                    </div>
                                )}

                                <Link href={isCartValid ? "/checkout" : "#"} className="block w-full">
                                    <Button 
                                        variant="premium-dark" 
                                        size="lg" 
                                        className="w-full gap-3 shadow-xl"
                                        disabled={!isCartValid}
                                    >
                                        {isCartValid ? "Go to Checkout" : "Insufficient Stock"}
                                        <ArrowRight size={16} />
                                    </Button>
                                </Link>

                                <div className="space-y-4 pt-4">
                                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">Premium Beauty Delivered to Your Door</p>
                                    <div className="flex justify-center gap-4 opacity-30 grayscale">
                                        {/* Icons placeholder */}
                                        <div className="w-8 h-5 bg-black/20" />
                                        <div className="w-8 h-5 bg-black/20" />
                                        <div className="w-8 h-5 bg-black/20" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
}
