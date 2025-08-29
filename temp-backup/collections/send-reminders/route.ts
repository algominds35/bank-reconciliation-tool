import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import SendGridService, { PaymentReminderData } from '@/lib/sendgrid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Starting payment reminder process...')
    
    const body = await req.json()
    const { invoice_id, user_id } = body
    
    let query = supabase
      .from('invoices')
      .select(`
        *,
        clients (
          name,
          email
        )
      `)
      .eq('status', 'pending')
      .not('due_date', 'is', null)
    
    // If specific invoice_id provided, only process that invoice
    if (invoice_id) {
      query = query.eq('id', invoice_id)
    }
    
    const { data: invoices, error } = await query
    
    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch invoices' 
      }, { status: 500 })
    }

    if (!invoices || invoices.length === 0) {
      console.log('✅ No overdue invoices found')
      return NextResponse.json({ 
        success: true, 
        message: 'No overdue invoices found',
        emailsSent: 0
      })
    }

    console.log(`📧 Found ${invoices.length} invoices to process`)

    const sendGridService = SendGridService.getInstance()
    let emailsSent = 0
    let emailsFailed = 0

    // Process each invoice and send appropriate reminder
    for (const invoice of invoices) {
      try {
        const dueDate = new Date(invoice.due_date)
        const today = new Date()
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // Determine which phase of reminder to send
        let phase: 'friendly' | 'reminder' | 'overdue' | 'final'
        
        if (daysOverdue <= 0) {
          // Invoice not due yet, send friendly reminder
          phase = 'friendly'
        } else if (daysOverdue <= 7) {
          // 1-7 days overdue, send reminder
          phase = 'reminder'
        } else if (daysOverdue <= 21) {
          // 8-21 days overdue, send overdue notice
          phase = 'overdue'
        } else {
          // 22+ days overdue, send final notice
          phase = 'final'
        }

        // Get client information
        const client = invoice.clients as any
        if (!client || !client.email) {
          console.log(`⚠️ Skipping invoice ${invoice.invoice_number} - no client email`)
          continue
        }

        // Prepare email data
        const emailData: PaymentReminderData = {
          clientName: client.name || 'Valued Customer',
          clientEmail: client.email,
          invoiceNumber: invoice.invoice_number,
          invoiceAmount: `$${parseFloat(invoice.amount.toString()).toFixed(2)}`,
          projectName: invoice.description || 'Project Services',
          dueDate: dueDate.toLocaleDateString(),
          daysOverdue: daysOverdue > 0 ? daysOverdue : undefined,
          paymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.id}`,
          companyName: process.env.COMPANY_NAME || 'ReconcileBook',
          companyEmail: process.env.FROM_EMAIL || 'alex@usealgomind.com'
        }

        // Send the email
        const success = await sendGridService.sendPaymentReminder(emailData, phase)
        
        if (success) {
          emailsSent++
          console.log(`✅ Sent ${phase} reminder for invoice #${invoice.invoice_number} to ${emailData.clientEmail}`)
          
          // Update invoice status to track email sent
          await supabase
            .from('invoices')
            .update({ 
              last_reminder_sent: new Date().toISOString(),
              reminder_phase: phase
            })
            .eq('id', invoice.id)
        } else {
          emailsFailed++
          console.log(`❌ Failed to send ${phase} reminder for invoice #${invoice.invoice_number}`)
        }

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (invoiceError) {
        console.error(`❌ Error processing invoice ${invoice.id}:`, invoiceError)
        emailsFailed++
      }
    }

    console.log(`✅ Automated reminder process complete. Sent: ${emailsSent}, Failed: ${emailsFailed}`)

    return NextResponse.json({
      success: true,
      message: 'Payment reminders sent successfully',
      summary: {
        totalInvoices: invoices.length,
        emailsSent,
        emailsFailed
      }
    })

  } catch (error) {
    console.error('❌ Automated reminder error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send payment reminders' 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get reminder statistics
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'pending')
      .not('due_date', 'is', null)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch invoice data' 
      }, { status: 500 })
    }

    const today = new Date()
    const stats = {
      total: invoices?.length || 0,
      overdue: 0,
      dueToday: 0,
      dueThisWeek: 0,
      friendly: 0,
      reminder: 0,
      final: 0
    }

    invoices?.forEach(invoice => {
      const dueDate = new Date(invoice.due_date)
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysOverdue > 0) {
        stats.overdue++
      } else if (daysOverdue === 0) {
        stats.dueToday++
      } else if (daysOverdue >= -7) {
        stats.dueThisWeek++
      }

      // Count by reminder phase
      if (invoice.reminder_phase) {
        stats[invoice.reminder_phase as keyof typeof stats]++
      }
    })

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('❌ Stats error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get reminder statistics' 
    }, { status: 500 })
  }
}
