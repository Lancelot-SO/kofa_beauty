"use client";

import { usePaystackPayment } from "react-paystack";

interface PaystackButtonProps {
    config: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export default function PaystackButton({ 
    config, 
    onSuccess, 
    onClose, 
    className, 
    children, 
    disabled 
}: PaystackButtonProps) {
    const initializePayment = usePaystackPayment(config);

    return (
        <button 
            type="button"
            onClick={() => {
                // @ts-ignore
                initializePayment(onSuccess, onClose);
            }}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
