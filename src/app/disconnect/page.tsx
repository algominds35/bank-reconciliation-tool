import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disconnected from QuickBooks - ReconcileBook',
  description: 'Your QuickBooks company has been disconnected from ReconcileBook. You can reconnect anytime from Settings.',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://www.reconcilebook.com/disconnect'
  }
}

export default function DisconnectPage() {
  return (
    <html lang="en">
      <head>
        <title>Disconnected from QuickBooks - ReconcileBook</title>
        <meta name="description" content="Your QuickBooks company has been disconnected from ReconcileBook. You can reconnect anytime from Settings." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.reconcilebook.com/disconnect" />
      </head>
      <body>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: '1.6',
          color: '#333'
        }}>
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px'
            }}>
              ✓
            </div>
            
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#111'
            }}>
              You've been disconnected.
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '32px',
              maxWidth: '480px',
              margin: '0 auto 32px'
            }}>
              Your QuickBooks company is no longer linked to ReconcileBook. You can reconnect anytime from Settings.
            </p>

            <Link 
              href="/"
              style={{
                display: 'inline-block',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                marginBottom: '24px'
              }}
            >
              Return to ReconcileBook
            </Link>

            <div style={{
              marginTop: '48px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 12px'
              }}>
                If you disconnected by mistake, you can reconnect QuickBooks:
              </p>
              <Link 
                href="/connect/quickbooks"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                Reconnect QuickBooks →
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}