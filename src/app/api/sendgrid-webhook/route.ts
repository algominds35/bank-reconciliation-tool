import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SendGridEvent {
  email: string
  timestamp: number
  event: string
  sg_event_id: string
  sg_message_id: string
  useragent?: string
  ip?: string
  url?: string
  reason?: string
  status?: string
  type?: string
  marketing_campaign_id?: string
  marketing_campaign_name?: string
  useragent_parsed?: {
    family?: string
    major?: string
    minor?: string
    patch?: string
    os?: {
      family?: string
      major?: string
      minor?: string
      patch?: string
    }
    device?: {
      family?: string
      brand?: string
      model?: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const events: SendGridEvent[] = await request.json()
    
    console.log(`🔔 SendGrid Webhook: Processing ${events.length} events`)
    
    for (const event of events) {
      await processSendGridEvent(event)
    }
    
    return NextResponse.json({ success: true, processed: events.length })
    
  } catch (error) {
    console.error('❌ SendGrid webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function processSendGridEvent(event: SendGridEvent) {
  try {
    const timestamp = new Date(event.timestamp * 1000)
    
    // Store event in database for tracking
    const { error: dbError } = await supabase
      .from('email_tracking_events')
      .insert([{
        email: event.email,
        event_type: event.event,
        timestamp: timestamp.toISOString(),
        sendgrid_event_id: event.sg_event_id,
        sendgrid_message_id: event.sg_message_id,
        user_agent: event.useragent,
        ip_address: event.ip,
        clicked_url: event.url,
        bounce_reason: event.reason,
        status: event.status,
        device_info: event.useragent_parsed ? JSON.stringify(event.useragent_parsed) : null,
        metadata: JSON.stringify(event)
      }])
    
    if (dbError) {
      console.error('❌ Database error storing event:', dbError)
    }
    
    // Update invoice status based on event type
    await updateInvoiceStatus(event)
    
    // Log the event for monitoring
    console.log(`📧 Email Event: ${event.event} for ${event.email} at ${timestamp.toLocaleString()}`)
    
    // Handle specific event types
    switch (event.event) {
      case 'delivered':
        console.log(`✅ Email delivered successfully to ${event.email}`)
        break
        
      case 'open':
        const device = getDeviceInfo(event.useragent_parsed)
        console.log(`👁️ Email opened on ${device} at ${timestamp.toLocaleString()}`)
        break
        
      case 'click':
        console.log(`🔗 Customer clicked payment link: ${event.url}`)
        break
        
      case 'bounce':
        console.log(`❌ Email bounced - ${event.reason || 'invalid address'}`)
        // Trigger SMS fallback
        await triggerSMSFallback(event.email, event.reason)
        break
        
      case 'dropped':
        console.log(`🚫 Email dropped - ${event.reason || 'spam filter'}`)
        // Trigger phone call fallback
        await triggerPhoneCallFallback(event.email)
        break
        
      case 'spamreport':
        console.log(`🚨 Email marked as spam by ${event.email}`)
        break
        
      case 'unsubscribe':
        console.log(`📤 Customer unsubscribed: ${event.email}`)
        break
    }
    
  } catch (error) {
    console.error('❌ Error processing SendGrid event:', error)
  }
}

async function updateInvoiceStatus(event: SendGridEvent) {
  try {
    // Find invoice by email and update status
    const { error } = await supabase
      .from('invoices')
      .update({ 
        last_email_status: event.event,
        last_email_event_time: new Date(event.timestamp * 1000).toISOString(),
        email_tracking_data: JSON.stringify(event)
      })
      .eq('client_email', event.email)
      .eq('status', 'pending')
    
    if (error) {
      console.error('❌ Error updating invoice status:', error)
    }
    
  } catch (error) {
    console.error('❌ Error updating invoice status:', error)
  }
}

async function triggerSMSFallback(email: string, reason?: string) {
  try {
    console.log(`📱 Triggering SMS fallback for ${email} (bounce reason: ${reason})`)
    
    // Store SMS fallback request
    const { error } = await supabase
      .from('sms_fallbacks')
      .insert([{
        email: email,
        reason: reason || 'email_bounce',
        status: 'pending',
        created_at: new Date().toISOString()
      }])
    
    if (error) {
      console.error('❌ Error storing SMS fallback:', error)
    }
    
    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log(`📱 SMS fallback queued for ${email}`)
    
  } catch (error) {
    console.error('❌ Error triggering SMS fallback:', error)
  }
}

async function triggerPhoneCallFallback(email: string) {
  try {
    console.log(`📞 Triggering phone call fallback for ${email}`)
    
    // Store phone call fallback request
    const { error } = await supabase
      .from('phone_call_fallbacks')
      .insert([{
        email: email,
        reason: 'email_dropped',
        status: 'pending',
        created_at: new Date().toISOString()
      }])
    
    if (error) {
      console.error('❌ Error storing phone call fallback:', error)
    }
    
    // TODO: Integrate with phone call service
    console.log(`📞 Phone call fallback queued for ${email}`)
    
  } catch (error) {
    console.error('❌ Error triggering phone call fallback:', error)
  }
}

function getDeviceInfo(useragentParsed?: any): string {
  if (!useragentParsed) return 'Unknown Device'
  
  const { family, major, minor, os, device } = useragentParsed
  
  if (device?.family) {
    return `${device.family} ${device.brand || ''} ${device.model || ''}`.trim()
  }
  
  if (family && os?.family) {
    return `${family} ${major || ''} on ${os.family} ${os.major || ''}`.trim()
  }
  
  if (family) {
    return family
  }
  
  return 'Unknown Device'
}
