import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { OrderStatusEmail } from '@/components/emails/OrderStatusEmail';
import type { OrderStatusType } from '@/components/emails/OrderStatusEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerEmail,
            customerName,
            orderNumber,
            newStatus,
            items,
            total,
            currency,
        } = body;

        if (!customerEmail || !orderNumber || !newStatus) {
            return NextResponse.json(
                { message: 'Missing required fields: customerEmail, orderNumber, newStatus' },
                { status: 400 }
            );
        }

        const statusLabels: Record<string, string> = {
            'Processing': 'Order Confirmed',
            'Shipped': 'Order Shipped',
            'Delivered': 'Order Delivered',
            'Cancelled': 'Order Cancelled',
        };

        const subjectLabel = statusLabels[newStatus] || `Status Update: ${newStatus}`;

        const { data, error } = await resend.emails.send({
            from: 'Kofa Beauty <orders@kofabeauty.com>',
            to: customerEmail,
            subject: `${subjectLabel} — Order #${orderNumber}`,
            react: OrderStatusEmail({
                customerName: customerName || 'Valued Customer',
                orderNumber,
                newStatus: newStatus as OrderStatusType,
                items: items || [],
                total: total || 0,
                currency: currency || 'GHS',
            }),
        });

        if (error) {
            console.error('Resend email error:', error);
            return NextResponse.json(
                { success: false, message: 'Failed to send email', error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Status update email sent successfully',
            emailId: data?.id,
        });
    } catch (error: any) {
        console.error('Order status email API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
