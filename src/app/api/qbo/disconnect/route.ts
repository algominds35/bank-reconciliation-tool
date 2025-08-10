import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { realmId } = await req.json()
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId is required' }, { status: 400 })
    }
    
    // TODO: Replace with real authenticated user ID
    const userId = 'current-user-id'
    
    // Delete the QBO connection
    const { error: deleteError } = await supabase
      .from('qbo_connections')
      .delete()
      .eq('user_id', userId)
      .eq('realm_id', realmId)
    
    if (deleteError) {
      console.error('Failed to delete QBO connection:', deleteError)
      return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
    }
    
    // Also delete related accounts and transactions
    await supabase
      .from('qbo_accounts')
      .delete()
      .eq('user_id', userId)
      .eq('realm_id', realmId)
    
    await supabase
      .from('qbo_transactions')
      .delete()
      .eq('user_id', userId)
      .eq('realm_id', realmId)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('QBO disconnect error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}