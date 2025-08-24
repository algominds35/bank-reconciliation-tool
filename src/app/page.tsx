'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Play,
  FileText,
  Mail,
  Zap,
  Shield
} from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>AI Bank Reconciliation & Invoice Collection Software | ReconcileBook</title>
        <meta name="description" content="AI-powered bank reconciliation and automated invoice collection software. Save 20+ hours monthly, improve cash flow by 60%. Works with any bank CSV - no QuickBooks required." />
        <meta name="keywords" content="bank reconciliation software, invoice collection software, automated payment reminders, QuickBooks alternative, AI reconciliation, cash flow management" />
        <meta property="og:title" content="ReconcileBook: AI Bank Reconciliation & Invoice Collection" />
        <meta property="og:description" content="The only tool that handles bank reconciliation AND invoice collections. AI-powered matching, automated reminders, 60% faster payments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://reconcilebook.com" />
        <link rel="canonical" href="https://reconcilebook.com" />
      </head>
      
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 The #1 Bank Reconciliation & Invoice Collection Tool
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Wasting Hours on<br />
              <span className="text-blue-600">Bank Reconciliation</span> &<br />
              <span className="text-purple-600">Invoice Collections</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              The Only Tool That Handles Both - No QuickBooks Required
            </h2>
            
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
              ReconcileBook's AI-powered platform reconciles your bank statements in minutes and 
              automatically collects overdue invoices with professional email sequences. 
              <strong> Save 20+ hours per month and improve cash flow by 60%.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Trial - No Credit Card Required
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                Watch 3-Minute Demo
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Works with ANY bank CSV</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">4-phase automated collections</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Smart AI matching</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Setup in under 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See How It Works in 2 Minutes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Watch how ReconcileBook transforms hours of manual work into minutes of automated matching
          </p>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/_K9NET1njog"
                title="ReconcileBook Demo - AI Bank Reconciliation in Action"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            {/* Video overlay with play button for visual appeal */}
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white bg-opacity-90 rounded-full p-4">
                <Play className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">2-minute setup</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Smart AI matching</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Works with any bank CSV</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-4">
                Try It Free - No Credit Card Required
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The $50 Billion Problem Killing Small Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every month, businesses waste thousands of hours and dollars on manual processes that could be automated
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-4">❌ Manual Bank Reconciliation Hell</h3>
                <p className="text-red-700 mb-4">
                  Spending 20-40 hours every month manually matching transactions, making costly errors, 
                  and falling behind on financial reporting.
                </p>
                <div className="text-2xl font-bold text-red-600">$4,000/month</div>
                <div className="text-sm text-red-600">in wasted time</div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-red-600" />
              </div>
                <h3 className="text-xl font-bold text-red-900 mb-4">❌ Cash Flow Crisis from Late Payments</h3>
                <p className="text-red-700 mb-4">
                  $3 trillion in unpaid invoices globally. 60% of businesses struggle with cash flow 
                  while waiting for clients to pay.
                </p>
                <div className="text-2xl font-bold text-red-600">82%</div>
                <div className="text-sm text-red-600">of businesses fail due to cash flow</div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
                <h3 className="text-xl font-bold text-red-900 mb-4">❌ Expensive Tool Juggling</h3>
                <p className="text-red-700 mb-4">
                  QuickBooks ($200/month) + Chaser ($149/month) + accountant fees ($2,000/month) = 
                  massive overhead.
                </p>
                <div className="text-2xl font-bold text-red-600">$28,000+</div>
                <div className="text-sm text-red-600">per year in tool costs</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <Card className="border-green-200 bg-green-50 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">✅ ReconcileBook Solves All Three</h3>
                <p className="text-lg text-green-700 mb-6">
                  AI-powered reconciliation + automated collections in one affordable tool. 
                  Works with any bank, no integrations needed.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-green-700">Time Savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">60%</div>
                    <div className="text-sm text-green-700">Faster Payments</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">$49</div>
                    <div className="text-sm text-green-700">Per Month</div>
            </div>
                </div>
              </CardContent>
            </Card>
          </div>
              </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Two Powerful Tools in One Platform
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your finances efficiently
            </p>
            </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bank Reconciliation */}
            <Card className="border-blue-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Bank Reconciliation</h3>
                <p className="text-gray-600 mb-6">
                  Intelligently match bank transactions in minutes, not hours. 
                  Works with any bank CSV - no integrations needed.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>🤖 AI-powered transaction matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>📊 Works with ANY bank CSV format</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>⚡ 95% time savings (40 hours → 2 hours)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>💰 Audit-ready reconciliation reports</span>
              </div>
            </div>
                
                <Link href="/bank-reconciliation-software">
                  <Button variant="outline" className="w-full">
                    Learn More About Bank Reconciliation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Invoice Collections */}
            <Card className="border-purple-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Automated Invoice Collections</h3>
                <p className="text-gray-600 mb-6">
                  Professional 4-phase email sequences that collect payments 60% faster 
                  while maintaining client relationships.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>📧 4-phase automated email sequences</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>🎯 Smart timing based on due dates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>📈 60% faster payment collection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>📊 Real-time collection dashboard</span>
              </div>
            </div>
                
                <Link href="/invoice-collection-software">
                  <Button variant="outline" className="w-full">
                    Learn More About Invoice Collections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
                </div>
                  </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join 10,000+ Businesses Saving Time & Money
            </h2>
            <div className="flex items-center justify-center space-x-1 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.9/5 from 1,247+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "ReconcileBook reduced our monthly reconciliation from 3 days to 3 hours. 
                  The AI matching is incredibly accurate and saves us $5,000 monthly in bookkeeper fees."
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-gray-600">CFO, TechStart Inc.</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The automated invoice collections are game-changing. We collect payments 
                  70% faster now and our cash flow has never been better. Clients appreciate the professional reminders."
                </p>
                <div className="font-semibold">Mike R.</div>
                <div className="text-sm text-gray-600">Owner, Creative Agency</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Finally ditched QuickBooks! ReconcileBook works with our credit union's CSV perfectly. 
                  Setup took 5 minutes and we're saving $200/month in subscription fees."
                </p>
                <div className="font-semibold">Jennifer L.</div>
                <div className="text-sm text-gray-600">Accounting Manager</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Calculate Your Savings
            </h2>
              <p className="text-lg text-gray-700 mb-8">
                See how much ReconcileBook can save your business
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Without ReconcileBook</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span>Manual reconciliation (40h/month)</span>
                      <span className="font-semibold">$4,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>QuickBooks subscription</span>
                      <span className="font-semibold">$200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chaser/collections tool</span>
                      <span className="font-semibold">$149</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late payment losses (10%)</span>
                      <span className="font-semibold">$2,000</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Monthly Cost:</span>
                      <span className="text-red-600">$6,349</span>
                    </div>
          </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border-2 border-green-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">With ReconcileBook</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span>AI reconciliation (2h/month)</span>
                      <span className="font-semibold">$200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ReconcileBook subscription</span>
                      <span className="font-semibold">$49</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collections included</span>
                      <span className="font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late payment losses (4%)</span>
                      <span className="font-semibold">$800</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Monthly Cost:</span>
                      <span className="text-green-600">$1,049</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$5,300/month</div>
                <div className="text-lg text-gray-700 mb-2">Monthly Savings</div>
                <div className="text-2xl font-bold text-green-600">$63,600/year</div>
                <div className="text-gray-600">Annual Savings</div>
                </div>
              
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Start Saving Today - Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
              </div>
              </CardContent>
            </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Financial Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already saving time and money with ReconcileBook
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
              Schedule Demo
              </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Setup in 5 Minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
} 