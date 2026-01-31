"use client";

import { useState } from "react";
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
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-4 lg:px-8 justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
                        <h2 className="text-sm font-medium text-gray-500 hidden sm:block">Overview</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-black font-bold text-xs">
                            AD
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
