'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp, 
  Download,
  Upload,
  ArrowRight,
  Zap,
  Search,
  Filter,
  Calendar,
  BarChart3,
  AlertTriangle
} from 'lucide-react'

export default function MonthEndBankReconciliationSOP() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Bookkeeping SOP Guide
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Month-End Bank Reconciliation SOP for Bookkeeping Firms (+ Free Template)
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Stop treating month-end like detective work. Here's a repeatable, faster reconciliation process that scales across your entire client base.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Hook Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
              <Search className="w-6 h-6 mr-2" />
              Why Month-End Feels Like Detective Work
            </h2>
            <p className="text-blue-800">
              Every month-end, you're piecing together financial puzzles. Bank statements don't match QuickBooks. Transactions are missing, duplicated, or wrong. You're spending 8+ hours per client on reconciliation that should take 30 minutes.
            </p>
            <p className="text-blue-800 mt-4">
              <strong>The problem:</strong> You're using a process designed for manual reconciliation, not modern bookkeeping efficiency.
            </p>
          </div>

          {/* Goals of a Solid SOP */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Goals of a Solid Reconciliation SOP</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reduce reconciliation time from 8 hours to 30 minutes per client. Scale your practice without hiring additional staff.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Achieve 95%+ match accuracy with multi-factor matching. Catch discrepancies that manual reconciliation misses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 text-purple-500 mr-2" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate professional PDF reports and maintain clear documentation for compliance and client communication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 text-orange-500 mr-2" />
                  Delegation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Train junior staff to handle reconciliation independently. Standardize processes across your entire team.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core SOP */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Core Month-End Reconciliation SOP</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard Operating Procedure</h3>
            <ol className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">1</span>
                <div>
                  <strong className="text-gray-900">Gather Statements & Prior Balances</strong>
                  <p className="mt-1">Download final bank statements for all accounts. Verify starting balances match your prior month's ending balance. Note any pending transactions that won't clear this month.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">2</span>
                <div>
                  <strong className="text-gray-900">Export Clean CSVs</strong>
                  <p className="mt-1">Export bank data as CSV (most banks support this). Export QuickBooks data for the exact date range. Ensure proper column mapping: date, amount, description, reference number.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">3</span>
                <div>
                  <strong className="text-gray-900">Run Multi-Factor Matching</strong>
                  <p className="mt-1">Upload both files to your reconciliation tool. Use date window (3 days), amount tolerance ($10), and description similarity (90%+). Review confidence scores and accept/reject matches.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">4</span>
                <div>
                  <strong className="text-gray-900">Review Only Exceptions</strong>
                  <p className="mt-1">Focus on transactions below 80% confidence. Handle edge cases: partial payments, transfers, split transactions, transpositions. Don't waste time on obvious matches.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">5</span>
                <div>
                  <strong className="text-gray-900">Handle Edge Cases</strong>
                  <p className="mt-1">Address partial payments (match to multiple QB entries), transfers (internal vs external), split transactions (one bank entry, multiple QB entries), and transpositions ($847 vs $874).</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">6</span>
                <div>
                  <strong className="text-gray-900">Produce Artifacts</strong>
                  <p className="mt-1">Generate PDF reconciliation report for client/accountant. Export CSV for QuickBooks import. Document any discrepancies or unusual transactions for follow-up.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Table */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exception Types → How to Resolve → When to Escalate</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Exception Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">How to Resolve</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">When to Escalate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Amount mismatch ($847 vs $874)</td>
                  <td className="border border-gray-300 px-4 py-2">Check for transposition error, verify with bank statement</td>
                  <td className="border border-gray-300 px-4 py-2">If difference &gt; $100 or pattern of errors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Missing bank transaction</td>
                  <td className="border border-gray-300 px-4 py-2">Check for pending status, verify posting date</td>
                  <td className="border border-gray-300 px-4 py-2">If transaction &gt; $1,000 or missing for &gt;7 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Duplicate QuickBooks entry</td>
                  <td className="border border-gray-300 px-4 py-2">Identify and merge duplicate entries</td>
                  <td className="border border-gray-300 px-4 py-2">If multiple duplicates or system-wide issue</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Split transaction</td>
                  <td className="border border-gray-300 px-4 py-2">Match to multiple QuickBooks entries</td>
                  <td className="border border-gray-300 px-4 py-2">If split involves &gt;5 entries or complex allocation</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Bank feed error</td>
                  <td className="border border-gray-300 px-4 py-2">Re-import bank feed, check connection</td>
                  <td className="border border-gray-300 px-4 py-2">If persistent connection issues or data corruption</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Unidentified transaction</td>
                  <td className="border border-gray-300 px-4 py-2">Research transaction details, contact client</td>
                  <td className="border border-gray-300 px-4 py-2">If transaction &gt; $500 or suspicious activity</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SOP Template */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Copy-Paste SOP Template</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Month-End Reconciliation SOP Template</h3>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{`# Month-End Bank Reconciliation SOP

## Purpose
Standardize month-end reconciliation process for all clients to ensure accuracy, speed, and consistency.

## Scope
Applies to all bank account reconciliations for bookkeeping clients.

## Responsibilities
- **Senior Bookkeeper**: Review and approve all reconciliations
- **Junior Bookkeeper**: Execute reconciliation process
- **Client**: Provide bank statements and answer questions

## Prerequisites
- Final bank statements for all accounts
- QuickBooks data exported for exact date range
- Prior month's reconciliation completed
- Client approval for any unusual transactions

## Process Steps

### Step 1: Gather Documentation
- [ ] Download final bank statements (PDF and CSV)
- [ ] Export QuickBooks data for exact date range
- [ ] Verify starting balances match prior month
- [ ] Note any pending transactions

### Step 2: Prepare Data
- [ ] Clean CSV files (remove headers, format dates)
- [ ] Map columns correctly (date, amount, description)
- [ ] Remove test or duplicate transactions
- [ ] Verify data integrity

### Step 3: Run Reconciliation
- [ ] Upload bank and QuickBooks CSV files
- [ ] Review auto-matches (confidence &gt;80%)
- [ ] Accept/reject suggested matches
- [ ] Handle exceptions manually

### Step 4: Review Exceptions
- [ ] Focus on transactions below 80% confidence
- [ ] Check for transposition errors
- [ ] Verify missing transactions
- [ ] Handle split transactions

### Step 5: Final Review
- [ ] Verify ending balance matches
- [ ] Review reconciliation report
- [ ] Document any discrepancies
- [ ] Get senior bookkeeper approval

### Step 6: Deliverables
- [ ] PDF reconciliation report
- [ ] CSV export for QuickBooks
- [ ] Exception documentation
- [ ] Client communication

## Quality Control
- All reconciliations require senior bookkeeper review
- Match rate must be &gt;90% for standard accounts
- Exceptions must be documented and resolved
- Client approval required for unusual transactions

## Escalation
- Escalate if match rate &lt;80%
- Escalate if exceptions &gt;10% of transactions
- Escalate if discrepancies &gt;$1,000
- Escalate if client questions cannot be resolved

## Tools Required
- ReconcileBook (primary reconciliation tool)
- QuickBooks (source data)
- Bank statements (verification)
- PDF generator (reports)

## Time Estimates
- Standard account (100-200 transactions): 30 minutes
- Complex account (200-500 transactions): 60 minutes
- Multi-account client: 2-4 hours
- Exception handling: +15 minutes per exception

## Success Metrics
- Match rate &gt;90%
- Reconciliation time &lt;60 minutes per account
- Client satisfaction &gt;95%
- Error rate &lt;2%`}</pre>
            </div>
          </div>

          {/* KPI Section */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What to Measure: Key Performance Indicators</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                  Match Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Target:</strong> &gt;90% auto-match rate<br/>
                  <strong>Measurement:</strong> Percentage of transactions matched automatically<br/>
                  <strong>Action:</strong> Investigate if &lt;80%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-green-500 mr-2" />
                  Time per Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Target:</strong> &lt;60 minutes per account<br/>
                  <strong>Measurement:</strong> Total reconciliation time<br/>
                  <strong>Action:</strong> Optimize process if &gt;90 minutes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                  Exceptions per 100 Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Target:</strong> &lt;10 exceptions per 100 transactions<br/>
                  <strong>Measurement:</strong> Manual matches required<br/>
                  <strong>Action:</strong> Review process if &gt;15
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                  Client Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Target:</strong> &gt;95% satisfaction<br/>
                  <strong>Measurement:</strong> Client feedback surveys<br/>
                  <strong>Action:</strong> Address concerns if &lt;90%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Plan */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Implementation Plan: Week 1-4 Rollout</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-green-900 mb-4">4-Week Implementation Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">1</div>
                <div>
                  <strong className="text-green-900">Week 1: Setup & Training</strong>
                  <p className="text-green-800 mt-1">Set up ReconcileBook accounts for all team members. Train senior bookkeepers on new process. Create client communication templates.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">2</div>
                <div>
                  <strong className="text-green-900">Week 2: Pilot Program</strong>
                  <p className="text-green-800 mt-1">Test new SOP with 3-5 existing clients. Gather feedback and refine process. Document lessons learned.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">3</div>
                <div>
                  <strong className="text-green-900">Week 3: Team Training</strong>
                  <p className="text-green-800 mt-1">Train all bookkeepers on new SOP. Practice with sample data. Establish quality control procedures.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">4</div>
                <div>
                  <strong className="text-green-900">Week 4: Full Rollout</strong>
                  <p className="text-green-800 mt-1">Implement new SOP across all clients. Monitor KPIs and performance. Gather client feedback.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Month-End Process?</h2>
            <p className="text-lg mb-6 opacity-90">
              ReconcileBook helps bookkeeping firms standardize reconciliation across all clients. Achieve 90%+ accuracy in 30 minutes per account. Scale your practice without hiring additional staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  See Pricing Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How long does it take to implement this SOP?</h3>
              <p className="text-gray-700">
                Most firms implement the new SOP in 2-4 weeks. Week 1 is setup and training, week 2 is pilot testing, week 3 is team training, and week 4 is full rollout. The process scales easily once established.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What if my clients have different bank formats?</h3>
              <p className="text-gray-700">
                ReconcileBook automatically detects and maps columns from any bank's CSV format. We support 50+ bank formats out of the box, and our system learns new formats quickly. No manual configuration required.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I train junior staff on this process?</h3>
              <p className="text-gray-700">
                The SOP template includes step-by-step instructions that junior staff can follow independently. Most team members become proficient after 2-3 reconciliations. Senior bookkeepers review all work initially, then transition to spot-checking.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What if a client has complex transactions?</h3>
              <p className="text-gray-700">
                The SOP includes escalation procedures for complex transactions. If exceptions exceed 10% of transactions or involve amounts over $1,000, senior bookkeepers review and handle. The system flags these automatically.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I measure success with this SOP?</h3>
              <p className="text-gray-700">
                Track four key metrics: match rate (&gt;90%), time per account (&lt;60 minutes), exceptions per 100 transactions (&lt;10), and client satisfaction (&gt;95%). ReconcileBook provides built-in reporting for these KPIs.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Can this SOP work for different client types?</h3>
              <p className="text-gray-700">
                Yes, the SOP is designed to be flexible. For simple clients (100-200 transactions), follow the standard process. For complex clients (200-500 transactions), add additional review steps. For enterprise clients, include team collaboration features.
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
                "name": "How long does it take to implement this SOP?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most firms implement the new SOP in 2-4 weeks. Week 1 is setup and training, week 2 is pilot testing, week 3 is team training, and week 4 is full rollout. The process scales easily once established."
                }
              },
              {
                "@type": "Question",
                "name": "What if my clients have different bank formats?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ReconcileBook automatically detects and maps columns from any bank's CSV format. We support 50+ bank formats out of the box, and our system learns new formats quickly. No manual configuration required."
                }
              },
              {
                "@type": "Question",
                "name": "How do I train junior staff on this process?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The SOP template includes step-by-step instructions that junior staff can follow independently. Most team members become proficient after 2-3 reconciliations. Senior bookkeepers review all work initially, then transition to spot-checking."
                }
              },
              {
                "@type": "Question",
                "name": "What if a client has complex transactions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The SOP includes escalation procedures for complex transactions. If exceptions exceed 10% of transactions or involve amounts over $1,000, senior bookkeepers review and handle. The system flags these automatically."
                }
              },
              {
                "@type": "Question",
                "name": "How do I measure success with this SOP?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Track four key metrics: match rate (&gt;90%), time per account (&lt;60 minutes), exceptions per 100 transactions (&lt;10), and client satisfaction (&gt;95%). ReconcileBook provides built-in reporting for these KPIs."
                }
              },
              {
                "@type": "Question",
                "name": "Can this SOP work for different client types?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the SOP is designed to be flexible. For simple clients (100-200 transactions), follow the standard process. For complex clients (200-500 transactions), add additional review steps. For enterprise clients, include team collaboration features."
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
            "name": "Month-End Bank Reconciliation SOP for Bookkeeping Firms",
            "description": "Step-by-step guide to implement a standardized month-end reconciliation process for bookkeeping firms that scales across all clients.",
            "image": "https://www.reconcilebook.com/og-image.jpg",
            "totalTime": "PT4W",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "0"
            },
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "ReconcileBook account"
              },
              {
                "@type": "HowToSupply",
                "name": "Bank statements"
              },
              {
                "@type": "HowToSupply",
                "name": "QuickBooks data"
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
                "name": "Week 1: Setup & Training",
                "text": "Set up ReconcileBook accounts for all team members. Train senior bookkeepers on new process. Create client communication templates.",
                "url": "https://www.reconcilebook.com/features"
              },
              {
                "@type": "HowToStep",
                "name": "Week 2: Pilot Program",
                "text": "Test new SOP with 3-5 existing clients. Gather feedback and refine process. Document lessons learned.",
                "url": "https://www.reconcilebook.com/features"
              },
              {
                "@type": "HowToStep",
                "name": "Week 3: Team Training",
                "text": "Train all bookkeepers on new SOP. Practice with sample data. Establish quality control procedures.",
                "url": "https://www.reconcilebook.com/features"
              },
              {
                "@type": "HowToStep",
                "name": "Week 4: Full Rollout",
                "text": "Implement new SOP across all clients. Monitor KPIs and performance. Gather client feedback.",
                "url": "https://www.reconcilebook.com/features"
              }
            ]
          })
        }}
      />
    </div>
  )
} 