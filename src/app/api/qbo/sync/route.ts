import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { fetchAccounts, fetchTransactions, markSync } from '@/lib/qbo'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            cookie: cookieStore.toString(),
          },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const { realmId } = await req.json()
    
    // Fetch accounts and transactions
    const accounts = await fetchAccounts(userId, realmId)
    const transactions = await fetchTransactions(userId, realmId, undefined)
    
    // Mark sync as complete
    await markSync(userId, realmId, 'completed')
    
    return NextResponse.json({ 
      success: true, 
      accountsCount: accounts.length,
      transactionsCount: transactions.length 
    })
    
  } catch (error) {
    console.error('QBO sync error:', error)
    const syncError = error instanceof Error ? error.message : 'Unknown sync error'
    return NextResponse.json({ error: syncError }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createClient(
      'https://ajdvqkvevaklcwhxijde.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHZxa3ZldmFrbGN3aHhpamRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkwOTYsImV4cCI6MjA2OTAwNTA5Nn0.551cSJSE4QlPdw1iRWBMslj2gBkcEIsQHenZRq6L7rs',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            cookie: cookieStore.toString(),
          },
        },
      }
    )

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