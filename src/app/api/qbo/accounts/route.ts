import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client with admin key for this operation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const url = new URL(req.url)
    const realmId = url.searchParams.get('realmId')
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    const { data: accounts, error } = await supabase
      .from('qbo_accounts')
      .select('*')
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