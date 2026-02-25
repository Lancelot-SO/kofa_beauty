"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useOrderStore } from "@/lib/store/useOrderStore";
import { useProductStore } from "@/lib/store/useProductStore";
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';

export default function AnalyticsPage() {
    const { orders } = useOrderStore();
    const { products } = useProductStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const paidOrders = orders.filter(order => order.status !== 'Pending Payment');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = paidOrders.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItemsSold = paidOrders.reduce((sum, order) => sum + order.items.reduce((is, item) => is + item.quantity, 0), 0);

    // Calculate Sales by Product
    const productSales = new Map<string, { name: string; revenue: number; quantity: number }>();

    paidOrders.forEach(order => {
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
    paidOrders.forEach(order => {
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

    // Calculate Sales Trend (Last 7 days)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        return {
            date: format(date, 'MMM dd'),
            fullDate: startOfDay(date),
            revenue: 0,
            orders: 0
        };
    }).reverse();

    paidOrders.forEach(order => {
        const orderDate = startOfDay(new Date(order.created_at));
        const dayData = last7Days.find(d => d.fullDate.getTime() === orderDate.getTime());
        if (dayData) {
            dayData.revenue += order.total;
            dayData.orders += 1;
        }
    });

    const CHART_COLORS = ['#E11D48', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

    // Custom Tooltip for premium feel
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl ring-1 ring-black/5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 py-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                            <span className="text-xs font-bold text-slate-800">
                                {entry.name}: {entry.name.includes('Revenue') ? `GH₵${entry.value.toFixed(2)}` : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend Chart */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif">Revenue Trend (Last 7 Days)</CardTitle>
                        <CardDescription>Daily revenue and order volume.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last7Days}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar 
                                    name="Revenue" 
                                    dataKey="revenue" 
                                    fill="#000000" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Products Chart */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif">Top Products</CardTitle>
                        <CardDescription>Best performing items by gross revenue.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                layout="vertical" 
                                data={topProducts}
                                margin={{ left: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }}
                                    width={100}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar 
                                    name="Revenue" 
                                    dataKey="revenue" 
                                    fill="#8B7355" 
                                    radius={[0, 4, 4, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Categories Chart */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif">Sales by Category</CardTitle>
                        <CardDescription>Revenue distribution across categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={topCategories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {topCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    formatter={(value) => <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2">{value}</span>}
                                    iconType="circle"
                                    iconSize={8}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
