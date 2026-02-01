"use client";

import { useCartStore, getCartSubtotal } from "@/lib/store/useCartStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronLeft, Lock, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOrderStore } from "@/lib/store/useOrderStore";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/supabase/types";
import { SHIPPING_FEE, TAX_RATE } from "@/lib/constants";
import dynamic from "next/dynamic";

const PaymentStep = dynamic(() => import("@/components/checkout/PaymentStep"), { ssr: false });

const PaystackButton = dynamic(() => import("@/components/checkout/PaystackButton"), { ssr: false });

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const subtotal = getCartSubtotal(items);
    const { addOrder } = useOrderStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [isProcessing, setIsProcessing] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const router = useRouter();

    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_FEE + tax;

    // Form State
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        postcode: "",
        phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setIsMounted(true);
        
        // Fetch current user profile if logged in
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profileData) {
                    setProfile(profileData);
                    setFormData(prev => ({
                        ...prev,
                        email: profileData.email || "",
                        firstName: profileData.first_name || "",
                        lastName: profileData.last_name || "",
                    }));
                }
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 3 && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (step === 3 && countdown === 0) {
            router.push("/");
        }
        return () => clearTimeout(timer);
    }, [step, countdown, router]);

    if (!isMounted) return null;

    if (items.length === 0 && step !== 3) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-light mb-4 text-center uppercase tracking-widest">Your Bag is Empty</h1>
                <Link href="/shop/all">
                    <Button variant="premium-outline-dark" size="sm">Return to Shop</Button>
                </Link>
            </div>
        );
    }

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(prev => prev + 1);
    };

    const handlePaymentSuccess = () => {
        setStep(3);
    };

    const handlePaymentClose = () => {
        toast.info("Payment cancelled");
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center py-20">
                <div className="container mx-auto px-4 max-w-2xl text-center space-y-8">
                    <Reveal>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em]">Thank You</h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-muted-foreground font-light text-lg">
                            Your order has been placed successfully. We'll send you a confirmation email shortly.
                        </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                        <div className="py-8 border-y border-border/40">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Order Confirmed</p>
                            <p className="text-lg font-bold italic">Processing Your Items</p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.4}>
                        <div className="space-y-6 pt-4">
                            <Link href="/">
                                <Button variant="premium-dark" size="lg" className="px-12 w-full sm:w-auto">
                                    Return to Homepage
                                </Button>
                            </Link>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                                Redirecting to home in {countdown} seconds...
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12 md:py-20 lg:px-20 xl:px-32">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Checkout Form */}
                    <div className="flex-1">
                        <Reveal>
                            <div className="mb-12">
                                <Link href="/cart" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-black transition-colors mb-6">
                                    <ChevronLeft size={12} />
                                    Back to Bag
                                </Link>
                                <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest">Checkout</h1>
                            </div>
                        </Reveal>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black font-bold' : 'text-muted-foreground'}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-black text-white' : 'bg-secondary'}`}>1</span>
                                <span className="text-[10px] uppercase tracking-widest">Information</span>
                            </div>
                            <div className="h-[1px] w-8 bg-border" />
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black font-bold' : 'text-muted-foreground'}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-black text-white' : 'bg-secondary'}`}>2</span>
                                <span className="text-[10px] uppercase tracking-widest">Shipping & Payment</span>
                            </div>
                        </div>

                        {step === 1 && (
                            <form onSubmit={handleNextStep} className="space-y-12">
                                <Reveal delay={0.1}>
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Contact Information</h2>
                                            <Input 
                                                name="email"
                                                type="email"
                                                placeholder="Email Address" 
                                                className="rounded-none h-14 border-border/60 focus:ring-0 focus:border-black" 
                                                required 
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Shipping Address</h2>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input 
                                                    name="firstName"
                                                    placeholder="First Name" 
                                                    className="rounded-none h-14 border-border/60" 
                                                    required 
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                />
                                                <Input 
                                                    name="lastName"
                                                    placeholder="Last Name" 
                                                    className="rounded-none h-14 border-border/60" 
                                                    required 
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <Input 
                                                name="address"
                                                placeholder="Address" 
                                                className="rounded-none h-14 border-border/60" 
                                                required 
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            <Input 
                                                name="apartment"
                                                placeholder="Apartment, suite, etc. (optional)" 
                                                className="rounded-none h-14 border-border/60" 
                                                value={formData.apartment}
                                                onChange={handleInputChange}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input 
                                                    name="city"
                                                    placeholder="City" 
                                                    className="rounded-none h-14 border-border/60" 
                                                    required 
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                />
                                                <Input 
                                                    name="postcode"
                                                    placeholder="Postcode" 
                                                    className="rounded-none h-14 border-border/60" 
                                                    required 
                                                    value={formData.postcode}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <Input 
                                                name="phone"
                                                placeholder="Phone Number" 
                                                className="rounded-none h-14 border-border/60" 
                                                required 
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <Button type="submit" variant="premium-dark" size="lg" className="w-full gap-3">
                                            Continue to Shipping
                                            <ArrowRight size={16} />
                                        </Button>
                                    </div>
                                </Reveal>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-12">
                                <Reveal delay={0.1}>
                                    <div className="space-y-10">
                                        <div className="p-6 border border-border/60 space-y-4 rounded-none">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground uppercase tracking-widest">Contact</span>
                                                <span className="font-medium text-black">{formData.email}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground uppercase tracking-widest">Ship to</span>
                                                <span className="font-medium text-black">
                                                    {formData.address}, {formData.city}, {formData.postcode}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Shipping Method</h2>
                                            <div className="p-4 border border-black flex justify-between items-center bg-secondary/10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-4 h-4 rounded-full border-4 border-black" />
                                                    <div className="text-xs uppercase tracking-widest">Standard Shipping</div>
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-[#B88E2F]">GH₵{SHIPPING_FEE.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Payment</h2>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest">
                                                    <Lock size={10} />
                                                    Secure Payment
                                                </div>
                                            </div>
                                            <div className="p-6 border border-border/60 rounded-none bg-secondary/5 text-center space-y-4">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                    Payment is processed securely by Paystack
                                                </p>
                                                <div className="flex justify-center gap-4 opacity-50 grayscale">
                                                    {/* Payment Logos can go here */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {isProcessing ? (
                                                <Button disabled variant="premium-dark" size="lg" className="w-full gap-3">
                                                    <Loader2 className="animate-spin" size={16} />
                                                    Processing...
                                                </Button>
                                            ) : (
                                                <PaymentStep 
                                                    formData={formData}
                                                    total={total}
                                                    subtotal={subtotal}
                                                    items={items}
                                                    profileId={profile?.id || null}
                                                    onSuccess={handlePaymentSuccess}
                                                />
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => setStep(1)} 
                                                className="text-[10px] uppercase tracking-widest"
                                            >
                                                Back to Information
                                            </Button>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[450px]">
                        <Reveal delay={0.2}>
                            <div className="bg-secondary/10 p-8 lg:p-10 sticky top-32 border border-border/20">
                                <h2 className="text-2xl font-light uppercase tracking-widest mb-10">Your Order</h2>

                                <div className="space-y-8 mb-8 max-h-[400px] overflow-y-auto pr-2">
                                    {items.map(({ product, quantity }) => (
                                        <div key={product.id} className="flex gap-4">
                                            <div className="relative w-20 h-24 bg-secondary/20 flex-shrink-0">
                                                <Image src={product.image || "/kofa-logo.png"} alt={product.name} fill className="object-cover" />
                                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                                    {quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-1">{product.name}</h4>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.category}</p>
                                                <p className="text-xs mt-1 font-medium italic">GH₵{product.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="mb-8 bg-border/40" />

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className="text-black font-medium">GH₵{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                                        <span>Shipping</span>
                                        <span className="text-[#B88E2F] font-bold">GH₵{SHIPPING_FEE.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                                        <span>Tax</span>
                                        <span className="text-black font-medium">GH₵{tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Separator className="mb-8 bg-border/40" />

                                <div className="flex justify-between items-end">
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Total</span>
                                    <div className="text-right">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">GHS</span>
                                        <span className="text-3xl font-light">GH₵{total.toFixed(2)}</span>
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
