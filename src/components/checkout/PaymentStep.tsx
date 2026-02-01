"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { useOrderStore } from "@/lib/store/useOrderStore";
import { useCartStore } from "@/lib/store/useCartStore";

interface PaymentStepProps {
    formData: any;
    total: number;
    subtotal: number;
    items: any[];
    profileId: string | null;
    onSuccess: () => void;
}

export default function PaymentStep({ 
    formData, 
    total, 
    subtotal,
    items, 
    profileId, 
    onSuccess 
}: PaymentStepProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { addOrder } = useOrderStore();
    const { clearCart } = useCartStore();

    const paystackConfig = {
        email: formData.email,
        amount: Math.round(total * 100),
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "GHS",
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "customer_name",
                    value: `${formData.firstName} ${formData.lastName}`
                }
            ]
        }
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const handleOnSuccess = async (reference: any) => {
        setIsProcessing(true);
        try {
            // 1. Create order in 'Processing' status since payment is confirmed
            const orderPayload = {
                customer_id: profileId,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                total: total,
                status: 'Processing' as const,
            };

            const orderItemsPayload = items.map(item => ({
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
            }));

            const newOrder = await addOrder(orderPayload, orderItemsPayload);
            console.log("Order created after payment:", newOrder.order_number);

            // 2. Send confirmation email
            await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    reference: reference.reference,
                    orderDetails: {
                        email: formData.email,
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        orderNumber: newOrder.order_number,
                        items: items.map(item => ({
                            name: item.product.name,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                        total: total,
                        shippingAddress: `${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}, ${formData.postcode}`,
                    }
                }),
            });

            clearCart();
            onSuccess();
            toast.success("Order placed successfully!");
        } catch (err) {
            console.error("Post-payment error:", err);
            toast.error("Payment successful, but order recording failed. Please contact support with reference: " + reference.reference);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOnClose = () => {
        toast.info("Payment cancelled");
    };

    return (
        <div className="flex flex-col gap-4">
            {isProcessing ? (
                <Button disabled variant="premium-dark" size="lg" className="w-full gap-3">
                    <Loader2 className="animate-spin" size={16} />
                    Processing Order...
                </Button>
            ) : (
                <Button 
                    onClick={() => {
                        // @ts-ignore
                        initializePayment(handleOnSuccess, handleOnClose);
                    }}
                    className="w-full h-14 bg-black text-white hover:bg-neutral-800 transition-colors uppercase text-[10px] tracking-[0.3em] font-bold flex items-center justify-center gap-3"
                >
                    Complete Purchase
                </Button>
            )}
        </div>
    );
}
