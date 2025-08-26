import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import SendGridService from '@/lib/sendgrid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json()
    
    // Store in database
    const { data: client, error } = await supabase
      .from('client_intakes')
      .insert([{
        business_name: clientData.businessName,
        business_type: clientData.businessType,
        industry: clientData.industry,
        ein: clientData.ein,
        year_established: clientData.yearEstablished,
        contact_person: clientData.contactPerson,
        title: clientData.title,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zipCode,
        annual_revenue: clientData.annualRevenue,
        number_of_employees: clientData.numberOfEmployees,
        current_bookkeeper: clientData.currentBookkeeper,
        accounting_software: clientData.accountingSoftware,
        bank_accounts: clientData.bankAccounts,
        services_needed: clientData.servicesNeeded,
        frequency: clientData.frequency,
        start_date: clientData.startDate,
        special_requirements: clientData.specialRequirements,
        referral_source: clientData.referralSource,
        goals: clientData.goals,
        challenges: clientData.challenges,
        status: 'new',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send notification emails
    await sendNotificationEmails(clientData)

    // Trigger automated welcome sequence
    await triggerWelcomeSequence(clientData)

    return NextResponse.json({
      success: true,
      message: 'Client intake submitted successfully',
      clientId: client.id
    })

  } catch (error) {
    console.error('Client intake API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit client intake',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function sendNotificationEmails(clientData: any) {
  try {
    const sendGrid = SendGridService.getInstance()

    // Send confirmation email to client
    const clientEmailTemplate = generateClientConfirmationEmail(clientData)
    await sendGrid.sendEmail({
      to: clientData.email,
      subject: clientEmailTemplate.subject,
      html: clientEmailTemplate.html,
      text: clientEmailTemplate.text
    })

    // Send notification to admin
    const adminEmailTemplate = generateAdminNotificationEmail(clientData)
    await sendGrid.sendEmail({
      to: 'alex@usealgomind.com',
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
      text: adminEmailTemplate.text
    })

  } catch (error) {
    console.error('Failed to send notification emails:', error)
  }
}

async function triggerWelcomeSequence(clientData: any) {
  try {
    // Schedule welcome email sequence
    // This would typically use a job queue or cron job
    // For now, we'll just log it
    console.log(`Welcome sequence triggered for ${clientData.businessName}`)
    
    // In a real system, you'd:
    // 1. Schedule Day 1: Welcome email with next steps
    // 2. Schedule Day 3: Document request reminder
    // 3. Schedule Day 7: Check-in email
    // 4. Schedule Day 14: Follow-up if no response
    
  } catch (error) {
    console.error('Failed to trigger welcome sequence:', error)
  }
}

function generateClientConfirmationEmail(clientData: any) {
  return {
    subject: `Welcome to J2 Bookkeeping, ${clientData.businessName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to J2 Bookkeeping</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .next-steps { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #374151; color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to J2 Bookkeeping!</h1>
        </div>
        
        <div class="content">
            <h2>Thank you, ${clientData.contactPerson}!</h2>
            <p>We've received your information for <strong>${clientData.businessName}</strong> and are excited to help streamline your financial operations.</p>
            
            <div class="next-steps">
                <h3>🎯 What Happens Next:</h3>
                <ol>
                    <li><strong>Review & Analysis</strong> - We'll analyze your business needs (24 hours)</li>
                    <li><strong>Consultation Call</strong> - Schedule a call to discuss your custom plan</li>
                    <li><strong>Service Agreement</strong> - Finalize your service package</li>
                    <li><strong>Onboarding</strong> - Get you set up and running (5 business days)</li>
                </ol>
            </div>
            
            <p><strong>Services Requested:</strong></p>
            <ul>
                ${clientData.servicesNeeded.map((service: string) => `<li>${service}</li>`).join('')}
            </ul>
            
            <p>We'll contact you within 24 hours to schedule your consultation.</p>
        </div>
        
        <div class="footer">
            <p>J2 Bookkeeping - Professional Bookkeeping Services</p>
            <p>Questions? Reply to this email or call (830) 590-1323</p>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Welcome to J2 Bookkeeping, ${clientData.contactPerson}!

We've received your information for ${clientData.businessName} and are excited to help streamline your financial operations.

What Happens Next:
1. Review & Analysis - We'll analyze your business needs (24 hours)
2. Consultation Call - Schedule a call to discuss your custom plan  
3. Service Agreement - Finalize your service package
4. Onboarding - Get you set up and running (5 business days)

Services Requested:
${clientData.servicesNeeded.join('\n')}

We'll contact you within 24 hours to schedule your consultation.

J2 Bookkeeping - Professional Bookkeeping Services
Questions? Reply to this email or call (830) 590-1323
    `
  }
}

function generateAdminNotificationEmail(clientData: any) {
  return {
    subject: `🚀 New Client Intake: ${clientData.businessName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <title>New Client Intake</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .info-item { padding: 10px; background: #f3f4f6; border-radius: 4px; }
        .priority { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Client Intake Received!</h1>
        </div>
        
        <div class="content">
            <div class="priority">
                <strong>Action Required:</strong> Contact within 24 hours to maintain service standard
            </div>
            
            <h2>Business Information</h2>
            <div class="info-grid">
                <div class="info-item"><strong>Business:</strong> ${clientData.businessName}</div>
                <div class="info-item"><strong>Industry:</strong> ${clientData.industry}</div>
                <div class="info-item"><strong>Contact:</strong> ${clientData.contactPerson}</div>
                <div class="info-item"><strong>Title:</strong> ${clientData.title}</div>
                <div class="info-item"><strong>Email:</strong> ${clientData.email}</div>
                <div class="info-item"><strong>Phone:</strong> ${clientData.phone}</div>
                <div class="info-item"><strong>Revenue:</strong> ${clientData.annualRevenue}</div>
                <div class="info-item"><strong>Employees:</strong> ${clientData.numberOfEmployees}</div>
            </div>
            
            <h3>Services Needed (${clientData.frequency}):</h3>
            <ul>
                ${clientData.servicesNeeded.map((service: string) => `<li>${service}</li>`).join('')}
            </ul>
            
            <h3>Current Challenges:</h3>
            <p>${clientData.challenges || 'None specified'}</p>
            
            <h3>Business Goals:</h3>
            <p>${clientData.goals || 'None specified'}</p>
            
            <h3>Special Requirements:</h3>
            <p>${clientData.specialRequirements || 'None specified'}</p>
            
            <div class="priority">
                <strong>Referral Source:</strong> ${clientData.referralSource}<br/>
                <strong>Preferred Start:</strong> ${clientData.startDate || 'ASAP'}
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
New Client Intake Received!

ACTION REQUIRED: Contact within 24 hours

Business: ${clientData.businessName}
Contact: ${clientData.contactPerson} (${clientData.title})
Email: ${clientData.email}
Phone: ${clientData.phone}
Industry: ${clientData.industry}
Revenue: ${clientData.annualRevenue}
Employees: ${clientData.numberOfEmployees}

Services Needed (${clientData.frequency}):
${clientData.servicesNeeded.join('\n')}

Current Challenges: ${clientData.challenges || 'None specified'}
Business Goals: ${clientData.goals || 'None specified'}
Special Requirements: ${clientData.specialRequirements || 'None specified'}

Referral Source: ${clientData.referralSource}
Preferred Start: ${clientData.startDate || 'ASAP'}
    `
  }
}
