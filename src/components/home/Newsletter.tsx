"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
    return (
        <section className="sticky top-0 min-h-screen flex items-center justify-center py-32 bg-black text-white overflow-hidden z-30">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-rose/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                <div className="space-y-6 mb-12">
                    <Reveal>
                        <span className="text-xs font-bold tracking-[0.4em] uppercase text-brand-rose">
                            Join the Community
                        </span>
                    </Reveal>

                    <Reveal delay={200}>
                        <h2 className="text-4xl md:text-6xl font-megante leading-[1.1] mb-6">
                            Are you on <br />
                            <span className="italic font-light text-brand-rose">the KB Babes list?</span>
                        </h2>
                    </Reveal>

                    <Reveal delay={300}>
                        <p className="text-gray-400 max-w-xl mx-auto tracking-wide text-sm md:text-lg font-megante font-light leading-relaxed">
                            Sign up for exclusive beauty tips, early access to new drops, and member-only rewards.
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={500}>
                    <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
                        <form className="flex flex-col md:flex-row gap-6 items-end" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex-1 w-full text-left space-y-3">
                                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                                    Your Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="h-14 bg-transparent border-0 border-b border-white/20 rounded-none text-white focus:border-brand-rose focus:ring-0 px-0 text-lg transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <Button
                                variant="premium"
                                className="w-full md:w-auto px-12 h-14"
                            >
                                Join Now
                            </Button>
                        </form>
                        <p className="mt-6 text-[10px] text-gray-500 tracking-widest uppercase">
                            By subscribing you agree to our privacy policy.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
