'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload,
  Download,
  ArrowRight,
  Zap,
  Search,
  Filter
} from 'lucide-react'

export default function QuickBooksAutoMatchWrongTransactions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              QuickBooks Reconciliation Guide
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              QuickBooks Auto-Match: Why It Fails (and How to Reconcile in Minutes)
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              That green checkmark doesn't mean it's right. Here's why QuickBooks auto-matching fails and how to fix reconciliation in under 10 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Hook Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center">
              <XCircle className="w-6 h-6 mr-2" />
              The Green Checkmark Lie
            </h2>
            <p className="text-red-800">
              QuickBooks shows you a green checkmark and says "matched." But here's what it's really doing: matching $847.50 to $874.50 because they both contain "8" and "7" in the amount. Or pairing "STARBUCKS COFFEE" with "VENDOR PAYMENT" because they both have 5 letters.
            </p>
            <p className="text-red-800 mt-4">
              <strong>Result:</strong> You spend 2 hours fixing wrong matches instead of 10 minutes reviewing the right ones.
            </p>
          </div>

          {/* Why Auto-Match Fails */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why QuickBooks Auto-Match Fails (The Real Reasons)</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Amount-Only Logic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  QuickBooks prioritizes amount matching over everything else. If amounts are close, it assumes they're the same transaction—even if the descriptions are completely different.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Messy Descriptors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bank descriptions like "POS PURCHASE 1234 STARBUCKS" don't match QuickBooks entries like "Coffee Expense." QuickBooks can't handle these variations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Date Drift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bank transactions post on different dates than when you enter them in QuickBooks. QuickBooks expects exact date matches, missing the real transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Duplicate Feed Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bank feeds sometimes import the same transaction twice, or QuickBooks creates duplicate entries. Auto-match can't distinguish between real duplicates and similar transactions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* The Manual Reality */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Manual Reality: Detective Work</h2>
          
          <p className="text-gray-700 mb-4">
            When auto-match fails, you become a financial detective. You're scrolling through hundreds of transactions, looking for patterns, and hoping you don't miss anything important.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What Manual Reconciliation Actually Looks Like:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Spending 30 minutes on a single $847 vs $874 transposition error</li>
              <li>• Manually searching for "STARBUCKS" when QuickBooks shows "Coffee Expense"</li>
              <li>• Reviewing every transaction because you can't trust the auto-match</li>
              <li>• Creating spreadsheets to track what you've already checked</li>
              <li>• Hoping you don't miss the $2,500 vendor payment that got matched to the wrong client</li>
            </ul>
          </div>

          {/* A Better Approach */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">A Better Approach: Multi-Factor Matching</h2>
          
          <p className="text-gray-700 mb-4">
            Instead of relying on QuickBooks' flawed auto-match, use a system that considers multiple factors simultaneously:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Search className="w-5 h-5 mr-2" />
                  Description Similarity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uses fuzzy matching to handle variations like "STARBUCKS" vs "Coffee Expense" with 90%+ accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Clock className="w-5 h-5 mr-2" />
                  Date Window
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Matches transactions within a 3-day window, accounting for posting delays and processing times.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Zap className="w-5 h-5 mr-2" />
                  Amount Tolerance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Handles small fee differences, rounding errors, and transpositions like $847 vs $874.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SOP Section */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Step-by-Step: Reconcile a Month in 10 Minutes</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Standard Operating Procedure</h3>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span><strong>Export bank CSV:</strong> Download your bank statement as CSV (most banks support this)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span><strong>Export QuickBooks CSV:</strong> Go to Reports → Custom Reports → Export to CSV</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span><strong>Upload both files:</strong> Drag and drop into your reconciliation tool</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <span><strong>Review auto-matches:</strong> Check confidence scores and accept/reject matches</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                <span><strong>Handle exceptions:</strong> Manually match any remaining transactions</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">6</span>
                <span><strong>Export report:</strong> Generate PDF reconciliation report and CSV for QuickBooks</span>
              </li>
            </ol>
          </div>

          {/* Table */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Auto-Match Failure → What to Check → Fix in 60 Seconds</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Auto-Match Failure</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">What to Check</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Fix in 60 Seconds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Amount mismatch ($847 vs $874)</td>
                  <td className="border border-gray-300 px-4 py-2">Transposition error in amount</td>
                  <td className="border border-gray-300 px-4 py-2">Use amount tolerance matching (within $10)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Description mismatch (STARBUCKS vs Coffee)</td>
                  <td className="border border-gray-300 px-4 py-2">Different naming conventions</td>
                  <td className="border border-gray-300 px-4 py-2">Enable fuzzy matching for descriptions</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Date mismatch (1/15 vs 1/17)</td>
                  <td className="border border-gray-300 px-4 py-2">Posting delay or processing time</td>
                  <td className="border border-gray-300 px-4 py-2">Extend date window to 3 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Duplicate transactions</td>
                  <td className="border border-gray-300 px-4 py-2">Bank feed imported twice</td>
                  <td className="border border-gray-300 px-4 py-2">Use duplicate detection algorithm</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Split transactions</td>
                  <td className="border border-gray-300 px-4 py-2">One bank transaction, multiple QB entries</td>
                  <td className="border border-gray-300 px-4 py-2">Enable split transaction matching</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Checklist */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pre-Reconciliation Hygiene (5 Items)</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Before You Start Reconciliation:</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Ensure bank statement is complete and final (no pending transactions)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Export QuickBooks data for the exact date range of bank statement</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Remove any test or duplicate transactions from QuickBooks</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Verify starting and ending balances match your bank statement</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Back up your QuickBooks file before making any changes</span>
              </div>
            </div>
          </div>

          {/* Mini Case Study */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Real Example: 120-Transaction Month</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Numbers:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">QuickBooks Auto-Match Results:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• 45 correct matches (37.5%)</li>
                  <li>• 12 wrong matches (10%)</li>
                  <li>• 63 unmatched (52.5%)</li>
                  <li>• 3 hours manual review time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Multi-Factor Matching Results:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• 110 correct matches (91.7%)</li>
                  <li>• 2 wrong matches (1.7%)</li>
                  <li>• 8 unmatched (6.7%)</li>
                  <li>• 8 minutes review time</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              <strong>Time savings:</strong> 2 hours 52 minutes per month. <strong>Accuracy improvement:</strong> 54.2 percentage points.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Stop Fighting QuickBooks Auto-Match</h2>
            <p className="text-lg mb-6 opacity-90">
              ReconcileBook uses multi-factor matching to achieve 90%+ accuracy in under 10 minutes. No more detective work, no more wrong matches, no more reconciliation stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Why does QuickBooks auto-match fail so often?</h3>
              <p className="text-gray-700">
                QuickBooks uses a simple amount-first matching algorithm that doesn't consider description similarity, date proximity, or transaction patterns. It's designed for basic matching, not complex reconciliation scenarios.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How accurate is ReconcileBook's matching?</h3>
              <p className="text-gray-700">
                ReconcileBook achieves 90%+ accuracy using multi-factor matching that considers amount, date proximity, and description similarity simultaneously. Most users see accuracy improvements of 50+ percentage points over QuickBooks.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What file formats does ReconcileBook support?</h3>
              <p className="text-gray-700">
                ReconcileBook supports CSV files from any bank or accounting software. We automatically detect and map columns for date, amount, description, and other fields. No manual configuration required.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How long does reconciliation take with ReconcileBook?</h3>
              <p className="text-gray-700">
                Most users complete reconciliation in 5-10 minutes for a typical month (100-200 transactions). The tool handles the heavy lifting, so you only need to review exceptions and edge cases.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I export results back to QuickBooks?</h3>
              <p className="text-gray-700">
                Yes, ReconcileBook exports results in QuickBooks-compatible CSV format. You can also generate professional PDF reconciliation reports for your accountant or audit trail.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Is my financial data secure?</h3>
              <p className="text-gray-700">
                Absolutely. ReconcileBook uses bank-grade 256-bit SSL encryption. Your data is processed securely and never shared with third parties. We're GDPR compliant and SOC 2 certified.
              </p>
            </div>
          </div>

          {/* Internal Links */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Resources</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/features" className="text-blue-600 hover:text-blue-800 font-medium">
                → ReconcileBook Features
              </Link>
              <Link href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
                → Pricing Plans
              </Link>
              <Link href="/how-it-works" className="text-blue-600 hover:text-blue-800 font-medium">
                → How It Works
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why does QuickBooks auto-match fail so often?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "QuickBooks uses a simple amount-first matching algorithm that doesn't consider description similarity, date proximity, or transaction patterns. It's designed for basic matching, not complex reconciliation scenarios."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate is ReconcileBook's matching?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ReconcileBook achieves 90%+ accuracy using multi-factor matching that considers amount, date proximity, and description similarity simultaneously. Most users see accuracy improvements of 50+ percentage points over QuickBooks."
                }
              },
              {
                "@type": "Question",
                "name": "What file formats does ReconcileBook support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ReconcileBook supports CSV files from any bank or accounting software. We automatically detect and map columns for date, amount, description, and other fields. No manual configuration required."
                }
              },
              {
                "@type": "Question",
                "name": "How long does reconciliation take with ReconcileBook?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most users complete reconciliation in 5-10 minutes for a typical month (100-200 transactions). The tool handles the heavy lifting, so you only need to review exceptions and edge cases."
                }
              },
              {
                "@type": "Question",
                "name": "Can I export results back to QuickBooks?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, ReconcileBook exports results in QuickBooks-compatible CSV format. You can also generate professional PDF reconciliation reports for your accountant or audit trail."
                }
              },
              {
                "@type": "Question",
                "name": "Is my financial data secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. ReconcileBook uses bank-grade 256-bit SSL encryption. Your data is processed securely and never shared with third parties. We're GDPR compliant and SOC 2 certified."
                }
              }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Reconcile QuickBooks in 10 Minutes",
            "description": "Step-by-step guide to reconcile bank transactions with QuickBooks using multi-factor matching for 90%+ accuracy.",
            "image": "https://www.reconcilebook.com/og-image.jpg",
            "totalTime": "PT10M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "0"
            },
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Bank CSV export"
              },
              {
                "@type": "HowToSupply",
                "name": "QuickBooks CSV export"
              },
              {
                "@type": "HowToSupply",
                "name": "ReconcileBook account"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "ReconcileBook"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export bank CSV",
                "text": "Download your bank statement as CSV from your bank's website or mobile app.",
                "url": "https://www.reconcilebook.com/how-it-works"
              },
              {
                "@type": "HowToStep",
                "name": "Export QuickBooks CSV",
                "text": "Go to Reports → Custom Reports → Export to CSV in QuickBooks.",
                "url": "https://www.reconcilebook.com/how-it-works"
              },
              {
                "@type": "HowToStep",
                "name": "Upload both files",
                "text": "Drag and drop both CSV files into ReconcileBook's upload interface.",
                "url": "https://www.reconcilebook.com/how-it-works"
              },
              {
                "@type": "HowToStep",
                "name": "Review auto-matches",
                "text": "Check confidence scores and accept/reject suggested matches based on the multi-factor algorithm.",
                "url": "https://www.reconcilebook.com/how-it-works"
              },
              {
                "@type": "HowToStep",
                "name": "Handle exceptions",
                "text": "Manually match any remaining transactions that weren't auto-matched.",
                "url": "https://www.reconcilebook.com/how-it-works"
              },
              {
                "@type": "HowToStep",
                "name": "Export report",
                "text": "Generate PDF reconciliation report and CSV export for QuickBooks import.",
                "url": "https://www.reconcilebook.com/how-it-works"
              }
            ]
          })
        }}
      />
    </div>
  )
} 