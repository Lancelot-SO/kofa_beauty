
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, ChevronRight, Clock } from "lucide-react";

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-playfair font-bold mb-2">My Orders</h1>
                <p className="text-gray-500">View and track your order history.</p>
            </div>

            <div className="space-y-4">
                {orders && orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-playfair font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Clock size={14} />
                                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <p className="text-sm text-gray-400 uppercase tracking-widest text-[10px]">Total Amount</p>
                                    <p className="text-lg font-bold font-playfair">GH₵{order.total_amount.toFixed(2)}</p>
                                </div>
                                
                                <div className="hidden md:block w-px h-10 bg-gray-100" />

                                <Link 
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-rose hover:text-black transition-colors"
                                >
                                    Details <ChevronRight size={16} />
                                </Link>
                            </div>
                            
                            {/* Preview Items */}
                            <div className="mt-6 pt-6 border-t border-gray-50 flex gap-3 overflow-x-auto pb-2">
                                {order.order_items.map((item: any) => (
                                    <div key={item.id} className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 relative border border-gray-100">
                                         {/* Image placeholder */}
                                         {item.products?.image && (
                                             <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover rounded-lg opacity-80" />
                                         )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-playfair text-xl font-bold mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                        <Link href="/shop/all" className="inline-block bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-rose transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
