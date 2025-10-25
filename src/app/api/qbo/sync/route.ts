import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decrypt } from '@/lib/crypto'

// QuickBooks API functions
async function fetchAccountsFromQBO(accessToken: string, realmId: string) {
  try {
    const response = await fetch(`https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=SELECT * FROM Account WHERE Active = true&minorversion=65`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`QuickBooks API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.Account || []
  } catch (error) {
    console.error('Error fetching accounts from QuickBooks:', error)
    throw error
  }
}

async function fetchTransactionsFromQBO(accessToken: string, realmId: string, sinceDate: string) {
  try {
    const entityTypes = ['Purchase', 'Invoice', 'Payment', 'Deposit', 'SalesReceipt', 'BillPayment', 'JournalEntry']
    const allTransactions: any[] = []
    
    for (const entityType of entityTypes) {
      try {
        const query = `SELECT * FROM ${entityType} WHERE TxnDate >= '${sinceDate}' MAXRESULTS 1000`
        const response = await fetch(
          `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          const items = data.QueryResponse?.[entityType] || []
          allTransactions.push(...items.map((item: any) => ({ ...item, EntityType: entityType })))
        }
      } catch (err) {
        console.log(`Skipping ${entityType}:`, err)
        // Continue with other types even if one fails
      }
    }
    
    return allTransactions
  } catch (error) {
    console.error('Error fetching transactions from QuickBooks:', error)
    throw error
  }
}

