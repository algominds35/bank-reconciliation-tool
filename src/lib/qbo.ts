import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/crypto'
import { Prisma } from '@prisma/client'

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
      'com.intuit.quickbooks.accounting com.intuit.quickbooks.payment openid email profile phone address',
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

export async function refreshTokens(connId: string) {
  let conn = await prisma.qboConnection.findUnique({ where: { id: connId } })
  if (!conn) throw new Error('Connection not found')
  const basic = Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString('base64')
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: decrypt(conn.refreshTokenEncrypted) })
  const res = await fetch(QBO_TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Refresh failed')
  const data = (await res.json()) as TokenResponse
  const now = Date.now()
  conn = await prisma.qboConnection.update({
    where: { id: conn.id },
    data: {
      accessTokenEncrypted: encrypt(data.access_token),
      refreshTokenEncrypted: data.refresh_token ? encrypt(data.refresh_token) : conn.refreshTokenEncrypted,
      accessTokenExpiresAt: new Date(now + data.expires_in * 1000),
    },
  })
  return conn
}

async function getAuthHeader(conn: { id: string; accessTokenEncrypted: string; accessTokenExpiresAt: Date }) {
  if (new Date(conn.accessTokenExpiresAt).getTime() < Date.now() + 60_000) {
    conn = await refreshTokens(conn.id)
  }
  const token = decrypt(conn.accessTokenEncrypted)
  return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
}

export async function fetchAccounts(userId: string, realmId: string) {
  const conn = await prisma.qboConnection.findFirst({ where: { userId, realmId } })
  if (!conn) throw new Error('No QBO connection')
  const headers = await getAuthHeader(conn)
  const url = `${QBO_API_BASE}/${realmId}/query?query=${encodeURIComponent('select * from Account')}`
  const res = await fetch(url, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error('Accounts fetch failed')
  const data = await res.json()
  const rows = (data.QueryResponse?.Account || []) as any[]
  await prisma.$transaction(
    rows.map((a) =>
      prisma.qboAccount.upsert({
        where: { realmId_qboId: { realmId, qboId: String(a.Id) } },
        create: {
          userId,
          realmId,
          qboId: String(a.Id),
          name: a.Name,
          accountType: a.AccountType,
          accountSubType: a.AccountSubType || null,
          active: a.Active ?? true,
        },
        update: {
          name: a.Name,
          accountType: a.AccountType,
          accountSubType: a.AccountSubType || null,
          active: a.Active ?? true,
        },
      })
    )
  )
}

export async function fetchTransactions(userId: string, realmId: string, since?: string) {
  const conn = await prisma.qboConnection.findFirst({ where: { userId, realmId } })
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
  for (const q of queries) {
    const url = `${QBO_API_BASE}/${realmId}/query?query=${encodeURIComponent(q)}`
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (!res.ok) continue
    const data = await res.json()
    const key = Object.keys(data.QueryResponse || {}).find((k) => Array.isArray((data.QueryResponse as any)[k]))
    const rows = (key ? (data.QueryResponse as any)[key] : []) as any[]
    if (!rows.length) continue
    await prisma.$transaction(
      rows.map((t) =>
        prisma.qboTransaction.upsert({
          where: { realmId_qboId_txn: { realmId, qboId: String(t.Id) } },
          create: {
            userId,
            realmId,
            entityType: key || 'Txn',
            qboId: String(t.Id),
            docNumber: t.DocNumber || t.PaymentRefNum || null,
            txnDate: new Date(t.TxnDate || t.MetaData?.CreateTime || Date.now()),
            amount: new Prisma.Decimal(
              t.TotalAmt ?? t.Amount ?? (t.Line || []).reduce((s: number, l: any) => s + (l.Amount || 0), 0) ?? 0
            ),
            description: t.PrivateNote || t.Line?.[0]?.Description || null,
            accountRef: t.AccountRef?.value || null,
            reconciled: undefined,
          },
          update: {
            docNumber: t.DocNumber || t.PaymentRefNum || null,
            txnDate: new Date(t.TxnDate || t.MetaData?.CreateTime || Date.now()),
            amount: new Prisma.Decimal(
              t.TotalAmt ?? t.Amount ?? (t.Line || []).reduce((s: number, l: any) => s + (l.Amount || 0), 0) ?? 0
            ),
            description: t.PrivateNote || t.Line?.[0]?.Description || null,
            accountRef: t.AccountRef?.value || null,
          },
        })
      )
    )
  }
}

export async function markSync(userId: string, realmId: string) {
  await prisma.qboConnection.updateMany({ where: { userId, realmId }, data: { lastSyncAt: new Date(), syncStatus: 'completed' } })
}