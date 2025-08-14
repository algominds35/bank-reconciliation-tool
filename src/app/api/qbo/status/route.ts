import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client with cookies for authentication
    const cookieStore = await cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id
    
    const { data: connections, error } = await supabase
      .from('qbo_connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('Failed to fetch QBO connections:', error)
      return NextResponse.json({ error: 'Failed to fetch connection status' }, { status: 500 })
    }
    
    const connection = connections && connections.length > 0 ? connections[0] : null
    
    return NextResponse.json({
      connection,
      hasConnection: !!connection
    })
    
  } catch (error) {
    console.error('QBO status check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 