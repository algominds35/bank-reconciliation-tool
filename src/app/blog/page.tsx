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
      title: "QuickBooks Bank Feed Not Syncing? Here's the Complete Fix (2024)",
      excerpt: "QuickBooks bank feed not syncing is a nightmare that wastes hours every month. Here's the step-by-step fix that actually works.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "quickbooks-bank-feed-not-syncing-fix",
      category: "QuickBooks"
    },
    {
      id: 11,
      title: "QuickBooks Duplicate Transactions? Here's How to Remove Them (2024)",
      excerpt: "QuickBooks duplicate transactions can destroy your reconciliation and waste hours of cleanup time. Here's how to find and remove them quickly.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "quickbooks-duplicate-transactions-remove",
      category: "QuickBooks"
    },
    {
      id: 12,
      title: "QuickBooks Reconciliation Balance Not Matching? Here's the Fix (2024)",
      excerpt: "QuickBooks reconciliation balance not matching can drive you crazy. Here's the systematic approach to identify and fix the root cause quickly.",
      date: "2024-01-16",
      readTime: "13 min read",
      author: "Alex",
      slug: "quickbooks-reconciliation-balance-not-matching",
      category: "QuickBooks"
    },
    {
      id: 13,
      title: "Multiple Bank Accounts Reconciliation: Complete Guide",
      excerpt: "Managing multiple bank accounts in QuickBooks? Here's how to reconcile them efficiently and avoid common pitfalls.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "multiple-bank-accounts-reconciliation",
      category: "Tutorial"
    },
    {
      id: 14,
      title: "Year-End Reconciliation Checklist: Don't Miss These Steps",
      excerpt: "Year-end reconciliation is critical for accurate financial statements. Here's the complete checklist to ensure nothing is missed.",
      date: "2024-01-16",
      readTime: "15 min read",
      author: "Alex",
      slug: "year-end-reconciliation-checklist",
      category: "Checklist"
    },
    {
      id: 15,
      title: "Monthly Reconciliation Checklist: Stay on Track",
      excerpt: "Monthly reconciliation keeps your books clean and accurate. Here's the step-by-step checklist for consistent results.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "monthly-reconciliation-checklist",
      category: "Checklist"
    },
    {
      id: 16,
      title: "Bank Reconciliation for Small Business: Complete Guide",
      excerpt: "Small business bank reconciliation doesn't have to be complicated. Here's the simplified process that works for any business size.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "bank-reconciliation-for-small-business",
      category: "Small Business"
    },
    {
      id: 17,
      title: "Step-by-Step Bank Reconciliation Guide",
      excerpt: "New to bank reconciliation? Here's the complete step-by-step guide that will make you an expert in no time.",
      date: "2024-01-16",
      readTime: "16 min read",
      author: "Alex",
      slug: "step-by-step-bank-reconciliation-guide",
      category: "Tutorial"
    },
    {
      id: 18,
      title: "Automated Reconciliation: Complete Tutorial",
      excerpt: "Automate your bank reconciliation process and save hours every month. Here's how to set it up properly.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "automated-reconciliation-complete-tutorial",
      category: "Automation"
    },
    {
      id: 19,
      title: "QuickBooks Integration Best Practices",
      excerpt: "Integrating QuickBooks with other systems? Here's how to do it right and avoid common integration problems.",
      date: "2024-01-16",
      readTime: "13 min read",
      author: "Alex",
      slug: "quickbooks-integration-best-practices",
      category: "Integration"
    },
    {
      id: 20,
      title: "Multi-Client Reconciliation Strategies",
      excerpt: "Managing multiple clients? Here's how to handle their reconciliations efficiently without getting overwhelmed.",
      date: "2024-01-16",
      readTime: "15 min read",
      author: "Alex",
      slug: "multi-client-reconciliation-strategies",
      category: "Multi-Client"
    },
    {
      id: 21,
      title: "Reconciliation Software Comparison: 2024 Guide",
      excerpt: "Comparing reconciliation software options? Here's the complete guide to choosing the right tool for your needs.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "reconciliation-software-comparison",
      category: "Software"
    },
    {
      id: 22,
      title: "Accounting Automation Guide: Save Hours Every Month",
      excerpt: "Automate your accounting processes and save hours every month. Here's the complete guide to getting started.",
      date: "2024-01-16",
      readTime: "18 min read",
      author: "Alex",
      slug: "accounting-automation-guide",
      category: "Automation"
    },
    {
      id: 23,
      title: "Professional Report Templates for Reconciliation",
      excerpt: "Create professional reconciliation reports that impress clients and auditors. Here are the templates you need.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "professional-report-templates",
      category: "Reports"
    },
    {
      id: 24,
      title: "Client Communication Best Practices for Reconciliation",
      excerpt: "Communicating reconciliation issues to clients? Here's how to do it professionally and maintain trust.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "client-communication-best-practices",
      category: "Communication"
    },
    {
      id: 25,
      title: "Reconciliation Best Practices: Industry Standards",
      excerpt: "Follow industry best practices for bank reconciliation and ensure your books are always accurate and compliant.",
      date: "2024-01-16",
      readTime: "14 min read",
      author: "Alex",
      slug: "reconciliation-best-practices",
      category: "Best Practices"
    },
    {
      id: 26,
      title: "Reconciliation Time Savings: How to Cut Hours",
      excerpt: "Save hours every month on reconciliation. Here are the proven strategies that actually work.",
      date: "2024-01-16",
      readTime: "12 min read",
      author: "Alex",
      slug: "reconciliation-time-savings",
      category: "Productivity"
    },
    {
      id: 27,
      title: "Fix QuickBooks Reconciliation Fast: Emergency Guide",
      excerpt: "QuickBooks reconciliation emergency? Here's how to fix it fast and get your books back on track.",
      date: "2024-01-16",
      readTime: "9 min read",
      author: "Alex",
      slug: "fix-quickbooks-reconciliation-fast",
      category: "Emergency"
    },
    {
      id: 28,
      title: "Export QuickBooks Online Transactions: Complete Guide",
      excerpt: "Need to export transactions from QuickBooks Online? Here's the complete guide to getting your data out.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "export-quickbooks-online-transactions",
      category: "Export"
    },
    {
      id: 29,
      title: "QuickBooks Auto Matching Problems: Complete Fix",
      excerpt: "QuickBooks auto matching problems driving you crazy? Here's the complete fix that actually works.",
      date: "2024-01-16",
      readTime: "11 min read",
      author: "Alex",
      slug: "quickbooks-auto-matching-problems",
      category: "QuickBooks"
    },
    {
      id: 30,
      title: "Export QuickBooks Bank Transactions: Step-by-Step",
      excerpt: "Need to export bank transactions from QuickBooks? Here's the step-by-step process that works every time.",
      date: "2024-01-16",
      readTime: "8 min read",
      author: "Alex",
      slug: "export-quickbooks-bank-transactions",
      category: "Export"
    },
    {
      id: 31,
      title: "Manual vs Automated Reconciliation: Which is Better?",
      excerpt: "Manual or automated reconciliation? Here's the complete comparison to help you choose the right approach.",
      date: "2024-01-16",
      readTime: "13 min read",
      author: "Alex",
      slug: "manual-vs-automated-reconciliation",
      category: "Comparison"
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