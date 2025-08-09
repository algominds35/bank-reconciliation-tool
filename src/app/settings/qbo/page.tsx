import Link from 'next/link'

export const metadata = {
  title: 'QuickBooks Online Connection - ReconcileBook',
  description: 'Connect or disconnect your QuickBooks Online account and manage syncs.',
}

export default function QboSettingsPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>QuickBooks Online</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Connect your QuickBooks account to import accounts and transactions. After connecting, a daily sync will run automatically.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link href="/api/qbo/connect" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
          Connect QuickBooks
        </Link>
        <Link href="/disconnect" style={{ border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
          Disconnect
        </Link>
        <form action="/api/qbo/sync" method="post" style={{ display: 'inline' }}>
          <input type="hidden" name="full" value="true" />
          <button type="submit" style={{ border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: 8 }}>
            Full Historical Sync
          </button>
        </form>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sync Status</h2>
        <p style={{ color: '#666' }}>
          After connecting, you will see import progress and a summary of reconciled vs. unreconciled months here.
        </p>
      </div>
    </div>
  )
}