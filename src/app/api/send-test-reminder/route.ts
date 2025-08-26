import { NextRequest, NextResponse } from 'next/server'
import SendGridService from '@/lib/sendgrid'

export async function POST(request: NextRequest) {
  try {
    const { templateId, testEmail } = await request.json()

    // Get template (for now using hardcoded templates, in real app would fetch from DB)
    const templates = {
      'welcome-day1': {
        subject: 'Welcome to J2 Bookkeeping - Next Steps',
        message: `Hi Test Client,

Welcome to J2 Bookkeeping! We're excited to help streamline your financial operations.

Here's what happens next:
• We'll review your business requirements
• Schedule your consultation call within 24 hours
• Create your custom service plan
• Begin onboarding within 5 business days

Please have the following ready for our call:
✓ Recent bank statements (last 3 months)
✓ Current accounting software access
✓ List of specific pain points you want to solve

We'll be in touch soon!

Best regards,
Jimmie Williams
J2 Bookkeeping

---
This is a test email from the automated reminder system.`
      },
      'document-reminder': {
        subject: 'Missing Documents - Test Client',
        message: `Hi Test Client,

I hope you're doing well! I wanted to follow up on the documents we discussed for your bookkeeping setup.

Still needed:
• Bank statements (last 3 months)
• Credit card statements
• Current QuickBooks file (if applicable)
• Vendor and customer lists

Having these documents will help us get your books up to date quickly and accurately.

Could you please upload these to your secure client portal or email them to me by next Friday?

Thanks!
Jimmie

---
This is a test email from the automated reminder system.`
      },
      'monthly-checkin': {
        subject: 'Monthly Financial Update - Test Client',
        message: `Hi Test Client,

Hope your business is going well! Time for our monthly check-in.

This month I've completed:
✓ Bank reconciliation for all accounts
✓ Categorized all transactions
✓ Updated your financial statements
✓ Identified any discrepancies or issues

Your reports are ready and will be sent separately. 

Questions for you:
1. Any new business expenses or income sources?
2. Planning any major purchases or investments?
3. Any bookkeeping concerns or questions?

Let me know if you'd like to schedule a quick call to review your numbers.

Best,
Jimmie

---
This is a test email from the automated reminder system.`
      }
    }

    const template = templates[templateId as keyof typeof templates]
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    const sendGrid = SendGridService.getInstance()
    
    const success = await sendGrid.sendEmail({
      to: testEmail,
      subject: `[TEST] ${template.subject}`,
      html: template.message.replace(/\n/g, '<br>'),
      text: template.message
    })

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully'
      })
    } else {
      throw new Error('Failed to send email')
    }

  } catch (error) {
    console.error('Error sending test reminder:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
