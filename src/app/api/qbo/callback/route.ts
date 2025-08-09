import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
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
    await prisma.qboConnection.upsert({
      where: { userId_realmId: { userId, realmId } },
      create: { userId, realmId, ...tokens, syncStatus: 'idle' },
      update: { ...tokens, syncStatus: 'idle' },
    })
    ;(await cookies()).delete('qbo_oauth_state')
    return NextResponse.redirect('/settings/qbo')
  } catch (e) {
    console.error('QBO OAuth callback error', e)
    return NextResponse.redirect('/?error=qbo_callback')
  }
}