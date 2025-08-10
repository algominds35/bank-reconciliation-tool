import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // TODO: Replace with real authenticated user ID
    const userId = 'current-user-id'
    
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