"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProductStore } from "@/lib/store/useProductStore";
import { toast } from "sonner";
import { Loader2, Plus, X, Upload, Trash2 } from "lucide-react";
import { Product } from "@/lib/supabase/types";
import { useEffect, useState } from "react";

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    category: z.enum(["Face", "Lips", "Eyes", "Sets"]),
    price: z.number().min(0.01, "Price must be greater than 0"),
    sale_price: z.number().nullable().optional(),
    sale_end_date: z.string().nullable().optional(),
    stock: z.number().min(0, "Stock cannot be negative"),
    weight: z.number().optional(),
    status: z.enum(["Active", "Draft", "Out of Stock"]),
    image: z.string().optional().or(z.literal("")),
    images: z.array(z.string()).max(4, "Maximum 4 images allowed").optional(),
    description: z.string().optional(),
    colors: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const PREDEFINED_COLORS = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#008000" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FFC0CB" },
];

export function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const { addProduct, updateProduct, isLoading } = useProductStore();
    const [colorInput, setColorInput] = useState("");
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            sku: "",
            category: "Face",
            price: 0,
            sale_price: null,
            sale_end_date: null,
            stock: 0,
            weight: 0,
            status: "Active",
            image: "",
            images: [],
            description: "",
            colors: [],
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIndex(index ?? -1); // -1 for main generic upload if needed
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            const currentImages = form.getValues("images") || [];
            
            // If index is provided (replacing or adding to specific slot), update that slot
            // Otherwise, append
            let newImages = [...currentImages];
            if (index !== undefined && index < 4) {
                 // For now, simpler logic: just append if within limit unless replacing
                 if (index < newImages.length) {
                     // Replacing existing
                     newImages[index] = data.url;
                 } else {
                     // Adding new at end (if user clicked empty slot 3 but only has 1, we just append effectively)
                     // Actually let's just push for simplicity if it's the 'add' button
                     if(newImages.length < 4) newImages.push(data.url);
                 }
            } else {
                 if(newImages.length < 4) {
                     newImages.push(data.url);
                 }
            }

            form.setValue("images", newImages);
            // Sync main image to first image
            if (newImages.length > 0) {
                form.setValue("image", newImages[0]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setUploadingIndex(null);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images") || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        form.setValue("images", newImages);
        form.setValue("image", newImages[0] || "");
    };

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                sku: initialData.sku,
                category: initialData.category as "Face" | "Lips" | "Eyes" | "Sets",
                price: Number(initialData.price),
                sale_price: initialData.sale_price ? Number(initialData.sale_price) : null,
                sale_end_date: initialData.sale_end_date || null,
                stock: initialData.stock,
                weight: initialData.weight ? Number(initialData.weight) : 0,
                status: initialData.status,
                image: initialData.image || "",
                // @ts-ignore - 'images' might not exist in type if generated types aren't updated yet, but we handle it
                images: initialData.images || (initialData.image ? [initialData.image] : []),
                description: initialData.description || "",
                colors: initialData.colors || [],
            });
        }
    }, [initialData, form]);

    const onSubmit = async (values: ProductFormValues) => {
        try {
            // Ensure images array is set and handle sale price nulls
            const submissionData = {
                ...values,
                sale_price: values.sale_price || null,
                sale_end_date: values.sale_end_date || null,
                images: values.images?.length ? values.images : (values.image ? [values.image] : []),
            };

            if (initialData) {
                // @ts-ignore
                await updateProduct(initialData.id, submissionData);
                toast.success("Product updated successfully");
            } else {
                // @ts-ignore
                await addProduct(submissionData);
                toast.success("Product created successfully");
            }
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("Submission error details:", error);
            const errorMessage = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            toast.error(`Something went wrong: ${errorMessage}`);
        }
    };

    const addColor = () => {
        if (colorInput && !form.getValues("colors")?.includes(colorInput)) {
            const currentColors = form.getValues("colors") || [];
            form.setValue("colors", [...currentColors, colorInput]);
            setColorInput("");
        }
    };
    
    const togglePredefinedColor = (color: string) => {
        const currentColors = form.getValues("colors") || [];
        if (currentColors.includes(color)) {
            form.setValue("colors", currentColors.filter(c => c !== color));
        } else {
            form.setValue("colors", [...currentColors, color]);
        }
    };

    return (
        <div className="bg-white p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold font-heading text-slate-900">
                    {initialData ? "Edit Product" : "Add New Product"}
                </h2>
                {onCancel && (
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Row 1: Name and SKU */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lavender Face Cream" {...field} className="bg-white border-slate-200 h-11" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. CR-001" {...field} className="bg-white border-slate-200 h-11" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Row 2: Category and Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-slate-200 h-11">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Face">Face</SelectItem>
                                            <SelectItem value="Lips">Lips</SelectItem>
                                            <SelectItem value="Eyes">Eyes</SelectItem>
                                            <SelectItem value="Sets">Sets</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Weight (kg)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            placeholder="0.5" 
                                            {...field} 
                                            value={field.value ?? ''}
                                            onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                            className="bg-white border-slate-200 h-11" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Layout Split: Left (Details) & Right (Media/Status) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-slate-700">Description</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Product description..." 
                                                className="min-h-[150px] bg-white border-slate-200 resize-none" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             {/* Pricing & Stock Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Price (GH₵)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    step="0.01" 
                                                    placeholder="0.00" 
                                                    {...field} 
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                                    className="bg-white border-slate-200 h-11" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="sale_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="text-sm font-semibold text-slate-700">Sale Price (GH₵)</FormLabel>
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            form.setValue("sale_price", null);
                                                            form.setValue("sale_end_date", null);
                                                        }}
                                                        className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase tracking-wider"
                                                    >
                                                        Clear Sale
                                                    </button>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    step="0.01" 
                                                    placeholder="0.00 (optional)" 
                                                    {...field} 
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                                                    className="bg-white border-slate-200 h-11" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sale_end_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Sale End Date</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="datetime-local"
                                                    {...field} 
                                                    value={field.value ?? ''}
                                                    className="bg-white border-slate-200 h-11" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Stock Quantity</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field} 
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value))}
                                                    className="bg-white border-slate-200 h-11" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Colors */}
                             <FormField
                                control={form.control}
                                name="colors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-slate-700">Values & Colors</FormLabel>
                                        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
                                            {/* Predefined Swatches */}
                                            <div className="flex flex-wrap gap-2">
                                                {PREDEFINED_COLORS.map((color) => {
                                                    const isSelected = field.value?.includes(color.name);
                                                    return (
                                                        <button
                                                            key={color.name}
                                                            type="button"
                                                            onClick={() => togglePredefinedColor(color.name)}
                                                            className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                                                                isSelected ? "border-slate-900 ring-1 ring-slate-900 scale-110" : "border-gray-200 hover:border-gray-400"
                                                            }`}
                                                            style={{ backgroundColor: color.value }}
                                                            title={color.name}
                                                        >
                                                            {isSelected && color.name === "White" && <div className="w-2 h-2 rounded-full bg-black" />}
                                                            {isSelected && color.name !== "White" && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Custom Color Input */}
                                            <div className="flex gap-2">
                                                <Input 
                                                    value={colorInput} 
                                                    onChange={(e) => setColorInput(e.target.value)} 
                                                    placeholder="Add custom color..." 
                                                    className="bg-white border-slate-200"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addColor();
                                                        }
                                                    }}
                                                />
                                                <Button type="button" onClick={addColor} variant="secondary">Add</Button>
                                            </div>

                                            {/* Selected Colors List */}
                                            <div className="flex flex-wrap gap-2">
                                                {field.value?.map((color, index) => (
                                                    <div key={index} className="flex items-center bg-white px-3 py-1 rounded-full border border-slate-200 text-sm">
                                                        <span className="w-3 h-3 rounded-full mr-2 border border-gray-100" style={{ backgroundColor: color.toLowerCase() }} />
                                                        {color}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => {
                                                                const newColors = field.value?.filter((_, i) => i !== index);
                                                                field.onChange(newColors);
                                                            }}
                                                            className="ml-2 text-slate-400 hover:text-red-500"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!field.value || field.value.length === 0) && (
                                                    <span className="text-sm text-slate-400 italic">No colors selected</span>
                                                )}
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* RIGHT COLUMN (1/3) */}
                        <div className="space-y-6">
                            
                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-slate-700">Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white border-slate-200 h-11">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Product Images (Max 4) */}
                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-slate-700 flex justify-between">
                                            Product Images
                                            <span className="text-xs font-normal text-slate-500">{field.value?.length || 0}/4</span>
                                        </FormLabel>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Array.from({ length: 4 }).map((_, index) => {
                                                const image = field.value?.[index];
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className={`relative aspect-square rounded-lg border-2 ${
                                                            image ? "border-transparent" : "border-dashed border-slate-200 hover:border-slate-300"
                                                        } bg-slate-50 flex flex-col items-center justify-center transition-all overflow-hidden group`}
                                                    >
                                                        {uploadingIndex === index ? (
                                                             <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                                        ) : image ? (
                                                            <>
                                                                <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                {index === 0 && (
                                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] uppercase font-bold text-center py-1">
                                                                        Main Image
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                                                    <Plus className="w-6 h-6 text-slate-300 group-hover:text-slate-400" />
                                                                    <input 
                                                                        type="file" 
                                                                        className="hidden" 
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageUpload(e, index)}
                                                                        disabled={uploadingIndex !== null}
                                                                    />
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                         <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                         {onCancel && (
                             <Button type="button" variant="ghost" onClick={onCancel}>
                                 Cancel
                             </Button>
                         )}
                        <Button type="submit" disabled={isLoading} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                initialData ? "Update Product" : "Save Product"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
