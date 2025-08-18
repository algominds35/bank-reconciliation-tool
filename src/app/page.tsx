"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Clock,
  ArrowRight,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-neutral-600" />,
    title: "AI-Powered Matching",
    description: "Automatically match bank transactions with QuickBooks data using advanced machine learning algorithms."
  },
  {
    icon: <Shield className="w-6 h-6 text-neutral-600" />,
    title: "Bank-Level Security",
    description: "Enterprise-grade encryption with SOC 2 compliance. Your financial data is protected with military-grade security."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-neutral-600" />,
    title: "Real-Time Analytics",
    description: "Live dashboards showing reconciliation status, cash flow insights, and financial health metrics."
  },
  {
    icon: <Users className="w-6 h-6 text-neutral-600" />,
    title: "Multi-Client Management",
    description: "Handle unlimited clients from one dashboard. Perfect for bookkeepers and accounting firms."
  },
  {
    icon: <Clock className="w-6 h-6 text-neutral-600" />,
    title: "Automated Workflows",
    description: "Set up rules and automation to handle recurring transactions. Never miss a reconciliation again."
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-neutral-600" />,
    title: "QuickBooks Native",
    description: "Seamless integration with QuickBooks Online. Sync invoices, transactions, and accounts automatically."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO",
    company: "TechFlow Solutions",
    content: "This tool saved us 15 hours per month on bank reconciliation. The AI matching is incredibly accurate.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Managing Partner",
    company: "Rodriguez & Associates",
    content: "We handle 50+ clients and this tool has revolutionized our workflow. The multi-client dashboard is a game-changer.",
    rating: 5
  },
  {
    name: "Jennifer Walsh",
    role: "Finance Director",
    company: "GreenLeaf Retail",
    content: "Finally, a reconciliation tool that actually works with QuickBooks. We've eliminated 90% of our manual work.",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small businesses getting started with automation",
    features: [
      "Up to 1,000 transactions/month",
      "Basic AI matching",
      "QuickBooks integration",
      "Email support",
      "Standard reports"
    ],
    popular: false,
    stripeLink: "https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a"
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "Ideal for growing businesses and bookkeepers",
    features: [
      "Up to 10,000 transactions/month",
      "Advanced AI matching",
      "Multi-account support",
      "Priority support",
      "Advanced analytics",
      "Custom rules & automation"
    ],
    popular: true,
    stripeLink: "https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b"
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited transactions",
      "Custom AI models",
      "White-label solution",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "On-premise deployment"
    ],
    popular: false,
    stripeLink: "https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">QB</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-neutral-900">ReconcilePro</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Features</a>
              <a href="#pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Pricing</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Reviews</a>
              <a href="#demo" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Demo</a>
            </nav>

            {/* Right Side Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium">
                  Log in
                </Button>
              </Link>
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Start Free Trial
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Financial Automation
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-8 tracking-tight">
              Bank Reconciliation
              <span className="block bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                That Actually Works
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Automate your bank reconciliation with AI-powered matching. 
              Reconcile months of transactions in minutes, not hours. 
              Seamlessly integrated with QuickBooks Online.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Link href="/auth/login">
                <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-4 text-lg rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200 font-medium">
                  <Play className="mr-2 w-5 h-5" />
                  Log In
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-neutral-200">
              <p className="text-neutral-500 text-sm font-medium mb-6">TRUSTED BY LEADING COMPANIES</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-medium text-neutral-400">TechFlow Solutions</div>
                <div className="text-lg font-medium text-neutral-400">Rodriguez & Associates</div>
                <div className="text-lg font-medium text-neutral-400">GreenLeaf Retail</div>
                <div className="text-lg font-medium text-neutral-400">InnovateCorp</div>
                <div className="text-lg font-medium text-neutral-400">Peak Financial</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Everything You Need to
              <span className="block bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                Automate Reconciliation
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Powerful features designed for modern businesses that need accuracy, speed, and reliability in their financial operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-neutral-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Two Powerful Tools in One Platform
            </h2>
            <p className="text-xl text-neutral-600 max-w-4xl mx-auto">
              ReconcilePro combines AI-powered bank reconciliation with automated invoice collections. 
              See how both tools work together to automate your entire financial workflow.
            </p>
          </motion.div>

          {/* Tool 1: Bank Reconciliation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                🏦 AI-Powered Bank Reconciliation
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Automatically match bank transactions with QuickBooks data using advanced machine learning.
              </p>
            </div>

            {/* How It Works Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">Connect & Import</h4>
                <p className="text-neutral-600 text-sm">
                  Connect QuickBooks Online and import bank statements. We automatically sync all your financial data.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">AI Matching</h4>
                <p className="text-neutral-600 text-sm">
                  Our AI analyzes transaction patterns and automatically matches bank transactions with QuickBooks records.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">Review & Approve</h4>
                <p className="text-neutral-600 text-sm">
                  Review AI suggestions, approve matches, and generate professional reconciliation reports in minutes.
                </p>
              </div>
            </div>

            {/* Reconciliation Interface Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-lg max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900">Bank Transactions (Unmatched)</h4>
                  <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <span className="text-sm text-neutral-700">$1,250.00 - Office Supplies</span>
                      <span className="text-xs text-neutral-500">Mar 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <span className="text-sm text-neutral-700">$89.99 - Software Subscription</span>
                      <span className="text-xs text-neutral-500">Mar 14, 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <span className="text-sm text-neutral-700">$2,100.00 - Client Payment</span>
                      <span className="text-xs text-neutral-500">Mar 13, 2024</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900">AI Matches Found</h4>
                  <div className="bg-green-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-200">
                      <span className="text-sm text-green-800">✓ $1,250.00 - Office Supplies</span>
                      <span className="text-xs text-green-600">Matched with Invoice #1001</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-200">
                      <span className="text-sm text-green-800">✓ $89.99 - Software Subscription</span>
                      <span className="text-xs text-green-600">Matched with Recurring Expense</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Reconciliation Progress</span>
                  <span className="text-sm text-blue-600">85% Complete</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">3,891 of 4,580 transactions reconciled</p>
              </div>
            </div>
          </motion.div>

          {/* Tool 2: Invoice Collections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                💰 Automated Invoice Collections
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Automatically send professional payment reminders and get paid 40% faster without awkward conversations.
              </p>
            </div>

            {/* How Invoice Collections Work */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">Import Invoices</h4>
                <p className="text-neutral-600 text-sm">
                  Import outstanding invoices from QuickBooks or upload CSV files. We automatically detect payment status.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">2</span>
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">Smart Reminders</h4>
                <p className="text-neutral-600 text-sm">
                  Set up automated reminder schedules with professional templates. Escalate gently if needed.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">3</span>
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">Track & Collect</h4>
                <p className="text-neutral-600 text-sm">
                  Monitor payment status, track responses, and automatically update QuickBooks when payments arrive.
                </p>
              </div>
            </div>

            {/* Invoice Collections Interface Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-lg max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900">Outstanding Invoices</h4>
                  <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <div>
                        <span className="text-sm font-medium text-neutral-700">Invoice #1001</span>
                        <p className="text-xs text-neutral-500">TechFlow Solutions - $1,250.00</p>
                      </div>
                      <span className="text-xs text-red-600 font-medium">Overdue 15 days</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <div>
                        <span className="text-sm font-medium text-neutral-700">Invoice #1002</span>
                        <p className="text-xs text-neutral-500">GreenLeaf Retail - $2,100.00</p>
                      </div>
                      <span className="text-xs text-yellow-600 font-medium">Due in 3 days</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900">Collection Status</h4>
                  <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200">
                      <span className="text-sm text-orange-800">📧 Reminder sent</span>
                      <span className="text-xs text-orange-600">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200">
                      <span className="text-sm text-orange-800">📞 Follow-up call</span>
                      <span className="text-xs text-orange-600">Scheduled for tomorrow</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-900">Collection Progress</span>
                  <span className="text-sm text-emerald-600">$3,350.00 collected this month</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-xs text-emerald-600 mt-1">70% of overdue invoices have payment plans</p>
              </div>
            </div>
          </motion.div>

          {/* How Both Tools Work Together */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                🔄 Complete Financial Workflow Automation
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Both tools work together to create a seamless financial automation system.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-2xl p-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-blue-900 mb-4">🏦 Bank Reconciliation</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Import bank statements automatically</li>
                    <li>• AI matches transactions with QuickBooks</li>
                    <li>• Generate reconciliation reports</li>
                    <li>• Export to PDF for compliance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-900 mb-4">💰 Invoice Collections</h4>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>• Track outstanding invoices</li>
                    <li>• Automated payment reminders</li>
                    <li>• Payment status monitoring</li>
                    <li>• QuickBooks integration</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                <h5 className="font-semibold text-neutral-900 mb-2">🔄 How They Connect:</h5>
                <p className="text-sm text-neutral-700">
                  When invoice collections bring in payments, they automatically appear in your bank feed. 
                  Our AI then matches these payments with the corresponding invoices, creating a perfect 
                  reconciliation loop. No more manual work - everything flows automatically!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Demo Video CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                See Both Tools in Action
              </h3>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                Watch the complete demo showing how bank reconciliation and invoice collections work together 
                to automate your entire financial workflow. See real examples of AI matching, automated 
                reminders, and seamless QuickBooks integration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login">
                  <Button className="bg-white text-neutral-900 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg font-medium transition-all duration-200">
                    <Play className="mr-2 w-5 h-5" />
                    Log In to Demo
                  </Button>
                </Link>
                <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 text-lg rounded-lg font-medium transition-all duration-200">
                    Start Free Trial
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Join thousands of businesses that have transformed their reconciliation process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-sm bg-white rounded-xl">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-700 mb-8 leading-relaxed text-sm">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      <p className="text-sm text-neutral-500">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core features and 14-day free trial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full border ${
                  plan.popular 
                    ? 'border-neutral-900 shadow-lg' 
                    : 'border-neutral-200 shadow-sm'
                } transition-all duration-300 bg-white rounded-xl`}>
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-semibold text-neutral-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                      <span className="text-neutral-600">{plan.period}</span>
                    </div>
                    <p className="text-neutral-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-neutral-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={plan.stripeLink} target="_blank" rel="noopener noreferrer">
                      <Button 
                        className={`w-full py-3 rounded-lg font-medium ${
                          plan.popular
                            ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                        }`}
                      >
                        {plan.popular ? 'Start Free Trial' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-neutral-900 to-neutral-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight">
              Ready to Transform Your Reconciliation?
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-12">
              Join thousands of businesses saving hours every month on bank reconciliation. 
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-neutral-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg font-medium transition-all duration-200">
                  Start Free Trial
                </Button>
              </a>
              <Link href="/auth/login">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-4 text-lg rounded-lg font-medium transition-all duration-200">
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">QB</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-neutral-900">ReconcilePro</span>
              </div>
              <p className="text-neutral-600 mb-4 text-sm leading-relaxed">
                The most powerful bank reconciliation tool for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Product</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="#features" className="hover:text-neutral-900 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-neutral-900 transition-colors">Demo</a></li>
                <li><a href="/auth/login" className="hover:text-neutral-900 transition-colors">Log In</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Support</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="mailto:alex@usealgomind.com" className="hover:text-neutral-900 transition-colors">Contact Support</a></li>
                <li><a href="/auth/login" className="hover:text-neutral-900 transition-colors">Help Center</a></li>
                <li><a href="/auth/login" className="hover:text-neutral-900 transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Company</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="mailto:alex@usealgomind.com" className="hover:text-neutral-900 transition-colors">Contact Us</a></li>
                <li><a href="/auth/login" className="hover:text-neutral-900 transition-colors">About</a></li>
                <li><a href="/auth/login" className="hover:text-neutral-900 transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 text-sm">
              © 2024 ReconcilePro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/auth/login" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">Privacy Policy</a>
              <a href="/auth/login" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 