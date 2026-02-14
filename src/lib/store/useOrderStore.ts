import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Order, OrderItem, OrderInsert, OrderItemInsert } from '@/lib/supabase/types';

export type OrderStatus = 'Pending Payment' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

// Extended order type with items
export interface OrderWithItems extends Order {
    items: OrderItem[];
}

interface OrderState {
    orders: OrderWithItems[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (order: Omit<OrderInsert, 'id' | 'created_at' | 'updated_at'> & { order_number?: string }, items: Omit<OrderItemInsert, 'id' | 'order_id' | 'created_at'>[]) => Promise<OrderWithItems>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    getOrder: (id: string) => OrderWithItems | undefined;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,
    
    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        // Fetch orders with their items
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (ordersError) {
            set({ error: ordersError.message, isLoading: false });
            return;
        }
        
        // Fetch all order items
        const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*');
        
        if (itemsError) {
            set({ error: itemsError.message, isLoading: false });
            return;
        }
        
        // Combine orders with their items
        const ordersWithItems: OrderWithItems[] = (ordersData || []).map(order => ({
            ...order,
            items: (itemsData || []).filter(item => item.order_id === order.id)
        }));
        
        set({ orders: ordersWithItems, isLoading: false });
    },
    
    addOrder: async (order, items) => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        // Generate order number if not provided
        let orderNumber = order.order_number;
        if (!orderNumber) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            orderNumber = `KB-${timestamp}-${random}`;
        }
        
        console.log("Creating order through RPC with number:", orderNumber);
        
        const orderPayload = { 
            ...order, 
            order_number: orderNumber,
            customer_id: order.customer_id || null
        };

        // Call our secure RPC function to create order and items in one go
        const { data: orderData, error: orderError } = await supabase
            .rpc('place_order', {
                p_order: orderPayload,
                p_items: items
            });
        
        if (orderError) {
            console.error("Supabase RPC place_order error:", orderError);
            set({ error: orderError.message, isLoading: false });
            throw orderError;
        }

        if (!orderData) {
            const noDataError = new Error("Order creation failed - no data returned from RPC.");
            console.error(noDataError.message);
            set({ error: noDataError.message, isLoading: false });
            throw noDataError;
        }

        const newOrder: OrderWithItems = {
            ...orderData,
            // Assuming order_items are fetched again or included in the result
            // Our place_order RPC doesn't return items currently, but we can re-fetch if admin
            // For now, we'll manually attach them from our local data to update UI
            items: items.map((item, idx) => ({ ...item, id: `temp-${idx}`, order_id: orderData.id } as OrderItem))
        };
        
        set((state) => ({
            orders: [newOrder, ...state.orders],
            isLoading: false
        }));

        return newOrder;
    },
    
    updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        // If status is 'Processing', we use our secure RPC instead of direct update
        // to handle the payment confirmation bypass
        if (status === 'Processing') {
            const { error } = await supabase.rpc('confirm_payment', { p_order_id: id });
            if (error) {
                set({ error: error.message, isLoading: false });
                throw error;
            }
        } else {
            // For other updates, use direct table update (likely only for admins)
            const { data, error } = await supabase
                .from('orders')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                set({ error: error.message, isLoading: false });
                throw error;
            }
        }

        // Optimistically update local state if we don't have fresh DB data
        set((state) => ({
            orders: state.orders.map((o) => 
                o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o
            ),
            isLoading: false
        }));
    },
    
    deleteOrder: async (id) => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        // Order items will be deleted automatically due to CASCADE
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);
        
        if (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        } else {
            set((state) => ({
                orders: state.orders.filter((o) => o.id !== id),
                isLoading: false
            }));
        }
    },
    
    getOrder: (id) => get().orders.find((o) => o.id === id)
}));

// Re-export types for convenience
export type { Order, OrderItem } from '@/lib/supabase/types';
