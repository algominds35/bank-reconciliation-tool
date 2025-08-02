'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "QuickBooks Bank Feed Issues? Here's the Complete Fix (2024)",
      excerpt: "QuickBooks bank feed issues are the #1 frustration for business owners. Here's the step-by-step fix that actually works.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "quickbooks-bank-feed-issues-fix-2024",
      category: "QuickBooks"
    },
    {
      id: 2,
      title: "QuickBooks Auto Match Wrong? Here's How to Fix It (2024)",
      excerpt: "QuickBooks keeps matching the wrong transactions? You're not alone. Here's the complete solution to fix incorrect matches.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "quickbooks-auto-match-wrong-fix",
      category: "QuickBooks"
    },
    {
      id: 3,
      title: "QuickBooks Duplicate Transactions? Here's the Complete Fix (2024)",
      excerpt: "QuickBooks keeps creating duplicate transactions? This is a common nightmare. Here's the step-by-step fix that actually works.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "quickbooks-duplicate-transactions-fix",
      category: "QuickBooks"
    },
    {
      id: 4,
      title: "How to Reconcile PayPal in QuickBooks: Complete Guide (2024)",
      excerpt: "PayPal reconciliation in QuickBooks is notoriously difficult. Here's the step-by-step process that actually works for e-commerce businesses.",
      date: "2024-01-16",
      readTime: "15 min read",
      author: "Alex",
      slug: "how-to-reconcile-paypal-in-quickbooks",
      category: "E-commerce"
    },
    {
      id: 5,
      title: "Best Reconciliation Software for QuickBooks: 2024 Comparison",
      excerpt: "Tired of QuickBooks reconciliation headaches? Here's the complete comparison of the best reconciliation software for QuickBooks users.",
      date: "2024-01-16",
      readTime: "8 min read",
      author: "Alex",
      slug: "best-reconciliation-software-quickbooks",
      category: "Software"
    },
    {
      id: 6,
      title: "QuickBooks CSV Import Reconciliation: Complete Guide (2024)",
      excerpt: "Bank feed issues? CSV import is often more reliable. Here's the complete guide to importing and reconciling CSV files in QuickBooks.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "quickbooks-csv-import-reconciliation",
      category: "Tutorial"
    },
    {
      id: 7,
      title: "QuickBooks Bank Rules: How to Set Them Up Right",
      excerpt: "Learn how to configure QuickBooks bank rules for automatic transaction categorization and faster reconciliation.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "quickbooks-bank-rules-setup",
      category: "QuickBooks"
    },
    {
      id: 8,
      title: "Restaurant Bank Reconciliation: Special Considerations",
      excerpt: "Restaurant reconciliation is uniquely challenging. Learn how to handle high transaction volumes, multiple payment methods, and cash management.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "restaurant-bank-reconciliation",
      category: "Industry Guide"
    },
    {
      id: 9,
      title: "E-commerce Reconciliation: Handling Multiple Payment Methods",
      excerpt: "E-commerce businesses face unique challenges with multiple payment processors, refunds, and international transactions. Here's how to handle it all.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "ecommerce-reconciliation-multiple-payments",
      category: "E-commerce"
    },
    {
      id: 10,
      title: "QuickBooks Reconciliation Tips: 10 Pro Secrets for 2024",
      excerpt: "Most QuickBooks users waste hours on reconciliation because they don't know these insider secrets. Learn the techniques that professional bookkeepers use.",
      date: "2024-01-16",
      readTime: "15 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-tips-2024",
      category: "QuickBooks"
    },
    {
      id: 11,
      title: "QuickBooks Bank Feed Not Syncing? Complete Troubleshooting Guide (2024)",
      excerpt: "Your QuickBooks bank feed stopped syncing and you don't know why? You're not alone. This is one of the most common QuickBooks issues. Here's the complete fix.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "quickbooks-bank-feed-syncing-issues",
      category: "QuickBooks"
    },
    {
      id: 12,
      title: "QuickBooks Reconciliation Accuracy: Why 95% of Users Make These Critical Mistakes",
      excerpt: "Most QuickBooks users think their reconciliation is accurate, but they're making critical errors that could cost them thousands. Here's what you're probably doing wrong.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-accuracy",
      category: "QuickBooks"
    },
    {
      id: 13,
      title: "Save 10+ Hours Per Week on QuickBooks Reconciliation: The Complete Guide",
      excerpt: "Most bookkeepers spend 10-15 hours per week on reconciliation. That's 40-60 hours per month wasted on a task that could take just 2-3 hours. Here's how to reclaim your time.",
      date: "2024-01-16",
      readTime: "13 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-time-savings",
      category: "Productivity"
    },
    {
      id: 14,
      title: "QuickBooks Reconciliation Best Practices: The 2024 Complete Guide",
      excerpt: "Top bookkeepers and accountants follow these reconciliation best practices to ensure accuracy, efficiency, and compliance. Learn the techniques that separate amateurs from professionals.",
      date: "2024-01-16",
      readTime: "16 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-best-practices-2024",
      category: "Best Practices"
    },
    {
      id: 15,
      title: "QuickBooks Reconciliation Errors: The 2024 Complete Fix Guide",
      excerpt: "QuickBooks reconciliation errors are driving you crazy? You're not alone. Thousands of users face these same errors daily. Here's the complete fix guide that actually works.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-errors-2024",
      category: "QuickBooks"
    },
    {
      id: 16,
      title: "Bank Reconciliation Guide 2024: The Complete Step-by-Step Process",
      excerpt: "Bank reconciliation is trending as more businesses realize its importance. This complete guide will teach you everything you need to know about bank reconciliation in 2024.",
      date: "2024-01-16",
      readTime: "18 min read",
      author: "Alex",
      slug: "bank-reconciliation-guide-2024",
      category: "Tutorial"
    },
    {
      id: 17,
      title: "Bank Reconciliation Software 2024: Top Tools That Actually Work",
      excerpt: "Bank reconciliation software is trending as businesses realize manual reconciliation is costing them thousands. Here are the top tools for 2024 that actually deliver results.",
      date: "2024-01-16",
      readTime: "16 min read",
      author: "Alex",
      slug: "bank-reconciliation-software-2024",
      category: "Software"
    },
    {
      id: 18,
      title: "QuickBooks Reconciliation Software 2024: The Complete Guide (Trending Now)",
      excerpt: "QuickBooks reconciliation software is currently trending on Google as more businesses realize they need better tools than QuickBooks' built-in reconciliation. Here's the complete guide.",
      date: "2024-01-16",
      readTime: "17 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-software-2024",
      category: "Software"
    },
    {
      id: 19,
      title: "Automated Reconciliation: Complete Tutorial",
      excerpt: "Automate your bank reconciliation process and save hours every month. Here's how to set it up properly.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "automated-reconciliation-complete-tutorial",
      category: "Automation"
    },
    {
      id: 20,
      title: "QuickBooks Integration Best Practices",
      excerpt: "Integrating QuickBooks with other systems? Here's how to do it right and avoid common integration problems.",
      date: "2024-01-16",
      readTime: "13 min read",
      author: "Alex",
      slug: "quickbooks-integration-best-practices",
      category: "Integration"
    },
    {
      id: 21,
      title: "Multi-Client Reconciliation Strategies",
      excerpt: "Managing multiple clients? Here's how to handle their reconciliations efficiently without getting overwhelmed.",
      date: "2024-01-16",
      readTime: "15 min read",
      author: "Alex",
      slug: "multi-client-reconciliation-strategies",
      category: "Multi-Client"
    },
    {
      id: 22,
      title: "Reconciliation Software Comparison: 2024 Guide",
      excerpt: "Comparing reconciliation software options? Here's the complete guide to choosing the right tool for your needs.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "reconciliation-software-comparison",
      category: "Software"
    },
    {
      id: 23,
      title: "Accounting Automation Guide: Save Hours Every Month",
      excerpt: "Automate your accounting processes and save hours every month. Here's the complete guide to getting started.",
      date: "2024-01-16",
      readTime: "18 min read",
      author: "Alex",
      slug: "accounting-automation-guide",
      category: "Automation"
    },
    {
      id: 24,
      title: "Professional Report Templates for Reconciliation",
      excerpt: "Create professional reconciliation reports that impress clients and auditors. Here are the templates you need.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "professional-report-templates",
      category: "Reports"
    },
    {
      id: 25,
      title: "Client Communication Best Practices for Reconciliation",
      excerpt: "Communicating reconciliation issues to clients? Here's how to do it professionally and maintain trust.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "client-communication-best-practices",
      category: "Communication"
    },
    {
      id: 26,
      title: "Reconciliation Best Practices: Industry Standards",
      excerpt: "Follow industry best practices for bank reconciliation and ensure your books are always accurate and compliant.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "reconciliation-best-practices",
      category: "Best Practices"
    },
    {
      id: 27,
      title: "Reconciliation Time Savings: How to Cut Hours",
      excerpt: "Save hours every month on reconciliation. Here are the proven strategies that actually work.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "reconciliation-time-savings",
      category: "Productivity"
    },
    {
      id: 28,
      title: "Fix QuickBooks Reconciliation Fast: Emergency Guide",
      excerpt: "QuickBooks reconciliation emergency? Here's how to fix it fast and get your books back on track.",
      date: "2024-01-16",
      readTime: "9 min read",
      author: "Alex",
      slug: "fix-quickbooks-reconciliation-fast",
      category: "Emergency"
    },
    {
      id: 29,
      title: "Export QuickBooks Online Transactions: Complete Guide",
      excerpt: "Need to export transactions from QuickBooks Online? Here's the complete guide to getting your data out.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "export-quickbooks-online-transactions",
      category: "Export"
    },
    {
      id: 30,
      title: "QuickBooks Auto Matching Problems: Complete Fix",
      excerpt: "QuickBooks auto matching problems driving you crazy? Here's the complete fix that actually works.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "quickbooks-auto-matching-problems",
      category: "QuickBooks"
    },
    {
      id: 31,
      title: "Export QuickBooks Bank Transactions: Step-by-Step",
      excerpt: "Need to export bank transactions from QuickBooks? Here's the step-by-step process that works every time.",
      date: "2024-01-16",
      readTime: "8 min read",
      author: "Alex",
      slug: "export-quickbooks-bank-transactions",
      category: "Export"
    },
    {
      id: 32,
      title: "Manual vs Automated Reconciliation: Which is Better?",
      excerpt: "Manual or automated reconciliation? Here's the complete comparison to help you choose the right approach.",
      date: "2024-01-16",
      readTime: "13 min read",
      author: "Alex",
      slug: "manual-vs-automated-reconciliation",
      category: "Comparison"
    },
    {
      id: 33,
      title: "QuickBooks Bank Feed Issues 2024: The Complete Troubleshooting Guide",
      excerpt: "QuickBooks bank feed issues affect thousands of users daily. Here's the complete troubleshooting guide that fixes 95% of bank feed problems.",
      date: "2024-01-16",
      readTime: "15 min read",
      author: "Alex",
      slug: "quickbooks-bank-feed-issues-2024-complete-guide",
      category: "QuickBooks"
    },
    {
      id: 34,
      title: "QuickBooks Auto Match Wrong Transactions: The Ultimate Fix Guide (2024)",
      excerpt: "QuickBooks keeps matching the wrong transactions and you can't figure out why? This comprehensive guide will fix your auto-matching problems once and for all.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "quickbooks-auto-match-wrong-transactions-ultimate-fix",
      category: "QuickBooks"
    },
    {
      id: 35,
      title: "QuickBooks Duplicate Transactions Fix: Complete Step-by-Step Solution (2024)",
      excerpt: "QuickBooks creating duplicate transactions is a nightmare that wastes hours. Here's the complete step-by-step solution that prevents and fixes duplicate transactions.",
      date: "2024-01-16",
      readTime: "16 min read",
      author: "Alex",
      slug: "quickbooks-duplicate-transactions-fix-complete-solution",
      category: "QuickBooks"
    },
    {
      id: 36,
      title: "How to Reconcile PayPal in QuickBooks: The Definitive Guide (2024)",
      excerpt: "PayPal reconciliation in QuickBooks is notoriously difficult for e-commerce businesses. Here's the definitive guide that makes it simple and accurate.",
      date: "2024-01-16",
      readTime: "18 min read",
      author: "Alex",
      slug: "how-to-reconcile-paypal-in-quickbooks-definitive-guide",
      category: "E-commerce"
    },
    {
      id: 37,
      title: "Best Reconciliation Software for QuickBooks: 2024 Expert Comparison",
      excerpt: "Looking for the best reconciliation software for QuickBooks? Here's the expert comparison of top tools that actually work and save you time.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "best-reconciliation-software-for-quickbooks-2024",
      category: "Software"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bank Reconciliation Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides, tips, and solutions for QuickBooks users, bookkeepers, and accountants. 
            Learn how to reconcile faster, more accurately, and with less frustration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    {post.readTime}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 