"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

export function Tutorials() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yMiddle = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const ySides = useTransform(scrollYProgress, [0, 1], [0, 0]);

    const categories = [
        {
            subtitle: "HOW TO",
            title: "EYES",
            image: "/eyes.avif", // Close up eye makeup
            link: "/tutorials/eyes"
        },
        {
            subtitle: "HOW TO",
            title: "FACE",
            image: "/face.avif", // Brushes face
            link: "/tutorials/face"
        },
        {
            subtitle: "HOW TO",
            title: "LIPS",
            image: "/lips.avif", // Lips close up
            link: "/tutorials/lips"
        }
    ];

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 20
            }
        }
    };

    return (
        <section ref={containerRef} className="relative py-20 bg-white overflow-hidden">
            {/* Split Background */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
                <div className="h-2/3 w-full bg-white" />
                <div className="h-1/3 w-full bg-black" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-center text-3xl md:text-4xl font-megante font-bold tracking-[0.2em] mb-16 uppercase text-black">
                        T U T O R I A L S
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => {
                        const isMiddle = index === 1;
                        return (
                            <motion.div
                                key={index}
                                style={{ y: isMiddle ? yMiddle : ySides }}
                                className="relative"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={itemVariants}
                            >
                                <Link href={category.link} className="group block relative h-[400px] md:h-[450px] w-full overflow-hidden">
                                    <motion.div
                                        className="w-full h-full relative"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Image
                                            src={category.image}
                                            alt={`How to ${category.title}`}
                                            fill
                                            className="object-cover object-center"
                                        />
                                        {/* Gradient to make text readable */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                    </motion.div>

                                    <div className="absolute inset-x-0 bottom-8 flex flex-col items-center justify-end text-center p-6">
                                        <motion.span
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 0.9, y: 0 }}
                                            transition={{ delay: 0.2 + (index * 0.1) }}
                                            className="text-white text-xs tracking-[0.25em] font-bold mb-3 uppercase"
                                        >
                                            {category.subtitle}
                                        </motion.span>
                                        <motion.h3
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (index * 0.1) }}
                                            className="text-white text-5xl md:text-6xl font-megante font-medium tracking-wide"
                                        >
                                            {category.title}
                                        </motion.h3>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
