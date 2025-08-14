import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAccounts, fetchTransactions, markSync } from '@/lib/qbo'
            
export async function POST(req: NextRequest) {
  try {
    console.log('QBO SYNC STARTED - ENTERPRISE VERSION')
    
    const { realmId, full = false } = await req.json()
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    // Create Supabase client
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs'
    )
    
    // Get the connection
    const { data: connections, error: connError } = await supabase
      .from('qbo_connections')
      .select('*')
      .eq('realm_id', realmId)
      .limit(1)
    
    if (connError || !connections || connections.length === 0) {
      return NextResponse.json({ error: 'No QBO connection found' }, { status: 400 })
    }
    
    const connection = connections[0]
    const userId = connection.user_id
    
    // Update sync status to 'syncing'
    await supabase
      .from('qbo_connections')
      .update({ 
        sync_status: 'syncing',
        updated_at: new Date().toISOString()
      })
      .eq('id', connection.id)
    
    try {
      console.log('Starting full sync for realm:', realmId)
      
      // Fetch accounts from QuickBooks
      const accounts = await fetchAccounts(userId, realmId)
      console.log(`Fetched ${accounts.length} accounts from QBO`)
      
      // Fetch transactions - 24 months if full sync, 7 days if incremental
      const sinceDate = full ? 
        new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : // 24 months
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)     // 7 days
      
      const transactions = await fetchTransactions(userId, realmId, sinceDate)
      console.log(`Fetched ${transactions.length} transactions from QBO since ${sinceDate}`)
      
      // Mark sync as completed
      await markSync(userId, realmId, 'completed')
      
      console.log('SYNC COMPLETED SUCCESSFULLY!')
      
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        message: `Successfully synced ${accounts.length} accounts and ${transactions.length} transactions`,
        syncType: full ? 'Full 24-month sync' : 'Incremental 7-day sync'
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
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
            
export async function GET(req: NextRequest) {
  try {
    console.log('QBO CRON SYNC - ENTERPRISE VERSION')
    
    // Create Supabase client
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs'
    )
    
    // Get all QBO connections
    const { data: connections, error } = await supabase
      .from('qbo_connections')
      .select('*')
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
    }
    
    console.log(`Found ${connections.length} connections to sync`)
    
    // Sync each connection
    for (const connection of connections) {
      try {
        console.log(`Syncing realm ${connection.realm_id}`)
        
        const accounts = await fetchAccounts(connection.user_id, connection.realm_id)
        const transactions = await fetchTransactions(connection.user_id, connection.realm_id, undefined) // Full sync
        
        await markSync(connection.user_id, connection.realm_id, 'completed')
        
        console.log(`✅ Synced ${accounts.length} accounts and ${transactions.length} transactions for realm ${connection.realm_id}`)
        
      } catch (syncError) {
        console.error(`❌ Failed to sync realm ${connection.realm_id}:`, syncError)
        await markSync(connection.user_id, connection.realm_id, 'failed')
      }
    }
    
    console.log('CRON SYNC COMPLETED!')
    return NextResponse.json({ success: true, message: 'Cron sync completed' })
    
  } catch (error) {
    console.error('QBO cron sync error:', error)
    return NextResponse.json({ error: 'Cron sync failed' }, { status: 500 })
  }
}