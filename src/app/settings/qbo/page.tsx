'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'



export default function QboSettingsPage() {
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  const handleFullSync = async () => {
    setSyncing(true)
    setSyncStatus('Starting full historical sync...')
    
    try {
      // For now, we'll use a placeholder realmId since you haven't completed the connection yet
      const response = await fetch('/api/qbo/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          realmId: 'test-realm-id', // This will be replaced with actual realmId after connection
          full: true
        })
      })
      
      if (response.ok) {
        setSyncStatus('Sync completed successfully!')
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

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link href="/api/qbo/connect" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
          Connect QuickBooks
        </Link>
        <Link href="/disconnect" style={{ border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
          Disconnect
        </Link>
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

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sync Status</h2>
        <p style={{ color: '#666' }}>
          After connecting, you will see import progress and a summary of reconciled vs. unreconciled months here.
        </p>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
          <strong>Note:</strong> The Full Historical Sync button will work properly once you complete the QuickBooks connection and have a valid realmId.
        </p>
      </div>
    </div>
  )
}