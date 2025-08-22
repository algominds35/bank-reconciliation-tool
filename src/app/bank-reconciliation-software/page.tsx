'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Zap,
  FileText,
  Brain,
  Upload
} from 'lucide-react'

export const metadata = {
  title: 'AI Bank Reconciliation Software | ReconcileBook - 99.9% Accuracy',
  description: 'AI-powered bank reconciliation software that matches transactions with 99.9% accuracy. Works with any bank CSV. Reduce reconciliation time by 95%. Free trial.',
  keywords: 'bank reconciliation software, AI reconciliation, automated bank matching, QuickBooks alternative, CSV bank reconciliation',
}

export default function BankReconciliationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🤖 AI-Powered Bank Reconciliation
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Bank Reconciliation<br />
              <span className="text-blue-600">Software</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Match Bank Transactions in Minutes, Not Hours
            </h2>
            
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
              Advanced AI algorithms match transactions by amount, date, and description with 
              <strong> 99.9% accuracy</strong>. Works with any bank CSV - no integrations needed. 
              Reduce reconciliation time by 95%.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Watch Demo
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Works with ANY bank
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                99.9% accuracy
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                5-minute setup
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI Bank Reconciliation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop spending 20-40 hours monthly on manual reconciliation. Let AI do it in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced machine learning algorithms analyze amount, date, and description patterns 
                  to match transactions with 99.9% accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Upload className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">Universal CSV Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Works with CSV exports from Chase, Wells Fargo, Bank of America, or any bank. 
                  No integrations, no setup headaches.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">95% Time Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reduce monthly reconciliation from 40 hours to 2 hours. Focus on growing 
                  your business instead of matching transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Audit-Ready Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate professional reconciliation reports instantly. Perfect for 
                  accountants, auditors, and financial reviews.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">Massive Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Replace $2,000/month bookkeeper fees and expensive QuickBooks subscriptions. 
                  ROI pays for itself in the first month.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Multi-User Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Team collaboration features with role-based access. Perfect for 
                  accounting firms managing multiple clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AI Bank Reconciliation Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 3-step process that transforms hours of work into minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Your CSVs</h3>
              <p className="text-gray-600">
                Export CSV files from your bank and accounting software. 
                Drag and drop into ReconcileBook - takes 30 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analyzes & Matches</h3>
              <p className="text-gray-600">
                Advanced algorithms compare amounts, dates, and descriptions. 
                AI suggests matches with confidence scores.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Review & Export</h3>
              <p className="text-gray-600">
                Review AI suggestions (90%+ pre-matched), confirm matches, 
                and export professional reconciliation reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join 10,000+ Businesses Saving Time & Money
            </h2>
            <div className="flex justify-center items-center space-x-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.8/5 (150+ reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "ReconcileBook reduced our monthly reconciliation from 3 days to 3 hours. 
                  The AI matching is incredibly accurate."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-gray-500">CFO, TechStart Inc</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally, a reconciliation tool that works with our credit union. 
                  No more expensive QuickBooks subscription!"
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-semibold">Mike R.</p>
                    <p className="text-sm text-gray-500">Owner, Mike's Auto Shop</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "We handle 50+ client reconciliations monthly. ReconcileBook 
                  increased our capacity by 300% with the same staff."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-semibold">Jennifer L.</p>
                    <p className="text-sm text-gray-500">Partner, L&K Accounting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save 20+ Hours Monthly?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using AI to automate their bank reconciliation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Free Trial - No Credit Card Required
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            14-day free trial • Cancel anytime • Setup in under 5 minutes
          </p>
        </div>
      </section>
    </div>
  )
}
