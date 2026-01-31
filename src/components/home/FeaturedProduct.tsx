"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function FeaturedProduct() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

    return (
        <section ref={containerRef} className="bg-brand-deep-maroon py-0 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-black/20 skew-x-12 translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Image Content */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            style={{ y, rotate }}
                            className="relative aspect-square md:aspect-[4/5] w-full max-w-xl mx-auto overflow-hidden rounded-2xl shadow-2xl"
                        >
                            <Image
                                src="/hotpicks.avif"
                                alt="Hot Picks"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>

                        {/* Decorative floating element */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-rose hidden lg:block rounded-full mix-blend-overlay blur-3xl opacity-50"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 text-left lg:pr-10 space-y-8">
                        <div className="space-y-4">
                            <Reveal>
                                <span className="inline-block px-4 py-1 rounded-full border border-brand-rose/30 text-[10px] font-bold tracking-[0.3em] text-white uppercase">
                                    Product Spotlight
                                </span>
                            </Reveal>
                            <Reveal delay={200}>
                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-megante text-white leading-[0.95]">
                                    KB <br />
                                    <span className="italic font-light text-brand-rose">Collection</span>
                                </h2>
                            </Reveal>
                        </div>

                        <Reveal delay={400}>
                            <p className="max-w-md text-base md:text-lg text-gray-300 leading-relaxed font-megante font-light">
                                Discover our curated selection of professional tools designed for the modern beauty enthusiast. Precision, quality, and style in every stroke.
                            </p>
                        </Reveal>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <Reveal delay={600}>
                                <Link href="/shop/brushes">
                                    <Button
                                        variant="premium"
                                        size="premium"
                                        className="py-5" // Slightly shorter for this section
                                    >
                                        Explore Brushes
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                                    </Button>
                                </Link>
                            </Reveal>
                            <Reveal delay={700}>
                                <Link href="/shop/all" className="inline-flex items-center h-auto py-5 text-xs font-bold tracking-[0.2em] text-white uppercase hover:text-brand-rose transition-colors">
                                    Shop All Collections
                                </Link>
                            </Reveal>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
