
import { Reveal } from "@/components/ui/Reveal";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "FAQ | Kofa Beauty",
    description: "Frequently Asked Questions about Kofa Beauty products and shipping.",
};

const FAQ_DATA = [
    {
        q: "Do you ship internationally?",
        a: "Yes, we ship to anywhere in Nigeria & the United Kingdom"
    },
    {
        q: "Can I use these brushes with liquid and powder products?",
        a: "Absolutely. Our brushes are designed to work beautifully with creams, liquid and powders for seamless blending."
    },
    {
        q: "How long does delivery take?",
        a: "Delivery times vary by location and selected shipping method. Estimate timeframes are provided at checkout."
    },
    {
        q: "Can I returned or exchange my brushes?",
        a: "For hygiene reasons, opened or used brushes cannot be returned."
    }
];

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-black relative pt-32 pb-20 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/makeup-brushes.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-30 grayscale"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                {/* Header Section */}
                <header className="mb-20">
                    <Reveal>
                        <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-white/60 mb-2 font-bold italic">
                            PRODUCT & SHIPPING INFO
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="text-7xl md:text-9xl font-playfair italic text-white leading-none">
                            FAQ
                        </h1>
                    </Reveal>
                </header>

                {/* FAQ Items */}
                <div className="space-y-16">
                    {FAQ_DATA.map((item, index) => (
                        <div key={index} className="space-y-8">
                            {/* Question Bubble (Right) */}
                            <Reveal y={20} delay={index * 0.1}>
                                <div className="flex justify-end items-end gap-4 group">
                                    <div className="relative bg-white text-black p-6 md:p-8 rounded-[40px] rounded-br-[5px] max-w-[85%] md:max-w-[70%] shadow-2xl">
                                        <p className="text-base md:text-xl font-medium font-sans leading-relaxed">
                                            {item.q}
                                        </p>
                                        {/* Bubble Tail */}
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white transform rotate-45 z-[-1] rounded-br-2xl" />
                                    </div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#3d0b0b] border-2 border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                                        <span className="text-white font-playfair text-xl md:text-3xl italic">Q</span>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Answer Bubble (Left) */}
                            <Reveal y={20} delay={index * 0.1 + 0.2}>
                                <div className="flex justify-start items-start gap-4 flex-row-reverse md:flex-row">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#3d0b0b] border-2 border-white/20 flex items-center justify-center shrink-0 shadow-lg transform translate-y-4">
                                        <span className="text-white font-playfair text-xl md:text-3xl italic">A</span>
                                    </div>
                                    <div className="relative bg-white text-black p-6 md:p-8 rounded-[40px] rounded-bl-[5px] max-w-[85%] md:max-w-[70%] shadow-2xl">
                                        <p className="text-base md:text-xl font-light font-sans leading-relaxed">
                                            {item.a}
                                        </p>
                                        {/* Bubble Tail */}
                                        <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-white transform rotate-45 z-[-1] rounded-bl-2xl" />
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    ))}
                </div>

                <Reveal delay={0.6}>
                    <div className="mt-24 text-center">
                        <p className="text-white/40 text-xs uppercase tracking-widest">
                            Still have questions? Check our <a href="/contact-us" className="text-brand-rose underline">Contact page</a>
                        </p>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
