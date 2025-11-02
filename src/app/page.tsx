'use client'

import Header from '@/components/Header'
import CSVFirstHero from '@/components/CSVFirstHero'
import Benefits from '@/components/Benefits'
import QuickBooksVsReconcileBook from '@/components/QuickBooksVsReconcileBook'
import Testimonials from '@/components/Testimonials'
import Logos from '@/components/Logos'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

// Force environment variable refresh
const FORCE_ENV_REFRESH = Date.now()

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <CSVFirstHero />
      <Benefits />
      <QuickBooksVsReconcileBook />
      <HowItWorks />
      <Testimonials />
      <Logos />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
