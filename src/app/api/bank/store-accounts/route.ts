import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const { accounts } = await request.json()

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return NextResponse.json(
        { error: 'Accounts array required' },
        { status: 400 }
      )
    }

    console.log(`Storing ${accounts.length} bank accounts for user: ${user.id}`)

    const bankAccounts = []

    // Process each connected account
    for (const accountId of accounts) {
      try {
        // Retrieve account details from Stripe
        const account = await stripe.financialConnections.accounts.retrieve(accountId)
        
        console.log(`Processing account: ${accountId}, type: ${account.type}`)

        // Extract account information
        const accountData = {
          user_id: user.id,
          provider: 'stripe_fc',
          account_id: accountId,
          bank_name: account.institution?.name || 'Unknown Bank',
          account_type: account.type || 'unknown',
          last_four: account.last_four || '****',
          status: account.status === 'active' ? 'active' : 'inactive',
          connected_at: new Date().toISOString()
        }

        // Store or update account in database
        const { data: storedAccount, error: upsertError } = await supabase
          .from('bank_accounts')
          .upsert(accountData, {
            onConflict: 'account_id',
            ignoreDuplicates: false
          })
          .select()
          .single()

        if (upsertError) {
          console.error(`❌ Failed to store account ${accountId}:`, upsertError)
          continue
        }

        bankAccounts.push(storedAccount)
        console.log(`✅ Stored account: ${account.bank_name} ${account.last_four}`)

      } catch (accountError) {
        console.error(`❌ Error processing account ${accountId}:`, accountError)
        continue
      }
    }

    // Log the sync operation
    const { error: logError } = await supabase
      .from('sync_logs')
      .insert({
        user_id: user.id,
        sync_type: 'manual',
        status: 'success',
        transactions_synced: 0, // We'll update this when we sync transactions
        sync_start: new Date().toISOString(),
        sync_end: new Date().toISOString()
      })

    if (logError) {
      console.error('❌ Failed to log sync operation:', logError)
    }

    return NextResponse.json({
      success: true,
      accounts_stored: bankAccounts.length,
      accounts: bankAccounts
    })

  } catch (error) {
    console.error('Store accounts error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to store bank accounts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify user authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    console.log(`Retrieving bank accounts for user: ${user.id}`)

    // Get user's connected bank accounts
    const { data: accounts, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('connected_at', { ascending: false })

    if (error) {
      console.error('❌ Failed to retrieve bank accounts:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve bank accounts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      accounts: accounts || []
    })

  } catch (error) {
    console.error('Get bank accounts error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve bank accounts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
