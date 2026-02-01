
import { TextPageLayout } from "@/components/layout/TextPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Store Policy | Kofa Beauty",
    description: "Read about our exchange and refund policies at Kofa Beauty.",
};

export default function StorePolicyPage() {
    return (
        <TextPageLayout
            title="Store Policy"
            subtitle="Exchange & Refunds"
        >
            <h3>1. Return Policy</h3>
            <p>
                Due to the nature of our products (cosmetics and beauty tools), <strong>we do not accept returns or exchanges for hygiene reasons</strong>, unless the item you received is defective or damaged.
            </p>

            <h3>2. Damaged or Defective Items</h3>
            <p>
                We inspect every item before shipping. However, if you receive a defective or damaged item, please contact us immediately at <a href="mailto:info@kofabeauty.com">info@kofabeauty.com</a> with details and photos of the product and the defect.
            </p>
            <ul>
                <li>You must notify us within <strong>48 hours</strong> of receiving the delivery.</li>
                <li>We will examine the issue and notify you via e-mail whether you are entitled to a replacement or refund.</li>
            </ul>

            <h3>3. Refunds</h3>
            <p>
                If your defect claim is approved, we will initiate a refund to your original method of payment (or Mobile Money wallet). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
            </p>

            <h3>4. Order Cancellations</h3>
            <p>
                Orders can only be cancelled within 1 hour of placement. Once an order has been processed for shipping, it cannot be cancelled.
            </p>
        </TextPageLayout>
    );
}
