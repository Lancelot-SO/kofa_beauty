
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Calendar, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

// Since params are promises in newer Next.js versions (or types requiring it), we await it if necessary or just use the type properly.
// The provided type from standard nextjs `page.tsx` usually is `params: { id: string }` or `Promise<{ id: string }>`. 
// I'll stick to basic props for now but keep in mind this might need `await params` in extremely new next versions.

export default async function OrderDetailPage({ params }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In Next 15 params might need awaiting, but sticking to 14 pattern, user provided `next: "16.1.6"` so params is a Promise.
    // Wait, next 15+ params is a promise. I should await it.
    
    const { id } = await params; // Awaiting params for Next 15+ compat

    const { data: order } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <Link href="/account/orders" className="text-gray-500 hover:text-black flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Back to Orders
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-playfair font-bold mb-2">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <Calendar size={14} /> 
                            Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                     <span className={`px-4 py-1.5 rounded text-xs uppercase font-bold tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden p-6">
                        <h3 className="font-playfair font-bold text-lg mb-6">Items</h3>
                        <div className="space-y-6">
                            {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg shrink-0 overflow-hidden border border-gray-100">
                                         {item.products?.image && (
                                             <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover" />
                                         )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold font-playfair">{item.products?.name}</h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>GH₵{(order.total_amount - (order.shipping_cost || 0)).toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>GH₵{(order.shipping_cost || 0).toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-lg font-bold font-playfair mt-4 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span>GH₵{order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                     <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h3 className="font-playfair font-bold text-lg mb-4 flex items-center gap-2">
                            <MapPin size={18} /> Shipping Address
                        </h3>
                         <div className="text-sm text-gray-600 leading-relaxed">
                             <p className="font-bold text-black mb-1">{order.shipping_address?.name}</p>
                             <p>{order.shipping_address?.street}</p>
                             <p>{order.shipping_address?.city}, {order.shipping_address?.region}</p>
                             <p>{order.shipping_address?.phone}</p>
                         </div>
                    </div>

                     <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h3 className="font-playfair font-bold text-lg mb-4 flex items-center gap-2">
                            <CreditCard size={18} /> Payment Info
                        </h3>
                         <div className="text-sm text-gray-600 space-y-2">
                             <p className="flex justify-between">
                                 <span>Method:</span>
                                 <span className="font-bold text-black capitalize">{order.payment_method || 'Paystack'}</span>
                             </p>
                             <p className="flex justify-between">
                                 <span>Status:</span>
                                 <span className="font-bold text-green-600 capitalize">{order.payment_status}</span>
                             </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
