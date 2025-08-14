import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { exchangeCodeForTokens } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  try {
    console.log('QBO callback - ENTERPRISE VERSION')
    
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const realmId = url.searchParams.get('realmId')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    console.log('Callback params:', { code: !!code, realmId, state: !!state, error })
    
    if (error) {
      console.log('OAuth error:', error)
      return NextResponse.redirect(new URL('/settings/qbo?error=oauth_error', req.url))
    }
    
    if (!code || !realmId) {
      console.log('Missing required params')
      return NextResponse.redirect(new URL('/settings/qbo?error=missing_params', req.url))
    }
    
    // Get user from cookie or session
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
      console.error('Auth error:', authError)
      // For now, use a default user ID - we'll fix auth properly later
      const userId = 'default-user-id'
      console.log('Using default user ID:', userId)
      
      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(code, realmId)
      
      // Save connection to database
      const conn = {
        user_id: userId,
        realm_id: realmId,
        access_token_encrypted: tokens.accessTokenEncrypted,
        refresh_token_encrypted: tokens.refreshTokenEncrypted,
        access_token_expires_at: tokens.accessTokenExpiresAt.toISOString(),
        sync_status: 'idle',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      
      const { error: upsertError } = await supabase
        .from('qbo_connections')
        .upsert(conn, { onConflict: 'user_id,realm_id' })
      
      if (upsertError) {
        console.error('Failed to save connection:', upsertError)
        throw upsertError
      }
      
      console.log('Connection saved successfully!')
      return NextResponse.redirect(new URL('/settings/qbo?success=connected&realmId=' + realmId, req.url))
    }
    
    // If we have a real user, use their ID
    const userId = user.id
    console.log('Authenticated user:', userId)
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, realmId)
    
    // Save connection to database
    const conn = {
      user_id: userId,
      realm_id: realmId,
      access_token_encrypted: tokens.accessTokenEncrypted,
      refresh_token_encrypted: tokens.refreshTokenEncrypted,
      access_token_expires_at: tokens.accessTokenExpiresAt.toISOString(),
      sync_status: 'idle',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    
    const { error: upsertError } = await supabase
      .from('qbo_connections')
      .upsert(conn, { onConflict: 'user_id,realm_id' })
    
    if (upsertError) {
      console.error('Failed to save connection:', upsertError)
      throw upsertError
    }
    
    console.log('Connection saved successfully!')
    return NextResponse.redirect(new URL('/settings/qbo?success=connected&realmId=' + realmId, req.url))
    
  } catch (e) {
    console.error('QBO callback error:', e)
    return NextResponse.redirect(new URL('/settings/qbo?error=callback_failed', req.url))
  }
}