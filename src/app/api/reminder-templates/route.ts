import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: templates, error } = await supabase
      .from('reminder_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      templates: templates || []
    })

  } catch (error) {
    console.error('Error fetching reminder templates:', error)
    
    // Return default templates if database fails
    const defaultTemplates = [
      {
        id: 'welcome-day1',
        name: 'Welcome Email (Day 1)',
        subject: 'Welcome to J2 Bookkeeping - Next Steps',
        message: `Hi {CLIENT_NAME},

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
J2 Bookkeeping`,
        trigger_type: 'days_after',
        trigger_value: 1,
        is_active: true,
        category: 'onboarding'
      },
      {
        id: 'document-reminder',
        name: 'Document Request Reminder',
        subject: 'Missing Documents - {CLIENT_NAME}',
        message: `Hi {CLIENT_NAME},

I hope you're doing well! I wanted to follow up on the documents we discussed for your bookkeeping setup.

Still needed:
• Bank statements (last 3 months)
• Credit card statements
• Current QuickBooks file (if applicable)
• Vendor and customer lists

Having these documents will help us get your books up to date quickly and accurately.

Could you please upload these to your secure client portal or email them to me by {DUE_DATE}?

Thanks!
Jimmie`,
        trigger_type: 'days_after',
        trigger_value: 3,
        is_active: true,
        category: 'documents'
      },
      {
        id: 'monthly-checkin',
        name: 'Monthly Check-in',
        subject: 'Monthly Financial Update - {CLIENT_NAME}',
        message: `Hi {CLIENT_NAME},

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
Jimmie`,
        trigger_type: 'monthly',
        trigger_value: 1,
        is_active: true,
        category: 'reporting'
      }
    ]

    return NextResponse.json({
      success: true,
      templates: defaultTemplates
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const template = await request.json()

    const { data, error } = await supabase
      .from('reminder_templates')
      .upsert([{
        id: template.id,
        name: template.name,
        subject: template.subject,
        message: template.message,
        trigger_type: template.triggerType,
        trigger_value: template.triggerValue,
        is_active: template.isActive,
        category: template.category,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      template: data
    })

  } catch (error) {
    console.error('Error saving reminder template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save template' },
      { status: 500 }
    )
  }
}
