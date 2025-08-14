'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import QboDashboard from '@/components/qbo-dashboard'

interface QboConnection {
  id: string
  realm_id: string
  sync_status: string
  last_sync_at: string | null
  created_at: string
}

export default function QboSettingsClient() {
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QuickBooks Integration</h1>
              <p className="mt-2 text-gray-600">
                Connect your QuickBooks account to automatically sync transactions and integrate them into your reconciliation workflow.
              </p>
            </div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error === 'access_denied' ? 'Connection Cancelled' : 'Connection Error'}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error === 'access_denied' 
                    ? 'You cancelled the QuickBooks authorization. You can try connecting again anytime.'
                    : 'There was an error connecting to QuickBooks. Please try again.'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Successfully Connected!</h3>
                <div className="mt-2 text-sm text-green-700">
                  Your QuickBooks account is now connected and ready to sync.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {connection ? (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">QuickBooks Connected</h2>
              <p className="text-sm text-gray-600">Your account is successfully connected</p>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Realm ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{connection.realm_id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sync Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{connection.sync_status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Sync</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {connection.last_sync_at 
                      ? new Date(connection.last_sync_at).toLocaleDateString()
                      : 'Never'
                    }
                  </dd>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleFullSync}
                  disabled={syncing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {syncing ? 'Syncing...' : 'Full Historical Sync'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Disconnect
                </button>
              </div>

              {syncStatus && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">{syncStatus}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Connect QuickBooks</h2>
              <p className="text-sm text-gray-600">Link your QuickBooks account to start syncing transactions</p>
            </div>
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Connect?</h3>
              <p className="text-gray-500 mb-6">
                Connect your QuickBooks account to automatically import transactions and integrate them into your reconciliation workflow.
              </p>
              <button
                onClick={() => window.location.href = '/api/qbo/connect'}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect QuickBooks
              </button>
            </div>
          </div>
        )}

        {/* QBO Dashboard Component */}
        {connection && <QboDashboard realmId={connection.realm_id} />}
      </div>
    </div>
  )
} 