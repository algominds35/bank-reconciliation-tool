import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'End-User License Agreement (EULA) - ReconcileBook',
  description: 'End-User License Agreement for ReconcileBook software and services.',
  alternates: {
    canonical: 'https://www.reconcilebook.com/eula'
  }
}

export default function EULAPage() {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <html lang="en">
      <head>
        <title>End-User License Agreement (EULA) - ReconcileBook</title>
        <meta name="description" content="End-User License Agreement for ReconcileBook software and services." />
        <link rel="canonical" href="https://www.reconcilebook.com/eula" />
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
          <header style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#111'
            }}>
              End-User License Agreement (EULA)
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Last updated: {today}
            </p>
          </header>

          <main>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                License Grant
              </h2>
              <p style={{ marginBottom: '16px' }}>
                Subject to payment of applicable fees and compliance with this Agreement, ReconcileBook, Inc. ("ReconcileBook", "we", "our") grants you a limited, non-exclusive, non-transferable license to access and use the ReconcileBook software and services (the "Software") solely for your internal business purposes.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                Acceptable Use
              </h2>
              <p style={{ marginBottom: '8px' }}>You may use the Software to:</p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '4px' }}>Reconcile bank and credit card transactions using CSV files you lawfully control</li>
                <li style={{ marginBottom: '4px' }}>Generate reconciliation reports for internal records, accountants, auditors, and clients you serve</li>
                <li style={{ marginBottom: '4px' }}>Create user accounts for team members within your subscription plan limits</li>
              </ul>
              <p style={{ marginBottom: '8px' }}>You may not:</p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '4px' }}>Reverse engineer, decompile, or attempt to derive the source code</li>
                <li style={{ marginBottom: '4px' }}>Rent, lease, sell, sublicense, or redistribute the Software</li>
                <li style={{ marginBottom: '4px' }}>Use the Software for unlawful purposes or to infringe third-party rights</li>
                <li style={{ marginBottom: '4px' }}>Circumvent usage limits or security measures</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                Data Handling
              </h2>
              <p style={{ marginBottom: '16px' }}>
                We process customer data in accordance with our Privacy Policy. You are responsible for ensuring you have the right to upload and process any data you provide to the Software. You must maintain the security of your account credentials and notify us immediately of any unauthorized access.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                Third-Party Services (Intuit/QuickBooks)
              </h2>
              <p style={{ marginBottom: '16px' }}>
                The Software may integrate with third-party services including Intuit QuickBooks. Your use of such integrations is subject to the third party's terms of service and privacy policies. We are not responsible for the availability, functionality, or security of third-party services. You may disconnect these integrations at any time through your account settings or by visiting our disconnect page.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                Termination
              </h2>
              <p style={{ marginBottom: '16px' }}>
                This Agreement remains in effect while you use the Software. Either party may terminate this Agreement at any time. We may suspend or terminate your access for breach of this Agreement. Upon termination, your right to use the Software ceases immediately, though certain provisions will survive termination.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                Disclaimers & Limitation of Liability
              </h2>
              <p style={{ marginBottom: '12px' }}>
                THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p style={{ marginBottom: '16px' }}>
                OUR TOTAL LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE AMOUNTS PAID BY YOU FOR THE SOFTWARE IN THE 12 MONTHS PRECEDING THE CLAIM. WE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#111'
              }}>
                Support & Contact
              </h2>
              <p style={{ marginBottom: '16px' }}>
                For questions about this Agreement or technical support, please contact us at{' '}
                <a 
                  href="mailto:support@reconcilebook.com" 
                  style={{ color: '#3b82f6', textDecoration: 'underline' }}
                >
                  support@reconcilebook.com
                </a>
              </p>
            </section>

            <div style={{ 
              marginTop: '48px', 
              paddingTop: '24px', 
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <Link 
                href="/"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                ← Back to ReconcileBook
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}