import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO status check started')
    
    // Create Supabase client with proper cookie handling
    const cookieStore = await cookies()
    
    console.log('Available cookies:', cookieStore.getAll().map(c => c.name))
    
    const supabase = createServerSupabaseClient(cookieStore.toString())

    console.log('Supabase client created, attempting to get user')

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Authentication error in status route:', authError)
      return NextResponse.json({ 
        error: 'Authentication failed', 
        details: authError.message,
        code: authError.status 
      }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found in session')
      return NextResponse.json({ 
        error: 'No authenticated user found',
        code: 'NO_USER'
      }, { status: 401 })
    }
    
    const userId = user.id
    console.log('User authenticated in status route:', userId)
    
    console.log('Fetching QBO connections for user:', userId)
    
    const { data: connections, error } = await supabase
      .from('qbo_connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('Failed to fetch QBO connections:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch connection status',
        details: error.message 
      }, { status: 500 })
    }
    
    console.log('Found connections:', connections?.length || 0)
    
    const connection = connections && connections.length > 0 ? connections[0] : null
    
    if (connection) {
      console.log('Connection details:', {
        id: connection.id,
        realmId: connection.realm_id,
        syncStatus: connection.sync_status,
        lastSync: connection.last_sync_at
      })
    }
    
    return NextResponse.json({
      connection,
      hasConnection: !!connection,
      userId,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('QBO status check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 