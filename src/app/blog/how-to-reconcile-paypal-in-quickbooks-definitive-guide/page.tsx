import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Zap,
  TrendingUp,
  Shield,
  Users,
  CreditCard
} from 'lucide-react'

export default function PayPalReconciliationQuickBooks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-500 text-white">
              E-commerce Reconciliation
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              How to Reconcile PayPal in QuickBooks: The Definitive Guide (2024)
            </h1>
            <p className="text-xl opacity-90 mb-8">
              PayPal reconciliation in QuickBooks is notoriously difficult for e-commerce businesses. Here's the definitive guide that makes it simple and accurate.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm opacity-80">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>18 min read</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>Updated January 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <div className="flex items-start">
              <CreditCard className="h-6 w-6 text-blue-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  PayPal Reconciliation is Complex for E-commerce
                </h3>
                <p className="text-blue-700">
                  PayPal transactions include fees, refunds, holds, and multiple payment types that make reconciliation challenging. This guide will simplify the process.
                </p>
              </div>
            </div>
          </div>

          <h2>Why PayPal Reconciliation is So Difficult</h2>
          
          <p>
            PayPal reconciliation is challenging because of several unique factors:
          </p>

          <ul>
            <li><strong>Multiple Transaction Types:</strong> Sales, refunds, fees, holds, transfers</li>
            <li><strong>Fee Deductions:</strong> PayPal takes fees from each transaction</li>
            <li><strong>Timing Differences:</strong> PayPal processes transactions differently than banks</li>
            <li><strong>Holds and Pending:</strong> Some transactions are held before clearing</li>
            <li><strong>Multiple Currencies:</strong> International transactions add complexity</li>
            <li><strong>Refund Processing:</strong> Refunds don't always match original transaction amounts</li>
          </ul>

          <h2>Understanding PayPal Transaction Types</h2>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">Income Transactions</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Payment Received:</strong> Customer payments</li>
                  <li>• <strong>Refund Received:</strong> Refunds from suppliers</li>
                  <li>• <strong>Transfer In:</strong> Money moved from bank to PayPal</li>
                  <li>• <strong>Fee Reversal:</strong> Reversed fees</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Expense Transactions</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Payment Sent:</strong> Payments to suppliers</li>
                  <li>• <strong>Refund Sent:</strong> Customer refunds</li>
                  <li>• <strong>Transfer Out:</strong> Money moved to bank</li>
                  <li>• <strong>Fees:</strong> PayPal transaction fees</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2>Step-by-Step PayPal Reconciliation Process</h2>

          <h3>Step 1: Download PayPal Transactions</h3>
          <p>
            Start by getting your PayPal data:
          </p>
          <ol>
            <li>Log into your PayPal account</li>
            <li>Go to Activity → Statements</li>
            <li>Select the date range you want to reconcile</li>
            <li>Download as CSV format</li>
            <li>Save the file with a clear name (e.g., "PayPal_January_2024.csv")</li>
          </ol>

          <h3>Step 2: Prepare QuickBooks for Reconciliation</h3>
          <p>
            Set up QuickBooks to handle PayPal transactions:
          </p>
          <ol>
            <li>Create a PayPal account in QuickBooks (if not already done)</li>
            <li>Go to Lists → Chart of Accounts</li>
            <li>Add new account: "PayPal Account" (Bank account type)</li>
            <li>Set up PayPal fees account: "PayPal Fees" (Expense account)</li>
          </ol>

          <h3>Step 3: Import PayPal Transactions</h3>
          <p>
            Import your PayPal data into QuickBooks:
          </p>
          <ol>
            <li>Go to Banking → Bank Feeds → Import Web Connect File</li>
            <li>Select your PayPal CSV file</li>
            <li>Map the columns correctly:
              <ul>
                <li>Date → Transaction Date</li>
                <li>Description → Memo</li>
                <li>Amount → Amount</li>
                <li>Type → Transaction Type</li>
              </ul>
            </li>
            <li>Review and accept the import</li>
          </ol>

          <h3>Step 4: Categorize PayPal Transactions</h3>
          <p>
            Proper categorization is crucial:
          </p>
          <ol>
            <li><strong>Sales Transactions:</strong> Categorize as Sales/Income</li>
            <li><strong>PayPal Fees:</strong> Categorize as PayPal Fees expense</li>
            <li><strong>Refunds:</strong> Categorize as Sales Returns or appropriate expense</li>
            <li><strong>Transfers:</strong> Categorize as transfers between accounts</li>
          </ol>

          <h3>Step 5: Handle PayPal Fees Separately</h3>
          <p>
            PayPal fees need special attention:
          </p>
          <ol>
            <li>Create separate transactions for fees</li>
            <li>Match fees to corresponding sales transactions</li>
            <li>Use a consistent fee account for tracking</li>
            <li>Consider creating a fee schedule for different transaction types</li>
          </ol>

          <h2>Advanced PayPal Reconciliation Strategies</h2>

          <h3>Strategy 1: Batch Processing</h3>
          <p>
            Process PayPal transactions in batches:
          </p>
          <ol>
            <li>Reconcile PayPal weekly or monthly</li>
            <li>Process all transactions for the period at once</li>
            <li>Create summary entries for fees</li>
            <li>Match refunds to original transactions</li>
          </ol>

          <h3>Strategy 2: Use PayPal Reports</h3>
          <p>
            Leverage PayPal's reporting features:
          </p>
          <ol>
            <li>Download PayPal Business Reports</li>
            <li>Use Settlement Reports for detailed fee breakdown</li>
            <li>Compare PayPal reports with QuickBooks</li>
            <li>Use reports to verify transaction accuracy</li>
          </ol>

          <h3>Strategy 3: Handle International Transactions</h3>
          <p>
            For international PayPal transactions:
          </p>
          <ol>
            <li>Note currency exchange rates</li>
            <li>Record exchange rate gains/losses</li>
            <li>Use separate accounts for different currencies</li>
            <li>Consider using PayPal's currency conversion features</li>
          </ol>

          <h2>Common PayPal Reconciliation Problems and Solutions</h2>

          <div className="space-y-6 my-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-600 mb-2">Problem 1: Fees Don't Match Sales</h4>
              <p className="text-gray-700 mb-3">PayPal fees don't correspond to individual sales transactions.</p>
              <p className="text-sm text-gray-600"><strong>Solution:</strong> Create summary fee entries or use PayPal's fee breakdown reports.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-600 mb-2">Problem 2: Refunds Don't Balance</h4>
              <p className="text-gray-700 mb-3">Refund amounts don't match original transaction amounts due to fees.</p>
              <p className="text-sm text-gray-600"><strong>Solution:</strong> Record refunds net of fees or create separate fee reversal entries.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-600 mb-2">Problem 3: Timing Differences</h4>
              <p className="text-gray-700 mb-3">PayPal transactions appear on different dates than bank deposits.</p>
              <p className="text-sm text-gray-600"><strong>Solution:</strong> Use PayPal transaction dates and reconcile transfers separately.</p>
            </div>
          </div>

          <h2>Best Practices for PayPal Reconciliation</h2>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Reconciliation Process</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Reconcile PayPal weekly</li>
                  <li>• Use consistent categorization</li>
                  <li>• Track fees separately</li>
                  <li>• Match refunds to sales</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Documentation</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Keep PayPal statements</li>
                  <li>• Document fee calculations</li>
                  <li>• Track exchange rates</li>
                  <li>• Maintain audit trail</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2>When PayPal Reconciliation Becomes Too Complex</h2>

          <p>
            For high-volume e-commerce businesses, PayPal reconciliation can become overwhelming:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              The ReconcileBook Solution
            </h3>
            <p className="text-blue-800 mb-4">
              ReconcileBook handles PayPal reconciliation automatically:
            </p>
            <ul className="text-blue-800 space-y-2 mb-6">
              <li>✅ <strong>PayPal Import:</strong> Direct CSV import with smart mapping</li>
              <li>✅ <strong>Fee Handling:</strong> Automatically separates and categorizes fees</li>
              <li>✅ <strong>Refund Matching:</strong> Smart matching of refunds to original transactions</li>
              <li>✅ <strong>Multi-Currency:</strong> Handles international transactions</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#demo" className="scroll-smooth">
                <Button variant="outline">
                  Watch Demo
                </Button>
              </a>
            </div>
          </div>

          <h2>PayPal Reconciliation Checklist</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-4">Monthly PayPal Reconciliation</h3>
            <ul className="space-y-2">
              <li>☐ Download PayPal CSV for the month</li>
              <li>☐ Import transactions into QuickBooks</li>
              <li>☐ Categorize all transactions properly</li>
              <li>☐ Match fees to corresponding sales</li>
              <li>☐ Handle refunds and returns</li>
              <li>☐ Reconcile PayPal account balance</li>
              <li>☐ Verify all transfers are recorded</li>
              <li>☐ Document any discrepancies</li>
            </ul>
          </div>

          <h2>Final Tips for Successful PayPal Reconciliation</h2>

          <ul>
            <li><strong>Be Consistent:</strong> Use the same process every month</li>
            <li><strong>Track Fees:</strong> Monitor PayPal fees as a business expense</li>
            <li><strong>Handle Refunds:</strong> Process refunds promptly and accurately</li>
            <li><strong>Use Reports:</strong> Leverage PayPal's reporting tools</li>
            <li><strong>Consider Automation:</strong> Use tools like ReconcileBook for efficiency</li>
          </ul>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-4">Need More Help?</h3>
            <p className="mb-4">
              If PayPal reconciliation is taking too much time, consider using ReconcileBook for automated, accurate reconciliation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:alex@usealgomind.com" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact Support →
              </a>
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                Try ReconcileBook Free →
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Tired of Complex PayPal Reconciliation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of e-commerce businesses using ReconcileBook for simple, accurate PayPal reconciliation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Read More Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 