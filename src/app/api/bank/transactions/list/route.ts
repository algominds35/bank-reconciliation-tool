import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('account')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log(`Fetching transactions for user: ${user.id}, account: ${accountId}`)

    let query = supabase
      .from('bank_transactions_sync')
      .select(`
        *,
        bank_account:bank_accounts (
          bank_name,
          last_four
        )
      `)
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Filter by specific account if provided
    if (accountId) {
      query = query.eq('bank_account_id', accountId)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('❌ Failed to fetch transactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    // Get summary statistics
    const { data: stats, error: statsError } = await supabase
      .from('bank_transactions_sync')
      .select('amount, is_reconciled')
      .eq('user_id', user.id)

    if (statsError) {
      console.error('❌ Failed to fetch transaction stats:', statsError)
    }

    const totalAmount = stats?.reduce((sum, tx) => sum + tx.amount, 0) || 0
    const reconciledCount = stats?.filter(tx => tx.is_reconciled).length || 0
    const totalCount = stats?.length || 0

    return NextResponse.json({
      success: true,
      transactions: transactions || [],
      summary: {
        total_transactions: totalCount,
        total_amount: totalAmount,
        reconciled_count: reconciledCount,
        unreconciled_count: totalCount - reconciledCount
      },
      pagination: {
        limit,
        offset,
        has_more: transactions && transactions.length === limit
      }
    })

  } catch (error) {
    console.error('List transactions error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const { 
      transaction_ids, 
      reconciled_status,
      notes 
    } = await request.json()

    if (!transaction_ids || !Array.isArray(transaction_ids)) {
      return NextResponse.json(
        { error: 'Transaction IDs array required' },
        { status: 400 }
      )
    }

    console.log(`Updating ${transaction_ids.length} transactions for user: ${user.id}`)

    // Update transaction reconciliation status
    const { data: updatedTransactions, error } = await supabase
      .from('bank_transactions_sync')
      .update({
        is_reconciled: reconciled_status,
        reconciled_with: notes || null,
        updated_at: new Date().toISOString()
      })
      .in('id', transaction_ids)
      .eq('user_id', user.id) // SECURITY: Ensure user can only update their own transactions
      .select()

    if (error) {
      console.error('❌ Failed to update transactions:', error)
      return NextResponse.json(
        { error: 'Failed to update transactions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updated_count: updatedTransactions?.length || 0,
      transactions: updatedTransactions
    })

  } catch (error) {
    console.error('Update transactions error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
