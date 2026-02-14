import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";

async function getProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(3);
    
    if (error) {

        return [];
    }
    
    return data || [];
}

export async function EssentialsDrop() {
    const products = await getProducts();

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
