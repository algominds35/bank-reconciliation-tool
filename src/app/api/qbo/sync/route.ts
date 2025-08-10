import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchAccounts, fetchTransactions, markSync } from '@/lib/qbo'

// Function to convert QuickBooks transactions to main transaction format
async function importQboTransactionsToMainTable(transactions: any[], userId: string, realmId: string) {
  const convertedTransactions = transactions.map(qboTx => ({
    user_id: userId,
    client_id: null, // Will be set by user later
    transaction_type: 'quickbooks',
    date: qboTx.TxnDate || qboTx.MetaData?.CreateTime,
    description: qboTx.DocNumber ? `${qboTx.DocNumber} - ${qboTx.Memo || qboTx.Description || 'QuickBooks Transaction'}` : (qboTx.Memo || qboTx.Description || 'QuickBooks Transaction'),
    amount: Math.abs(qboTx.Amount || 0),
    is_credit: (qboTx.Amount || 0) > 0,
    is_reconciled: false,
    reconciliation_group: null,
    qbo_id: qboTx.Id,
    qbo_realm_id: realmId,
    qbo_account_id: qboTx.AccountRef?.value,
    qbo_account_name: qboTx.AccountRef?.name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))

  // Upsert transactions to avoid duplicates
  const { data, error } = await supabase
    .from('transactions')
    .upsert(convertedTransactions, { 
      onConflict: 'qbo_id,qbo_realm_id',
      ignoreDuplicates: false
    })
    .select()

  if (error) {
    console.error('Error importing QBO transactions to main table:', error)
    throw error
  }

  return data
}

export async function POST(req: NextRequest) {
  try {
    const { realmId, full = false } = await req.json()
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    // TODO: Replace with real authenticated user ID
    const userId = 'current-user-id'
    
    // Update sync status to 'syncing'
    const { error: updateError } = await supabase
      .from('qbo_connections')
      .update({ 
        sync_status: 'syncing',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('realm_id', realmId)
    
    if (updateError) {
      console.error('Failed to update sync status:', updateError)
      return NextResponse.json({ error: 'Failed to start sync' }, { status: 500 })
    }
    
    try {
      // Fetch accounts from QuickBooks
      const accounts = await fetchAccounts(userId, realmId)
      console.log(`Fetched ${accounts.length} accounts from QBO`)
      
      // Fetch transactions from QuickBooks
      const transactions = await fetchTransactions(userId, realmId, full ? undefined : new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString().slice(0, 10))
      console.log(`Fetched ${transactions.length} transactions from QBO`)
      
      // Import transactions to main table
      const importedTransactions = await importQboTransactionsToMainTable(transactions, userId, realmId)
      console.log(`Imported ${importedTransactions.length} transactions to main table`)
      
      // Mark sync as completed
      await markSync(userId, realmId, 'completed')
      
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        importedCount: importedTransactions.length,
        message: `Successfully synced ${accounts.length} accounts and imported ${importedTransactions.length} transactions to main system`
      })
      
    } catch (syncError) {
      console.error('Sync failed:', syncError)
      
      // Mark sync as failed
      const errorMessage = syncError instanceof Error ? syncError.message : 'Unknown sync error'
      await markSync(userId, realmId, 'failed', errorMessage)
      
      return NextResponse.json({ 
        error: 'Sync failed', 
        details: errorMessage
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('QBO sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const realmId = url.searchParams.get('realmId')
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    // TODO: Replace with real authenticated user ID
    const userId = 'current-user-id'
    
    // Update sync status to 'syncing'
    const { error: updateError } = await supabase
      .from('qbo_connections')
      .update({ 
        sync_status: 'syncing',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('realm_id', realmId)
    
    if (updateError) {
      console.error('Failed to update sync status:', updateError)
      return NextResponse.json({ error: 'Failed to start sync' }, { status: 500 })
    }
    
    try {
      // Fetch accounts from QuickBooks
      const accounts = await fetchAccounts(userId, realmId)
      console.log(`Cron job: Fetched ${accounts.length} accounts from QBO`)
      
      // Fetch transactions from QuickBooks
      const transactions = await fetchTransactions(userId, realmId) // Incremental sync for cron
      console.log(`Cron job: Fetched ${transactions.length} transactions from QBO`)
      
      // Import transactions to main table
      const importedTransactions = await importQboTransactionsToMainTable(transactions, userId, realmId)
      console.log(`Cron job: Imported ${importedTransactions.length} transactions to main table`)
      
      // Mark sync as completed
      await markSync(userId, realmId, 'completed')
      
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        importedCount: importedTransactions.length,
        message: `Cron sync completed: ${accounts.length} accounts and imported ${importedTransactions.length} transactions to main table`
      })
      
    } catch (syncError) {
      console.error('Cron sync failed:', syncError)
      
      // Mark sync as failed
      const errorMessage = syncError instanceof Error ? syncError.message : 'Unknown sync error'
      await markSync(userId, realmId, 'failed', errorMessage)
      
      return NextResponse.json({ 
        error: 'Cron sync failed', 
        details: errorMessage
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('QBO cron sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}