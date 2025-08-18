import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EmailSendResult, EmailTemplateVariables } from '@/types/invoice-collections';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { user_id, invoice_id, reminder_type, custom_message } = await req.json();

    if (!user_id || !invoice_id || !reminder_type) {
      return NextResponse.json({
        success: false,
        message: 'User ID, Invoice ID, and Reminder Type are required'
      }, { status: 400 });
    }

    // Get invoice with client information
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(
          id,
          company_name,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', invoice_id)
      .eq('user_id', user_id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({
        success: false,
        message: 'Invoice not found'
      }, { status: 404 });
    }

    if (!invoice.client?.email) {
      return NextResponse.json({
        success: false,
        message: 'Client email not found'
      }, { status: 400 });
    }

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('user_id', user_id)
      .eq('template_type', reminder_type)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json({
        success: false,
        message: 'Email template not found'
      }, { status: 404 });
    }

    // Process template variables
    const templateVars: EmailTemplateVariables = {
      client_name: getClientName(invoice.client),
      invoice_number: invoice.invoice_number,
      amount: formatCurrency(invoice.balance),
      due_date: formatDate(invoice.due_date),
      days_overdue: invoice.days_overdue,
      your_name: 'Your Company Name', // This should come from user settings
      deadline_date: invoice.days_overdue > 14 ? formatDate(addDays(new Date(), 2)) : undefined
    };

    const processedSubject = processTemplate(template.subject_line, templateVars);
    const processedBody = processTemplate(template.email_body, templateVars);

    // Send email (using a placeholder for now - you'll need to integrate with your email service)
    const emailResult = await sendEmail({
      to: invoice.client.email,
      subject: processedSubject,
      body: processedBody,
      from: 'noreply@yourcompany.com' // This should come from user settings
    });

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email',
        error: emailResult.error
      }, { status: 500 });
    }

    // Create email campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        user_id,
        invoice_id,
        client_id: invoice.client.id,
        campaign_type: reminder_type,
        email_subject: processedSubject,
        email_body: processedBody,
        recipient_email: invoice.client.email,
        sent_at: new Date().toISOString()
      })
      .select()
      .single();

    if (campaignError) {
      console.error('Failed to create campaign record:', campaignError);
    }

    // Update payment reminder
    await supabase
      .from('payment_reminders')
      .update({
        last_sent_date: new Date().toISOString(),
        next_send_date: calculateNextReminderDate(invoice.days_overdue, reminder_type)
      })
      .eq('invoice_id', invoice_id)
      .eq('is_active', true);

    // Update invoice reminder status
    await supabase
      .from('invoices')
      .update({
        last_reminder_sent: new Date().toISOString(),
        next_reminder_date: calculateNextReminderDate(invoice.days_overdue, reminder_type)
      })
      .eq('id', invoice_id);

    return NextResponse.json({
      success: true,
      campaign_id: campaign?.id,
      message_id: emailResult.message_id,
      message: 'Reminder email sent successfully'
    });

  } catch (error) {
    console.error('Send reminder error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getClientName(client: any): string {
  if (client.company_name) {
    return client.company_name;
  }
  
  const firstName = client.first_name || '';
  const lastName = client.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName || lastName || 'Valued Client';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function processTemplate(template: string, variables: EmailTemplateVariables): string {
  let processed = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`{${key}}`, 'g');
      processed = processed.replace(regex, String(value));
    }
  });
  
  return processed;
}

async function sendEmail({ to, subject, body, from }: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<EmailSendResult> {
  try {
    // This is a placeholder - you'll need to integrate with your email service
    // Options include: SendGrid, Mailgun, AWS SES, Resend, etc.
    
    // For now, we'll simulate a successful email send
    console.log('Sending email:', { to, subject, from });
    console.log('Email body:', body);
    
    // Simulate email service response
    return {
      success: true,
      message_id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to,
      from,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };
    
    await sgMail.send(msg);
    
    return {
      success: true,
      message_id: `sg_${Date.now()}`
    };
    */
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email send failed'
    };
  }
}

function calculateNextReminderDate(daysOverdue: number, reminderType: string): string {
  const today = new Date();
  
  switch (reminderType) {
    case 'friendly':
      // Send next reminder in 3 days
      return addDays(today, 3).toISOString().split('T')[0];
    case 'firm':
      // Send next reminder in 2 days
      return addDays(today, 2).toISOString().split('T')[0];
    case 'final':
      // Send next reminder in 1 day
      return addDays(today, 1).toISOString().split('T')[0];
    default:
      // Default to 3 days
      return addDays(today, 3).toISOString().split('T')[0];
  }
}
