
import { Metadata } from "next";
import { Mail, MapPin, Instagram, Phone, Clock } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
    title: "Contact Us | Kofa Beauty",
    description: "Get in touch with the Kofa Beauty team.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-brand-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src="/contact-hero-service.png"
                    alt="Contact Kofa Beauty Service"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="relative z-10 text-center text-white p-4 max-w-4xl mx-auto mt-20">
                    <Reveal>
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">Contact Us</h1>
                        <p className="text-lg md:text-xl font-light tracking-widest uppercase opacity-90">
                            We'd love to hear from you
                        </p>
                    </Reveal>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-8 py-20 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* Left Column: Contact Info */}
                    <div className="space-y-12 pt-10 lg:pt-0">
                         <Reveal delay={0.1}>
                             <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm h-full">
                                <h3 className="font-playfair text-3xl font-bold mb-6">Get in Touch</h3>
                                <p className="text-gray-500 mb-10 leading-relaxed">
                                    Whether you have a question about our products, need help with an order, or just want to say hi, our team is ready to assist you.
                                </p>
                                
                                <div className="space-y-8">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose shrink-0">
                                            <Mail size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-playfair text-lg font-bold mb-1">Email</h4>
                                            <a href="mailto:carrine@kofabeauty.com" className="text-gray-600 hover:text-black transition-colors block text-lg">
                                                carrine@kofabeauty.com
                                            </a>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-medium">Response time: Within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose shrink-0">
                                            <Phone size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-playfair text-lg font-bold mb-1">Phone / WhatsApp</h4>
                                            <a href="tel:+233550000000" className="text-gray-600 hover:text-black transition-colors block text-lg">
                                                +233 540 517 0655
                                            </a>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-medium flex items-center gap-1">
                                                <Clock size={12} /> 24/7, Available Always
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose shrink-0">
                                            <Instagram size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-playfair text-lg font-bold mb-1">Social Media</h4>
                                            <a href="https://instagram.com/kofabeautyy" target="_blank" className="text-gray-600 hover:text-black transition-colors block text-lg">
                                                @kofabeautyy
                                            </a>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-medium">Follow for latest updates</p>
                                        </div>
                                    </div>

                                     <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose shrink-0">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-playfair text-lg font-bold mb-1">HQ Location</h4>
                                             <p className="text-gray-600 text-lg">Gbawe Accra, Ghana</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Column: form */}
                    <div className="lg:mt-20">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
