"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useOrderStore } from "@/lib/store/useOrderStore";
import { useProductStore } from "@/lib/store/useProductStore";
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const { orders } = useOrderStore();
    const { products } = useProductStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItemsSold = orders.reduce((sum, order) => sum + order.items.reduce((is, item) => is + item.quantity, 0), 0);

    // Calculate Sales by Product
    const productSales = new Map<string, { name: string; revenue: number; quantity: number }>();

    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales.has(item.product_name)) {
                productSales.set(item.product_name, { name: item.product_name, revenue: 0, quantity: 0 });
            }
            const data = productSales.get(item.product_name)!;
            data.revenue += item.price * item.quantity;
            data.quantity += item.quantity;
        });
    });

    const topProducts = Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    const maxRevenue = Math.max(...topProducts.map(p => p.revenue), 1);

    // Calculate Sales by Category (Need to join with products)
    const categorySales = new Map<string, number>();
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.product_id); // Try to find by ID
            // If product deleted or not found, maybe fallback or skip. 
            // We can match by name if ID fails as fallback for this demo
            const category = product?.category || "Other";

            const current = categorySales.get(category) || 0;
            categorySales.set(category, current + (item.price * item.quantity));
        });
    });

    const topCategories = Array.from(categorySales.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const totalCategorySales = topCategories.reduce((sum, cat) => sum + cat.value, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-gray-500 mt-1">Deep dive into your store performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GH₵{totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Avg. Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GH₵{aov.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Items Sold</CardTitle>
                        <Package className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItemsSold}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Top Products Chart */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle>Top Products by Revenue</CardTitle>
                        <CardDescription>Your best performing products.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {topProducts.map((product, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">{product.name}</span>
                                    <span className="font-bold text-slate-900">GH₵{product.revenue.toFixed(2)}</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-slate-900 rounded-full"
                                    />
                                </div>
                                <div className="text-xs text-slate-400 text-right">{product.quantity} sold</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Categories Chart */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Where your revenue comes from.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {topCategories.map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">{cat.name}</span>
                                    <span className="font-bold text-slate-900">{((cat.value / totalCategorySales) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.value / totalCategorySales) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                        className={`h-full rounded-full ${i % 4 === 0 ? 'bg-rose-500' :
                                            i % 4 === 1 ? 'bg-amber-500' :
                                                i % 4 === 2 ? 'bg-blue-500' :
                                                    'bg-emerald-500'
                                            }`}
                                    />
                                </div>
                                <div className="text-xs text-slate-400 text-right">GH₵{cat.value.toFixed(2)}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
