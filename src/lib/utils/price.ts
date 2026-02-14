import { Product } from "@/lib/supabase/types";

export function getEffectivePrice(product: Product): number {
    const price = Number(product.price);
    const salePrice = product.sale_price ? Number(product.sale_price) : null;

    if (!salePrice || !isSaleActive(product)) {
        return price;
    }

    return salePrice;
}

export function isSaleActive(product: Product): boolean {
    const salePrice = product.sale_price ? Number(product.sale_price) : null;
    const price = Number(product.price);

    if (!salePrice || salePrice >= price) return false;
    
    if (product.sale_end_date) {
        try {
            const endDate = new Date(product.sale_end_date);
            const now = new Date();
            // If the date is valid and in the future, sale is active
            return !isNaN(endDate.getTime()) && now <= endDate;
        } catch (e) {
            console.error("Error parsing sale_end_date:", e);
            return true; // Fallback to true if date is present but unparseable
        }
    }
    
    return true;
}
