"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { AdminSidebar, MobileMenuButton } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 admin-theme">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-4 lg:px-8 justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
                        <h2 className="text-sm font-medium text-gray-500 hidden sm:block font-montserrat tracking-tight">Admin Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-brand-rose transition-colors uppercase tracking-widest border border-gray-100 px-4 py-1.5 rounded-full hover:border-brand-rose/30 bg-gray-50/50"
                        >
                            <Globe size={14} />
                            <span className="hidden sm:inline">View Website</span>
                        </Link>
                        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                            <span className="text-xs font-bold text-gray-700 hidden md:block uppercase tracking-wider">Admin</span>
                            <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-black font-bold text-xs ring-2 ring-brand-rose/10">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
