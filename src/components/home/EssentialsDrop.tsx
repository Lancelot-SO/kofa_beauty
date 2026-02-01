import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/supabase/types";

export function EssentialsDrop() {
    const products: Product[] = [
        {
            id: "1",
            name: "12 Piece Brush Set",
            description: "Essential brush set for all your makeup needs.",
            price: 30.00,
            sale_price: null,
            image: "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=2525&auto=format&fit=crop",
            images: [],
            stock: 45,
            status: "Active",
            category: "Brushes",
            sku: "KB-BR-12",
            weight: 0.5,
            colors: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "2",
            name: "Long-Lasting Lipgloss",
            description: "High-shine lipgloss that stays on all day.",
            price: 18.00,
            sale_price: null,
            image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2670&auto=format&fit=crop",
            images: [],
            stock: 12,
            status: "Active",
            category: "Lips",
            sku: "KB-LIP-01",
            weight: 0.1,
            colors: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "3",
            name: "Cat Eye Strip Lashes",
            description: "Dramatic cat-eye lashes for a bold look.",
            price: 10.00,
            sale_price: null,
            image: "https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?q=80&w=2620&auto=format&fit=crop",
            images: [],
            stock: 0,
            status: "Out of Stock",
            category: "Lashes",
            sku: "KB-LASH-03",
            weight: 0.05,
            colors: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    return (
        <section className="py-20 bg-brand-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Reveal>
                        <h4 className="text-sm font-bold tracking-widest text-gray-500 mb-2">DON'T MISS OUT</h4>
                    </Reveal>
                    <Reveal delay={200}>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold tracking-wide text-black uppercase">
                            The Essentials Drop
                        </h2>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <Reveal key={product.id} delay={index * 200}>
                            <ProductCard product={product} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
