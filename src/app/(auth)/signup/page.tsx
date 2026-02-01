"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronLeft, ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        } else {
            toast.success("Account created! Check your email to confirm your account.");
            router.push("/login?message=check-email");
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white primary-copy">
            {/* Left Side: Form Area */}
            <div className="w-full md:w-[45%] lg:w-[40%] p-8 md:p-12 lg:p-20 flex flex-col justify-center relative">
                <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-black transition-colors group">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Selection
                </Link>

                <div className="max-w-md w-full mx-auto space-y-12">
                    <Reveal>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-light uppercase tracking-widest leading-tight">Create <br />Account</h1>
                            <p className="text-muted-foreground font-light text-sm">Join the Kofa Beauty collective and unlock exclusive member benefits, early access, and rewards.</p>
                        </div>
                    </Reveal>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Reveal delay={0.1}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest font-bold ml-4">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Zoe"
                                            className="rounded-full h-14 px-6 border-black/10 focus-visible:ring-0 focus-visible:border-black transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest font-bold ml-4">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Kravitz"
                                            className="rounded-full h-14 px-6 border-black/10 focus-visible:ring-0 focus-visible:border-black transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold ml-4">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="rounded-full h-14 px-6 border-black/10 focus-visible:ring-0 focus-visible:border-black transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold ml-4">Create Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="rounded-full h-14 px-6 border-black/10 focus-visible:ring-0 focus-visible:border-black transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="premium-dark"
                                size="lg"
                                className="w-full gap-3 active:scale-[0.98]"
                            >
                                {isLoading ? "Creating Account..." : "Join Now"}
                                {!isLoading && <ArrowRight size={16} />}
                            </Button>
                        </Reveal>
                    </form>

                    <Reveal delay={0.3}>
                        <div className="space-y-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-black/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-medium">
                                    <span className="bg-white px-4 text-muted-foreground">Or join with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={handleGoogleSignUp}
                                disabled={isLoading}
                                variant="premium-outline-dark"
                                size="lg"
                                className="h-14 w-full gap-3"
                            >
                                <Chrome size={18} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Google</span>
                            </Button>

                            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-black font-bold hover:text-accent transition-colors underline underline-offset-4">Log In</Link>
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Right Side: Image */}
            <div className="hidden md:block flex-1 relative bg-secondary overflow-hidden">
                <Image
                    src="/login_background.png"
                    alt="Luxury Beauty Experience"
                    fill
                    className="object-cover animate-image-zoom"
                    priority
                />
                <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <Reveal delay={0.5}>
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-80">Collective Rewards</p>
                            <h2 className="text-3xl font-light uppercase tracking-widest leading-tight">Your Beauty <br />Legacy Starts Here</h2>
                        </div>
                    </Reveal>
                </div>
            </div>

            <style jsx global>{`
                @keyframes image-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .animate-image-zoom {
                    animation: image-zoom 20s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
}
