import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReconcileBook - AI Bank Reconciliation & Invoice Collection Software',
  description: 'Stop wasting hours on bank reconciliation and invoice collections. ReconcileBook\'s AI matches transactions in minutes and automates payment reminders. Save 20+ hours monthly.',
  keywords: 'bank reconciliation software, invoice collection software, automated reconciliation, AI accounting, QuickBooks alternative',
  openGraph: {
    title: 'ReconcileBook - AI Bank Reconciliation & Invoice Collection Software',
    description: 'Stop wasting hours on bank reconciliation and invoice collections. Save 20+ hours monthly with AI automation.',
    url: 'https://reconcilebook.com',
    siteName: 'ReconcileBook',
    images: [
      {
        url: 'https://reconcilebook.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReconcileBook - AI Bank Reconciliation & Invoice Collection Software',
    description: 'Stop wasting hours on bank reconciliation and invoice collections. Save 20+ hours monthly with AI automation.',
    images: ['https://reconcilebook.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://reconcilebook.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ReconcileBook",
              "description": "AI-powered bank reconciliation and invoice collection software that saves businesses 20+ hours monthly",
              "url": "https://reconcilebook.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web, Windows, Mac",
              "offers": {
                "@type": "Offer",
                "price": "49",
                "priceCurrency": "USD",
                "priceValidUntil": "2024-12-31"
              },
              "creator": {
                "@type": "Organization",
                "name": "ReconcileBook"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}