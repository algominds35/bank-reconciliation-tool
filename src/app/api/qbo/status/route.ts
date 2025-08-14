import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client with proper cookie handling
    const cookieStore = await cookies()
    
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            cookie: cookieStore.toString(),
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
    console.log('Authenticated user ID:', userId)
    
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
    
    console.log('Found connections:', connections)
    
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