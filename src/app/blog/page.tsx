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
      title: "QuickBooks Bank Feed Not Working? 5 Fast Fixes",
      excerpt: "Tired of QuickBooks bank feeds failing? Here's how to fix them fast and get back to reconciling.",
      date: "2024-01-16",
      readTime: "8 min read",
      author: "Alex",
      slug: "quickbooks-bank-feed-not-working",
      category: "QuickBooks"
    },
    {
      id: 2,
      title: "How to Export Transactions from QuickBooks Online",
      excerpt: "Step-by-step guide to export your QuickBooks Online transactions for reconciliation.",
      date: "2024-01-16",
      readTime: "6 min read",
      author: "Alex",
      slug: "export-quickbooks-online-transactions",
      category: "Tutorial"
    },
    {
      id: 3,
      title: "QuickBooks Auto-Matching Problems: 5 Solutions That Actually Work",
      excerpt: "Stop fighting with QuickBooks' unpredictable auto-matching. Learn proven solutions to fix reconciliation issues and get better results.",
      date: "2024-01-16",
      readTime: "10 min read",
      author: "Alex",
      slug: "quickbooks-auto-matching-problems",
      category: "QuickBooks"
    },
    {
      id: 4,
      title: "How to Export Bank Transactions from QuickBooks Desktop in 3 Steps",
      excerpt: "Get your QuickBooks data ready for faster reconciliation with these simple export steps.",
      date: "2024-01-16",
      readTime: "6 min read",
      author: "Alex",
      slug: "export-quickbooks-bank-transactions",
      category: "Tutorial"
    },
    {
      id: 5,
      title: "Manual vs Automated Bank Reconciliation: Time and Cost Comparison",
      excerpt: "See the dramatic time and cost savings when you switch from manual reconciliation to smart automation.",
      date: "2024-01-16",
      readTime: "8 min read",
      author: "Alex",
      slug: "manual-vs-automated-reconciliation",
      category: "Comparison"
    },
    {
      id: 6,
      title: "How to Fix QuickBooks Reconciliation Fast: Complete Guide",
      excerpt: "Stop struggling with QuickBooks reconciliation. Learn proven methods to fix reconciliation issues quickly and get your books balanced in minutes, not hours.",
      date: "2024-01-15",
      readTime: "8 min read",
      author: "Alex",
      slug: "fix-quickbooks-reconciliation-fast",
      category: "QuickBooks"
    },
    {
      id: 7,
      title: "How to Reconcile Bank Statements in 8 Minutes",
      excerpt: "Learn the step-by-step process to automate your bank reconciliation and save 4-5 hours every month.",
      date: "2024-01-14",
      readTime: "5 min read",
      author: "Alex",
      slug: "how-to-reconcile-bank-statements-8-minutes",
      category: "Tutorial"
    },
    {
      id: 8,
      title: "5 Common Bank Reconciliation Errors and How to Fix Them",
      excerpt: "Discover the most common reconciliation mistakes and learn how to prevent them with automated tools.",
      date: "2024-01-13",
      readTime: "7 min read",
      author: "Alex",
      slug: "common-bank-reconciliation-errors-fix",
      category: "Tips"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ReconcileBook Blog</h1>
              <p className="text-gray-600 mt-2">Bank reconciliation tips, tutorials, and industry insights</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">{post.category}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 