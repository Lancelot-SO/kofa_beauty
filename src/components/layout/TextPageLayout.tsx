
import { Reveal } from "@/components/ui/Reveal";

interface TextPageLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function TextPageLayout({ title, subtitle, children }: TextPageLayoutProps) {
    return (
        <div className="pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen bg-brand-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16 md:mb-24">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-black mb-6">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-gray-500 text-sm md:text-base tracking-widest uppercase font-medium">
                                    {subtitle}
                                </p>
                            )}
                            <div className="w-24 h-1 bg-black mx-auto mt-8" />
                        </div>
                    </Reveal>
                    
                    <Reveal delay={0.2}>
                        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-p:font-sans prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-black prose-a:no-underline hover:prose-a:text-brand-rose transition-colors">
                            {children}
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
