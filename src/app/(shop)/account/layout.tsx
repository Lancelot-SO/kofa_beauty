
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/account");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const navigation = [
        { name: "Overview", href: "/account", icon: LayoutDashboard },
        { name: "My Orders", href: "/account/orders", icon: Package },
        { name: "Profile", href: "/account/profile", icon: User },
        // { name: "Addresses", href: "/account/addresses", icon: MapPin }, // Postponed until address table is confirmed
    ];

    return (
        <div className="pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen bg-brand-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-40">
                            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose font-playfair font-bold text-xl">
                                    {profile?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-playfair font-bold truncate">
                                        {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'My Account'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
                                    >
                                        <item.icon size={18} />
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <SignOutButton className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left" />
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
