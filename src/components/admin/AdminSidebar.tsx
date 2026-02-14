"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    X,
    Percent
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
    };

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
        { href: "/admin/promotions", label: "Promotions", icon: Percent },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "flex flex-col h-screen w-64 bg-slate-900 text-white shadow-lg fixed left-0 top-0 z-50 transition-transform duration-300",
                // On Desktop: always visible
                "lg:translate-x-0",
                // On Mobile: slide in/out based on isOpen
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-wide">KOFA ADMIN</h1>
                    {/* Close Button (Mobile Only) */}
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-1 text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-rose-500/20 to-rose-500/5 text-rose-300 font-medium border-l-4 border-rose-500"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-4 border-transparent"
                                )}
                            >
                                <Icon size={20} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors text-sm text-left"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}

// Mobile Toggle Button Component
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open menu"
        >
            <Menu size={24} />
        </button>
    );
}
