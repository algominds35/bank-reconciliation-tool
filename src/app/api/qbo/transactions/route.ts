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
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    const { data: transactions, error } = await supabase
      .from('qbo_transactions')
      .select(`
        *,
        qbo_accounts(account_name)
      `)
      .eq('realm_id', realmId)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Failed to fetch QBO transactions:', error)
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
    
    return NextResponse.json({
      transactions: transactions || [],
      count: transactions?.length || 0,
      hasMore: (transactions?.length || 0) === limit
    })
    
  } catch (error) {
    console.error('QBO transactions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 