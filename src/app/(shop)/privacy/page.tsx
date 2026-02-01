
import { TextPageLayout } from "@/components/layout/TextPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Kofa Beauty",
    description: "Read our Privacy Policy to understand how we collect, use, and protect your information at Kofa Beauty.",
};

export default function PrivacyPage() {
    return (
        <TextPageLayout
            title="Privacy Policy"
            subtitle="Last Updated: February 2026"
        >
            <h3>1. Introduction</h3>
            <p>
                Welcome to Kofa Beauty. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                (kofabeauty.com) and tell you about your privacy rights and how the law protects you.
            </p>

            <h3>2. Information We Collect</h3>
            <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes payment card details (processed securely by Paystack).</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>

            <h3>3. How We Use Your Data</h3>
            <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h3>4. Data Security</h3>
            <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. Limited access to your personal data is granted only to employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h3>5. Contact Details</h3>
            <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:info@kofabeauty.com">info@kofabeauty.com</a>.
            </p>
        </TextPageLayout>
    );
}
