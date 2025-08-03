import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle, Clock, TrendingUp, Calculator, RefreshCw } from 'lucide-react'

export default function QuickBooksReconciliationNotBalancing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-red-100 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            QuickBooks Reconciliation Not Balancing? Here's the Fix
          </h1>
          <p className="text-xl text-red-100">
            Your reconciliation won't balance and you're stuck? This step-by-step guide will get your accounts reconciled fast.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Nothing is more frustrating than spending hours on reconciliation only to find your QuickBooks 
            accounts won't balance. Whether you're off by a few cents or hundreds of dollars, this guide 
            will help you identify and fix the most common causes of reconciliation imbalances.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <p className="text-sm text-red-800">
                  <strong>Quick Fix:</strong> If you're consistently struggling with reconciliation balancing, 
                  try ReconcileBook's smart auto-matching technology that catches 90%+ of common errors automatically.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why QuickBooks Reconciliation Won't Balance
          </h2>

          <p className="text-gray-600 mb-6">
            Reconciliation imbalances typically stem from a few common issues. Understanding these causes 
            helps you fix them faster and prevent future problems.
          </p>

          <div className="space-y-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                1. Duplicate Transactions
              </h3>
              <p className="text-gray-600 mb-4">
                The most common cause of reconciliation imbalances. QuickBooks often imports the same 
                transaction multiple times, especially when bank feeds are involved.
              </p>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Sign:</strong> Your difference equals exactly one transaction amount
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-green-600" />
                2. Wrong Transaction Dates
              </h3>
              <p className="text-gray-600 mb-4">
                Transactions posted to the wrong period can cause reconciliation to fail, especially 
                around month-end or year-end.
              </p>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Sign:</strong> Large discrepancies at period boundaries
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Bank Feed Timing Issues
              </h3>
              <p className="text-gray-600 mb-4">
                Bank feeds can import transactions before they clear, causing temporary imbalances 
                until the transaction officially posts.
              </p>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Sign:</strong> Pending transactions showing as cleared
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4. Manual Entry Errors
              </h3>
              <p className="text-gray-600 mb-4">
                Simple typos in amounts, transposed numbers, or wrong account assignments can 
                throw off your entire reconciliation.
              </p>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Sign:</strong> Differences that don't match any transaction amounts
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Step-by-Step Fix for Reconciliation Imbalances
          </h2>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Step 1: Check for Duplicates
              </h4>
              <p className="text-gray-600 mb-4">
                Go to Banking → Bank Feeds → Downloaded Transactions. Look for identical transactions 
                and delete duplicates. This fixes 60% of reconciliation issues.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 10-15 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Step 2: Verify Transaction Dates
              </h4>
              <p className="text-gray-600 mb-4">
                Review all transactions in your reconciliation period. Ensure they're posted to the 
                correct month and year.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 15-20 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Step 3: Check for Pending Transactions
              </h4>
              <p className="text-gray-600 mb-4">
                Look for transactions marked as "pending" that shouldn't be included in your 
                reconciliation. Uncheck them if they haven't cleared.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 5-10 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Step 4: Verify Bank Statement Balance
              </h4>
              <p className="text-gray-600 mb-4">
                Double-check your bank statement ending balance. Make sure you're using the correct 
                date and amount from your bank.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 5 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Step 5: Check for Manual Adjustments
              </h4>
              <p className="text-gray-600 mb-4">
                Look for any manual journal entries or adjustments that might be affecting your 
                account balance.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 10 minutes</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Advanced Troubleshooting Techniques
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              The "Divide by 9" Rule
            </h3>
            <p className="text-blue-800 mb-3">
              If your difference is divisible by 9, you likely have a transposed number error. 
              For example, if you're off by $63, check for transactions where you might have entered 
              $36 instead of $63.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-sm text-blue-700">
                <strong>Example:</strong> Difference of $27 = 2+7=9 ✓ | Difference of $45 = 4+5=9 ✓
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              The "Double-Check" Method
            </h3>
            <p className="text-green-800 mb-3">
              Add up your bank statement transactions manually and compare to QuickBooks. This 
              often reveals the source of the discrepancy.
            </p>
            <ul className="text-green-700 space-y-1">
              <li>• Use a calculator or spreadsheet</li>
              <li>• Check each transaction individually</li>
              <li>• Look for missing or extra transactions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Prevention Strategies
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Daily Habits</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Reconcile weekly, not monthly
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Check bank feeds daily
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Review downloaded transactions
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Keep bank statements handy
                </li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Monthly Checks</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Run reconciliation reports
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Review account registers
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Check for uncleared transactions
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Verify bank statement accuracy
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Time Savings Comparison
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Manual Troubleshooting</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 2-4 hours per reconciliation</li>
                  <li>• High error rate</li>
                  <li>• Frequent rework needed</li>
                  <li>• Stressful process</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">ReconcileBook Auto-Matching</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 30 minutes per reconciliation</li>
                  <li>• 90%+ accuracy rate</li>
                  <li>• Automatic error detection</li>
                  <li>• Stress-free process</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            When to Seek Professional Help
          </h2>

          <p className="text-gray-600 mb-6">
            If you've tried all the steps above and your reconciliation still won't balance, it might 
            be time to consider professional help or alternative solutions:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Large discrepancies ($1,000+)</p>
                <p className="text-gray-600 text-sm">May indicate serious accounting errors</p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Persistent monthly imbalances</p>
                <p className="text-gray-600 text-sm">Could indicate systematic issues</p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Multiple account problems</p>
                <p className="text-gray-600 text-sm">May require professional review</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Conclusion
          </h2>

          <p className="text-gray-600 mb-6">
            QuickBooks reconciliation imbalances are frustrating but usually fixable with systematic 
            troubleshooting. Start with the most common causes and work through the steps methodically. 
            If problems persist, consider using automated reconciliation tools that can catch errors 
            before they become major issues.
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">
              Stop Struggling with Reconciliation
            </h3>
            <p className="mb-4">
              Get ReconcileBook's smart auto-matching technology and never worry about reconciliation 
              imbalances again. Start your free trial today.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <TrendingUp className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 