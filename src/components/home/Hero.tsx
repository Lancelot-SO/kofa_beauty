"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#2A1B19]">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0"
            >
                <Image
                    src="/hero-image.png"
                    alt="Kofa Beauty Model"
                    fill
                    priority
                    quality={100}
                    sizes="100vw"
                    className="object-cover object-center"
                    unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            </motion.div>

            {/* Content Container */}
            <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-left text-white z-10 pt-20">
                <div className="max-w-4xl space-y-6">
                    <Reveal>
                        <p className="font-sans text-sm md:text-base font-medium tracking-[0.4em] uppercase text-white/90 mb-4">
                            Welcome to Kofa Beauty
                        </p>
                    </Reveal>

                    <Reveal delay={200}>
                        <h1 className="font-megante text-5xl md:text-7xl lg:text-8xl font-medium tracking-wide leading-tight text-[#f3e6e6]">
                            Brush Up on <br />
                            <span className="italic block mt-2 text-white">the Basics</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={400}>
                        <div className="w-16 bg-white/50 h-[1px] my-8 md:my-10" />
                    </Reveal>

                    <Reveal delay={600}>
                        <p className="font-megante text-base md:text-lg text-white/90 max-w-lg leading-relaxed tracking-wide">
                            Everyone starts somewhere. These brushes make it easier to learn, experiment, and build the skills behind every great look.
                        </p>
                    </Reveal>

                    <Reveal delay={800}>
                        <div className="pt-10">
                            <Link href="/shop/all">
                                <Button
                                    variant="premium"
                                    size="premium"
                                >
                                    Buy Now
                                </Button>
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
        </section>
    );
}
