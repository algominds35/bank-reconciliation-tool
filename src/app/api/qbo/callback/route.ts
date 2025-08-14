import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { exchangeCodeForTokens } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const realmId = url.searchParams.get('realmId')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const expected = (await cookies()).get('qbo_oauth_state')?.value

  // Handle OAuth errors (user cancelled, access denied, etc.)
  if (error) {
    console.log('QBO OAuth error:', error)
    ;(await cookies()).delete('qbo_oauth_state')
    
    // Redirect based on error type
    if (error === 'access_denied') {
      return NextResponse.redirect('/settings/qbo?error=access_denied')
    } else if (error === 'invalid_grant') {
      return NextResponse.redirect('/settings/qbo?error=invalid_grant')
    } else {
      return NextResponse.redirect('/settings/qbo?error=oauth_error')
    }
  }

  // Validate required parameters for successful connection
  if (!code || !realmId || !state || !expected || state !== expected) {
    console.log('QBO OAuth validation failed:', { code: !!code, realmId: !!realmId, state: !!state, expected: !!expected, stateMatch: state === expected })
    ;(await cookies()).delete('qbo_oauth_state')
    return NextResponse.redirect('/settings/qbo?error=invalid_params')
  }

  try {
    // Create Supabase client with cookies for authentication
    const cookieStore = await cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    // Get real authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.redirect('/auth/login')
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

    // Clear OAuth state and redirect to success
    ;(await cookies()).delete('qbo_oauth_state')
    return NextResponse.redirect('/settings/qbo?success=connected')
    
  } catch (e) {
    console.error('QBO OAuth callback error:', e)
    ;(await cookies()).delete('qbo_oauth_state')
    return NextResponse.redirect('/settings/qbo?error=connection_failed')
  }
}