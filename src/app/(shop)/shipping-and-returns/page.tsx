
import { TextPageLayout } from "@/components/layout/TextPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping & Returns | Kofa Beauty",
    description: "Learn about our shipping rates, delivery times, and return process.",
};

export default function ShippingPage() {
    return (
        <TextPageLayout
            title="Shipping & Returns"
            subtitle="Delivery Information"
        >
            <h3>Shipping Rates</h3>
            <p>
                We strive to keep shipping affordable. We effectively offer a <strong>Flat Rate of GHS 25.00</strong> for delivery within Accra.
            </p>
            <ul>
                <li><strong>Accra Delivery:</strong> GHS 25.00 (Flat Rate)</li>
                <li><strong>Greater Accra (Outside City Center):</strong> Calculated at checkout based on distance.</li>
                <li><strong>Other Regions:</strong> Calculated at checkout via courier services.</li>
            </ul>

            <h3>Delivery Times</h3>
            <p>
                <strong>Accra Orders:</strong> Orders placed before 12:00 PM are often delivered the same day. Orders placed after 12:00 PM will be delivered the next business day.
            </p>
            <p>
                <strong>Regional Orders:</strong> Please allow 48-72 hours for delivery via our innovative courier partners.
            </p>

            <h3>Order Tracking</h3>
            <p>
                Once your order is out for delivery, you will receive an email notification. For regional orders, specific waybill numbers will be provided.
            </p>

            <h3>Returns Process</h3>
            <p>
                As stated in our <a href="/store-policy">Store Policy</a>, we do not accept returns on used cosmetic items. If you have received a damaged item, please contact us immediately.
            </p>
        </TextPageLayout>
    );
}
