import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const realmId = url.searchParams.get('realmId')
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    // TODO: Replace with real authenticated user ID
    const userId = 'current-user-id'
    
    const { data: accounts, error } = await supabase
      .from('qbo_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('realm_id', realmId)
      .eq('is_active', true)
      .order('account_name')
    
    if (error) {
      console.error('Failed to fetch QBO accounts:', error)
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
    }
    
    return NextResponse.json({
      accounts: accounts || [],
      count: accounts?.length || 0
    })
    
  } catch (error) {
    console.error('QBO accounts fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 