import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductInsert, ProductUpdate } from '@/lib/supabase/types';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<ProductInsert, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateProduct: (id: string, updates: ProductUpdate) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;
    searchResults: Product[];
    isSearching: boolean;
    searchProducts: (query: string) => Promise<void>;

}

export const useProductStore = create<ProductState>()((set, get) => ({
    products: [],
    searchResults: [],
    isLoading: false,
    isSearching: false,
    error: null,
    
    searchProducts: async (query: string) => {
        if (!query.trim()) {
            set({ searchResults: [], isSearching: false });
            return;
        }

        set({ isSearching: true, error: null });
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
            .eq('status', 'Active')
            .order('created_at', { ascending: false });
        
        if (error) {
            set({ error: error.message, isSearching: false });
        } else {
            set({ searchResults: data || [], isSearching: false });
        }
    },
    
    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            set({ error: error.message, isLoading: false });
        } else {
            set({ products: data || [], isLoading: false });
        }
    },
    
    addProduct: async (product) => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();
        
        if (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        } else {
            set((state) => ({
                products: [data, ...state.products],
                isLoading: false
            }));
        }
    },
    
    updateProduct: async (id, updates) => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('products')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        } else {
            set((state) => ({
                products: state.products.map((p) => p.id === id ? data : p),
                isLoading: false
            }));
        }
    },
    
    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        } else {
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
                isLoading: false
            }));
        }
    },
    
    getProduct: (id) => get().products.find((p) => p.id === id)
}));

// Re-export Product type for convenience
export type { Product } from '@/lib/supabase/types';
