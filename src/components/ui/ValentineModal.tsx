"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import Link from 'next/link';

const VALENTINE_EXPIRY_KEY = 'valentine_modal_expiry';
const VALENTINE_DISMISSED_KEY = 'valentine_modal_dismissed';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function ValentineModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; x: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        const now = Date.now();
        const expiry = localStorage.getItem(VALENTINE_EXPIRY_KEY);
        const dismissed = localStorage.getItem(VALENTINE_DISMISSED_KEY);

        if (dismissed === 'true') {
            return;
        }

        if (!expiry) {
            // Set expiry to 24 hours from first load
            localStorage.setItem(VALENTINE_EXPIRY_KEY, (now + TWENTY_FOUR_HOURS).toString());
            setIsOpen(true);
        } else if (now < parseInt(expiry)) {
            setIsOpen(true);
        }

        // Generate random hearts for the raining effect
        const newHearts = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // horizontal start position across viewport width
            size: Math.random() * (24 - 10) + 10, // random heart size
            duration: Math.random() * (6 - 3) + 3, // random fall speed
            delay: Math.random() * 5, // random staggered start
        }));
        setHearts(newHearts);
    }, []);

    const handleClose = () => {
        localStorage.setItem(VALENTINE_DISMISSED_KEY, 'true');
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
                    {/* Ambient Heart Rain Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        {hearts.map((heart) => (
                            <motion.div
                                key={heart.id}
                                initial={{ y: -50, x: `${heart.x}vw`, opacity: 0, rotate: 0 }}
                                animate={{ 
                                    y: '110vh', 
                                    opacity: [0, 0.7, 0.7, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: heart.duration,
                                    delay: heart.delay,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute text-rose-300/60"
                                style={{ fontSize: heart.size }}
                            >
                                <Heart fill="currentColor" stroke="none" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Modal Content Panel */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative pointer-events-auto bg-white/90 backdrop-blur-2xl border border-rose-100 p-10 rounded-[48px] shadow-[0_32px_100px_-20px_rgba(255,182,193,0.5)] max-w-[400px] text-center mx-4 overflow-hidden"
                    >
                        {/* Soft decorative background heart */}
                        <div className="absolute -top-20 -right-20 text-rose-50/50 pointer-events-none">
                             <Heart size={240} fill="currentColor" />
                        </div>

                        <button 
                            onClick={handleClose}
                            className="absolute top-6 right-6 p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10 space-y-8">
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.15, 1],
                                    filter: ["drop-shadow(0 0 0px #FDA4AF)", "drop-shadow(0 0 20px #FDA4AF)", "drop-shadow(0 0 0px #FDA4AF)"]
                                }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 2,
                                    ease: "easeInOut"
                                }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-rose-50 rounded-full text-rose-500"
                            >
                                <Heart size={44} fill="currentColor" />
                            </motion.div>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 italic font-medium leading-tight">
                                    Happy Valentine!
                                </h2>
                                
                                <p className="text-slate-500 font-sans text-lg leading-relaxed">
                                    Celebrating the beauty of love with you today. Enjoy <span className="text-rose-500 font-bold">20% OFF</span> on all <span className="text-rose-500 font-bold">Brushes for <span className="text-rose-500 font-bold">24hours</span></span>!
                                </p>
                            </div>

                            <Link 
                                href="/shop/brushes"
                                onClick={handleClose}
                                className="w-full bg-linear-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-5 rounded-[24px] transition-all shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] inline-block"
                            >
                                Spread the Love
                            </Link>
                            
                            <p className="text-[10px] text-rose-300 uppercase tracking-[0.2em] font-bold">
                                Kofa Beauty Exclusive
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
