"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    threshold?: number;
    duration?: number;
    y?: number;
}

export function Reveal({
    children,
    className = "",
    delay = 0,
    threshold = 0.1,
    y = 40
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold,
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const transitionDelay = `${delay}ms`;

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) ${isVisible ? "opacity-100 translate-y-0" : "opacity-0"
                }`}
            style={{
                transitionDelay,
                transform: isVisible ? 'translateY(0)' : `translateY(${y}px)`
            }}
        >
            {children}
        </div>
    );
}
