import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface OrderEmailProps {
    customerName: string;
    orderNumber: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    shippingAddress: string;
}

export const OrderEmail = ({
    customerName,
    orderNumber,
    items,
    total,
    shippingAddress,
}: OrderEmailProps) => (
    <Html>
        <Head />
        <Preview>Your Kofa Beauty order confirmation - {orderNumber}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={heading}>Order Confirmation</Heading>
                </Section>
                <Section style={section}>
                    <Text style={text}>Hi {customerName},</Text>
                    <Text style={text}>
                        Thank you for your order! We're processing it now and will notify you when it ships.
                    </Text>
                    <Text style={orderLabel}>Order Number: <span style={orderValue}>{orderNumber}</span></Text>
                </Section>
                <Section style={section}>
                    <Heading style={subHeading}>Items Ordered</Heading>
                    {items.map((item, index) => (
                        <Row key={index} style={itemRow}>
                            <Column style={{ textAlign: "left" }}>
                                <Text style={itemName}>{item.name} x {item.quantity}</Text>
                            </Column>
                            <Column style={{ textAlign: "right" }}>
                                <Text style={itemPrice}>GH₵{item.price.toFixed(2)}</Text>
                            </Column>
                        </Row>
                    ))}
                    <Hr style={hr} />
                    <Row>
                        <Column style={{ textAlign: "left" }}>
                            <Text style={totalLabel}>Total</Text>
                        </Column>
                        <Column style={{ textAlign: "right" }}>
                            <Text style={totalValue}>GH₵{total.toFixed(2)}</Text>
                        </Column>
                    </Row>
                </Section>
                <Section style={section}>
                    <Heading style={subHeading}>Shipping Address</Heading>
                    <Text style={text}>{shippingAddress}</Text>
                </Section>
                <Section style={footer}>
                    <Text style={footerText}>
                        If you have any questions, please reply to this email or contact our support team.
                    </Text>
                    <Hr style={hr} />
                    <Text style={copyright}>
                        © {new Date().getFullYear()} Kofa Beauty. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
};

const header = {
    padding: "32px 0",
    textAlign: "center" as const,
};

const heading = {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "300",
    color: "#000000",
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
};

const section = {
    padding: "24px",
    border: "1px solid #f0f0f0",
    marginBottom: "20px",
};

const subHeading = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#000000",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    marginBottom: "16px",
};

const text = {
    fontSize: "14px",
    lineHeight: "24px",
    color: "#4a4a4a",
};

const orderLabel = {
    ...text,
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginTop: "16px",
};

const orderValue = {
    fontWeight: "700",
    color: "#000000",
};

const itemRow = {
    padding: "8px 0",
};

const itemName = {
    fontSize: "14px",
    color: "#000000",
};

const itemPrice = {
    fontSize: "14px",
    color: "#000000",
    fontWeight: "500",
};

const totalLabel = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#000000",
    textTransform: "uppercase" as const,
};

const totalValue = {
    fontSize: "20px",
    fontWeight: "300",
    color: "#000000",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const footer = {
    textAlign: "center" as const,
    padding: "32px 0",
};

const footerText = {
    fontSize: "12px",
    color: "#8898aa",
    lineHeight: "24px",
};

const copyright = {
    fontSize: "12px",
    color: "#8898aa",
    marginTop: "16px",
};
