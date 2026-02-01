
import { TextPageLayout } from "@/components/layout/TextPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Kofa Beauty",
    description: "Review the Terms of Service for Kofa Beauty. These terms govern your use of our website and purchase of our products.",
};

export default function TermsPage() {
    return (
        <TextPageLayout
            title="Terms of Service"
            subtitle="Last Updated: February 2026"
        >
            <h3>1. Agreement to Terms</h3>
            <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Kofa Beauty ("we," "us" or "our"), concerning your access to and use of the kofabeauty.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
            </p>

            <h3>2. User Representations</h3>
            <p>
                By using the Site, you represent and warrant that:
            </p>
            <ul>
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                <li>You are not under the age of 13.</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
            </ul>

            <h3>3. Products</h3>
            <p>
                We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
            </p>

            <h3>4. Purchases and Payment</h3>
            <p>
                We accept the following forms of payment: Visa, Mastercard, Mobile Money (via Paystack). You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update your account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
            </p>

            <h3>5. Return Policy</h3>
            <p>
               Please review our Return Policy posted on the Site prior to making any purchases.
            </p>

            <h3>6. Contact Us</h3>
            <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:info@kofabeauty.com">info@kofabeauty.com</a>
            </p>
        </TextPageLayout>
    );
}
