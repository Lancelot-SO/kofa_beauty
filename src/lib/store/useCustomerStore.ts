import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';

export interface CustomerWithStats extends Profile {
    total_orders: number;
    total_spent: number;
}

interface CustomerState {
    customers: CustomerWithStats[];
    isLoading: boolean;
    error: string | null;
    fetchCustomers: () => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
    customers: [],
    isLoading: false,
    error: null,

    fetchCustomers: async () => {
        set({ isLoading: true, error: null });
        const supabase = createClient();

        try {
            // Fetch all customer profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'customer')
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            // Fetch orders to calculate stats
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('customer_id, total');

            if (ordersError) throw ordersError;

            // Calculate stats for each customer
            const customersWithStats: CustomerWithStats[] = (profiles || []).map(profile => {
                const customerOrders = (orders || []).filter(o => o.customer_id === profile.id);
                return {
                    ...profile,
                    total_orders: customerOrders.length,
                    total_spent: customerOrders.reduce((sum, o) => sum + Number(o.total), 0)
                };
            });

            set({ customers: customersWithStats, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    deleteCustomer: async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Update local state
        set({ customers: get().customers.filter(c => c.id !== id) });
    }
}));
