'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Clock, User, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Alex</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>January 15, 2024</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>5 min read</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            How to Reconcile Bank Statements in 8 Minutes
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Learn the step-by-step process to automate your bank reconciliation and save 4-5 hours every month.
          </p>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <h2>The Problem: Manual Reconciliation Takes Hours</h2>
          <p>
            Every month, accountants and bookkeepers spend 4-5 hours manually reconciling bank statements with their accounting software. 
            This tedious process involves:
          </p>
          <ul>
            <li>Downloading bank statements</li>
            <li>Exporting QuickBooks data</li>
            <li>Manually matching transactions</li>
            <li>Checking for discrepancies</li>
            <li>Creating reconciliation reports</li>
          </ul>

          <h2>The Solution: Automated Bank Reconciliation</h2>
          <p>
            With modern reconciliation tools, you can complete the same process in under 8 minutes. Here's how:
          </p>

          <h3>Step 1: Upload Your Files</h3>
          <p>
            Start by uploading your bank statement CSV file and your QuickBooks export. Most reconciliation tools accept standard CSV formats.
          </p>

          <h3>Step 2: Use Smart Matching</h3>
          <p>
            Modern tools provide side-by-side interfaces that automatically suggest matches between bank and bookkeeping transactions. 
            Simply click to confirm matches or use bulk selection for multiple transactions.
          </p>

          <h3>Step 3: Export Professional Reports</h3>
          <p>
            Once reconciled, export professional PDF reports for your clients or CSV files for your accounting software.
          </p>

          <h2>Time Savings Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-semibold">Manual Process</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 4-5 hours per month</li>
                  <li>• Error-prone matching</li>
                  <li>• Tedious spreadsheet work</li>
                  <li>• No professional reports</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-semibold">Automated Process</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 8 minutes per month</li>
                  <li>• Smart matching interface</li>
                  <li>• One-click reconciliation</li>
                  <li>• Professional PDF reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2>Key Benefits of Automated Reconciliation</h2>
          <ul>
            <li><strong>95% Time Savings:</strong> Complete reconciliation in minutes instead of hours</li>
            <li><strong>Error Reduction:</strong> Automated matching reduces human errors</li>
            <li><strong>Professional Reports:</strong> Generate branded PDF reports for clients</li>
            <li><strong>QuickBooks Integration:</strong> Export CSV files for seamless integration</li>
            <li><strong>Multi-Client Support:</strong> Handle multiple businesses efficiently</li>
          </ul>

          <h2>Getting Started</h2>
          <p>
            Ready to save 4-5 hours every month on bank reconciliation? Try ReconcileBook's automated reconciliation tool with a 14-day free trial.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4">Try ReconcileBook Free</h3>
            <p className="mb-4">
              Join thousands of accountants who have already automated their reconciliation process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  Start Free Trial
                </Button>
              </a>
              <a href="https://youtu.be/pgd2QIQcbOk" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  Watch Demo Video
                </Button>
              </a>
            </div>
          </div>

          <h2>Conclusion</h2>
          <p>
            Manual bank reconciliation is a thing of the past. With modern automation tools, you can complete the same work in minutes instead of hours, 
            while producing more accurate and professional results. The time savings alone make automated reconciliation a must-have for any accounting practice.
          </p>

        </div>
      </article>
    </div>
  )
} 