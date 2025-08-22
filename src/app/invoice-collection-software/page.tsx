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
  Mail,
  Target,
  BarChart3,
  Zap
} from 'lucide-react'

export const metadata = {
  title: 'Automated Invoice Collection Software | ReconcileBook - 60% Faster Payments',
  description: 'Automated invoice collection software with 4-phase email sequences. Improve cash flow by 60% with professional payment reminders. Free trial.',
  keywords: 'invoice collection software, automated payment reminders, cash flow management, invoice follow up, payment collection automation',
}

export default function InvoiceCollectionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              💰 Automated Invoice Collection
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Automated Invoice<br />
              <span className="text-green-600">Collection Software</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Stop Chasing Payments. Let Automation Do It.
            </h2>
            
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
              Professional 4-phase email sequences automatically follow up on overdue invoices. 
              <strong> Improve cash flow by 60%</strong> while maintaining client relationships. 
              No manual follow-up required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
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
                60% faster payments
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Professional templates
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                4-phase automation
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
              Why Choose Automated Invoice Collection?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop losing money to late payments. Professional automation gets you paid faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Mail className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">4-Phase Email Sequences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Friendly reminder → Payment due → Urgent notice → Final warning. 
                  Professional templates that maintain client relationships.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Day -7: Friendly reminder</li>
                  <li>• Day +3: Payment due notice</li>
                  <li>• Day +14: Urgent overdue notice</li>
                  <li>• Day +30: Final collection warning</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Smart Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically calculates optimal send times based on due dates, payment history, 
                  and client behavior patterns for maximum effectiveness.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">60% Faster Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Businesses using ReconcileBook collect payments 60% faster than manual follow-up. 
                  Reduce average collection time from 45 days to 18 days.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Real-Time Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track overdue amounts, reminder status, and collection rates in one 
                  professional dashboard. Know exactly what needs attention.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">Improved Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Consistent follow-up recovers 40% more overdue invoices. 
                  Transform your accounts receivable into reliable cash flow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Relationship Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional, courteous messaging maintains client relationships 
                  while ensuring timely payments. No aggressive collection tactics.
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
              How Automated Invoice Collection Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Set it once, collect payments automatically forever
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Import Invoices</h3>
              <p className="text-gray-600 text-sm">
                Upload your invoices via CSV or create them manually. 
                System tracks due dates automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Automated Monitoring</h3>
              <p className="text-gray-600 text-sm">
                AI monitors due dates and automatically determines 
                which phase of reminder to send.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Professional Emails</h3>
              <p className="text-gray-600 text-sm">
                Branded, personalized emails sent at optimal times 
                with payment links and clear calls to action.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Track Results</h3>
              <p className="text-gray-600 text-sm">
                Monitor open rates, payment responses, and 
                collection performance in real-time dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Templates Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Email Templates That Get Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professionally crafted emails that maintain relationships while ensuring payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg text-green-800">Phase 1: Friendly Reminder</CardTitle>
                <p className="text-sm text-green-600">Sent 7 days before due date</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white border rounded p-4 text-sm">
                  <p className="font-semibold mb-2">Subject: Friendly Reminder - Invoice #12345</p>
                  <p className="mb-2">Hi [Client Name],</p>
                  <p className="mb-2">
                    This is a friendly reminder that invoice #12345 for $2,500.00 
                    is due on March 15, 2024.
                  </p>
                  <p className="mb-2">Please let us know if you have any questions.</p>
                  <Button size="sm" className="bg-green-600 text-white">Pay Invoice Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-lg text-red-800">Phase 4: Final Notice</CardTitle>
                <p className="text-sm text-red-600">Sent 30+ days overdue</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white border rounded p-4 text-sm">
                  <p className="font-semibold mb-2">Subject: FINAL NOTICE - Invoice #12345</p>
                  <p className="mb-2">Hi [Client Name],</p>
                  <p className="mb-2">
                    Invoice #12345 for $2,500.00 is now 32 days overdue. 
                    This is our final notice before collection action.
                  </p>
                  <p className="mb-2">Please contact us immediately to resolve this matter.</p>
                  <Button size="sm" className="bg-red-600 text-white">Pay Invoice Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Businesses Improve Cash Flow by 60%
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
                  "Our average collection time dropped from 45 days to 18 days. 
                  The automated sequences are incredibly professional."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-semibold">David K.</p>
                    <p className="text-sm text-gray-500">CEO, Marketing Agency</p>
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
                  "ReconcileBook recovered $50,000 in overdue invoices in the first month. 
                  Our cash flow has never been better."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-semibold">Lisa M.</p>
                    <p className="text-sm text-gray-500">Owner, Design Studio</p>
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
                  "No more awkward phone calls chasing payments. The automation 
                  handles everything professionally while I focus on growing the business."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-semibold">Tom R.</p>
                    <p className="text-sm text-gray-500">Consultant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Improve Cash Flow by 60%?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of businesses collecting payments faster with automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Free Trial - No Credit Card Required
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-green-200 mt-4 text-sm">
            14-day free trial • Cancel anytime • Setup in under 5 minutes
          </p>
        </div>
      </section>
    </div>
  )
}
