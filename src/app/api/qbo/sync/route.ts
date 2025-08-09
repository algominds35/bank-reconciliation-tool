import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchAccounts, fetchTransactions, markSync } from '@/lib/qbo'

async function runSync(userId: string, realmId: string, full: boolean) {
  await supabase
    .from('qbo_connections')
    .update({ sync_status: 'running', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('realm_id', realmId)
  await fetchAccounts(userId, realmId)
  await fetchTransactions(userId, realmId, full ? undefined : new Date(Date.now() - 90*24*60*60*1000).toISOString().slice(0,10))
  await markSync(userId, realmId)
}

export async function POST(req: NextRequest) {
  try {
    let userId = 'current-user-id'
    let realmId: string | null = null
    let full = false

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      userId = body.userId || userId
      realmId = body.realmId || null
      full = Boolean(body.full)
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData()
      userId = (form.get('userId') as string) || userId
      realmId = (form.get('realmId') as string) || null
      full = Boolean(form.get('full'))
    }

    if (!realmId) return NextResponse.json({ error: 'realmId required' }, { status: 400 })

    await runSync(userId, realmId, full)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('QBO sync error', e)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}

export async function GET() {
  try {
    // Cron daily sync across all connections
    const { data: connections } = await supabase.from('qbo_connections').select('user_id, realm_id')
    for (const c of connections || []) {
      // fire-and-forget, but await sequentially to avoid rate limits
      // eslint-disable-next-line no-await-in-loop
      await runSync(c.user_id, c.realm_id, false)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('QBO cron sync error', e)
    return NextResponse.json({ ok: true })
  }
}