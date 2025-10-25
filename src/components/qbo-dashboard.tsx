'use client'

import React, { useEffect, useState } from 'react'

interface QboAccount {
  id: string
  account_name: string
  account_type: string
  balance: number
  currency: string
}

interface QboTransaction {
  id: string
  transaction_date: string
  transaction_type: string
  amount: number
  memo: string
  reference_number: string
}

interface Duplicate {
  transaction1: QboTransaction
  transaction2: QboTransaction
  confidence: number
  reason: string
  type: 'exact' | 'likely' | 'possible'
}

interface QboDashboardProps {
  realmId: string
}

export default function QboDashboard({ realmId }: QboDashboardProps) {
  const [accounts, setAccounts] = useState<QboAccount[]>([])
  const [transactions, setTransactions] = useState<QboTransaction[]>([])
  const [duplicates, setDuplicates] = useState<Duplicate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (realmId) {
      fetchDashboardData()
    }
  }, [realmId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch accounts
      const accountsResponse = await fetch(`/api/qbo/accounts?realmId=${realmId}`)
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setAccounts(accountsData.accounts || [])
      }
      
      // Fetch recent transactions
      const transactionsResponse = await fetch(`/api/qbo/transactions?realmId=${realmId}&limit=50`)
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions || [])
      }
      
      // Fetch duplicates
      const duplicatesResponse = await fetch(`/api/qbo/duplicates?realmId=${realmId}`)
      if (duplicatesResponse.ok) {
        const duplicatesData = await duplicatesResponse.json()
        setDuplicates(duplicatesData.duplicates || [])
      }
      
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading QuickBooks data...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc2626' }}>
        Error: {error}
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)

  // Check if a transaction is involved in any duplicate pair
  const isDuplicate = (txId: string) => {
    return duplicates.some(dup => 
      dup.transaction1.id === txId || dup.transaction2.id === txId
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
        QuickBooks Dashboard
      </h2>

      {/* Duplicate Warning Banner */}
      {duplicates.length > 0 && (
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #fbbf24', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg style={{ width: '24px', height: '24px', color: '#d97706', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: '0 0 4px 0' }}>
              ⚠️ {duplicates.length} Potential Duplicate{duplicates.length > 1 ? 's' : ''} Found
            </h3>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
              Review transactions marked with ⚠️ below. These may be duplicate entries that should be removed.
            </p>
          </div>
        </div>
      )}
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Total Balance</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#0f172a' }}>
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Connected Accounts</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#0f172a' }}>
            {accounts.length}
          </p>
        </div>
        
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Total Transactions</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: '#16a34a' }}>
            {transactions.length}
          </p>
        </div>

        <div style={{ background: duplicates.length > 0 ? '#fef3c7' : '#f8fafc', border: `1px solid ${duplicates.length > 0 ? '#fbbf24' : '#e2e8f0'}`, borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Potential Duplicates</h3>
          <p style={{ fontSize: '24px', fontWeight: '600', margin: '0', color: duplicates.length > 0 ? '#d97706' : '#16a34a' }}>
            {duplicates.length}
          </p>
        </div>
      </div>

      {/* Accounts Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Connected Bank Accounts</h3>
        {accounts.length > 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Account Name
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      {account.account_name}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                      {account.account_type}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: '500' }}>
                      ${(account.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No accounts found. Try running a sync first.</p>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Description
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Reference
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((transaction) => {
                  const hasDuplicate = isDuplicate(transaction.id)
                  const rowStyle = hasDuplicate ? { background: '#fef3c7' } : {}
                  
                  return (
                    <tr key={transaction.id} style={rowStyle}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {hasDuplicate && (
                            <span title="Potential duplicate transaction" style={{ color: '#d97706', fontSize: '16px' }}>
                              ⚠️
                            </span>
                          )}
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#e0e7ff',
                          color: '#3730a3'
                        }}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        {transaction.memo || 'No description'}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#64748b' }}>
                        {transaction.reference_number || '-'}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: '500' }}>
                        ${Math.abs(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No transactions found. Try running a sync first.</p>
        )}
      </div>
    </div>
  )
} 