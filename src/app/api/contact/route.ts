import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: 'ReconcileBook Support <support@reconcilebook.com>',
      to: ['alex@usealgomind.com'],
      subject: `[${subject}] Contact Form - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F45B49;">New Contact Form Submission</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2;">
              <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #1976d2;">${email}</a>
            </p>
          </div>
        </div>
      `
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'ReconcileBook Support <support@reconcilebook.com>',
      to: [email],
      subject: 'We received your message - ReconcileBook Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F45B49;">Thank you for contacting ReconcileBook!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your message and our support team will get back to you within 2-4 hours during business hours.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p>If you have any urgent questions, please don't hesitate to reach out to us directly at <a href="mailto:alex@usealgomind.com" style="color: #F45B49;">alex@usealgomind.com</a></p>
          
          <p>Best regards,<br>
          The ReconcileBook Team</p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      emailId: emailResponse.data?.id
    })

  } catch (error) {
    console.error('Error sending contact form:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
