import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: reminders, error } = await supabase
      .from('scheduled_reminders')
      .select(`
        *,
        reminder_templates (
          name,
          subject
        )
      `)
      .order('scheduled_date', { ascending: true })

    if (error) throw error

    const formattedReminders = reminders?.map(reminder => ({
      id: reminder.id,
      clientName: reminder.client_name,
      clientEmail: reminder.client_email,
      templateId: reminder.template_id,
      templateName: reminder.reminder_templates?.name || 'Unknown Template',
      scheduledDate: reminder.scheduled_date,
      status: reminder.status,
      sentDate: reminder.sent_date
    })) || []

    return NextResponse.json({
      success: true,
      reminders: formattedReminders
    })

  } catch (error) {
    console.error('Error fetching scheduled reminders:', error)
    return NextResponse.json({
      success: true,
      reminders: [] // Return empty array if database fails
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientId, templateId, scheduledDate, clientName, clientEmail } = await request.json()

    const { data, error } = await supabase
      .from('scheduled_reminders')
      .insert([{
        client_id: clientId,
        template_id: templateId,
        client_name: clientName,
        client_email: clientEmail,
        scheduled_date: scheduledDate,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      reminder: data
    })

  } catch (error) {
    console.error('Error scheduling reminder:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to schedule reminder' },
      { status: 500 }
    )
  }
}
