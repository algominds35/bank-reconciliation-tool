'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Benefits from '@/components/Benefits'
import Testimonials from '@/components/Testimonials'
import Logos from '@/components/Logos'
import DemoVideo from '@/components/DemoVideo'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <Testimonials />
      <Logos />
      <DemoVideo />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
