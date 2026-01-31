"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BundleOffer() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Suble parallax for the image
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

    return (
        <section
            ref={sectionRef}
            className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white z-10"
        >
            {/* Image - Left Side */}
            <div className="w-full md:w-1/2 relative h-[40vh] md:h-screen overflow-hidden">
                <motion.div
                    style={{ scale }}
                    className="w-full h-full relative"
                >
                    <Image
                        src="/bundle-offer.jpg"
                        alt="Bundle Offer Model"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </motion.div>
            </div>

            {/* Content - Right Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 bg-white relative">
                <motion.div
                    style={{ y: yContent }}
                    className="max-w-lg w-full space-y-8 text-center md:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h4 className="text-xs md:text-sm font-bold tracking-[0.3em] text-gray-400 uppercase">
                            Limited Time Offer
                        </h4>
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-megante font-bold text-black leading-[1.1]"
                    >
                        15% Off for <br /> the Bundle
                    </motion.h2>

                    <motion.p
                        className="text-gray-500 leading-relaxed text-sm md:text-base font-light font-megante"
                    >
                        Elevate your beauty routine with top-quality products now available at a special discounted price.
                    </motion.p>

                    <motion.p
                        className="text-sm font-bold text-black tracking-wide font-megante"
                    >
                        Use code KB1DROP at checkout
                    </motion.p>

                    <motion.div className="pt-4">
                        <Link href="/shop/bundle">
                            <Button
                                variant="premium-outline-dark"
                                size="premium"
                                className="px-12 py-5"
                            >
                                Buy the Bundle
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
