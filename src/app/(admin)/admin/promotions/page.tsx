"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Percent, Trash2, CheckCircle2, Clock } from "lucide-react";

export default function PromotionsPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [percentage, setPercentage] = useState<number | "">("");
    const [durationValue, setDurationValue] = useState<string>("");
    const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>("hours");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsFetching(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('category');

            if (error) throw error;

            // Extract unique categories
            const uniqueCategories = Array.from(new Set(data?.map(p => p.category) || [])).filter(Boolean).sort();
            setCategories(uniqueCategories);
        } catch (error) {

            toast.error("Failed to load categories");
        } finally {
            setIsFetching(false);
        }
    };

    const handleApplyPromotion = async () => {
        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }
        if (!percentage || Number(percentage) <= 0 || Number(percentage) > 100) {
            toast.error("Please enter a valid percentage (1-100)");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Fetch products in the category to calculate new prices for each
            // We can't easily do "price * 0.8" in a single update call with Supabase JS client normally, 
            // unless we use an RPC or raw SQL. 
            // For simplicity and safety (without adding new SQL functions), we'll fetch, calculate, and update.
            // If the dataset is huge, an RPC would be better. For now, this is likely fine.

            const { data: products, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .eq('category', selectedCategory);

            if (fetchError) throw fetchError;

            if (!products || products.length === 0) {
                toast.warning(`No products found in ${selectedCategory}`);
                setIsLoading(false);
                return;
            }

            const discountMultiplier = 1 - (Number(percentage) / 100);

            // Calculate sale end date if duration is provided
            let saleEndDate: string | null = null;
            if (durationValue) {
                const now = new Date();
                const duration = Number(durationValue);
                if (durationUnit === 'hours') {
                    now.setHours(now.getHours() + duration);
                } else {
                    now.setDate(now.getDate() + duration);
                }
                saleEndDate = now.toISOString();
            }

            // 2. Perform updates
            // Using Promise.all for parallel updates might be too much for rate limits if many products.
            // Let's batch them or just do them sequentially if count is low. 
            // Actually, we can't bulk update with different values easily without an upsert.
            // Let's use `upsert` with the calculate values.
            
            const updates = products.map(product => {
                const originalPrice = Number(product.price);
                const newSalePrice = Math.round(originalPrice * discountMultiplier * 100) / 100;
                
                return {
                    ...product,
                    sale_price: newSalePrice,
                    sale_end_date: saleEndDate,
                    updated_at: new Date().toISOString()
                };
            });



            const { error: updateError } = await supabase
                .from('products')
                .upsert(updates);

            if (updateError) throw updateError;

            toast.success(`Applied ${percentage}% discount to ${products.length} products in ${selectedCategory}`);
            setPercentage("");
            setDurationValue("");
            
        } catch (error: any) {

            toast.error(`Failed to apply promotion: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearPromotion = async () => {
        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        if (!confirm(`Are you sure you want to remove sales prices for all products in "${selectedCategory}"?`)) {
            return;
        }

        setIsLoading(true);
        try {
            // Bulk update to set sale_price to null
            const { error } = await supabase
                .from('products')
                .update({ sale_price: null, sale_end_date: null, updated_at: new Date().toISOString() })
                .eq('category', selectedCategory);

            if (error) throw error;

            toast.success(`Removed promotions from ${selectedCategory}`);
        } catch (error: any) {

            toast.error(`Failed to clear promotion: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Promotions</h1>
                    <p className="text-slate-500 mt-1">Manage discounts for product categories.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    
                    {/* Category Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-900">
                            Select Category
                        </label>
                        {isFetching ? (
                            <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
                        ) : (
                            <div className="grid gap-2">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-rosy/20 focus:border-brand-rosy bg-slate-50 hover:bg-white transition-colors cursor-pointer"
                                >
                                    <option value="">-- Choose a category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 px-1">
                                    The promotion will apply to all products in this category.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Discount Input */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-900">
                            Discount Percentage
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={percentage}
                                onChange={(e) => setPercentage(Number(e.target.value))}
                                placeholder="e.g. 20"
                                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-rosy/20 focus:border-brand-rosy transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <Percent size={16} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 px-1">
                            Enter a value between 1 and 100.
                        </p>
                    </div>

                    {/* Duration Input */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-900">
                            Duration (Optional)
                        </label>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min="1"
                                    value={durationValue}
                                    onChange={(e) => setDurationValue(e.target.value)}
                                    placeholder="e.g. 24"
                                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-rosy/20 focus:border-brand-rosy transition-all"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Clock size={16} />
                                </div>
                            </div>
                            <select
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value as 'hours' | 'days')}
                                className="w-32 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-rosy/20 focus:border-brand-rosy bg-slate-50 hover:bg-white transition-colors cursor-pointer"
                            >
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 px-1">
                            Leave empty for indefinite duration.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                        onClick={handleClearPromotion}
                        disabled={isLoading || !selectedCategory}
                        className="px-6 py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        Remove Promotion
                    </button>
                    
                    <button
                        onClick={handleApplyPromotion}
                        disabled={isLoading || !selectedCategory || !percentage}
                        className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        Apply Promotion
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 shrink-0 mt-0.5">
                    <Percent size={14} />
                </div>
                <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How Promotions Work</p>
                    <p className="leading-relaxed opacity-90">
                        Applying a promotion calculates the discounted price based on the original price for every product in the selected category. 
                        The new price is saved as the <strong>Sale Price</strong>. 
                        To end a sale, simply use the "Remove Promotion" button to reset the Sale Price for that category.
                    </p>
                </div>
            </div>
        </div>
    );
}
