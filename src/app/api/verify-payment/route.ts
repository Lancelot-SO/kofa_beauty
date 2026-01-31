import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { OrderEmail } from '@/components/emails/OrderEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { reference, orderDetails } = await request.json();

        if (!reference) {
            return NextResponse.json(
                { message: 'Reference is required' },
                { status: 400 }
            );
        }

        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            // Send Order Confirmation Email
            if (orderDetails) {
                try {
                    await resend.emails.send({
                        from: 'Kofa Beauty <onboarding@resend.dev>', // Replace with your verified domain
                        to: orderDetails.email,
                        subject: `Order Confirmation - ${orderDetails.orderNumber || reference}`,
                        react: OrderEmail({
                            customerName: orderDetails.customerName,
                            orderNumber: orderDetails.orderNumber || reference,
                            items: orderDetails.items,
                            total: orderDetails.total,
                            shippingAddress: orderDetails.shippingAddress,
                        }),
                    });
                } catch (emailError) {
                    console.error('Failed to send order email:', emailError);
                    // Don't fail the whole request if email fails
                }
            }

            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
                data: data.data,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || 'Payment verification failed',
                },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('Paystack verification error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
