import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO status check - ENTERPRISE VERSION')
    
    // Create Supabase client
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs'
    )
    
    // Check for any QBO connections in the database
    const { data: connections, error } = await supabase
      .from('qbo_connections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        success: false,
        error: 'Database error',
        hasConnection: false
      })
    }
    
    const connection = connections && connections.length > 0 ? connections[0] : null
    
    if (connection) {
      console.log('Found connection:', connection.realm_id)
      return NextResponse.json({
        success: true,
        hasConnection: true,
        connection: {
          realmId: connection.realm_id,
          syncStatus: connection.sync_status,
          lastSync: connection.last_sync_at,
          createdAt: connection.created_at
        }
      })
    } else {
      console.log('No connections found')
      return NextResponse.json({
        success: true,
        hasConnection: false,
        message: 'No QuickBooks connection found'
      })
    }
    
  } catch (error) {
    console.error('QBO status error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Route error',
      hasConnection: false
    }, { status: 500 })
  }
} 