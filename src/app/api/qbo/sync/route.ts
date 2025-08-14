import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { fetchAccounts, fetchTransactions, markSync } from '@/lib/qbo'
            
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerSupabaseClient(cookieStore.toString())
            
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id
            
    const { realmId, full = false } = await req.json()
                
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
                
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
                  
      // Mark sync as completed
      await markSync(userId, realmId, 'completed')
                  
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        message: `Successfully synced ${accounts.length} accounts and imported transactions`
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
    const syncError = error instanceof Error ? error.message : 'Unknown sync error'
    return NextResponse.json({ error: syncError }, { status: 500 })
  }
}
            
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
                
    const supabase = createServerSupabaseClient(cookieStore.toString())
            
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id
            
    // Get all QBO connections for the user
    const { data: connections, error } = await supabase
      .from('qbo_connections')
      .select('*')
      .eq('user_id', userId)
                
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
    }
            
    // Sync each connection
    for (const connection of connections) {
      try {
        const accounts = await fetchAccounts(userId, connection.realm_id)
        const transactions = await fetchTransactions(userId, connection.realm_id, undefined)
        await markSync(userId, connection.realm_id, 'completed')
        console.log(`Synced ${accounts.length} accounts and ${transactions.length} transactions for realm ${connection.realm_id}`)
      } catch (syncError) {
        console.error(`Failed to sync realm ${connection.realm_id}:`, syncError)
        await markSync(userId, connection.realm_id, 'failed')
      }
    }
                
    return NextResponse.json({ success: true })
            
  } catch (error) {
    console.error('QBO cron sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}