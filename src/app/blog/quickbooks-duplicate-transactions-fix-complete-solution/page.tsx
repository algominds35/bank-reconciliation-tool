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
  Copy
} from 'lucide-react'

export default function QuickBooksDuplicateTransactionsFix() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-500 text-white">
              QuickBooks Duplicate Fix
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              QuickBooks Duplicate Transactions Fix: Complete Step-by-Step Solution (2024)
            </h1>
            <p className="text-xl opacity-90 mb-8">
              QuickBooks creating duplicate transactions is a nightmare that wastes hours. Here's the complete step-by-step solution that prevents and fixes duplicate transactions.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm opacity-80">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>16 min read</span>
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
          <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-8">
            <div className="flex items-start">
              <Copy className="h-6 w-6 text-purple-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Duplicate Transactions Are a Common Nightmare
                </h3>
                <p className="text-purple-700">
                  QuickBooks duplicate transactions can ruin your books and waste hours of cleanup time. This guide will help you prevent, identify, and fix duplicates quickly.
                </p>
              </div>
            </div>
          </div>

          <h2>Why QuickBooks Creates Duplicate Transactions</h2>
          
          <p>
            Understanding why duplicates happen helps prevent them:
          </p>

          <ul>
            <li><strong>Bank Feed Issues:</strong> Multiple downloads of the same transaction</li>
            <li><strong>Manual Entry Errors:</strong> Entering the same transaction twice</li>
            <li><strong>Import Problems:</strong> CSV imports creating duplicates</li>
            <li><strong>Sync Issues:</strong> Problems with bank synchronization</li>
            <li><strong>User Errors:</strong> Accidentally entering transactions multiple times</li>
          </ul>

          <h2>How to Identify Duplicate Transactions</h2>

          <h3>Method 1: Use QuickBooks Duplicate Detection</h3>
          <p>
            QuickBooks has built-in duplicate detection:
          </p>
          <ol>
            <li>Go to Banking → Bank Feeds → Bank Feeds Center</li>
            <li>Look for transactions marked as "Possible Duplicate"</li>
            <li>Review each flagged transaction</li>
            <li>Decide whether to accept or reject</li>
          </ol>

          <h3>Method 2: Manual Search for Duplicates</h3>
          <p>
            Search for potential duplicates manually:
          </p>
          <ol>
            <li>Go to Find → Advanced Find</li>
            <li>Search by amount and date range</li>
            <li>Look for transactions with same amount and similar dates</li>
            <li>Compare descriptions and payees</li>
          </ol>

          <h3>Method 3: Use Reports to Find Duplicates</h3>
          <p>
            Generate reports to identify duplicates:
          </p>
          <ol>
            <li>Go to Reports → Banking → Reconciliation Discrepancy</li>
            <li>Look for unusual patterns</li>
            <li>Check for transactions with same amounts</li>
            <li>Review transaction dates and descriptions</li>
          </ol>

          <h2>Step-by-Step Fix for Duplicate Transactions</h2>

          <h3>Step 1: Stop the Source</h3>
          <p>
            First, prevent more duplicates:
          </p>
          <ol>
            <li>Check your bank feeds for connection issues</li>
            <li>Review recent manual entries</li>
            <li>Verify CSV imports haven't been run multiple times</li>
            <li>Check for sync problems with bank accounts</li>
          </ol>

          <h3>Step 2: Identify All Duplicates</h3>
          <p>
            Find all duplicate transactions:
          </p>
          <ol>
            <li>Use the duplicate detection methods above</li>
            <li>Create a list of all duplicates found</li>
            <li>Note the original and duplicate transactions</li>
            <li>Check if duplicates are reconciled</li>
          </ol>

          <h3>Step 3: Fix Duplicates (If Not Reconciled)</h3>
          <p>
            For unreconciled duplicates:
          </p>
          <ol>
            <li>Go to Banking → Bank Feeds → Bank Feeds Center</li>
            <li>Find the duplicate transaction</li>
            <li>Click "Exclude" to remove it from bank feeds</li>
            <li>Or delete the duplicate if it's a manual entry</li>
          </ol>

          <h3>Step 4: Fix Duplicates (If Reconciled)</h3>
          <p>
            For reconciled duplicates, you need to be more careful:
          </p>
          <ol>
            <li>First, unreconcile the month containing duplicates</li>
            <li>Go to Banking → Reconcile</li>
            <li>Click "Undo Last Reconciliation"</li>
            <li>Remove the duplicate transactions</li>
            <li>Reconcile again</li>
          </ol>

          <h2>Preventing Future Duplicate Transactions</h2>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Bank Feed Best Practices</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Download transactions once daily</li>
                  <li>• Review before accepting</li>
                  <li>• Check for "Possible Duplicate" flags</li>
                  <li>• Monitor bank feed status</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Manual Entry Tips</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Use search before entering new transactions</li>
                  <li>• Check for existing entries</li>
                  <li>• Use consistent naming conventions</li>
                  <li>• Review entries before saving</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2>Advanced Duplicate Detection Methods</h2>

          <h3>Method 1: Use Excel for Analysis</h3>
          <p>
            Export transactions and analyze in Excel:
          </p>
          <ol>
            <li>Go to Reports → Banking → Reconciliation Discrepancy</li>
            <li>Export to Excel</li>
            <li>Sort by amount and date</li>
            <li>Look for identical amounts on same/similar dates</li>
            <li>Compare descriptions for similarities</li>
          </ol>

          <h3>Method 2: Use QuickBooks Audit Trail</h3>
          <p>
            Check the audit trail for duplicate entries:
          </p>
          <ol>
            <li>Go to Reports → Accountant & Taxes → Audit Trail</li>
            <li>Filter by date range</li>
            <li>Look for multiple entries of same transaction</li>
            <li>Note who created the entries</li>
          </ol>

          <h3>Method 3: Third-Party Duplicate Detection</h3>
          <p>
            Consider using specialized tools:
          </p>
          <ol>
            <li>Use QuickBooks add-ons for duplicate detection</li>
            <li>Export data and use Excel formulas</li>
            <li>Use reconciliation software like ReconcileBook</li>
          </ol>

          <h2>Common Duplicate Scenarios and Solutions</h2>

          <div className="space-y-6 my-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-600 mb-2">Scenario 1: Bank Feed Duplicates</h4>
              <p className="text-gray-700 mb-3">Same transaction downloaded multiple times from bank feed.</p>
              <p className="text-sm text-gray-600"><strong>Solution:</strong> Exclude duplicates in bank feeds center.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-600 mb-2">Scenario 2: Manual Entry Duplicates</h4>
              <p className="text-gray-700 mb-3">Transaction entered manually and also imported from bank.</p>
              <p className="text-sm text-gray-600"><strong>Solution:</strong> Delete manual entry, keep bank import.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-600 mb-2">Scenario 3: CSV Import Duplicates</h4>
              <p className="text-gray-700 mb-3">Same CSV file imported multiple times.</p>
              <p className="text-sm text-gray-600"><strong>Solution:</strong> Delete duplicate imports, keep original.</p>
            </div>
          </div>

          <h2>When QuickBooks Duplicate Detection Fails</h2>

          <p>
            Sometimes QuickBooks doesn't catch duplicates, or you need a more reliable solution:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              The ReconcileBook Solution
            </h3>
            <p className="text-blue-800 mb-4">
              ReconcileBook prevents duplicates automatically and makes cleanup easy:
            </p>
            <ul className="text-blue-800 space-y-2 mb-6">
              <li>✅ <strong>Duplicate Prevention:</strong> Automatically detects and prevents duplicates</li>
              <li>✅ <strong>Smart Import:</strong> Handles CSV imports without creating duplicates</li>
              <li>✅ <strong>Easy Cleanup:</strong> Simple interface to remove duplicates</li>
              <li>✅ <strong>Audit Trail:</strong> Track all changes and imports</li>
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

          <h2>Prevention Checklist</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-4">Daily Prevention Tasks</h3>
            <ul className="space-y-2">
              <li>☐ Check bank feeds for "Possible Duplicate" flags</li>
              <li>☐ Review new transactions before accepting</li>
              <li>☐ Search for existing transactions before manual entry</li>
              <li>☐ Monitor bank feed connection status</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-4 mt-6">Weekly Prevention Tasks</h3>
            <ul className="space-y-2">
              <li>☐ Run duplicate detection reports</li>
              <li>☐ Review audit trail for unusual patterns</li>
              <li>☐ Check reconciliation discrepancies</li>
              <li>☐ Backup QuickBooks data</li>
            </ul>
          </div>

          <h2>Final Thoughts</h2>

          <p>
            Duplicate transactions are frustrating but preventable. The key is to:
          </p>

          <ul>
            <li>Implement systematic duplicate detection</li>
            <li>Use QuickBooks features properly</li>
            <li>Review transactions regularly</li>
            <li>Consider better tools when QuickBooks fails</li>
          </ul>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-4">Need More Help?</h3>
            <p className="mb-4">
              If you're still struggling with duplicate transactions, consider using ReconcileBook for a more reliable and duplicate-free reconciliation experience.
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Tired of QuickBooks Duplicate Transactions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who've switched to ReconcileBook for duplicate-free reconciliation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Read More Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 