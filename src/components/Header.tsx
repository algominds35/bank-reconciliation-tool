'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowRight } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F45B49] to-[#E24C3A] rounded-lg flex items-center justify-center mr-3">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">ReconcileBook</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Features</a>
            <a href="#testimonials" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Testimonials</a>
            <a href="#pricing" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">FAQ</a>
            <Link href="/blog">
              <span className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Blog</span>
            </Link>
            <Link href="/contact">
              <span className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Contact</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                Login
              </Button>
            </Link>
            <a href="https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-[#F45B49] hover:bg-[#E24C3A] text-white rounded-full">
                  Start Free Trial
                </Button>
              </motion.div>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
