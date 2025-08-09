import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { getQboAuthUrl } from '@/lib/qbo'

export async function GET(_req: NextRequest) {
  const state: string = randomUUID()
  const c = cookies()
  c.set('qbo_oauth_state', state, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600 })
  const url = getQboAuthUrl(state)
  return NextResponse.redirect(url)
}