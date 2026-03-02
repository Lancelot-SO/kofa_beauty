import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

import { formatPrice } from "@/lib/utils/price";
import { CurrencyCode } from "@/lib/constants/currency";

export type OrderStatusType = 'Pending Payment' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderStatusEmailProps {
    customerName: string;
    orderNumber: string;
    newStatus: OrderStatusType;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    currency?: CurrencyCode;
}

// Map statuses to the 4 tracking stages (Pending Payment is stage 0 / pre-tracking)
const TRACKING_STAGES = [
    { key: 'Processing', label: 'Order Confirmed', icon: '✓', description: 'Payment received & confirmed' },
    { key: 'Shipped', label: 'Shipped', icon: '📦', description: 'Package is on its way' },
    { key: 'Delivered', label: 'Delivered', icon: '🎉', description: 'Successfully delivered' },
] as const;

const STATUS_MESSAGES: Record<OrderStatusType, { heading: string; body: string }> = {
    'Pending Payment': {
        heading: 'Awaiting Payment',
        body: 'Your order has been created and is awaiting payment confirmation.',
    },
    'Processing': {
        heading: 'Order Confirmed! 🎉',
        body: 'Great news! Your payment has been confirmed and your order is now being prepared with care.',
    },
    'Shipped': {
        heading: 'Your Order is On Its Way! 🚚',
        body: 'Exciting news! Your order has been shipped and is on its way to you. The rider will contact you upon arrival for delivery fee settlement.',
    },
    'Delivered': {
        heading: 'Order Delivered! ✨',
        body: 'Your order has been successfully delivered. We hope you love your products! Thank you for shopping with Kofa Beauty.',
    },
    'Cancelled': {
        heading: 'Order Cancelled',
        body: 'Your order has been cancelled. If you did not request this cancellation, please contact our support team immediately.',
    },
};

function getStageState(stageKey: string, currentStatus: OrderStatusType) {
    const stageOrder = ['Processing', 'Shipped', 'Delivered'];
    const stageIndex = stageOrder.indexOf(stageKey);
    const currentIndex = stageOrder.indexOf(currentStatus);

    if (currentIndex === -1) return 'upcoming'; // Pending Payment or Cancelled
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
}

export const OrderStatusEmail = ({
    customerName,
    orderNumber,
    newStatus,
    items,
    total,
    currency = 'GHS',
}: OrderStatusEmailProps) => {
    const statusInfo = STATUS_MESSAGES[newStatus];
    const isCancelled = newStatus === 'Cancelled';

    return (
        <Html>
            <Head />
            <Preview>Order {orderNumber} — {statusInfo.heading}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Brand Header */}
                    <Section style={brandHeader}>
                        <Text style={brandName}>KOFA BEAUTY</Text>
                    </Section>

                    {/* Status Banner */}
                    <Section style={isCancelled ? cancelledBanner : statusBanner}>
                        <Heading style={isCancelled ? cancelledHeading : statusHeading}>
                            {statusInfo.heading}
                        </Heading>
                        <Text style={isCancelled ? cancelledSubtext : statusSubtext}>
                            Order #{orderNumber}
                        </Text>
                    </Section>

                    {/* Greeting + Message */}
                    <Section style={section}>
                        <Text style={text}>Hi {customerName},</Text>
                        <Text style={text}>{statusInfo.body}</Text>
                    </Section>

                    {/* Tracking Timeline — only for non-cancelled orders */}
                    {!isCancelled && (
                        <Section style={section}>
                            <Heading style={subHeading}>Order Tracking</Heading>
                            <Section style={trackingContainer}>
                                {TRACKING_STAGES.map((stage, index) => {
                                    const state = getStageState(stage.key, newStatus);
                                    const isLast = index === TRACKING_STAGES.length - 1;

                                    return (
                                        <Row key={stage.key} style={trackingRow}>
                                            {/* Circle + Line Column */}
                                            <Column style={trackingIndicatorColumn}>
                                                {/* Circle */}
                                                <div style={{
                                                    ...trackingCircle,
                                                    ...(state === 'completed' ? circleCompleted : {}),
                                                    ...(state === 'current' ? circleCurrent : {}),
                                                    ...(state === 'upcoming' ? circleUpcoming : {}),
                                                }}>
                                                    <span style={{
                                                        fontSize: state === 'completed' ? '14px' : '16px',
                                                        lineHeight: '1',
                                                    }}>
                                                        {state === 'completed' ? '✓' : stage.icon}
                                                    </span>
                                                </div>
                                                {/* Connector Line */}
                                                {!isLast && (
                                                    <div style={{
                                                        ...connectorLine,
                                                        backgroundColor: state === 'completed' ? '#16a34a' : '#e2e8f0',
                                                    }} />
                                                )}
                                            </Column>
                                            {/* Label + Description Column */}
                                            <Column style={trackingLabelColumn}>
                                                <Text style={{
                                                    ...trackingLabel,
                                                    color: state === 'upcoming' ? '#94a3b8' : '#0f172a',
                                                    fontWeight: state === 'current' ? '700' : '600',
                                                }}>
                                                    {stage.label}
                                                </Text>
                                                <Text style={{
                                                    ...trackingDescription,
                                                    color: state === 'upcoming' ? '#cbd5e1' : '#64748b',
                                                }}>
                                                    {stage.description}
                                                </Text>
                                            </Column>
                                        </Row>
                                    );
                                })}
                            </Section>
                        </Section>
                    )}

                    {/* Order Items */}
                    <Section style={section}>
                        <Heading style={subHeading}>Your Items</Heading>
                        {items.map((item, index) => (
                            <Row key={index} style={itemRow}>
                                <Column style={{ textAlign: "left" }}>
                                    <Text style={itemName}>{item.name} × {item.quantity}</Text>
                                </Column>
                                <Column style={{ textAlign: "right" }}>
                                    <Text style={itemPrice}>{formatPrice(item.price * item.quantity, currency)}</Text>
                                </Column>
                            </Row>
                        ))}
                        <Hr style={hr} />
                        <Row>
                            <Column style={{ textAlign: "left" }}>
                                <Text style={totalLabel}>Total</Text>
                            </Column>
                            <Column style={{ textAlign: "right" }}>
                                <Text style={totalValue}>{formatPrice(total, currency)}</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Need help? Reply to this email or reach out to our support team.
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
};

