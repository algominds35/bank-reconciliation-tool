import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import SendGridService from '@/lib/sendgrid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { clientEmail, clientName, businessName, message } = await request.json()

    // Store message in database
    const { data: messageRecord, error: dbError } = await supabase
      .from('client_messages')
      .insert([{
        client_email: clientEmail,
        client_name: clientName,
        business_name: businessName,
        message: message,
        sent_date: new Date().toISOString(),
        status: 'sent'
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue even if database fails
    }

    // Send message to Jimmie
    await forwardMessageToBookkeeper(clientEmail, clientName, businessName, message)

    // Send confirmation to client
    await sendConfirmationToClient(clientEmail, clientName)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageId: messageRecord?.id
    })

  } catch (error) {
    console.error('Message sending error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

async function forwardMessageToBookkeeper(clientEmail: string, clientName: string, businessName: string, message: string) {
  try {
    const sendGrid = SendGridService.getInstance()
    
    await sendGrid.sendEmail({
      to: 'alex@usealgomind.com',
      subject: `💬 New Message from ${clientName} (${businessName})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>New Client Message</h1>
          </div>
          
          <div style="padding: 20px; background: #f9fafb;">
            <h2>Client Information</h2>
            <p><strong>Name:</strong> ${clientName}</p>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            
            <h2>Message</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong>Action Required:</strong> Please respond to the client within 24 hours to maintain service standards.
            </div>
          </div>
          
          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p>ReconcileBook Client Portal System</p>
          </div>
        </div>
      `,
      text: `
New Client Message

Client Information:
Name: ${clientName}
Business: ${businessName}
Email: ${clientEmail}
Date: ${new Date().toLocaleString()}

Message:
${message}

ACTION REQUIRED: Please respond to the client within 24 hours to maintain service standards.

ReconcileBook Client Portal System
      `
    })
  } catch (error) {
    console.error('Failed to forward message to bookkeeper:', error)
  }
}

async function sendConfirmationToClient(clientEmail: string, clientName: string) {
  try {
    const sendGrid = SendGridService.getInstance()
    
    await sendGrid.sendEmail({
      to: clientEmail,
      subject: 'Message Received - J2 Bookkeeping',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 20px; text-align: center;">
            <h1>Message Received</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2>Hi ${clientName},</h2>
            
            <p>Thank you for your message! We've received it and Jimmie will respond within 24 hours.</p>
            
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
              <h3 style="margin-top: 0;">What happens next:</h3>
              <ul style="margin: 0;">
                <li>Your message has been forwarded to Jimmie Williams</li>
                <li>You'll receive a response within 24 hours</li>
                <li>For urgent matters, call (830) 590-1323</li>
              </ul>
            </div>
            
            <p>You can continue to upload documents or send additional messages through your secure client portal.</p>
            
            <p>Best regards,<br/>
            J2 Bookkeeping Team</p>
          </div>
          
          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p>J2 Bookkeeping - Professional Bookkeeping Services</p>
            <p>Questions? Call (830) 590-1323</p>
          </div>
        </div>
      `,
      text: `
Hi ${clientName},

Thank you for your message! We've received it and Jimmie will respond within 24 hours.

What happens next:
• Your message has been forwarded to Jimmie Williams
• You'll receive a response within 24 hours
• For urgent matters, call (830) 590-1323

You can continue to upload documents or send additional messages through your secure client portal.

Best regards,
J2 Bookkeeping Team

J2 Bookkeeping - Professional Bookkeeping Services
Questions? Call (830) 590-1323
      `
    })
  } catch (error) {
    console.error('Failed to send confirmation to client:', error)
  }
}
