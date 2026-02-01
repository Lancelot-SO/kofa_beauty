import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send email
        const data = await resend.emails.send({
            from: 'Kofa Beauty <onboarding@resend.dev>', // Default Resend test domain
            to: ['carrine@kofabeauty.com'], // In prod this should be env var, but using this for now as user requested
            subject: `New Contact Form: ${subject || 'No Subject'}`,
            replyTo: email,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #000;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        });

        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, da: data });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
