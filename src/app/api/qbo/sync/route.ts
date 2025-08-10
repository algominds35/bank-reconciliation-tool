import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchAccounts, fetchTransactions, markSync } from '@/lib/qbo'

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
      const accounts = await fetchAccounts(realmId, userId)
      console.log(`Fetched ${accounts.length} accounts from QBO`)
      
      // Fetch transactions from QuickBooks
      const transactions = await fetchTransactions(realmId, userId, full)
      console.log(`Fetched ${transactions.length} transactions from QBO`)
      
      // Mark sync as completed
      await markSync(realmId, userId, 'completed')
      
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        message: `Successfully synced ${accounts.length} accounts and ${transactions.length} transactions`
      })
      
    } catch (syncError) {
      console.error('Sync failed:', syncError)
      
      // Mark sync as failed
      await markSync(realmId, userId, 'failed', syncError.message)
      
      return NextResponse.json({ 
        error: 'Sync failed', 
        details: syncError.message 
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
      const accounts = await fetchAccounts(realmId, userId)
      console.log(`Cron job: Fetched ${accounts.length} accounts from QBO`)
      
      // Fetch transactions from QuickBooks
      const transactions = await fetchTransactions(realmId, userId, false) // Incremental sync for cron
      console.log(`Cron job: Fetched ${transactions.length} transactions from QBO`)
      
      // Mark sync as completed
      await markSync(realmId, userId, 'completed')
      
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        message: `Cron sync completed: ${accounts.length} accounts and ${transactions.length} transactions`
      })
      
    } catch (syncError) {
      console.error('Cron sync failed:', syncError)
      
      // Mark sync as failed
      await markSync(realmId, userId, 'failed', syncError.message)
      
      return NextResponse.json({ 
        error: 'Cron sync failed', 
        details: syncError.message 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('QBO cron sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}