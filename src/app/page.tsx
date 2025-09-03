'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Benefits from '@/components/Benefits'
import Testimonials from '@/components/Testimonials'
import Logos from '@/components/Logos'
import DemoScreenshots from '@/components/DemoScreenshots'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

// Force redeploy to fix environment variables
export const FORCE_REDEPLOY = 'fix-api-connection-' + Date.now()

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <DemoScreenshots />
      <Testimonials />
      <Logos />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
