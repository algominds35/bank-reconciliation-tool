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

interface QboDashboardProps {
  realmId: string
}

export default function QboDashboard({ realmId }: QboDashboardProps) {
  const [accounts, setAccounts] = useState<QboAccount[]>([])
  const [transactions, setTransactions] = useState<QboTransaction[]>([])
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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
        QuickBooks Dashboard
      </h2>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
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
                {transactions.slice(0, 20).map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                      {new Date(transaction.transaction_date).toLocaleDateString()}
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
                ))}
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