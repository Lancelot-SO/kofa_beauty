"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        } else {
            toast.success("Password updated successfully!");
            router.push("/login?message=password-reset-success");
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
                    <CardTitle className="text-2xl font-megante text-center">Set New Password</CardTitle>
                    <CardDescription className="text-zinc-400 text-center">
                        Please enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" title="New Password"  className="text-zinc-300">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-zinc-800/50 border-zinc-700 text-white pl-10 pr-10 h-12 transition-all focus:border-brand-rose focus:ring-brand-rose/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" title="Confirm Password"  className="text-zinc-300">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-zinc-800/50 border-zinc-700 text-white pl-10 pr-10 h-12 transition-all focus:border-brand-rose focus:ring-brand-rose/20"
                                />
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white h-12 text-sm font-bold uppercase tracking-widest transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
