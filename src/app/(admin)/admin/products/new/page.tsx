"use client";

import { useProductStore } from "@/lib/store/useProductStore";
import { ProductForm } from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
    const router = useRouter();

    return (
        <div className="pb-10">
            <ProductForm
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
