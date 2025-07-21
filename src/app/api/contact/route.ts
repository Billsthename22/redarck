/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/app/api/lib/mongodb';
import contact from '../model/contact';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to database first
    const contactMessage = new contact({
      name,
      email,
      message
    });

    await contactMessage.save();

    // Send email in background
    setImmediate(async () => {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev', // Use your verified domain
          to: process.env.EMAIL_TO!,
          subject: `New Contact Form Message from ${name}`,
          replyTo: email,
          html: `
            <h3>New Contact Form Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          `,
        });

        await contact.findByIdAndUpdate(contactMessage._id, { emailSent: true });
        console.log('✅ Email sent successfully via Resend');
      } catch (emailError: any) {
        console.error('❌ Email Error:', emailError.message);
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });

  } catch (error: any) {
    console.error('❌ Contact Error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to process your message. Please try again.', 
      details: error.message 
    }, { status: 500 });
  }
}