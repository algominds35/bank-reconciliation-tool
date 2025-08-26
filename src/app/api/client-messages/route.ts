import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: messages, error } = await supabase
      .from('client_messages')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching client messages:', error)
      return NextResponse.json({
        success: true,
        messages: [] // Return empty array instead of failing
      })
    }

    // Transform database format to component format
    const formattedMessages = messages?.map(msg => ({
      id: msg.id,
      clientName: msg.client_name,
      clientEmail: msg.client_email,
      businessName: msg.business_name,
      subject: msg.subject,
      message: msg.message,
      timestamp: msg.timestamp,
      status: msg.status,
      priority: msg.priority,
      category: msg.category
    })) || []

    return NextResponse.json({
      success: true,
      messages: formattedMessages
    })

  } catch (error) {
    console.error('API error fetching client messages:', error)
    return NextResponse.json({
      success: true,
      messages: [] // Return empty array instead of failing
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientName, clientEmail, businessName, subject, message, priority = 'medium', category = 'general' } = await request.json()

    const { data, error } = await supabase
      .from('client_messages')
      .insert([{
        client_name: clientName,
        client_email: clientEmail,
        business_name: businessName,
        subject: subject,
        message: message,
        priority: priority,
        category: category,
        status: 'unread',
        timestamp: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating client message:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: data
    })

  } catch (error) {
    console.error('API error creating client message:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
