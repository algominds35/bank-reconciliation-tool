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
    name: "Alex Rodriguez",
    role: "Senior Bookkeeper",
    company: "Rodriguez Financial Services",
    content: "I handle 75+ clients and this tool has saved me 20+ hours weekly. The AI matching is incredibly accurate - I've reduced reconciliation errors by 95%.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Sarah Chen",
    role: "CFO",
    company: "TechFlow Solutions",
    content: "We process 5,000+ transactions monthly. This tool reconciled 3 months of backlog in 2 hours. The QuickBooks integration is seamless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Michael Thompson",
    role: "Managing Partner",
    company: "Thompson & Associates CPA",
    content: "Our firm serves 120+ small businesses. This tool has become our secret weapon - clients love the accuracy and speed. ROI in the first month.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Jennifer Walsh",
    role: "Finance Director",
    company: "GreenLeaf Retail",
    content: "We have 8 bank accounts and 15,000+ monthly transactions. This tool handles everything automatically. The invoice collections feature is a game-changer.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "David Kim",
    role: "Controller",
    company: "Peak Financial Group",
    content: "Multi-entity accounting was a nightmare until this tool. We now reconcile 25+ entities in hours instead of weeks. The AI is incredibly smart.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Lisa Martinez",
    role: "Senior Accountant",
    company: "Martinez & Co.",
    content: "I've been in accounting for 15 years. This is the first reconciliation tool that actually works as advertised. The QuickBooks sync is flawless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
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

            {/* Switch from QB Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-green-50 border border-green-200 rounded-full shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-700">1,200+ switched from QuickBooks to this</span>
                </div>
              </div>
            </div>

            {/* Real Testimonials with Faces */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                    alt="Alex Rodriguez"
                    className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
                    alt="Sarah Chen"
                    className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                    alt="Michael Thompson"
                    className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" 
                    alt="Jennifer Walsh"
                    className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" 
                    alt="David Kim"
                    className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <span className="text-sm text-neutral-600">1,200+ entrepreneurs finding proven solutions</span>
              </div>
              
              {/* Quick Testimonial Preview */}
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-lg text-neutral-700 italic mb-4">
                  "This tool saved me 20+ hours weekly. The AI matching is incredibly accurate - I've reduced reconciliation errors by 95%."
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" 
                    alt="Alex Rodriguez"
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900">Alex Rodriguez</p>
                    <p className="text-xs text-neutral-500">Senior Bookkeeper, Rodriguez Financial Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-neutral-200">
              <p className="text-neutral-500 text-sm font-medium mb-6">TRUSTED BY LEADING COMPANIES</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-medium text-neutral-400">TechFlow Solutions</div>
                <div className="text-lg font-medium text-neutral-400">Rodriguez Financial Services</div>
                <div className="text-lg font-medium text-neutral-400">Thompson & Associates CPA</div>
                <div className="text-lg font-medium text-neutral-400">GreenLeaf Retail</div>
                <div className="text-lg font-medium text-neutral-400">Peak Financial Group</div>
              </div>
              
              {/* Trusted Badge */}
              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center px-6 py-3 bg-white border border-neutral-200 rounded-full shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">Trusted by 1,200+ business owners, bookkeepers, accountants & QuickBooks users</span>
                  </div>
                </div>
              </div>
              
              {/* Trust Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">1,200+</div>
                  <div className="text-sm text-neutral-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">50,000+</div>
                  <div className="text-sm text-neutral-600">Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">98.2%</div>
                  <div className="text-sm text-neutral-600">AI Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">15,000+</div>
                  <div className="text-sm text-neutral-600">Hours Saved</div>
                </div>
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

      {/* Professional Demo Section */}
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
              Watch how our AI-powered tool transforms your reconciliation process step by step.
            </p>
          </motion.div>

          {/* Demo Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side: How It Works */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">How It Works</h3>
                <p className="text-neutral-600 mb-6">
                  Our AI agent actively processes your bank transactions and QuickBooks data to uncover reconciliation opportunities and automatically match transactions.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <span className="text-neutral-700">Upload CSV files from your bank</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <span className="text-neutral-700">Connect QuickBooks accounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <span className="text-neutral-700">AI automatically matches transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">4</span>
                    </div>
                    <span className="text-neutral-700">Export reconciliation reports</span>
                  </div>
                </div>
              </div>

              {/* Create New Reconciliation Form */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Create New Reconciliation</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Reconciliation Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter reconciliation name"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Bank Account</label>
                    <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select bank account</option>
                      <option>Chase Business Checking</option>
                      <option>Wells Fargo Savings</option>
                      <option>Amex Business Gold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Date Range</label>
                    <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select date range</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last 6 months</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">AI Matching Rules</label>
                    <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select matching rules</option>
                      <option>Strict (99% confidence)</option>
                      <option>Standard (95% confidence)</option>
                      <option>Loose (90% confidence)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Keywords</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="Type keyword and press Enter"
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Press Enter to add • 0/50 keywords added</p>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Start Reconciliation
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Side: See Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">See Results</h3>
                <p className="text-neutral-600 mb-6">
                  All insights are organized and stored in a structured database for easy access and analysis.
                </p>
              </div>

              {/* Results Panel */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-neutral-900">Bank Reconciliation Results</h4>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Status</button>
                    <button className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Refresh</button>
                    <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors">Execute Pipeline</button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-neutral-500">Account: Chase Business Checking • Duration: Last 30 days</span>
                </div>

                {/* Results Table */}
                <div className="overflow-hidden border border-neutral-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Confidence ↑↓</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status ↑↓</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Client Payment - ABC Corp automatically matched with Invoice #1001
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">99%</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">✓ Matched</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">$2,500.00</td>
                        <td className="px-4 py-3 text-sm text-neutral-500">1/30/2024</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Office Supplies - Staples ready for categorization
                        </td>
                        <td className="px-4 py-3 text-sm text-yellow-600 font-medium">85%</td>
                        <td className="px-4 py-3 text-sm text-yellow-600 font-medium">📋 Review</td>
                        <td className="px-4 py-3 text-sm font-medium text-red-600">-$89.99</td>
                        <td className="px-4 py-3 text-sm text-neutral-500">1/30/2024</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Software Subscription - Adobe auto-matched with expense
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">97%</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">✓ Matched</td>
                        <td className="px-4 py-3 text-sm font-medium text-red-600">-$52.99</td>
                        <td className="px-4 py-3 text-sm text-neutral-500">1/30/2024</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Client Payment - XYZ Inc matched with Invoice #1002
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">98%</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">✓ Matched</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">$1,800.00</td>
                        <td className="px-4 py-3 text-sm text-neutral-500">1/30/2024</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Gas station transaction requires manual review
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600 font-medium">65%</td>
                        <td className="px-4 py-3 text-sm text-red-600 font-medium">⚠ Manual</td>
                        <td className="px-4 py-3 text-sm font-medium text-red-600">-$45.00</td>
                        <td className="px-4 py-3 text-sm text-neutral-500">1/29/2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4</div>
                    <div className="text-sm text-neutral-600">Auto-Matched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">1</div>
                    <div className="text-sm text-neutral-600">Ready to Review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-neutral-600">Manual Review</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Ready to See These Results for Your Business?
            </h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join 1,200+ businesses that have already automated their reconciliation process and saved hundreds of hours monthly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg font-medium">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#demo">
                <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-4 text-lg rounded-lg hover:border-neutral-400 hover:bg-neutral-50 font-medium">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Full Demo
                </Button>
              </a>
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
                <Card className="h-full border-0 shadow-sm bg-white rounded-xl hover:shadow-md transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-700 mb-8 leading-relaxed text-sm italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-neutral-100"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                        <p className="text-sm text-neutral-600">{testimonial.role}</p>
                        <p className="text-sm text-neutral-500">{testimonial.company}</p>
                      </div>
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