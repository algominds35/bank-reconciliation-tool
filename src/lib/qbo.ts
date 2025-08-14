import { encrypt, decrypt } from '@/lib/crypto'
import { supabase } from '@/lib/supabase'

const QBO_AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2'
const QBO_TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
const QBO_API_BASE = 'https://quickbooks.api.intuit.com/v3/company'

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
}

export function getQboAuthUrl(state: string, scope?: string) {
  const params = new URLSearchParams({
    client_id: process.env.QBO_CLIENT_ID!,
    response_type: 'code',
    scope:
      scope ||
      'com.intuit.quickbooks.accounting',
    redirect_uri: process.env.QBO_REDIRECT_URI!,
    state,
  })
  return `${QBO_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string, realmId: string) {
  const basic = Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString('base64')
  const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: process.env.QBO_REDIRECT_URI! })
  const res = await fetch(QBO_TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Token exchange failed')
  const data = (await res.json()) as TokenResponse
  const now = Date.now()
  return {
    realmId,
    accessTokenEncrypted: encrypt(data.access_token),
    refreshTokenEncrypted: encrypt(data.refresh_token),
    accessTokenExpiresAt: new Date(now + data.expires_in * 1000),
  }
}

export async function refreshTokensByUser(userId: string, realmId: string) {
  const { data: conn, error } = await supabase
    .from('qbo_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('realm_id', realmId)
    .maybeSingle()
  if (error) throw error
  if (!conn) throw new Error('Connection not found')
  const basic = Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString('base64')
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: decrypt(conn.refresh_token_encrypted) })
  const res = await fetch(QBO_TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Refresh failed')
  const data = (await res.json()) as TokenResponse
  const now = Date.now()
  const updates = {
    access_token_encrypted: encrypt(data.access_token),
    refresh_token_encrypted: data.refresh_token ? encrypt(data.refresh_token) : conn.refresh_token_encrypted,
    access_token_expires_at: new Date(now + data.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
  const { data: updated, error: upErr } = await supabase
    .from('qbo_connections')
    .update(updates)
    .eq('id', conn.id)
    .select('*')
    .maybeSingle()
  if (upErr) throw upErr
  return updated
}

async function getAuthHeader(conn: { id: string; access_token_encrypted: string; access_token_expires_at: string; user_id: string; realm_id: string }) {
  if (new Date(conn.access_token_expires_at).getTime() < Date.now() + 60_000) {
    conn = await refreshTokensByUser(conn.user_id, conn.realm_id)
  }
  const token = decrypt(conn.access_token_encrypted)
  return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
}

export async function fetchAccounts(userId: string, realmId: string) {
  const { data: conn, error } = await supabase
    .from('qbo_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('realm_id', realmId)
    .maybeSingle()
  if (error) throw error
  if (!conn) throw new Error('No QBO connection')
  const headers = await getAuthHeader(conn)
  const url = `${QBO_API_BASE}/${realmId}/query?query=${encodeURIComponent('select * from Account')}`
  const res = await fetch(url, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error('Accounts fetch failed')
  const data = await res.json()
  const rows = (data.QueryResponse?.Account || []) as any[]
  const upserts = rows.map((a) => ({
    user_id: userId,
    realm_id: realmId,
    qbo_account_id: String(a.Id),
    account_name: a.Name,
    account_type: a.AccountType,
    account_sub_type: a.AccountSubType || null,
    active: a.Active ?? true,
    updated_at: new Date().toISOString(),
  }))
  const { error: upErr } = await supabase
    .from('qbo_accounts')
    .upsert(upserts, { onConflict: 'realm_id,qbo_account_id' })
  if (upErr) throw upErr
  
  return rows
}

export async function fetchTransactions(userId: string, realmId: string, since?: string) {
  const { data: conn, error } = await supabase
    .from('qbo_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('realm_id', realmId)
    .maybeSingle()
  if (error) throw error
  if (!conn) throw new Error('No QBO connection')
  const headers = await getAuthHeader(conn)
  const start = since || new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const queries = [
    `select * from Purchase where TxnDate >= '${start}'`,
    `select * from JournalEntry where TxnDate >= '${start}'`,
    `select * from Payment where TxnDate >= '${start}'`,
    `select * from SalesReceipt where TxnDate >= '${start}'`,
    `select * from Deposit where TxnDate >= '${start}'`,
    `select * from BillPayment where TxnDate >= '${start}'`,
  ]
  
  let allTransactions: any[] = []
  
  for (const q of queries) {
    const url = `${QBO_API_BASE}/${realmId}/query?query=${encodeURIComponent(q)}`
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (!res.ok) continue
    const data = await res.json()
    const key = Object.keys(data.QueryResponse || {}).find((k) => Array.isArray((data.QueryResponse as any)[k]))
    const rows = (key ? (data.QueryResponse as any)[key] : []) as any[]
    if (!rows.length) continue
    const upserts = rows.map((t) => ({
      user_id: userId,
      realm_id: realmId,
      entity_type: key || 'Txn',
      qbo_transaction_id: String(t.Id),
      doc_number: t.DocNumber || t.PaymentRefNum || null,
      txn_date: new Date(t.TxnDate || t.MetaData?.CreateTime || Date.now()).toISOString(),
      amount: Number(
        t.TotalAmt ?? t.Amount ?? (t.Line || []).reduce((s: number, l: any) => s + (l.Amount || 0), 0) ?? 0
      ),
      description: t.PrivateNote || t.Line?.[0]?.Description || null,
      account_ref: t.AccountRef?.value || null,
      updated_at: new Date().toISOString(),
    }))
    const { error: upErr } = await supabase
      .from('qbo_transactions')
      .upsert(upserts, { onConflict: 'realm_id,qbo_transaction_id' })
    if (upErr) throw upErr
    
    allTransactions.push(...rows)
  }
  
  return allTransactions
}

export async function markSync(userId: string, realmId: string, status: string = 'completed', errorMessage?: string) {
  const updateData: any = { 
    last_sync_at: new Date().toISOString(), 
    sync_status: status 
  }
  
  if (errorMessage) {
    updateData.sync_error = errorMessage
  }
  
  const { data, error } = await supabase
    .from('qbo_connections')
    .update(updateData)
    .eq('user_id', userId)
    .eq('realm_id', realmId)
    .select()
    .maybeSingle()
    
  if (error) throw error
  return data
}