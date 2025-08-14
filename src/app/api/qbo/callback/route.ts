import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { exchangeCodeForTokens } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const realmId = url.searchParams.get('realmId')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    const cookieStore = await cookies()
    const expected = cookieStore.get('qbo_oauth_state')?.value

    // Handle OAuth errors (user cancelled, access denied, etc.)
    if (error) {
      console.log('QBO OAuth error:', error)
      
      // Redirect based on error type
      if (error === 'access_denied') {
        return NextResponse.redirect(new URL('/settings/qbo?error=access_denied', req.url))
      } else if (error === 'invalid_grant') {
        return NextResponse.redirect(new URL('/settings/qbo?error=invalid_grant', req.url))
      } else {
        return NextResponse.redirect(new URL('/settings/qbo?error=oauth_error', req.url))
      }
    }

    // Validate required parameters for successful connection
    if (!code || !realmId || !state || !expected || state !== expected) {
      console.log('QBO OAuth validation failed:', { code: !!code, realmId: !!realmId, state: !!state, expected: !!expected, stateMatch: state === expected })
      return NextResponse.redirect(new URL('/settings/qbo?error=invalid_params', req.url))
    }

    // Create Supabase client with proper cookie handling
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

    // Get real authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const userId = user.id
    
    const tokens = await exchangeCodeForTokens(code, realmId)
    
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
      console.error('Failed to save QBO connection:', upsertError)
      throw upsertError
    }

    // Redirect to success
    return NextResponse.redirect(new URL('/settings/qbo?success=connected', req.url))
    
  } catch (e) {
    console.error('QBO OAuth callback error:', e)
    return NextResponse.redirect(new URL('/settings/qbo?error=connection_failed', req.url))
  }
}