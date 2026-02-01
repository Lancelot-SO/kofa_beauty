"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, Variants, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Tutorials() {
    const containerRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
            image: "/eyes_tutorial.jpg", // Close up eye makeup
            link: "/tutorials/eyes"
        },
        {
            subtitle: "HOW TO",
            title: "FACE",
            image: "/face_tutorial.jpg", // Brushes face
            link: "/tutorials/face",
            video: "YOUR_YOUTUBE_VIDEO_ID" // Replace with your YouTube video ID (e.g., dQw4w9WgXcQ from youtube.com/watch?v=dQw4w9WgXcQ)
        },
        {
            subtitle: "HOW TO",
            title: "LIPS",
            image: "/lips_tutorial.jpeg", // Lips close up
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
                        const hasVideo = 'video' in category;

                        const content = (
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
                        );

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
                                {hasVideo ? (
                                    <motion.button
                                        onClick={() => setSelectedVideo(category.video!)}
                                        whileHover="hover"
                                        initial="initial"
                                        className="group block relative h-[400px] md:h-[450px] w-full overflow-hidden text-left"
                                    >
                                        {content}
                                        
                                        {/* Play/Watch Hint - Centered in the middle */}
                                        <motion.div
                                            variants={{
                                                initial: { opacity: 0, y: 10 },
                                                hover: { opacity: 1, y: 0 }
                                            }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-3 bg-black/20 backdrop-blur-sm">
                                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                            </div>
                                            <span className="text-white text-[10px] tracking-[0.3em] font-lato font-light uppercase whitespace-nowrap bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                                Click to watch tutorial
                                            </span>
                                        </motion.div>

                                        {/* Bottom text overlay */}
                                        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center justify-end text-center p-6">
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 0.9, y: 0 }}
                                                transition={{ delay: 0.2 + (index * 0.1) }}
                                                className="text-white text-xs tracking-[0.25em] font-lato font-light mb-3 uppercase"
                                            >
                                                {category.subtitle}
                                            </motion.span>

                                            <motion.h3
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="text-white text-5xl md:text-6xl font-playfair font-medium tracking-wide"
                                            >
                                                {category.title}
                                            </motion.h3>
                                        </div>
                                    </motion.button>
                                ) : (
                                    <Link href={category.link} className="group block relative h-[400px] md:h-[450px] w-full overflow-hidden">
                                        {content}
                                        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center justify-end text-center p-6">
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 0.9, y: 0 }}
                                                transition={{ delay: 0.2 + (index * 0.1) }}
                                                className="text-white text-xs tracking-[0.25em] font-lato font-light mb-3 uppercase"
                                            >
                                                {category.subtitle}
                                            </motion.span>
                                            <motion.h3
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="text-white text-5xl md:text-6xl font-playfair font-medium tracking-wide"
                                            >
                                                {category.title}
                                            </motion.h3>
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedVideo(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-[110] p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                title="Tutorial Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
