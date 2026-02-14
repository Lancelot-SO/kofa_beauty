"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { useOrderStore } from "@/lib/store/useOrderStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { getEffectivePrice } from "@/lib/utils/price";

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

    const [orderNumber] = useState(() => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `KB-${timestamp}-${random}`;
    });

    const paystackConfig = {
        email: formData.email,
        amount: Math.round(total * 100),
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "GHS",
        reference: orderNumber, // Use our generated order number as Paystack reference
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "customer_name",
                    value: `${formData.firstName} ${formData.lastName}`
                },
                {
                    display_name: "Order Number",
                    variable_name: "order_number",
                    value: orderNumber
                }
            ]
        }
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // 1. Create order immediately as 'Pending Payment'
            const orderPayload = {
                customer_id: profileId,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                total: total,
                status: 'Pending Payment' as const,
                order_number: orderNumber,
                phone: formData.phone,
                address: formData.address,
                apartment: formData.apartment || null,
                city: formData.city,
                postcode: formData.postcode,
            };

            const orderItemsPayload = items.map(item => ({
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price: getEffectivePrice(item.product),
            }));

            // Create the order in DB first
            const newOrder = await addOrder(orderPayload, orderItemsPayload);


            // 2. Initialize Paystack Payment
            initializePayment({
                onSuccess: async (reference: any) => {
                    try {

                        const { updateOrderStatus } = useOrderStore.getState();
                        
                        // 3. Update order status to Processing
                        await updateOrderStatus(newOrder.id, 'Processing');

                        // 4. Send Confirmation Email
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
                                        price: getEffectivePrice(item.product),
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

                        toast.error("Payment received, but order update failed. Please contact support.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                onClose: () => {
                    setIsProcessing(false);
                    toast.info("Payment cancelled. Your order has been saved as Pending.");
                }
            });

        } catch (err: any) {

            setIsProcessing(false);
            const errorMessage = err?.message || "Please try again.";
            toast.error(`Failed to initialize order: ${errorMessage}`);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {isProcessing ? (
                <Button disabled variant="premium-dark" size="lg" className="w-full gap-3">
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                </Button>
            ) : (
                <Button 
                    onClick={handlePayment}
                    className="w-full h-14 bg-black text-white hover:bg-neutral-800 transition-colors uppercase text-[10px] tracking-[0.3em] font-bold flex items-center justify-center gap-3"
                >
                    Confirm Order
                </Button>
            )}
        </div>
    );
}
