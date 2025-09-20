import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
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
    const fromDate = searchParams.get('from') // ISO date string
    const toDate = searchParams.get('to') // ISO date string

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID required' },
        { status: 400 }
      )
    }

    // Set default date range (last 30 days) if not provided
    const defaultFrom = new Date()
    defaultFrom.setDate(defaultFrom.getDate() - 30)
    
    const from = fromDate ? new Date(fromDate) : defaultFrom
    const to = toDate ? new Date(toDate) : new Date()

    // Convert to Unix timestamps for Stripe API
    const fromTimestamp = Math.floor(from.getTime() / 1000)
    const toTimestamp = Math.floor(to.getTime() / 1000)

    console.log(`Syncing transactions for account: ${accountId}, from: ${from.toISOString()}, to: ${to.toISOString()}`)

    // Verify account belongs to user
    const { data: bankAccount, error: accountError } = await supabase
      .from('bank_accounts')
      .select('id, account_id, bank_name')
      .eq('account_id', accountId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (accountError || !bankAccount) {
      console.error('❌ Account not found or access denied:', accountError)
      return NextResponse.json(
        { error: 'Account not found or access denied' },
        { status: 404 }
      )
    }

    // Start sync log
    const { data: syncLog, error: logError } = await supabase
      .from('sync_logs')
      .insert({
        user_id: user.id,
        bank_account_id: bankAccount.id,
        sync_type: 'manual',
        status: 'success',
        sync_start: new Date().toISOString()
      })
      .select()
      .single()

    if (logError) {
      console.error('❌ Failed to create sync log:', logError)
    }

    // Fetch transactions from Stripe Financial Connections
    const transactions = await (stripe.financialConnections.accounts as any).listTransactions(accountId, {
      from: fromTimestamp,
      to: toTimestamp,
      limit: 100 // Adjust as needed
    })

    console.log(`✅ Retrieved ${transactions.data.length} transactions from Stripe`)

    // Process and normalize transactions
    const normalizedTransactions = transactions.data.map(transaction => ({
      user_id: user.id,
      bank_account_id: bankAccount.id,
      stripe_transaction_id: transaction.id,
      amount: transaction.amount / 100, // Convert from cents to dollars
      currency: transaction.currency || 'usd',
      description: transaction.description || '',
      transaction_date: new Date(transaction.created * 1000).toISOString().split('T')[0], // Convert to date only
      transaction_type: transaction.amount > 0 ? 'credit' : 'debit',
      category: transaction.category || '',
      reference: transaction.reference || '',
      is_reconciled: false,
      raw_data: transaction,
      synced_at: new Date().toISOString()
    }))

    // Upsert transactions (avoid duplicates)
    const { data: insertedTransactions, error: insertError } = await supabase
      .from('bank_transactions_sync')
      .upsert(normalizedTransactions, {
        onConflict: 'stripe_transaction_id',
        ignoreDuplicates: false
      })
      .select()

    if (insertError) {
      console.error('❌ Failed to insert transactions:', insertError)
      
      // Update sync log with error
      if (syncLog) {
        await supabase
          .from('sync_logs')
          .update({
            status: 'error',
            error_message: insertError.message,
            sync_end: new Date().toISOString()
          })
          .eq('id', syncLog.id)
      }

      return NextResponse.json(
        { error: 'Failed to store transactions' },
        { status: 500 }
      )
    }

    // Update bank account last sync time
    await supabase
      .from('bank_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', bankAccount.id)

    // Update sync log with success
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'success',
          transactions_synced: insertedTransactions?.length || 0,
          sync_end: new Date().toISOString()
        })
        .eq('id', syncLog.id)
    }

    console.log(`✅ Successfully synced ${insertedTransactions?.length || 0} transactions`)

    return NextResponse.json({
      success: true,
      transactions_synced: insertedTransactions?.length || 0,
      account: {
        id: bankAccount.id,
        bank_name: bankAccount.bank_name,
        account_id: bankAccount.account_id
      },
      date_range: {
        from: from.toISOString(),
        to: to.toISOString()
      }
    })

  } catch (error) {
    console.error('Transaction sync error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync transactions',
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

    const { account_id, days = 30 } = await request.json()

    if (!account_id) {
      return NextResponse.json(
        { error: 'Account ID required' },
        { status: 400 }
      )
    }

    // Calculate date range
    const toDate = new Date()
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    // Convert to Unix timestamps
    const fromTimestamp = Math.floor(fromDate.getTime() / 1000)
    const toTimestamp = Math.floor(toDate.getTime() / 1000)

    console.log(`Manual sync requested for account: ${account_id}, last ${days} days`)

    // Verify account belongs to user
    const { data: bankAccount, error: accountError } = await supabase
      .from('bank_accounts')
      .select('id, account_id, bank_name')
      .eq('account_id', account_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (accountError || !bankAccount) {
      console.error('❌ Account not found or access denied:', accountError)
      return NextResponse.json(
        { error: 'Account not found or access denied' },
        { status: 404 }
      )
    }

    // Start sync log
    const { data: syncLog, error: logError } = await supabase
      .from('sync_logs')
      .insert({
        user_id: user.id,
        bank_account_id: bankAccount.id,
        sync_type: 'manual',
        status: 'success',
        sync_start: new Date().toISOString()
      })
      .select()
      .single()

    if (logError) {
      console.error('❌ Failed to create sync log:', logError)
    }

    // Fetch transactions from Stripe
    const transactions = await (stripe.financialConnections.accounts as any).listTransactions(account_id, {
      from: fromTimestamp,
      to: toTimestamp,
      limit: 100
    })

    console.log(`✅ Retrieved ${transactions.data.length} transactions from Stripe`)

    // Process transactions
    const normalizedTransactions = transactions.data.map(transaction => ({
      user_id: user.id,
      bank_account_id: bankAccount.id,
      stripe_transaction_id: transaction.id,
      amount: transaction.amount / 100,
      currency: transaction.currency || 'usd',
      description: transaction.description || '',
      transaction_date: new Date(transaction.created * 1000).toISOString().split('T')[0],
      transaction_type: transaction.amount > 0 ? 'credit' : 'debit',
      category: transaction.category || '',
      reference: transaction.reference || '',
      is_reconciled: false,
      raw_data: transaction,
      synced_at: new Date().toISOString()
    }))

    // Upsert transactions
    const { data: insertedTransactions, error: insertError } = await supabase
      .from('bank_transactions_sync')
      .upsert(normalizedTransactions, {
        onConflict: 'stripe_transaction_id',
        ignoreDuplicates: false
      })
      .select()

    if (insertError) {
      console.error('❌ Failed to insert transactions:', insertError)
      
      if (syncLog) {
        await supabase
          .from('sync_logs')
          .update({
            status: 'error',
            error_message: insertError.message,
            sync_end: new Date().toISOString()
          })
          .eq('id', syncLog.id)
      }

      return NextResponse.json(
        { error: 'Failed to store transactions' },
        { status: 500 }
      )
    }

    // Update bank account last sync time
    await supabase
      .from('bank_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', bankAccount.id)

    // Update sync log with success
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'success',
          transactions_synced: insertedTransactions?.length || 0,
          sync_end: new Date().toISOString()
        })
        .eq('id', syncLog.id)
    }

    console.log(`✅ Successfully synced ${insertedTransactions?.length || 0} transactions`)

    return NextResponse.json({
      success: true,
      transactions_synced: insertedTransactions?.length || 0,
      account: {
        id: bankAccount.id,
        bank_name: bankAccount.bank_name,
        account_id: bankAccount.account_id
      },
      date_range: {
        from: fromDate.toISOString(),
        to: toDate.toISOString()
      }
    })

  } catch (error) {
    console.error('Transaction sync error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