async function saveAccountsToSupabase(supabase: any, accounts: any[], realmId: string) {
  try {
    const accountsToInsert = accounts.map(account => ({
      realm_id: realmId,
      account_id: account.Id,
      account_name: account.Name,
      account_type: account.AccountType,
      account_sub_type: account.AccountSubType,
      is_active: account.Active,
      balance: account.CurrentBalance,
      currency: account.CurrencyRef?.value || 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Delete existing accounts for this realm
    await supabase
      .from('qbo_accounts')
      .delete()
      .eq('realm_id', realmId)

    // Insert new accounts
    if (accountsToInsert.length > 0) {
      const { error } = await supabase
        .from('qbo_accounts')
        .insert(accountsToInsert)
      
      if (error) throw error
    }

    return accountsToInsert.length
  } catch (error) {
    console.error('Error saving accounts to Supabase:', error)
    throw error
  }
}

async function saveTransactionsToSupabase(supabase: any, transactions: any[], realmId: string) {
  try {
    const transactionsToInsert = transactions.map(txn => ({
      realm_id: realmId,
      transaction_id: txn.Id,
      transaction_date: txn.TxnDate,
      transaction_type: txn.TxnType,
      reference_number: txn.DocNumber,
      memo: txn.Memo,
      amount: txn.TotalAmt,
      currency: txn.CurrencyRef?.value || 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Delete existing transactions for this realm
    await supabase
      .from('qbo_transactions')
      .delete()
      .eq('realm_id', realmId)

    // Insert new transactions
    if (transactionsToInsert.length > 0) {
      const { error } = await supabase
        .from('qbo_transactions')
        .insert(transactionsToInsert)
      
      if (error) throw error
    }

    return transactionsToInsert.length
  } catch (error) {
    console.error('Error saving transactions to Supabase:', error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 QBO SYNC STARTED - REAL IMPLEMENTATION')
    
    const { realmId, full = false } = await req.json()
    
    if (!realmId) {
      return NextResponse.json({ error: 'realmId required' }, { status: 400 })
    }
    
    console.log('Sync type:', full ? 'Full 24-month' : 'Incremental 7-day')
    
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Get the connection with OAuth tokens
    console.log('Getting connection details for realm:', realmId)
    const { data: connections, error: connError } = await supabase
      .from('qbo_connections')
      .select('*')
      .eq('realm_id', realmId)
      .limit(1)
    
    if (connError || !connections || connections.length === 0) {
      console.error('❌ No QBO connection found for realm:', realmId)
      return NextResponse.json({ error: 'No QBO connection found' }, { status: 400 })
    }
    
    const connection = connections[0]
    
    if (!connection.access_token_encrypted) {
      console.error('❌ No access token found for connection')
      return NextResponse.json({ error: 'QuickBooks connection expired. Please reconnect.' }, { status: 400 })
    }
    
    console.log('✅ Found connection with access token')
    
    // Update sync status to 'syncing'
    console.log('Updating sync status to syncing...')
    await supabase
      .from('qbo_connections')
      .update({ 
        sync_status: 'syncing',
        updated_at: new Date().toISOString()
      })
      .eq('id', connection.id)
    
    try {
      console.log('🚀 Starting REAL QuickBooks data sync...')
      
      // Decrypt the access token
      const accessToken = decrypt(connection.access_token_encrypted)
      console.log('✅ Decrypted access token')
      
      // Fetch accounts from QuickBooks
      console.log('Fetching accounts from QuickBooks...')
      const accounts = await fetchAccountsFromQBO(accessToken, realmId)
      console.log(`✅ Fetched ${accounts.length} accounts from QuickBooks`)
      
      // Save accounts to Supabase
      console.log('Saving accounts to database...')
      const savedAccountsCount = await saveAccountsToSupabase(supabase, accounts, realmId)
      console.log(`✅ Saved ${savedAccountsCount} accounts to database`)
                              
      // Fetch transactions - 24 months if full sync, 7 days if incremental
      const sinceDate = full ? 
        new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : // 24 months
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)     // 7 days
      
      console.log('Fetching transactions since:', sinceDate)
      const transactions = await fetchTransactionsFromQBO(accessToken, realmId, sinceDate)
      console.log(`✅ Fetched ${transactions.length} transactions from QuickBooks since ${sinceDate}`)
      
      // Save transactions to Supabase
      console.log('Saving transactions to database...')
      const savedTransactionsCount = await saveTransactionsToSupabase(supabase, transactions, realmId)
      console.log(`✅ Saved ${savedTransactionsCount} transactions to database`)
                              
      // Mark sync as completed
      console.log('Marking sync as completed...')
      await supabase
        .from('qbo_connections')
        .update({ 
          sync_status: 'completed',
          last_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', connection.id)
      
      console.log('🎉 SYNC COMPLETED SUCCESSFULLY!')
      console.log('📊 Summary:')
      console.log('   - Accounts fetched:', accounts.length)
      console.log('   - Transactions fetched:', transactions.length)
      console.log('   - Sync Type:', full ? 'Full 24-month sync' : 'Incremental 7-day sync')
      
      return NextResponse.json({
        success: true,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        message: `Successfully synced ${accounts.length} accounts and ${transactions.length} transactions from QuickBooks`,
        syncType: full ? 'Full 24-month sync' : 'Incremental 7-day sync'
      })
                              
    } catch (syncError) {
      console.error('❌ Sync failed:', syncError)
                              
      // Mark sync as failed
      const errorMessage = syncError instanceof Error ? syncError.message : 'Unknown sync error'
      console.log('Marking sync as failed with error:', errorMessage)
      await supabase
        .from('qbo_connections')
        .update({ 
          sync_status: 'failed',
          sync_error: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', connection.id)
                              
      return NextResponse.json({ 
        error: 'Sync failed', 
        details: errorMessage
      }, { status: 500 })
    }
                            
  } catch (error) {
    console.error('❌ QBO sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
                        
export async function GET(req: NextRequest) {
  try {
    console.log('🔄 QBO CRON SYNC - REAL IMPLEMENTATION')
    
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Get all QBO connections
    console.log('Getting all QBO connections for cron sync...')
    const { data: connections, error } = await supabase
      .from('qbo_connections')
      .select('*')
    
    if (error) {
      console.error('❌ Failed to fetch connections:', error)
      return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
    }
                            
    console.log(`📋 Found ${connections.length} connections to sync`)
    
    // Sync each connection
    for (const connection of connections) {
      try {
        console.log(`🔄 Syncing realm ${connection.realm_id}...`)
        
        if (!connection.access_token_encrypted) {
          console.log(`⚠️ No access token for realm ${connection.realm_id}, skipping...`)
          continue
        }
        
        // Decrypt the access token
        const accessToken = decrypt(connection.access_token_encrypted)
        
        // Fetch accounts from QuickBooks
        const accounts = await fetchAccountsFromQBO(accessToken, connection.realm_id)
        
        // Fetch transactions from QuickBooks (full sync for cron)
        const sinceDate = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) // 24 months
        const transactions = await fetchTransactionsFromQBO(accessToken, connection.realm_id, sinceDate)
        
        // Save to database
        await saveAccountsToSupabase(supabase, accounts, connection.realm_id)
        await saveTransactionsToSupabase(supabase, transactions, connection.realm_id)
        
        // Mark sync as completed
        await supabase
          .from('qbo_connections')
          .update({ 
            sync_status: 'completed',
            last_sync_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', connection.id)
        
        console.log(`✅ Synced ${accounts.length} accounts and ${transactions.length} transactions for realm ${connection.realm_id}`)
        
      } catch (syncError) {
        console.error(`❌ Failed to sync realm ${connection.realm_id}:`, syncError)
        await supabase
          .from('qbo_connections')
          .update({ 
            sync_status: 'failed',
            sync_error: syncError instanceof Error ? syncError.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('id', connection.id)
      }
    }
                            
    console.log('🎉 CRON SYNC COMPLETED!')
    return NextResponse.json({ success: true, message: 'Cron sync completed' })
                            
  } catch (error) {
    console.error('❌ QBO cron sync error:', error)
    return NextResponse.json({ error: 'Cron sync failed' }, { status: 500 })
  }
}