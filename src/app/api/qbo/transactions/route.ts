import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const realmId = url.searchParams.get('realmId')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    // TODO: Replace with real authenticated user ID
    const userId = 'current-user-id'
    
    const { data: transactions, error } = await supabase
      .from('qbo_transactions')
      .select(`
        *,
        qbo_accounts(account_name)
      `)
      .eq('user_id', userId)
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