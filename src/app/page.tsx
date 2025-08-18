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
  ArrowUpRight,
  Upload,
  Download,
  FileText,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Plus,
  Building2,
  CreditCard,
  Minus,
  X
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
              <a href="#demo">
                <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium">
                  See How It Works
                </Button>
              </a>
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
              <a href="#demo">
                <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-4 text-lg rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200 font-medium">
                  <Play className="mr-2 w-5 h-5" />
                  See How It Works
                </Button>
              </a>
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
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              See Your Financial Automation in Action
            </h2>
            <p className="text-xl text-neutral-600 max-w-4xl mx-auto">
              Real screenshots from ReconcilePro showing exactly how AI-powered reconciliation and invoice collections work.
            </p>
          </motion.div>

          {/* Main Dashboard Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                🏦 Bank Reconciliation Dashboard
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Your complete financial control center with real-time QuickBooks integration and transaction management.
              </p>
            </div>

            {/* Dashboard Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
                <div className="flex items-center space-x-6">
                  <h4 className="text-2xl font-bold text-neutral-900">Bank Reconciliation</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">alex@usealgomind.com</span>
                    <span className="text-neutral-400">•</span>
                    <select className="text-sm text-neutral-700 bg-transparent border-none">
                      <option>Client: All Clients</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900">
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900">
                    <Shield className="w-4 h-4" />
                    <span>Support</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900">
                    <span className="w-4 h-4 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center">QB</span>
                    <span>QuickBooks</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900">
                    <BarChart3 className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">Sign Out</button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-6 gap-4 mb-8">
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-neutral-900">36</div>
                  <div className="text-sm text-neutral-600 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Total
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">29</div>
                  <div className="text-sm text-green-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Reconciled
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">7</div>
                  <div className="text-sm text-red-600 flex items-center justify-center">
                    <span className="w-4 h-4 mr-1">⚠</span>
                    Unreconciled
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">26</div>
                  <div className="text-sm text-blue-600 flex items-center justify-center">
                    <span className="w-4 h-4 mr-1">$</span>
                    Bank
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">10</div>
                  <div className="text-sm text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    Bookkeeping
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-neutral-600 mb-1">QuickBooks</div>
                  <div className="flex items-center justify-center">
                    <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center">QB</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Connected</div>
                </div>
              </div>

              {/* QuickBooks Integration Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="w-12 h-12 bg-blue-600 text-white text-lg font-bold rounded-lg flex items-center justify-center">QB</span>
                    <div>
                      <h5 className="text-lg font-semibold text-blue-900">QuickBooks Integration</h5>
                      <p className="text-blue-700">Connect your QuickBooks account to automatically sync transactions and eliminate manual CSV uploads.</p>
                      <div className="flex items-center space-x-6 mt-2">
                        <span className="text-sm text-blue-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Auto-sync bank accounts & transactions
                        </span>
                        <span className="text-sm text-blue-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Real-time financial data
                        </span>
                        <span className="text-sm text-blue-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          No more manual CSV uploads
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Connect QuickBooks
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">All Transactions</button>
                <button className="px-4 py-2 text-neutral-600 hover:text-neutral-900">Smart Matching</button>
                <button className="px-4 py-2 text-neutral-600 hover:text-neutral-900">Invoice Collections</button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mb-6">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Bank CSV
                </Button>
                <Button variant="outline" className="border-neutral-200">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Bookkeeping CSV
                </Button>
                <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                  <option>All Transactions</option>
                </select>
                <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                  <option>All Types</option>
                </select>
                <div className="ml-auto flex space-x-2">
                  <Button variant="outline" className="border-neutral-200 text-neutral-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reconcile Selected (0)
                  </Button>
                  <Button variant="outline" className="border-neutral-200 text-neutral-600">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="border-neutral-200 text-neutral-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-neutral-300" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">$ Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-neutral-300" checked />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Late Fee Charge</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">-$25.00</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Bank</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">Fees</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Reconciled</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-red-500 hover:text-red-700">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-neutral-300" checked />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Client Refund</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">$3200.00</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Bank</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">Refunds</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Reconciled</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-red-500 hover:text-red-700">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-neutral-300" />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/24/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Phone Bill</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">-$150.00</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Bank</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">Utilities</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Unreconciled</span>
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-neutral-300" />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/24/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Gas Station</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">-$45.00</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Bank</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">Fuel</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Unreconciled</span>
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* AI Smart Matching Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                🤖 AI-Powered Smart Matching
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Our AI automatically finds and suggests transaction matches with confidence scoring and intelligent criteria.
              </p>
            </div>

            {/* Smart Matching Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              <div className="mb-6">
                <p className="text-neutral-600 mb-4">
                  Automatically find and suggest transaction matches using smart algorithms. Review and accept/reject each suggestion individually.
                </p>
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-neutral-900">Found 13 potential matches</h4>
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept All
                  </Button>
                </div>
              </div>

              {/* Match Cards */}
              <div className="space-y-4">
                {/* Match Card 1 */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">120% confidence</span>
                    <p className="text-sm text-neutral-600">Exact amount match, Date within 3 days, Description similarity, Exact description match, Category match</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="font-semibold text-neutral-800 mb-2 text-sm">Bank Transaction</p>
                      <p className="text-sm text-neutral-700 mb-1">Insurance Expense</p>
                      <p className="text-base font-medium text-red-600">-$150.00</p>
                      <p className="text-xs text-neutral-500">1/24/2024</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="font-semibold text-neutral-800 mb-2 text-sm">Bookkeeping Transaction</p>
                      <p className="text-sm text-neutral-700 mb-1">Insurance Expense</p>
                      <p className="text-base font-medium text-red-600">-$150.00</p>
                      <p className="text-xs text-neutral-500">1/24/2024</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-600">
                      <span className="text-lg leading-none mr-1">&times;</span>
                      Reject
                    </Button>
                  </div>
                </div>

                {/* Match Card 2 */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">120% confidence</span>
                    <p className="text-sm text-neutral-600">Exact amount match, Date within 3 days, Description similarity, Exact description match, Category match</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="font-semibold text-neutral-800 mb-2 text-sm">Bank Transaction</p>
                      <p className="text-sm text-neutral-700 mb-1">Service Revenue</p>
                      <p className="text-base font-medium text-green-600">$1800.00</p>
                      <p className="text-xs text-neutral-500">1/23/2024</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="font-semibold text-neutral-800 mb-2 text-sm">Bookkeeping Transaction</p>
                      <p className="text-sm text-neutral-700 mb-1">Service Revenue</p>
                      <p className="text-base font-medium text-green-600">$1800.00</p>
                      <p className="text-xs text-neutral-500">1/23/2024</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-600">
                      <span className="text-lg leading-none mr-1">&times;</span>
                      Reject
                    </Button>
                  </div>
                </div>

                {/* Match Card 3 */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">120% confidence</span>
                    <p className="text-sm text-neutral-600">Exact amount match, Date within 3 days, Description similarity, Exact description match, Category match</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="font-semibold text-neutral-800 mb-2 text-sm">Bank Transaction</p>
                      <p className="text-sm text-neutral-700 mb-1">Equipment Expense</p>
                      <p className="text-base font-medium text-red-600">-$500.00</p>
                      <p className="text-xs text-neutral-500">1/22/2024</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="font-semibold text-neutral-800 mb-2 text-sm">Bookkeeping Transaction</p>
                      <p className="text-sm text-neutral-700 mb-1">Equipment Expense</p>
                      <p className="text-base font-medium text-red-600">-$500.00</p>
                      <p className="text-xs text-neutral-500">1/22/2024</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-600">
                      <span className="text-lg leading-none mr-1">&times;</span>
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button variant="ghost" className="text-blue-600">View All Matches (10 more)</Button>
                <Button variant="outline" className="text-neutral-600 border-neutral-200 hover:bg-neutral-100">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* QuickBooks Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                🔗 QuickBooks Integration
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Connect your QuickBooks account to automatically sync transactions and integrate them into your reconciliation workflow.
              </p>
            </div>

            {/* QuickBooks Connected Dashboard Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              {/* Header with Connection Status */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 text-white text-lg font-bold rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-neutral-900">QuickBooks Connected</h4>
                    <p className="text-green-600 font-medium">✓ Successfully Connected!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-neutral-500">Realm ID: 9341455152432773</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Sync Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Sync completed successfully!</p>
                      <p className="text-sm text-blue-700">Last sync: 8/17/2025 • Status: completed</p>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Full Historical Sync
                  </Button>
                </div>
              </div>

              {/* QuickBooks Dashboard Metrics */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-neutral-50 rounded-xl p-4 text-center border">
                  <div className="text-2xl font-bold text-neutral-900">$47,892.45</div>
                  <div className="text-sm text-neutral-600">Total Balance</div>
                  <div className="text-xs text-green-600 mt-1">+$2,450.00 this month</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 text-center border">
                  <div className="text-2xl font-bold text-neutral-900">8</div>
                  <div className="text-sm text-neutral-600">Connected Accounts</div>
                  <div className="text-xs text-blue-600 mt-1">3 bank, 5 credit</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 text-center border">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-neutral-600">Reconciled Transactions</div>
                  <div className="text-xs text-green-600 mt-1">98% accuracy</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 text-center border">
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <div className="text-sm text-neutral-600">Pending Reconciliation</div>
                  <div className="text-xs text-orange-600 mt-1">Requires review</div>
                </div>
              </div>

              {/* Connected Bank Accounts */}
              <div className="bg-neutral-50 rounded-xl p-6 mb-8">
                <h5 className="text-lg font-semibold text-neutral-900 mb-4">Connected Bank Accounts</h5>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Chase Business Checking</p>
                          <p className="text-sm text-neutral-500">****1234</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">$23,456.78</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Last sync: 2 min ago</span>
                      <span className="text-green-600 font-medium">✓ Connected</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Chase Business Credit</p>
                          <p className="text-sm text-neutral-500">****5678</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-red-600">-$8,234.56</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Last sync: 5 min ago</span>
                      <span className="text-green-600 font-medium">✓ Connected</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Wells Fargo Savings</p>
                          <p className="text-sm text-neutral-500">****9012</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">$32,670.23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Last sync: 1 min ago</span>
                      <span className="text-green-600 font-medium">✓ Connected</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Amex Business Gold</p>
                          <p className="text-sm text-neutral-500">****3456</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-red-600">-$12,456.78</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Last sync: 3 min ago</span>
                      <span className="text-green-600 font-medium">✓ Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-neutral-50 rounded-xl p-6 mb-8">
                <h5 className="text-lg font-semibold text-neutral-900 mb-4">Recent Transactions</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Client Payment - ABC Corp</p>
                        <p className="text-sm text-neutral-500">1/30/2024 • Chase Business Checking</p>
                        <p className="text-xs text-green-600">✓ Auto-matched with Invoice #1001</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">$2,500.00</span>
                      <p className="text-sm text-neutral-500">Reconciled</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Minus className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Office Supplies - Staples</p>
                        <p className="text-sm text-neutral-500">1/30/2024 • Chase Business Credit</p>
                        <p className="text-xs text-blue-600">📋 Ready for categorization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-600">-$89.99</span>
                      <p className="text-sm text-neutral-500">Pending</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Software Subscription - Adobe</p>
                        <p className="text-sm text-neutral-500">1/30/2024 • Amex Business Gold</p>
                        <p className="text-xs text-green-600">✓ Auto-matched with Expense</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-600">-$52.99</span>
                      <p className="text-sm text-neutral-500">Reconciled</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Client Payment - XYZ Inc</p>
                        <p className="text-sm text-neutral-500">1/30/2024 • Wells Fargo Savings</p>
                        <p className="text-xs text-green-600">✓ Auto-matched with Invoice #1002</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">$1,800.00</span>
                      <p className="text-sm text-neutral-500">Reconciled</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Matching Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-blue-900">AI Auto-Matching Summary</h5>
                  <span className="text-sm text-blue-600 font-medium">Updated 2 minutes ago</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-blue-600">Total Transactions</div>
                    <div className="text-xs text-blue-500">From all accounts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1,224</div>
                    <div className="text-sm text-green-600">Auto-Matched</div>
                    <div className="text-xs text-green-500">98.2% accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">15</div>
                    <div className="text-sm text-yellow-600">Ready to Review</div>
                    <div className="text-xs text-yellow-500">AI suggestions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <div className="text-sm text-orange-600">Manual Review</div>
                    <div className="text-xs text-orange-500">Complex cases</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  <Download className="w-4 h-4 mr-2" />
                  Export Reconciliation Report
                </Button>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3">
                  <X className="w-4 h-4 mr-2" />
                  Disconnect QuickBooks
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Invoice Collections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                💰 Invoice Collections Dashboard
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Track outstanding invoices, send automated reminders, and get paid faster with smart collections management.
              </p>
            </div>

            {/* Invoice Collections Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-neutral-900">Invoice Collections</h4>
                <div className="flex space-x-3">
                  <Button variant="outline" className="border-neutral-200">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Invoices
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Invoice
                  </Button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">$12,450</div>
                  <div className="text-sm text-red-600">Overdue</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">$8,200</div>
                  <div className="text-sm text-yellow-600">Due Soon</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">$45,800</div>
                  <div className="text-sm text-green-600">Collected</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-blue-600">Active Invoices</div>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Reminder</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">#1001</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">TechFlow Solutions</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">$1,250.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/15/2024</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">2 hours ago</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          Remind
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">#1002</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">GreenLeaf Retail</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">$2,100.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/22/2024</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Due Soon</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">1 day ago</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          Remind
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">#1003</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Peak Financial</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">$850.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/25/2024</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">-</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="border-neutral-200 text-neutral-600" disabled>
                          Paid
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Transform Your Financial Operations?
              </h3>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                See how ReconcilePro automates your entire financial workflow with AI-powered reconciliation and smart invoice collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-neutral-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg font-medium transition-all duration-200">
                    Start Free Trial
                  </Button>
                </a>
                <a href="#demo">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-4 text-lg rounded-lg font-medium transition-all duration-200">
                    See How It Works
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
              <a href="#demo">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-4 text-lg rounded-lg font-medium transition-all duration-200">
                  See How It Works
                </Button>
              </a>
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
                <li><a href="#demo" className="hover:text-neutral-900 transition-colors">See How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Support</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="mailto:alex@usealgomind.com" className="hover:text-neutral-900 transition-colors">Contact Support</a></li>
                <li><a href="#demo" className="hover:text-neutral-900 transition-colors">Help Center</a></li>
                <li><a href="#demo" className="hover:text-neutral-900 transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Company</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="mailto:alex@usealgomind.com" className="hover:text-neutral-900 transition-colors">Contact Us</a></li>
                <li><a href="#demo" className="hover:text-neutral-900 transition-colors">About</a></li>
                <li><a href="#demo" className="hover:text-neutral-900 transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 text-sm">
              © 2024 ReconcilePro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#demo" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">Privacy Policy</a>
              <a href="#demo" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 