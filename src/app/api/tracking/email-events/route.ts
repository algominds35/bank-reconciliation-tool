import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const email = searchParams.get('email')
    
    let query = supabase
      .from('email_tracking_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (email) {
      query = query.eq('email', email)
    }
    
    const { data: events, error } = await query
    
    if (error) {
      console.error('❌ Error fetching email events:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch email events' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: events || [],
      count: events?.length || 0
    })
    
  } catch (error) {
    console.error('❌ Email events API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
