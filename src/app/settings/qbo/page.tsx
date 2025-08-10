'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import QboDashboard from '@/components/qbo-dashboard'

interface QboConnection {
  id: string
  realm_id: string
  sync_status: string
  last_sync_at: string | null
  created_at: string
}

export default function QboSettingsPage() {
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')
  const [connection, setConnection] = useState<QboConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  // Check for existing QBO connection
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/qbo/status')
      if (response.ok) {
        const data = await response.json()
        setConnection(data.connection)
      }
    } catch (error) {
      console.log('No existing connection found')
    } finally {
      setLoading(false)
    }
  }

  const handleFullSync = async () => {
    if (!connection) {
      setSyncStatus('Please connect to QuickBooks first')
      return
    }

    setSyncing(true)
    setSyncStatus('Starting full historical sync...')
    
    try {
      const response = await fetch('/api/qbo/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          realmId: connection.realm_id,
          full: true
        })
      })
      
      if (response.ok) {
        setSyncStatus('Sync completed successfully!')
        // Refresh connection status
        await checkConnection()
      } else {
        const errorData = await response.json()
        setSyncStatus(`Sync failed: ${errorData.error}`)
      }
    } catch (error) {
      setSyncStatus('Sync failed: Network error')
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    if (!connection) return
    
    try {
      const response = await fetch('/api/qbo/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          realmId: connection.realm_id
        })
      })
      
      if (response.ok) {
        setConnection(null)
        setSyncStatus('Disconnected from QuickBooks')
      }
    } catch (error) {
      setSyncStatus('Failed to disconnect')
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>QuickBooks Online</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Connect your QuickBooks account to import accounts and transactions. After connecting, a daily sync will run automatically.
      </p>

      {/* Error Messages */}
      {error && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          {error === 'access_denied' && 'QuickBooks connection was cancelled. You can try again anytime.'}
          {error === 'invalid_grant' && 'QuickBooks connection expired. Please try connecting again.'}
          {error === 'oauth_error' && 'There was an error with the QuickBooks connection. Please try again.'}
          {error === 'invalid_params' && 'Invalid connection parameters. Please try connecting again.'}
          {error === 'connection_failed' && 'Failed to establish QuickBooks connection. Please try again.'}
        </div>
      )}

      {/* Success Messages */}
      {success && (
        <div style={{ 
          background: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          color: '#16a34a', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          {success === 'connected' && 'Successfully connected to QuickBooks! Your data will sync automatically.'}
        </div>
      )}

      {/* Connection Status */}
      {connection && (
        <div style={{ 
          background: '#f0f9ff', 
          border: '1px solid #bae6fd', 
          color: '#0369a1', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
            ✅ Connected to QuickBooks
          </h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            <strong>Company ID:</strong> {connection.realm_id}
          </p>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            <strong>Sync Status:</strong> {connection.sync_status}
          </p>
          {connection.last_sync_at && (
            <p style={{ margin: '0', fontSize: '14px' }}>
              <strong>Last Sync:</strong> {new Date(connection.last_sync_at).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {!connection ? (
          <Link href="/api/qbo/connect" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
            Connect QuickBooks
          </Link>
        ) : (
          <>
            <button 
              onClick={handleDisconnect}
              style={{ 
                border: '1px solid #dc2626', 
                color: '#dc2626', 
                padding: '10px 16px', 
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>
            <button 
              onClick={handleFullSync}
              disabled={syncing}
              style={{ 
                border: '1px solid #e5e7eb', 
                padding: '10px 16px', 
                borderRadius: 8,
                background: syncing ? '#f3f4f6' : '#fff',
                cursor: syncing ? 'not-allowed' : 'pointer'
              }}
            >
              {syncing ? 'Syncing...' : 'Full Historical Sync'}
            </button>
          </>
        )}
      </div>

      {/* Sync Status */}
      {syncStatus && (
        <div style={{ 
          background: '#f0f9ff', 
          border: '1px solid #bae6fd', 
          color: '#0369a1', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          {syncStatus}
        </div>
      )}

      {/* QuickBooks Dashboard - Show when connected */}
      {connection && (
        <div style={{ marginTop: '40px' }}>
          <QboDashboard realmId={connection.realm_id} />
        </div>
      )}

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sync Status</h2>
        {connection ? (
          <p style={{ color: '#666' }}>
            Your QuickBooks data syncs automatically every day. Use the "Full Historical Sync" button above to import all historical data now.
          </p>
        ) : (
          <p style={{ color: '#666' }}>
            After connecting, you will see import progress and a summary of reconciled vs. unreconciled months here.
          </p>
        )}
      </div>
    </div>
  )
}