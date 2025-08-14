import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client with cookies for authentication
    const cookieStore = await cookies()
    
    // Debug: Log all available cookies
    const allCookies = cookieStore.getAll()
    console.log('All available cookies:', allCookies.map(c => c.name))
    
    // Look for any Supabase auth cookie
    const authCookie = allCookies.find(cookie => 
      cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
    )
    
    if (!authCookie) {
      console.error('No Supabase auth cookie found. Available cookies:', allCookies.map(c => c.name))
      return NextResponse.json({ error: 'No authentication cookie found' }, { status: 401 })
    }
    
    console.log('Found auth cookie:', authCookie.name)
    
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs',
      {
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