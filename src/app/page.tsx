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
  Zap,
  Shield,
  Target,
  BarChart3,
  Sparkles,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Building2,
  CreditCard,
  Globe,
  Lock,
  Smartphone
} from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>ReconcileBook: Stop QuickBooks Headaches - AI Bank Reconciliation</title>
        <meta name="description" content="Tired of QuickBooks API failures? ReconcileBook's AI matches bank transactions instantly via CSV upload. No integrations, no headaches, just results." />
        <meta name="keywords" content="QuickBooks alternative, bank reconciliation software, CSV upload reconciliation, AI transaction matching, invoice collection automation" />
        <meta property="og:title" content="ReconcileBook: The QuickBooks Alternative That Actually Works" />
        <meta property="og:description" content="Upload CSV, AI matches transactions instantly. No more QuickBooks integration failures." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://reconcilebook.com" />
        <link rel="canonical" href="https://reconcilebook.com" />
      </head>
      
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* Header with Login/Signup */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">ReconcileBook</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              🎯 The Only Tool That Gets Bank Reconciliation RIGHT
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              <span className="block">Tired of</span>
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                QuickBooks Mistakes?
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-slate-600 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
              Upload Bank CSV → AI Matches Transactions → Perfect Reconciliation
              <br />
              <span className="text-slate-800 font-medium">Plus Automated Invoice Collections That Actually Work</span>
            </h2>
            
            <p className="text-lg text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-slate-900">Bank Reconciliation:</strong> Upload any bank CSV, AI matches transactions to your books instantly - no more coffee purchases matched to rent payments!
              <br />
              <strong className="text-slate-900">Invoice Collections:</strong> Professional email sequences that don't hit spam and get you paid 60% faster.
            </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="https://buy.stripe.com/test_professional_79" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Start Free Trial - $79/mo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              
              <a href="#demo-video">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-slate-300 hover:border-slate-400 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
                  <Play className="mr-2 h-5 w-5" />
                  Watch 2-Minute Demo
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Works with ANY bank CSV</span>
          </div>
              <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">AI matches in seconds</span>
        </div>
              <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">No integrations needed</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium">Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            See the Magic in Action
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Watch how ReconcileBook transforms hours of manual work into minutes of automated precision
          </p>
          
          <div className="relative group">
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-[1.02]">
              <iframe
                src="https://www.youtube.com/embed/_K9NET1njog"
                title="ReconcileBook Demo - AI Bank Reconciliation in Action"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            {/* Floating elements around video */}
            <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
              ✨ 2 min setup
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
              🚀 Instant results
            </div>
          </div>
          
          <div className="mt-12">
            <a href="https://buy.stripe.com/test_professional_79" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                Start Free Trial - $79/mo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The $50 Billion Problem
              <br />
              <span className="text-red-600">Killing Small Businesses</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every month, businesses waste thousands of hours and dollars on broken QuickBooks integrations and manual processes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Invoice Reminders Hit Spam</h3>
                <p className="text-slate-600 mb-6">
                  XERO and QuickBooks automated reminders trigger spam filters. Your customers never see them, you never get paid.
                </p>
                <div className="text-3xl font-bold text-red-600 mb-2">68%</div>
                <div className="text-sm text-red-600 font-medium">of automated reminders hit spam</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
              </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Weekend Work Hell</h3>
                <p className="text-slate-600 mb-6">
                  "Running a business is already a pain, now even the sundays are ruined" chasing unpaid invoices manually.
                </p>
                <div className="text-3xl font-bold text-orange-600 mb-2">20+ hrs</div>
                <div className="text-sm text-orange-600 font-medium">weekend work monthly</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Cash Flow Crisis</h3>
                <p className="text-slate-600 mb-6">
                  Unpaid invoices pile up while you're stuck fixing QB problems instead of collecting payments.
                </p>
                <div className="text-3xl font-bold text-yellow-600 mb-2">82%</div>
                <div className="text-sm text-yellow-600 font-medium">of businesses fail due to cash flow</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Sound Familiar? There's a Better Way...
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
              </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white border-0 px-6 py-2 text-sm font-medium shadow-lg">
              ✨ The ReconcileBook Solution
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What If Bank Reconciliation
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Just Worked?
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              No APIs to break. No integrations to maintain. Just upload your CSV and watch AI do the work.
            </p>
            </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Bank Reconciliation</h3>
                <p className="text-slate-600 mb-8">
                  Intelligently match bank transactions in minutes, not hours. Works with any bank CSV - no integrations needed.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>🤖 AI-powered transaction matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>📊 Works with any bank CSV format</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>⚡ Results in under 2 minutes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>🎯 Smart confidence scoring</span>
              </div>
            </div>
                
                <Button variant="outline" className="w-full border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Automated Collections</h3>
                <p className="text-slate-600 mb-8">
                  Professional 4-phase email sequences that get invoices paid 60% faster. No more chasing customers.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>📧 Professional email templates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>🔄 4-phase automated sequences</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>📊 Payment tracking & analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>⚡ 60% faster payments</span>
              </div>
            </div>
                
                <Button variant="outline" className="w-full border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Professional Reports</h3>
                <p className="text-slate-600 mb-8">
                  Export clean PDF and CSV reports that make your accountant happy. Professional presentation every time.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>📄 Beautiful PDF reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>📊 Detailed CSV exports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>🎯 Audit trail included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>👥 Accountant-friendly format</span>
              </div>
            </div>
                
                <Button variant="outline" className="w-full border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* ROI Calculator */}
          <Card className="border-0 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-2xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-6">See Your Savings</h3>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-bold mb-2">20+ hours</div>
                  <div className="text-emerald-100">saved monthly</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">$2,400</div>
                  <div className="text-emerald-100">value of time saved</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">60%</div>
                  <div className="text-emerald-100">faster payments</div>
                </div>
              </div>
              <p className="text-xl text-emerald-100 mb-8">
                ReconcileBook pays for itself in the first week
              </p>
              <a href="https://buy.stripe.com/test_professional_79" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                  Start Saving Today - $79/mo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Smart Businesses
            </h2>
            <p className="text-xl text-slate-600">
              Join hundreds of businesses who've ditched QuickBooks headaches
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "My XERO reminders kept hitting spam folders. ReconcileBook's professional templates get delivered every time and I got paid 60% faster!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Jessica Smith</div>
                    <div className="text-slate-600 text-sm">CEO, TechFlow Solutions</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "We were spending $500/month on a bookkeeper just for reconciliation. ReconcileBook does it better for $79. ROI was immediate."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Mike Rodriguez</div>
                    <div className="text-slate-600 text-sm">Founder, Digital Marketing Pro</div>
              </div>
            </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "I was working every weekend chasing payments. Now ReconcileBook handles it all automatically. My Sundays are finally free!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AL</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Amanda Lee</div>
                    <div className="text-slate-600 text-sm">Small Business Owner</div>
              </div>
            </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Simple, Honest Pricing
            </h2>
            <p className="text-xl text-slate-600">
              No hidden fees. No per-user charges. Just results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                  <p className="text-slate-600 mb-6">Perfect for small businesses</p>
                  <div className="text-4xl font-bold text-slate-900 mb-2">$29</div>
                  <div className="text-slate-600 mb-8">per month</div>
                  
                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Up to 500 transactions/month</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>AI bank reconciliation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>CSV upload & export</span>
                </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>Email support</span>
                    </div>
                  </div>
                  
                  <a href="https://buy.stripe.com/test_starter_29" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800">
                      Start Free Trial - $29/mo
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 border-blue-500 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                  <p className="text-slate-600 mb-6">Everything you need to scale</p>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$79</div>
                  <div className="text-slate-600 mb-8">per month</div>
                  
                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Up to 2,000 transactions/month</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>AI bank reconciliation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Automated invoice collections</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Professional PDF reports</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Priority email support</span>
                    </div>
            </div>
                  
                  <a href="https://buy.stripe.com/test_professional_79" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Start Free Trial - $79/mo
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                  <p className="text-slate-600 mb-6">For growing businesses</p>
                  <div className="text-4xl font-bold text-slate-900 mb-2">$199</div>
                  <div className="text-slate-600 mb-8">per month</div>
                  
                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Unlimited transactions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Everything in Professional</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Multi-user access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>API access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Phone support</span>
                    </div>
                </div>
                  
                  <a href="https://buy.stripe.com/test_enterprise_199" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                      Start Free Trial - $199/mo
                    </Button>
                  </a>
              </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ditch QuickBooks Headaches?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of businesses who've discovered the simple way to handle bank reconciliation and invoice collections
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <a href="https://buy.stripe.com/test_professional_79" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial - $79/mo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-all duration-300">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo Again
              </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Setup in 2 Minutes</span>
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