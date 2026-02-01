
import { TextPageLayout } from "@/components/layout/TextPageLayout";
import { Metadata } from "next";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "FAQ | Kofa Beauty",
    description: "Frequently Asked Questions about Kofa Beauty products and shipping.",
};

export default function FaqPage() {
    return (
        <TextPageLayout
            title="Frequently Asked Questions"
            subtitle="Common Queries"
        >
            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="font-playfair text-lg">Where is Kofa Beauty based?</AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            We are proudly based in Accra, Ghana. All our products are shipped from our local warehouse.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="font-playfair text-lg">Do you ship internationally?</AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            Currently, we primarily ship within Ghana. We are working on expanding our shipping to other African countries and internationally soon. Sign up for our newsletter to be the first to know!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="font-playfair text-lg">Are your products cruelty-free?</AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            Yes! Kofa Beauty is committed to being 100% cruelty-free. We do not test our products or ingredients on animals.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="font-playfair text-lg">How long does delivery take?</AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            For orders within Accra, delivery is usually same-day or next-day. For other regions in Ghana, please allow 2-3 business days for delivery.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="font-playfair text-lg">What payment methods do you accept?</AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            We accept Mobile Money payment (MTN, Vodafone, AirtelTigo) and all major Debit/Credit Cards (Visa, Mastercard) via our secure payment partner, Paystack.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </TextPageLayout>
    );
}
