"use client";

import { useProductStore } from "@/lib/store/useProductStore";
import { ProductForm } from "@/components/admin/ProductForm";
import { useRouter, useParams } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Product } from "@/lib/store/useProductStore";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const { getProduct } = useProductStore();
    const [product, setProduct] = useState<Product | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            const foundProduct = getProduct(params.id as string);
            setProduct(foundProduct);
            setLoading(false);
        }
    }, [params.id, getProduct]);

    if (loading) return <div>Loading...</div>; // Or a skeleton

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <h2 className="text-xl font-semibold">Product not found</h2>
                <Link href="/admin/products">
                    <Button>Go back to Products</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="pb-10">
            <ProductForm
                initialData={product}
                onSuccess={() => {
                    router.push("/admin/products");
                }}
                onCancel={() => {
                    router.push("/admin/products");
                }}
            />
        </div>
    );
}