// ─── Styles ─────────────────────────────────────────────

const main: React.CSSProperties = {
    backgroundColor: "#f8fafc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: React.CSSProperties = {
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "580px",
};

const brandHeader: React.CSSProperties = {
    textAlign: "center",
    padding: "24px 0 16px",
};

const brandName: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "300",
    letterSpacing: "0.35em",
    color: "#0f172a",
    textTransform: "uppercase",
    margin: "0",
};

const statusBanner: React.CSSProperties = {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderRadius: "12px",
    padding: "32px 24px",
    textAlign: "center",
    marginBottom: "24px",
};

const cancelledBanner: React.CSSProperties = {
    background: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",
    borderRadius: "12px",
    padding: "32px 24px",
    textAlign: "center",
    marginBottom: "24px",
};

const statusHeading: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px 0",
    lineHeight: "1.3",
};

const cancelledHeading: React.CSSProperties = {
    ...statusHeading,
};

const statusSubtext: React.CSSProperties = {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "0",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
};

const cancelledSubtext: React.CSSProperties = {
    ...statusSubtext,
    color: "#fecaca",
};

const section: React.CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "16px",
};

const subHeading: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: "0 0 20px 0",
};

const text: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: "24px",
    color: "#334155",
    margin: "0 0 12px 0",
};

// ─── Tracking Timeline Styles ───────────────────────────

const trackingContainer: React.CSSProperties = {
    padding: "8px 0",
};

const trackingRow: React.CSSProperties = {
    verticalAlign: "top",
};

const trackingIndicatorColumn: React.CSSProperties = {
    width: "48px",
    verticalAlign: "top",
    textAlign: "center",
};

const trackingCircle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    textAlign: "center",
    lineHeight: "40px",
};

const circleCompleted: React.CSSProperties = {
    backgroundColor: "#16a34a",
    color: "#ffffff",
};

const circleCurrent: React.CSSProperties = {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    boxShadow: "0 0 0 4px #e2e8f0, 0 0 0 6px #0f172a",
};

const circleUpcoming: React.CSSProperties = {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
    border: "2px solid #e2e8f0",
};

const connectorLine: React.CSSProperties = {
    width: "3px",
    height: "28px",
    margin: "4px auto",
    borderRadius: "2px",
};

const trackingLabelColumn: React.CSSProperties = {
    verticalAlign: "top",
    paddingLeft: "12px",
    paddingBottom: "20px",
};

const trackingLabel: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 2px 0",
    lineHeight: "1.4",
    paddingTop: "8px",
};

const trackingDescription: React.CSSProperties = {
    fontSize: "12px",
    margin: "0",
    lineHeight: "1.4",
};

// ─── Item Styles ────────────────────────────────────────

const itemRow: React.CSSProperties = {
    padding: "8px 0",
};

const itemName: React.CSSProperties = {
    fontSize: "14px",
    color: "#0f172a",
    margin: "0",
};

const itemPrice: React.CSSProperties = {
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "600",
    margin: "0",
};

const totalLabel: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0",
};

const totalValue: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0",
};

const hr: React.CSSProperties = {
    borderColor: "#e2e8f0",
    margin: "16px 0",
};

const footer: React.CSSProperties = {
    textAlign: "center",
    padding: "24px 0",
};

const footerText: React.CSSProperties = {
    fontSize: "12px",
    color: "#94a3b8",
    lineHeight: "20px",
};

const copyright: React.CSSProperties = {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "12px",
};
