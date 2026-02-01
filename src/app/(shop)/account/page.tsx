
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Package, Truck, Clock } from "lucide-react";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch recent order
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

    const recentOrder = recentOrders?.[0];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-playfair font-bold mb-2">My Overview</h1>
                <p className="text-gray-500">Welcome back to your Kofa Beauty dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black text-white p-6 rounded-2xl md:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Package size={120} />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-sm uppercase tracking-widest font-medium opacity-70 mb-1">Recent Order</h3>
                        {recentOrder ? (
                            <div className="mt-4">
                                <div className="text-2xl font-playfair font-bold mb-2">Order #{recentOrder.id.slice(0, 8)}</div>
                                <div className="flex items-center gap-4 text-sm opacity-80 mb-6">
                                    <span className="flex items-center gap-2"><Clock size={14} /> {new Date(recentOrder.created_at).toLocaleDateString()}</span>
                                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs capitalize">{recentOrder.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    {recentOrder.order_items?.slice(0, 3).map((item: any) => ( // Minimal type fix
                                        <div key={item.id} className="w-12 h-12 bg-white/10 rounded-lg relative overflow-hidden">
                                           {/* Ideally we show images here */}
                                        </div>
                                    ))}
                                    {recentOrder.order_items?.length > 3 && (
                                         <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xs">
                                             +{recentOrder.order_items.length - 3}
                                         </div>
                                    )}
                                </div>
                                <div className="mt-8">
                                    <Link href={`/account/orders/${recentOrder.id}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-brand-rose transition-colors">
                                        View Order <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <p className="text-lg font-playfair mb-6">You haven't placed any orders yet.</p>
                                <Link href="/shop/all" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-rose hover:text-white transition-colors">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col">
                    <div className="mb-auto">
                        <h3 className="text-sm uppercase tracking-widest font-medium text-gray-500 mb-4">Default Address</h3>
                        <p className="font-playfair text-lg text-gray-400 italic">No default address saved.</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                         <Link href="/account/profile" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-brand-rose transition-colors">
                            Manage Addresses <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Quick Stats or Promo could go here */}
        </div>
    );
}
