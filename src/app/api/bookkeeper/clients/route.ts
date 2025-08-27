import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // URGENT: Add user filtering for privacy
    const userId = request.headers.get('user-id') || 'demo-user'
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      // Return empty array if table doesn't exist yet
      return NextResponse.json({
        success: true,
        clients: []
      })
    }

    return NextResponse.json({
      success: true,
      clients: clients || []
    })

  } catch (error) {
    console.error('Clients API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch clients',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json()
    
    const { data: client, error } = await supabase
      .from('clients')
      .insert([{
        name: clientData.name,
        status: clientData.status || 'active',
        last_upload: clientData.last_upload || null,
        total_transactions: clientData.total_transactions || 0,
        unmatched_transactions: clientData.unmatched_transactions || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      client
    })

  } catch (error) {
    console.error('Create client API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create client',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
