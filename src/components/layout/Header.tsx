"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X, Facebook, Instagram, Twitter, Youtube, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore, getCartSubtotal } from "@/lib/store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { items } = useCartStore();
    const subtotal = getCartSubtotal(items);
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(profile);
            }
        };
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(profile);
            } else {
                setProfile(null);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
        }
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className={`w-full fixed top-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"}`}>
            {/* Top Banner - Subtle transparency */}
            {!scrolled && (
                <div className="bg-black/80 text-white text-[10px] md:text-xs py-2 px-4 md:px-8 flex justify-between items-center tracking-[0.2em] border-b border-white/5">
                    <div className="flex items-center">
                        <Search size={14} className="cursor-pointer hover:text-brand-rose transition-colors" />
                    </div>
                    <div className="flex-1 text-center">
                        <span className="uppercase font-medium">
                            GHS 25 Flat Rate Shipping on all orders
                        </span>
                    </div>
                    <div className="hidden md:flex gap-4 items-center opacity-70">
                        <Link href="#" className="hover:text-brand-rose transition-colors"><Instagram size={12} /></Link>
                        <Link href="#" className="hover:text-brand-rose transition-colors"><Facebook size={12} /></Link>
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <div className={`transition-all duration-500 ${scrolled ? "py-3" : "py-6 md:py-8"}`}>
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">

                    {/* Left: Mobile Menu Trigger */}
                    <div className="flex md:hidden items-center">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white p-0 hover:bg-transparent hover:text-brand-rose">
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-black text-white border-r-white/10 w-[85%] p-0">
                                <div className="flex flex-col h-full">
                                    <div className="p-8 border-b border-white/5">
                                        <Image
                                            src="/kofa-logo-chrome.png"
                                            alt="Kofa Beauty"
                                            width={150}
                                            height={50}
                                            className="h-8 w-auto"
                                        />
                                    </div>
                                    <nav className="flex flex-col gap-1 p-4">
                                        {['Shop All', 'Face', 'Lips', 'Eyes', 'Sets'].map((item) => (
                                            <Link
                                                key={item}
                                                href={item === 'Shop All' ? '/shop/all' : `/shop/${item.toLowerCase().replace(' ', '-')}`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="px-4 py-4 text-xl font-megante hover:bg-white/5 rounded-lg transition-colors border-b border-white/5"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="mt-auto p-8 bg-white/5">
                                        {user ? (
                                            <div className="space-y-4 mb-8">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[10px] uppercase tracking-widest text-brand-rose opacity-80">Welcome</p>
                                                    <p className="text-xl font-megante">{profile?.full_name || user.email}</p>
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                    {profile?.role === 'admin' && (
                                                        <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-sm tracking-widest uppercase hover:text-brand-rose transition-colors">
                                                            <LayoutDashboard size={18} /> Admin Panel
                                                        </Link>
                                                    )}
                                                    <button onClick={handleLogout} className="flex items-center gap-3 text-sm tracking-widest uppercase hover:text-brand-rose transition-colors text-left w-full">
                                                        <LogOut size={18} /> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-sm tracking-widest uppercase mb-8 hover:text-brand-rose transition-colors">
                                                <User size={18} /> My Account
                                            </Link>
                                        )}
                                        <div className="flex gap-6 opacity-50">
                                            <Instagram size={20} />
                                            <Facebook size={20} />
                                            <Twitter size={20} />
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Center: Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
                        <Link href="/" className="block">
                            <Image
                                src="/kofa-logo-chrome.png"
                                alt="Kofa Beauty"
                                width={180}
                                height={60}
                                className={`h-8 md:h-12 w-auto object-contain transition-all duration-500 ${scrolled ? "md:h-8" : "md:h-12"}`}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-[10px] lg:text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                        {['Shop All', 'Face', 'Lips', 'Eyes', 'Sets'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Shop All' ? '/shop/all' : `/shop/${item.toLowerCase().replace(' ', '-')}`}
                                className="hover:text-brand-rose transition-colors relative group py-2"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-rose transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-5 md:gap-8 text-white">
                        {user ? (
                            <div className="flex items-center gap-6">
                                {profile?.role === 'admin' && (
                                    <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-brand-rose transition-colors">
                                        <LayoutDashboard size={18} strokeWidth={1.5} />
                                        <span className="text-[9px] uppercase tracking-widest font-bold">Dashboard</span>
                                    </Link>
                                )}
                                <div className="flex items-center gap-3 group relative cursor-default">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-brand-rose transition-colors">
                                        <User size={16} strokeWidth={1.5} />
                                    </div>
                                    <span className="hidden lg:block text-[9px] uppercase tracking-widest font-bold max-w-[100px] truncate">
                                        {profile?.first_name || 'My Account'}
                                    </span>
                                    
                                    {/* Dropdown Menu */}
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-white/10 p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                                            <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Logged in as</p>
                                            <p className="text-[10px] font-bold truncate">{user.email}</p>
                                        </div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-white/5 hover:text-brand-rose transition-colors rounded-md"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:flex items-center hover:text-brand-rose transition-colors group">
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                        )}
                        <Link href="/cart" className="relative hover:text-brand-rose transition-colors group">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {isMounted && cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-rose text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
