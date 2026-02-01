import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, Music2 as Tiktok } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-black text-white pt-24 pb-12 border-t border-white/5 z-40">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-8">
                        <Link href="/" className="block">
                            <Image
                                src="/kofa-logo-chrome.png"
                                alt="Kofa Beauty"
                                width={180}
                                height={60}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-light font-megante">
                            Redefining beauty through confidence, not comparison. We provide premium tools and products to enhance your natural beauty.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: Facebook, href: "#" },
                                { icon: Tiktok, href: "https://www.tiktok.com/tag/liyadances" },
                                { icon: Youtube, href: "#" },
                                { icon: Twitter, href: "#" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-brand-rose hover:border-brand-rose hover:text-white transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="font-megante text-xl text-brand-rose uppercase tracking-widest">Shop</h3>
                        <ul className="space-y-4">
                            {['Brushes', 'Lip Gloss', 'Lashes', 'All Collections'].map((item) => (
                                <li key={item}>
                                    <Link href={`/shop/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group font-megante">
                                        <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="md:col-span-3 space-y-6">
                        <h3 className="font-megante text-xl text-brand-rose uppercase tracking-widest">Client Services</h3>
                        <ul className="space-y-4">
                            {['Shipping & Returns', 'Store Policy', 'Payment Methods', 'FAQ', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-400 hover:text-white transition-colors font-megante">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-3 space-y-6">
                        <h3 className="font-megante text-xl text-brand-rose uppercase tracking-widest">The Lab</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Location</h4>
                                <p className="text-sm text-gray-300 font-megante">Accra, Ghana</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Email</h4>
                                <a href="mailto:info@kofabeauty.com" className="text-sm text-gray-300 hover:text-brand-rose transition-colors font-medium font-megante">
                                    info@kofabeauty.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                        © 2026 Kofa Beauty. All rights Reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                        Designed by <span className="text-gray-400">DeZiyaDeZigns</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
