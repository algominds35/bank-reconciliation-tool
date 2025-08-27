import { NextRequest, NextResponse } from 'next/server'
import SendGridService from '@/lib/sendgrid'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address required' },
        { status: 400 }
      )
    }

    console.log(`🧪 Testing email delivery to: ${email}`)

    const sendGrid = SendGridService.getInstance()
    
    const success = await sendGrid.sendEmail({
      to: email,
      subject: '🧪 ReconcileBook Email Test - SUCCESS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">✅ Email System Working!</h2>
          <p>Congratulations! Your SendGrid integration is working perfectly.</p>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Test Results:</h3>
            <ul>
              <li>✅ SendGrid API Key: Connected</li>
              <li>✅ Email Delivery: Successful</li>
              <li>✅ HTML Formatting: Working</li>
              <li>✅ From Address: Configured</li>
            </ul>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Your reports can now be emailed to clients automatically</li>
            <li>Reminder emails will be delivered</li>
            <li>Client portal notifications are active</li>
          </ol>
          
          <p>This email was sent from your ReconcileBook system at ${new Date().toISOString()}</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            ReconcileBook Pro - AI-Powered Bank Reconciliation<br>
            This is a test email to verify your email delivery system.
          </p>
        </div>
      `,
      text: `
ReconcileBook Email Test - SUCCESS!

Your SendGrid integration is working perfectly!

Test Results:
✅ SendGrid API Key: Connected
✅ Email Delivery: Successful  
✅ HTML Formatting: Working
✅ From Address: Configured

Next Steps:
1. Your reports can now be emailed to clients automatically
2. Reminder emails will be delivered
3. Client portal notifications are active

This email was sent from your ReconcileBook system at ${new Date().toISOString()}
      `
    })

    if (success) {
      return NextResponse.json({
        success: true,
        message: `✅ Test email sent successfully to ${email}`,
        timestamp: new Date().toISOString()
      })
    } else {
      throw new Error('SendGrid delivery failed')
    }

  } catch (error) {
    console.error('❌ Email test failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        troubleshooting: {
          checkApiKey: 'Verify SENDGRID_API_KEY is set in environment variables',
          checkFromEmail: 'Verify SENDGRID_FROM_EMAIL is configured',
          checkDomain: 'Ensure sending domain is verified in SendGrid'
        }
      },
      { status: 500 }
    )
  }
}
