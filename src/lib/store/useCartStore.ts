import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/supabase/types';
import { getEffectivePrice } from '@/lib/utils/price';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export const getCartSubtotal = (items: CartItem[]) => 
    items.reduce((sum, item) => {
        const price = getEffectivePrice(item.product);
        return sum + (Number(price) * item.quantity);
    }, 0);

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => {
                const existingItem = state.items.find(item => item.product.id === product.id);
                const currentQuantity = existingItem ? existingItem.quantity : 0;
                
                // Check if we can add more
                if (currentQuantity >= product.stock) {
                    return state; // No change if out of stock
                }

                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    };
                }
                return { items: [...state.items, { product, quantity: 1 }] };
            }),
            removeItem: (productId) => set((state) => ({
                items: state.items.filter(item => item.product.id !== productId)
            })),
            updateQuantity: (productId, quantity) => set((state) => {
                const item = state.items.find(i => i.product.id === productId);
                if (!item) return state;

                if (quantity <= 0) {
                    return { items: state.items.filter(item => item.product.id !== productId) };
                }

                // Check stock limit
                const finalQuantity = Math.min(quantity, item.product.stock);

                return {
                    items: state.items.map(item =>
                        item.product.id === productId
                            ? { ...item, quantity: finalQuantity }
                            : item
                    )
                };
            }),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
        }
    )
);
