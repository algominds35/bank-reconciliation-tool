import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ReconcileBook: Professional Bank Reconciliation & Excel Reporting',
  description: 'AI-powered bank reconciliation and professional Excel reports. Upload CSV, get perfect matches and accountant-ready reports in minutes.',
  keywords: 'bank reconciliation, Excel reports, QuickBooks alternative, CSV upload, financial reports',
  openGraph: {
    title: 'ReconcileBook: Professional Bank Reconciliation & Excel Reporting',
    description: 'AI-powered bank reconciliation and professional Excel reports. Upload CSV, get perfect matches and accountant-ready reports in minutes.',
    type: 'website',
    url: 'https://reconcilebook.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}