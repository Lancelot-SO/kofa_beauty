"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Package, Calendar, CreditCard } from "lucide-react";
import { useOrderStore, OrderStatus, OrderWithItems } from "@/lib/store/useOrderStore";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrdersPage() {
    const { orders, updateOrderStatus, fetchOrders, isLoading } = useOrderStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'Processing': return "bg-amber-50 text-amber-600 border-amber-200";
            case 'Shipped': return "bg-blue-50 text-blue-600 border-blue-200";
            case 'Delivered': return "bg-green-50 text-green-600 border-green-200";
            case 'Cancelled': return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    const handleStatusUpdate = async (id: string, status: OrderStatus) => {
        try {
            await updateOrderStatus(id, status);
            toast.success(`Order updated to ${status}`);
        } catch {
            toast.error("Failed to update order status");
        }
    };

    const openOrderDetails = (order: OrderWithItems) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-playfair">Orders</h1>
                <Button variant="premium-outline-dark" size="sm" className="gap-2 px-6">
                    <Filter size={14} /> Filter
                </Button>
            </div>

            <div className="flex items-center py-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold">Order</TableHead>
                                <TableHead className="font-bold">Date</TableHead>
                                <TableHead className="font-bold">Customer</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="font-bold">Items</TableHead>
                                <TableHead className="text-right font-bold">Total</TableHead>
                                <TableHead className="text-right font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow 
                                        key={order.id} 
                                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => openOrderDetails(order)}
                                    >
                                        <TableCell className="font-bold text-slate-900">{order.order_number}</TableCell>
                                        <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{order.customer_name}</span>
                                                <span className="text-xs text-slate-500">{order.customer_email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getStatusColor(order.status)} font-medium px-2 py-0 border leading-none h-5`}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.items.length} items</TableCell>
                                        <TableCell className="text-right font-bold text-slate-900">GH₵{Number(order.total).toFixed(2)}</TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="hover:bg-slate-200">Update Status</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => handleStatusUpdate(order.id, status)}
                                                            disabled={order.status === status}
                                                        >
                                                            Mark as {status}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-white">
                    {selectedOrder && (
                        <>
                            <SheetHeader className="p-6 border-b bg-slate-50/50">
                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <SheetTitle className="text-2xl font-playfair font-bold">Order {selectedOrder.order_number}</SheetTitle>
                                        <SheetDescription className="text-sm text-slate-500 mt-1">
                                            Placed on {format(new Date(selectedOrder.created_at), "MMMM d, yyyy 'at' h:mm a")}
                                        </SheetDescription>
                                    </div>
                                    <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)} text-sm px-3 py-1`}>
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                            </SheetHeader>
                            
                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-8">
                                    {/* Customer Information */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                                            <User size={14} /> Customer Contact
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
                                                <Mail size={16} className="text-slate-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Email Address</p>
                                                    <p className="text-sm font-medium text-slate-900">{selectedOrder.customer_email}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
                                                <Phone size={16} className="text-slate-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Phone Number</p>
                                                    <p className="text-sm font-medium text-slate-900">{selectedOrder.phone || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Shipping Address */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                                            <MapPin size={14} /> Delivery Information
                                        </h3>
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                                            <p className="text-sm font-bold text-slate-900">{selectedOrder.customer_name}</p>
                                            <div className="text-sm text-slate-600 space-y-0.5">
                                                <p>{selectedOrder.address}</p>
                                                {selectedOrder.apartment && <p>{selectedOrder.apartment}</p>}
                                                <p>{selectedOrder.city}, {selectedOrder.postcode}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Order Items */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                                            <Package size={14} /> Order Items
                                        </h3>
                                        <div className="border rounded-lg overflow-hidden border-slate-100 shadow-sm">
                                            <Table>
                                                <TableHeader className="bg-slate-50/50">
                                                    <TableRow>
                                                        <TableHead className="h-10 text-xs font-bold">Product</TableHead>
                                                        <TableHead className="h-10 text-xs text-center font-bold">Qty</TableHead>
                                                        <TableHead className="h-10 text-xs text-right font-bold">Price</TableHead>
                                                        <TableHead className="h-10 text-xs text-right font-bold">Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedOrder.items.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="py-3 font-medium text-slate-900">{item.product_name}</TableCell>
                                                            <TableCell className="py-3 text-center">{item.quantity}</TableCell>
                                                            <TableCell className="py-3 text-right">GH₵{Number(item.price).toFixed(2)}</TableCell>
                                                            <TableCell className="py-3 text-right font-bold text-slate-900">
                                                                GH₵{(Number(item.price) * item.quantity).toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </section>

                                    {/* Order Summary */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                                            <CreditCard size={14} /> Payment Summary
                                        </h3>
                                        <div className="p-6 bg-slate-900 text-white rounded-lg space-y-3">
                                            <div className="flex justify-between text-sm opacity-80">
                                                <span>Subtotal</span>
                                                <span>GH₵{Number(selectedOrder.total).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs opacity-80">
                                                <span>Delivery Fee (Settled with Rider)</span>
                                                <span className="italic">TBD</span>
                                            </div>
                                            <Separator className="bg-white/20" />
                                            <div className="flex justify-between items-end">
                                                <span className="font-bold uppercase tracking-widest text-xs">Total to be Collected</span>
                                                <span className="text-2xl font-bold">GH₵{Number(selectedOrder.total).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
