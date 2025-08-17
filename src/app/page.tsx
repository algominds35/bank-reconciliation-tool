'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Clock, 
  FileText,
  Upload,
  ArrowRight,
  Play
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Simulate successful submission without database
      await new Promise(resolve => setTimeout(resolve, 1000))
        setShowSuccess(true)
        setEmail('')
        setTimeout(() => setShowSuccess(false), 5000)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReconcileBook</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Reviews</a>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <a href="#demo" className="scroll-smooth">
                <Button variant="outline" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Watch How It Works
                </Button>
              </a>
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Start Free Trial</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-0">
              🚀 Trusted by small business owners & bookkeepers nationwide
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Losing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                $2,000+ Monthly
              </span>{' '}
              to Reconciliation Errors
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect your QuickBooks account or upload CSV files. Our AI automatically matches transactions with 90%+ accuracy. 
              Reconcile 3 months in <strong>10 minutes</strong> instead of <strong>8+ hours</strong>. Join small business owners & bookkeepers who've already saved <strong>20+ hours monthly</strong>.
            </p>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white"></div>
                </div>
                                 <span>Small business owners & bookkeepers switching daily</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                <TrendingUp className="h-4 w-4" />
                <span>QuickBooks Integration</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200">
                <Upload className="h-4 w-4" />
                <span>Upload CSV Files</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                <Zap className="h-4 w-4" />
                <span>90%+ AI Accuracy</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                <Clock className="h-4 w-4" />
                <span>10 Min vs 8 Hours</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Start Free 14-Day Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
              <a href="#demo" className="scroll-smooth">
                <Button variant="outline" size="lg" className="px-10 py-6 text-xl font-semibold border-2 hover:bg-gray-50">
                  <Play className="mr-3 h-6 w-6" />
                  Watch 2-Min Demo
                </Button>
              </a>
            </div>

            {/* Trust Signals */}
            <div className="text-center">
                           <p className="text-sm text-gray-500 mb-4">
               🆓 <strong>14-day free trial</strong> • 💳 Credit card required • 🔒 Cancel anytime • ✅ No auto-billing
             </p>
              <div className="flex justify-center items-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>99.9% uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                         <p className="text-sm text-gray-500 mb-8">Trusted by small businesses & bookkeepers nationwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-300">ACCOUNTING FIRM</div>
              <div className="text-2xl font-bold text-gray-300">BOOKKEEPING PRO</div>
              <div className="text-2xl font-bold text-gray-300">CPA PARTNERS</div>
              <div className="text-2xl font-bold text-gray-300">FINANCIAL SERVICES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tired of These Reconciliation Nightmares?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every month, you waste precious time on manual reconciliation that could be spent growing your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">8+ Hours Wasted Monthly</h3>
              <p className="text-gray-600 mb-6">
                Manual reconciliation eats up your entire workday. Time you could spend on high-value client work.
              </p>
              <div className="text-2xl font-bold text-red-600">$2,000+ Lost Monthly</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Errors Cost You Money</h3>
              <p className="text-gray-600 mb-6">
                One missed transaction can cost thousands. Manual entry leads to costly mistakes and client disputes.
              </p>
              <div className="text-2xl font-bold text-orange-600">Risk of Fines</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth Stuck in Neutral</h3>
              <p className="text-gray-600 mb-6">
                You can't scale when you're stuck doing low-value manual work. Your potential is limited by busywork.
              </p>
              <div className="text-2xl font-bold text-purple-600">Revenue Stagnant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Solution: QuickBooks Integration + AI-Powered Matching
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect your QuickBooks account for instant sync, or upload CSV files manually. Our AI does the heavy lifting - you get from chaos to clarity in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Connect QuickBooks</h3>
              <p className="text-gray-600">
                One-click QuickBooks integration. We automatically sync your transactions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Upload CSV (Optional)</h3>
              <p className="text-gray-600">
                Or upload bank statements manually. We support all major bank formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. AI Matches</h3>
              <p className="text-gray-600">
                Our AI instantly finds 90%+ of matches using intelligent pattern recognition.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Review & Export</h3>
              <p className="text-gray-600">
                Review AI suggestions, approve matches, and export professional reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Accountants
            </h2>
                         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               See how ReconcileBook is transforming reconciliation for small business owners & bookkeepers nationwide
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "I was spending 12+ hours monthly on reconciliation. Now it takes me 2 hours. This tool has literally saved my business."
              </p>
                             <div className="flex items-center">
                 <div className="w-12 h-12 bg-blue-500 rounded-full mr-4"></div>
                 <div>
                   <div className="font-semibold text-gray-900">Sarah Chen</div>
                   <div className="text-sm text-gray-500">Small Business Owner, Chen Consulting</div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "90% accuracy is no joke. I've caught errors that would have cost my clients thousands. This is a game-changer."
              </p>
                             <div className="flex items-center">
                 <div className="w-12 h-12 bg-green-500 rounded-full mr-4"></div>
                 <div>
                   <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                   <div className="text-sm text-gray-500">Bookkeeper, Rodriguez Financial Services</div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "From 8 hours to 45 minutes. I can now focus on growing my practice instead of drowning in paperwork."
              </p>
                             <div className="flex items-center">
                 <div className="w-12 h-12 bg-purple-500 rounded-full mr-4"></div>
                 <div>
                   <div className="font-semibold text-gray-900">Lisa Thompson</div>
                   <div className="text-sm text-gray-500">Small Business Owner, Thompson & Associates</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Stop Wasting Time on Reconciliation?
          </h2>
                     <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
             Join small business owners & bookkeepers who've already saved 20+ hours monthly. Start your free trial today.
           </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-xl font-semibold shadow-lg">
                Start Free 14-Day Trial
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </a>
            <a href="#demo" className="scroll-smooth">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl font-semibold">
                <Play className="mr-3 h-6 w-6" />
                Watch Demo
              </Button>
            </a>
          </div>
                     <p className="text-sm text-blue-200 mt-6">
             💳 Credit card required • 🔒 Cancel anytime • ✅ No auto-billing during trial
           </p>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See How It Works in 2 Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how ReconcileBook transforms 8+ hours of manual reconciliation into a 10-minute automated process.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* YouTube Video Embed */}
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/_K9NET1njog?cc_load_policy=1"
                  title="ReconcileBook - Professional Bank Reconciliation Software Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Description */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll See:</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Upload bank and bookkeeping CSV files</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Smart matching interface</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>One-click reconciliation</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Professional PDF reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>QuickBooks CSV export</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>95% time savings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Reconcile Like a Pro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for small businesses, bookkeepers, and accountants who need powerful reconciliation without the complexity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Smart CSV Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Drag, drop, done. Our smart parser handles any CSV format from any bank or accounting software.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
              </div>
                <CardTitle className="text-xl">Instant Auto-Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Watch transactions pair themselves automatically. Our algorithm finds matches you'd miss manually.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
            </div>
                <CardTitle className="text-xl">Professional Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate bank-ready PDF reports and CSV exports that make your accountant smile.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
              </div>
                <CardTitle className="text-xl">Multi-Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Perfect for bookkeepers managing multiple clients. Keep everyone's data separate and organized.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-yellow-600" />
            </div>
                <CardTitle className="text-xl">Bank-Grade Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your financial data stays encrypted and private. No AI training, no human review, no data sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  See exactly how much time you're saving. Most users cut reconciliation time by 85%.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl">QuickBooks Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect your QuickBooks account and sync 24+ months of transactions automatically. No more manual exports.
                </p>
              </CardContent>
            </Card>
          </div>
              </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Users
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">(4.9/5 from 1,200+ reviews)</span>
            </div>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I was spending 6-8 hours every month on reconciliation. ReconcileBook cut that to 45 minutes. The auto-matching is incredibly accurate - it caught discrepancies I would have missed. Paid for itself in the first month."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Martinez</div>
                    <div className="text-gray-600 text-sm">Small Business Owner, Construction</div>
                    <div className="text-green-600 text-sm font-medium">Saved 7.5 hours/month</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Game changer for my bookkeeping practice. I can now handle 3x more clients without hiring additional staff. The professional reports are exactly what my clients need. ROI was immediate."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Michael Johnson</div>
                    <div className="text-gray-600 text-sm">Certified Bookkeeper</div>
                    <div className="text-green-600 text-sm font-medium">3x more clients</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Finally, a tool that does exactly what I need without the QuickBooks bloat. Clean interface, fast processing, and reliable results. My reconciliation accuracy went from 85% to 98%."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">LC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Lisa Chen</div>
                    <div className="text-gray-600 text-sm">Finance Manager, Tech Startup</div>
                    <div className="text-green-600 text-sm font-medium">98% accuracy rate</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "QuickBooks was driving me crazy with wrong auto-matches. ReconcileBook's intelligent matching is spot-on. I can review and accept matches with confidence. Time savings are incredible."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-semibold">RD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Robert Davis</div>
                    <div className="text-gray-600 text-sm">Accountant, CPA Firm</div>
                    <div className="text-green-600 text-sm font-medium">90% time savings</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The CSV import feature is brilliant. Works with any bank format. No more manual data entry. Professional reports make my clients happy. This tool pays for itself every month."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-semibold">AW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Amanda Wilson</div>
                    <div className="text-gray-600 text-sm">Bookkeeper, Retail Business</div>
                    <div className="text-green-600 text-sm font-medium">Eliminated manual entry</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "As a small business owner, I was drowning in reconciliation. ReconcileBook made it simple and fast. The support team is amazing. I actually look forward to reconciliation now."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-pink-600 font-semibold">TB</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Thomas Brown</div>
                    <div className="text-gray-600 text-sm">Restaurant Owner</div>
                    <div className="text-green-600 text-sm font-medium">From 6 hours to 30 min</div>
              </div>
            </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees, no surprise charges. Cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Perfect for small businesses</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Up to 1,000 transactions/month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>CSV import & export</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>PDF reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <a href="https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      Get Starter - $29/mo
                    </Button>
                  </a>
                  <a href="https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="ghost">
                      <Clock className="mr-2 h-4 w-4" />
                      Try Starter Free (14 Days)
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-blue-500 border-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-gray-600">/month</span>
            </div>
                <p className="text-gray-600 mt-2">For growing businesses & bookkeepers</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Up to 10,000 transactions/month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Multi-client management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced matching rules</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>API access</span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                      Get Professional - $79/mo
                    </Button>
                  </a>
                  <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Try Professional Free (14 Days)
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">For large accounting firms</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Unlimited transactions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <a href="https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      Get Enterprise - $199/mo
                    </Button>
                  </a>
                  <a href="https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="ghost">
                      <Clock className="mr-2 h-4 w-4" />
                      Try Enterprise Free (14 Days)
                    </Button>
                  </a>
              </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              💳 Credit card required for trials • 🛡️ Bank-grade security • 🔒 99.9% uptime guarantee
            </p>
            <p className="text-sm text-gray-500">
              🆓 14-day free trials • ⚡ Instant access • 🚫 Cancel anytime before billing
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by 1,200+ Finance Professionals
            </h2>
            <p className="text-xl text-gray-600">
              Bank-grade security and reliability you can count on
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-gray-600 text-sm">256-bit SSL encryption, GDPR compliant</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade infrastructure with guaranteed reliability</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">Live chat, email, and phone support from reconciliation experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600 text-sm">1,200+ users saving 10+ hours per month on average</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ReconcileBook</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional bank reconciliation software that saves you time and reduces errors.
              </p>
              <div className="mb-4">
                <p className="text-gray-400 mb-2">Questions? Get in touch:</p>
                <a href="mailto:alex@usealgomind.com" className="text-blue-400 hover:text-blue-300 font-medium">
                  alex@usealgomind.com
                </a>
              </div>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">📧</span>
          </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">📱</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">💬</span>
                </div>
              </div>
              </div>

              <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
              </div>

              <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:alex@usealgomind.com" className="hover:text-white">Contact Support</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
              </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/eula" className="hover:text-white">End‑User License Agreement</Link></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white">GDPR</a></li>
              </ul>
            </div>
        </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReconcileBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 