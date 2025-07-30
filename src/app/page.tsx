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
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Try Professional Free (14 Days)</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              ✅ Trusted by 500+ QuickBooks users
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Tired of QuickBooks Messing Up Bank Feeds?{' '}
              <span className="text-blue-600">Reconcile 10x Faster — Without Touching a Spreadsheet.</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Whether you're a business owner, bookkeeper, or accountant — ReconcileBook helps you fix messy data, match transactions, and close your books 10x faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Professional $79/mo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Clock className="mr-2 h-5 w-5" />
                  Try Professional Free (14 Days)
                </Button>
              </a>
            </div>

            <p className="text-sm text-gray-500">
              💳 Credit card required for trial • 🔒 Cancel anytime • ✅ Auto-billing after 14 days
            </p>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See How It Works in 2 Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how ReconcileBook transforms 4-5 hours of manual reconciliation into an 8-minute automated process.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* YouTube Video Embed */}
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/_K9NET1njog"
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

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-8">Trusted by leading businesses</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {['Acme Corp', 'TechStart', 'GrowthCo', 'FinanceFirst', 'SmallBiz'].map((company) => (
              <div key={company} className="text-xl font-semibold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Every Month, You Lose Sleep Over Reconciliation
            </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <p className="text-gray-600">Spending 8+ hours manually matching transactions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-2"></div>
          </div>
                  <p className="text-gray-600">Losing money to accounting errors and missed discrepancies</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <p className="text-gray-600">Drowning in spreadsheets and manual data entry</p>
              </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <p className="text-gray-600">Paying $300+/month for bloated accounting software you barely use</p>
                </div>
              </div>
            </div>
            <div>
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Now You Can Reconcile in Minutes, Not Hours
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Upload CSV → Auto-match transactions → Export report in under 30 minutes</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Catch every discrepancy with our smart matching system</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Clean, focused interface - no bloated features you'll never use</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Starting at just $29/month - 90% less than enterprise solutions</p>
                  </div>
                </div>
              </Card>
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
          </div>
              </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Don't Just Take Our Word For It
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">(4.9/5 from 1,200+ reviews)</span>
            </div>
            </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Cut my monthly reconciliation from 6 hours to 45 minutes. ReconcileBook paid for itself in the first month."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Martinez</div>
                    <div className="text-gray-600 text-sm">Small Business Owner</div>
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
                  "Game changer for my bookkeeping practice. I can now handle 3x more clients without hiring additional staff."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Michael Johnson</div>
                    <div className="text-gray-600 text-sm">Certified Bookkeeper</div>
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
                  "Finally, a tool that does exactly what I need without all the bloat. Clean, fast, and reliable."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">LC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Lisa Chen</div>
                    <div className="text-gray-600 text-sm">Finance Manager</div>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Your Time Back?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses who've already said goodbye to reconciliation stress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
              Schedule a Demo
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm opacity-80">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Cancel anytime</span>
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
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
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