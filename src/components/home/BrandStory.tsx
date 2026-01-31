import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStory() {
    return (
        <section className="sticky top-0 min-h-screen flex items-center justify-center py-24 md:py-32 overflow-hidden bg-[#2A1B19] z-20">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/lipstickbg.avif"
                    alt="Dark Red Texture"
                    fill
                    className="object-cover object-center brightness-50"
                />
                <div className="absolute inset-0 bg-[#2A1B19]/80 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start justify-center max-w-6xl mx-auto">

                    {/* Left Column: Heading */}
                    <div className="w-full md:w-5/12 space-y-4 text-center md:text-left">
                        <Reveal>
                            <h4 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">
                                Our Commitment
                            </h4>
                        </Reveal>
                        <Reveal delay={200}>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-megante font-medium leading-tight">
                                Confidence, not comparison
                            </h2>
                        </Reveal>
                    </div>

                    {/* Right Column: Text & Signature */}
                    <div className="w-full md:w-6/12 space-y-8 text-center md:text-left">
                        <Reveal delay={400}>
                            <p className="text-gray-200 leading-relaxed text-base md:text-lg font-megante font-light">
                                At KOFA BEAUTY, we're prioritizing your beauty journey. We want all KB Babes to learn how to use our tools and products to enhance what you're already blessed with because we promote confidence not comparison!
                            </p>
                        </Reveal>

                        <Reveal delay={500}>
                            <p className="text-sm tracking-widest uppercase opacity-60 mb-2">
                                There's only one you boo.
                            </p>
                        </Reveal>

                        <Reveal delay={600}>
                            <p className="font-megante italic text-4xl text-brand-rose">
                                Love Aaliyah
                            </p>
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
}
