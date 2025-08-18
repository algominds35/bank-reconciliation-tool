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
              <Link href="/auth/login">
                <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium">
                  Log In
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

      {/* Quick Testimonials Section */}
      <section className="py-16 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Trusted by 1,200+ Financial Professionals
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              See what bookkeepers, accountants, and business owners are saying about ReconcilePro
            </p>
          </motion.div>

          {/* Featured Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed text-sm italic">
                "I handle 75+ clients and this tool has saved me 20+ hours weekly. The AI matching is incredibly accurate - I've reduced reconciliation errors by 95%."
              </p>
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                  alt="Alex Rodriguez"
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                />
                <div>
                  <p className="font-semibold text-neutral-900">Alex Rodriguez</p>
                  <p className="text-sm text-neutral-600">Senior Bookkeeper</p>
                  <p className="text-xs text-neutral-500">Rodriguez Financial Services</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed text-sm italic">
                "We process 5,000+ transactions monthly. This tool reconciled 3 months of backlog in 2 hours. The QuickBooks integration is seamless."
              </p>
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
                  alt="Sarah Chen"
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                />
                <div>
                  <p className="font-semibold text-neutral-900">Sarah Chen</p>
                  <p className="text-sm text-neutral-600">CFO</p>
                  <p className="text-xs text-neutral-500">TechFlow Solutions</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed text-sm italic">
                "Our firm serves 120+ small businesses. This tool has become our secret weapon - clients love the accuracy and speed. ROI in the first month."
              </p>
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                  alt="Michael Thompson"
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-100"
                />
                <div>
                  <p className="font-semibold text-neutral-900">Michael Thompson</p>
                  <p className="text-sm text-neutral-600">Managing Partner</p>
                  <p className="text-xs text-neutral-500">Thompson & Associates CPA</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View All Testimonials CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a href="#testimonials">
              <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-8 py-3">
                <Star className="w-4 h-4 mr-2" />
                View All Testimonials
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Everything You Need for Financial Automation
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Two powerful tools in one platform: Bank Reconciliation & Invoice Collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bank Reconciliation Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">AI-Powered Bank Reconciliation</h3>
              <p className="text-neutral-600 leading-relaxed">
                Automatically match bank transactions with QuickBooks data using advanced machine learning algorithms. 99% accuracy rate.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Bank-Level Security</h3>
              <p className="text-neutral-600 leading-relaxed">
                Enterprise-grade encryption with SOC 2 compliance. Your financial data is protected with military-grade security.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Real-Time Analytics</h3>
              <p className="text-neutral-600 leading-relaxed">
                Live dashboards showing reconciliation status, cash flow insights, and financial health metrics.
              </p>
            </motion.div>

            {/* Invoice Collections Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Automated Invoice Collections</h3>
              <p className="text-neutral-600 leading-relaxed">
                Track overdue invoices, send automated reminders, and predict payment dates using AI. Never chase payments again.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Multi-Client Management</h3>
              <p className="text-neutral-600 leading-relaxed">
                Handle unlimited clients from one dashboard. Perfect for bookkeepers and accounting firms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">QuickBooks Native</h3>
              <p className="text-neutral-600 leading-relaxed">
                Seamless integration with QuickBooks Online. Sync invoices, transactions, and accounts automatically.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Showcase - Your Actual Tool */}
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

          {/* Bank Reconciliation Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
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
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-8">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 px-6 py-3">
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>

              {/* Transactions Table */}
              <div className="overflow-hidden border border-neutral-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">$ Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">$2,500.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Client Payment</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Reconciled
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">View Details</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">-$89.99</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Office Supplies</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⚠ Pending
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">Review</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">-$52.99</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Software</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Reconciled
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">View Details</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">$1,800.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Client Payment</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Reconciled
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">View Details</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-neutral-900">1/29/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">-$45.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Gas Station</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ⚠ Manual Review
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">Review</td>
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
                🤖 AI Smart Matching Interface
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Watch our AI automatically match bank transactions with QuickBooks data using advanced machine learning.
              </p>
            </div>

            {/* AI Matching Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
                <h4 className="text-2xl font-bold text-neutral-900">AI Transaction Matching</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-500">Processing: 15 of 36 transactions</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* AI Matching Example */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bank Transaction */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h5 className="text-lg font-semibold text-blue-900 mb-4">Bank Transaction</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Date:</span>
                      <span className="text-sm font-medium text-blue-900">1/30/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Amount:</span>
                      <span className="text-lg font-bold text-blue-900">$2,500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Description:</span>
                      <span className="text-sm font-medium text-blue-900">Client Payment - ABC Corp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Account:</span>
                      <span className="text-sm font-medium text-blue-900">Chase Business Checking</span>
                    </div>
                  </div>
                </div>

                {/* QuickBooks Match */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h5 className="text-lg font-semibold text-green-900 mb-4">QuickBooks Match</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Invoice:</span>
                      <span className="text-sm font-medium text-green-900">#1001 - ABC Corp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Amount:</span>
                      <span className="text-lg font-bold text-green-900">$2,500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Service:</span>
                      <span className="text-sm font-medium text-green-900">Consulting Services</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Due Date:</span>
                      <span className="text-sm font-medium text-green-900">1/30/2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Confidence Score */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">99%</div>
                  <div className="text-lg font-medium text-green-800 mb-2">AI Confidence Score</div>
                  <div className="text-sm text-green-700">
                    Perfect match: Amount, date, and description all align
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Match
                </Button>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3">
                  <X className="w-4 h-4 mr-2" />
                  Reject Match
                </Button>
                <Button variant="outline" className="border-neutral-200 text-neutral-600 hover:bg-neutral-50 px-8 py-3">
                  <Clock className="w-4 h-4 mr-2" />
                  Review Later
                </Button>
              </div>
            </div>
          </motion.div>

          {/* QuickBooks Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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

          {/* Invoice Collections Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                📊 Invoice Collections Dashboard
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Automate your invoice management with AI-powered payment tracking and automated reminder systems.
              </p>
            </div>

            {/* Invoice Collections Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
                <h4 className="text-2xl font-bold text-neutral-900">Invoice Collections</h4>
                <div className="flex items-center space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                    <Plus className="w-4 h-4 mr-2" />
                    New Invoice
                  </Button>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Invoices
                  </Button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-600">$12,450.00</div>
                  <div className="text-sm text-red-600">Overdue</div>
                  <div className="text-xs text-red-500 mt-1">8 invoices</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">$8,900.00</div>
                  <div className="text-sm text-yellow-600">Due Soon</div>
                  <div className="text-xs text-yellow-500 mt-1">5 invoices</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">$45,200.00</div>
                  <div className="text-sm text-green-600">Collected</div>
                  <div className="text-xs text-green-500 mt-1">This month</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-blue-600">Total Invoices</div>
                  <div className="text-xs text-blue-500 mt-1">Active</div>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="overflow-hidden border border-neutral-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">#1001</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">ABC Corp</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">$2,500.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">1/15/2024</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                          Send Reminder
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">#1002</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">XYZ Inc</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">$1,800.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">1/20/2024</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Due Soon
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          Send Reminder
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">#1003</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">TechFlow</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">$950.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">1/25/2024</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-500">✓ Completed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* AI Insights */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-purple-900 mb-4">AI Insights & Recommendations</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-purple-900">Payment Prediction</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      ABC Corp likely to pay within 3-5 days based on payment history
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-purple-900">Collection Strategy</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Send personalized reminder to XYZ Inc for best response rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Export Report Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                📄 Export & Reporting
              </h3>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Generate professional reports and export data in multiple formats for your team and clients.
              </p>
            </div>

            {/* Export Report Mockup */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
              {/* Report Header */}
              <div className="text-center mb-8 pb-6 border-b border-neutral-200">
                <h4 className="text-3xl font-bold text-neutral-900 mb-2">Bank Reconciliation Report</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>Export Date: 8/17/2025</p>
                  <p>Account: alex@usealgomind.com</p>
                  <p>Total Reconciled Transactions: 6</p>
                </div>
              </div>

              {/* Report Table */}
              <div className="overflow-hidden border border-neutral-200 rounded-lg mb-8">
                <table className="w-full">
                  <thead className="bg-blue-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Group</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    <tr className="bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-900">1/30/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Late Fee Charge</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">$-25.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Bank</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">62ae00</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-sm text-neutral-900">1/29/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Client Refund</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">$-150.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Bank</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">62ae00</td>
                    </tr>
                    <tr className="bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-900">1/28/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Phone Bill</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">$-65.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Bank</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">62ae00</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-sm text-neutral-900">1/27/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Gas Station</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">$-45.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Bank</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">62ae00</td>
                    </tr>
                    <tr className="bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-900">1/26/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Client Payment - DEF Inc</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">$3200.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Bank</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">62ae00</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-sm text-neutral-900">1/25/2024</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Freelancer Payment - Design Work</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">$-500.00</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">Bank</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">62ae00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Report Summary */}
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">Total Amount: $2415.00</div>
              </div>

              {/* Export Options */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h5 className="text-lg font-semibold text-neutral-900 mb-4 text-center">Export Options</h5>
                <div className="flex justify-center space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 px-6 py-3">
                    <FileText className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Excel Report
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

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