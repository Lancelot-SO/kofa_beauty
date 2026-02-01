"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        } else {
            setIsSubmitted(true);
            toast.success("Password reset link sent to your email!");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white shadow-2xl">
                <CardHeader className="space-y-1 pt-8">
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                            <img src="/kofa-logo-chrome.png" alt="Kofa Beauty" className="h-10 w-auto" />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-megante text-center">Reset Password</CardTitle>
                    <CardDescription className="text-zinc-400 text-center">
                        {isSubmitted 
                            ? "We've sent a recovery link to your email." 
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-zinc-800/50 border-zinc-700 text-white pl-10 h-12 transition-all focus:border-brand-rose focus:ring-brand-rose/20"
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white h-12 text-sm font-bold uppercase tracking-widest transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending link..." : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-rose/10 text-brand-rose mb-4">
                                <Mail size={32} />
                            </div>
                            <p className="text-sm text-zinc-400">
                                Check your inbox (and spam folder) for the reset link.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
                    <Link 
                        href="/login" 
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
