import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { exchangeCodeForTokens } from '@/lib/qbo'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const realmId = url.searchParams.get('realmId')
  const state = url.searchParams.get('state')
  const expected = (await cookies()).get('qbo_oauth_state')?.value
  if (!code || !realmId || !state || !expected || state !== expected) return NextResponse.redirect('/?error=qbo_oauth')

  try {
    const userId = 'current-user-id' // TODO: replace with real authenticated user id
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
    const { error } = await supabase
      .from('qbo_connections')
      .upsert(conn, { onConflict: 'user_id,realm_id' })
    if (error) throw error
    ;(await cookies()).delete('qbo_oauth_state')
    return NextResponse.redirect('/settings/qbo')
  } catch (e) {
    console.error('QBO OAuth callback error', e)
    return NextResponse.redirect('/?error=qbo_callback')
  }
}