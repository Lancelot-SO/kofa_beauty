"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    return (
        <section ref={containerRef} className="relative w-full overflow-hidden">
            {/* Hero Image Section - No text overlay */}
            <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
                <motion.div
                    style={{ y, scale }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/hero-image.jpeg"
                        alt="Kofa Beauty Models"
                        fill
                        priority
                        quality={100}
                        sizes="100vw"
                        className="object-cover object-center"
                        unoptimized
                    />
                </motion.div>
            </div>

            {/* Welcome Text Section - Below the image */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-[#4A2C28] py-12 md:py-16"
            >
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.3em] text-white/90 uppercase">
                        Welcome to
                    </h1>
                    <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium tracking-[0.25em] text-white mt-2 uppercase">
                        Kofa Beauty
                    </h2>
                </div>
            </motion.div>

            {/* Brush Up Section - With headline, CTA and image */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-[#3b0d10] py-12 md:py-16 border-t border-white/10"
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                        {/* Text Content */}
                        <div className="text-center md:text-left">
                            <motion.h3
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight text-[#f3e6e6]"
                            >
                                Brush Up on <br className="hidden md:block" />
                                <span className="italic text-white">the Basics</span>
                            </motion.h3>
                            
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="w-16 bg-white/50 h-[1px] my-6 md:my-8 mx-auto md:mx-0 origin-left"
                            />
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                                className="font-lato text-base md:text-lg text-white/90 max-w-lg leading-relaxed tracking-wide"
                            >
                                Everyone starts somewhere. These brushes make it easier to learn, experiment, and build the skills behind every great look.
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                className="pt-8"
                            >
                                <motion.a
                                    href="/shop/all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-block px-8 py-3 bg-white text-[#4A2C28] font-lato font-medium tracking-wider uppercase text-sm hover:bg-white/90 transition-colors rounded-[20px]"
                                >
                                    Buy Now
                                </motion.a>
                            </motion.div>
                        </div>
                        
                        {/* Brushes Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotate: -10 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 100 }}
                            className="relative w-48 h-48 md:w-[400px] md:h-[400px] flex-shrink-0"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src="/brushes.jpeg"
                                    alt="Makeup Brushes"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
