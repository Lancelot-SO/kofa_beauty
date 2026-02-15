"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DollarSign,
    ShoppingBag,
    Package,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Plus,
    Filter,
    Loader2
} from "lucide-react";
import { useProductStore } from "@/lib/store/useProductStore";
import { useOrderStore, OrderWithItems } from "@/lib/store/useOrderStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
    const { products, fetchProducts, isLoading: productsLoading } = useProductStore();
    const { orders, fetchOrders, isLoading: ordersLoading } = useOrderStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchProducts();
        fetchOrders();
    }, [fetchProducts, fetchOrders]);

    // Product Metrics
    const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    // Order Metrics (Exclude pending payment)
    const paidOrders = orders.filter(order => order.status !== 'Pending Payment');
    const totalRevenue = paidOrders.reduce((sum: number, order: OrderWithItems) => sum + Number(order.total), 0);
    const totalOrders = paidOrders.length;

    // Sort orders by date (newest first)
    const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    const isLoading = productsLoading || ordersLoading;

    const metrics = [
        { label: "Total Revenue", value: `GH₵${totalRevenue.toFixed(2)}`, icon: DollarSign, change: "+12.5%", trendingUp: true },
        { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, change: "+3 today", trendingUp: true },
        { label: "Active Products", value: products.filter(p => p.status === 'Active').length.toString(), icon: Package, change: "+2 this week", trendingUp: true },
        { label: "Stock Issues", value: (lowStockCount + outOfStockCount).toString(), icon: AlertTriangle, change: `${outOfStockCount} Out of stock`, trendingUp: false, urgent: lowStockCount + outOfStockCount > 0 },
    ];

    if (!isMounted) return null;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Overview</h1>
                    <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your store today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="premium-outline-dark" size="sm" className="gap-2 px-6">
                        <Filter size={14} /> Filter
                    </Button>
                    <Link href="/admin/products">
                        <Button variant="premium-dark" size="sm" className="gap-2 px-6 shadow-sm">
                            <Plus size={14} /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {metric.label}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${metric.urgent ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"}`}>
                                    <Icon size={16} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{metric.value}</div>
                                <div className="flex items-center gap-1.5 mt-2">
                                    {metric.trendingUp ? (
                                        <ArrowUpRight size={14} className="text-green-500" />
                                    ) : (
                                        <ArrowDownRight size={14} className="text-red-500" />
                                    )}
                                    <span className={`text-xs font-medium ${metric.trendingUp ? "text-green-600" : "text-red-600"}`}>
                                        {metric.change}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Orders</CardTitle>
                            <CardDescription>Latest customer purchases from your store.</CardDescription>
                        </div>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 italic">
                                        <th className="pb-4 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Order</th>
                                        <th className="pb-4 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Customer</th>
                                        <th className="pb-4 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Status</th>
                                        <th className="pb-4 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-500 italic">No orders yet</td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-2 font-medium">{order.order_number}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{order.customer_name}</span>
                                                        <span className="text-xs text-slate-500">{order.customer_email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <Badge variant="outline" className={`${order.status === 'Processing' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                        order.status === 'Delivered' ? "bg-green-50 text-green-600 border-green-200" :
                                                            order.status === 'Shipped' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                                                "bg-red-50 text-red-600 border-red-200"
                                                        } font-medium px-2 py-0 border leading-none h-5`}>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-2 text-right font-bold text-slate-900">GH₵{Number(order.total).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Products / Categories */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { name: "Eyes", share: 45, color: "bg-blue-500" },
                                { name: "Face", share: 30, color: "bg-amber-500" },
                                { name: "Lips", share: 20, color: "bg-rose-500" },
                                { name: "Brushes", share: 5, color: "bg-emerald-500" }
                            ].map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-600">{cat.name}</span>
                                        <span className="text-xs font-medium text-slate-400">{cat.share}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.share}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-white border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-light tracking-widest uppercase">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Button variant="premium-outline" className="h-auto py-5 flex flex-col gap-2 rounded-2xl border-white/10 hover:bg-white/10">
                                <Plus size={20} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">New Order</span>
                            </Button>
                            <Button variant="premium-outline" className="h-auto py-5 flex flex-col gap-2 rounded-2xl border-white/10 hover:bg-white/10">
                                <Users size={20} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Customer</span>
                            </Button>
                            <Button variant="premium-outline" className="h-auto py-5 flex flex-col gap-2 rounded-2xl border-white/10 hover:bg-white/10">
                                <ArrowUpRight size={20} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Export</span>
                            </Button>
                            <Button variant="premium-outline" className="h-auto py-5 flex flex-col gap-2 rounded-2xl border-white/10 hover:bg-white/10">
                                <TrendingUp size={20} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Reports</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
