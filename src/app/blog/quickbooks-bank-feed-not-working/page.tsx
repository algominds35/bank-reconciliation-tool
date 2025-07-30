import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react'

export default function QuickBooksBankFeedNotWorking() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-blue-100 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            QuickBooks Bank Feed Not Working? 5 Fast Fixes
          </h1>
          <p className="text-xl text-blue-100">
            Tired of QuickBooks bank feeds failing? Here's how to fix them fast and get back to reconciling.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            QuickBooks bank feeds are supposed to make reconciliation easier, but when they stop working, 
            they can bring your entire bookkeeping process to a halt. If you're dealing with failed bank 
            feeds, connection errors, or missing transactions, you're not alone.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Quick Fix:</strong> If your bank feed is completely broken, export your transactions 
                  as CSV and use ReconcileBook for faster, more reliable reconciliation.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why QuickBooks Bank Feeds Fail
          </h2>

          <p className="text-gray-600 mb-6">
            Bank feeds can fail for several reasons, from technical issues to security updates. 
            Understanding the root cause helps you fix them faster.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            1. Bank Security Updates
          </h3>
          <p className="text-gray-600 mb-6">
            Banks frequently update their security protocols, which can break existing connections. 
            This is the most common cause of bank feed failures.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            2. QuickBooks Server Issues
          </h3>
          <p className="text-gray-600 mb-6">
            QuickBooks servers can experience downtime or maintenance, preventing bank feeds from syncing.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            3. Expired Credentials
          </h3>
          <p className="text-gray-600 mb-6">
            Bank login credentials can expire, requiring re-authentication to restore the connection.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            5 Fast Fixes for QuickBooks Bank Feeds
          </h2>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Fix #1: Re-authenticate Your Bank Connection
              </h4>
              <p className="text-gray-600 mb-4">
                Go to Banking → Bank Feeds → Set Up Bank Feeds and re-enter your bank credentials. 
                This resolves most authentication issues.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 5 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Fix #2: Clear QuickBooks Cache
              </h4>
              <p className="text-gray-600 mb-4">
                Close QuickBooks, clear your browser cache, and restart. This fixes many sync issues.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 3 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Fix #3: Check Bank Website Status
              </h4>
              <p className="text-gray-600 mb-4">
                Visit your bank's website to ensure they're not experiencing technical issues that 
                could affect the connection.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 2 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Fix #4: Update QuickBooks
              </h4>
              <p className="text-gray-600 mb-4">
                Ensure you're running the latest version of QuickBooks, as updates often include 
                bank feed fixes.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 10 minutes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Fix #5: Contact Your Bank
              </h4>
              <p className="text-gray-600 mb-4">
                If all else fails, contact your bank to ensure they support QuickBooks integration 
                and haven't changed their connection requirements.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 15-30 minutes</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            When Bank Feeds Keep Failing: The Alternative
          </h2>

          <p className="text-gray-600 mb-6">
            If you're constantly dealing with bank feed issues, consider a more reliable approach:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Export & Reconcile Method
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                Export transactions directly from your bank's website
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                Import into ReconcileBook for smart auto-matching
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                Get 90%+ accuracy without relying on bank feeds
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                Export results back to QuickBooks
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Prevention Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Regular Maintenance</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Re-authenticate connections monthly</li>
                <li>• Keep QuickBooks updated</li>
                <li>• Monitor bank feed status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Backup Plan</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Export transactions manually</li>
                <li>• Use alternative reconciliation tools</li>
                <li>• Keep bank statements handy</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Time Savings Comparison
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">QuickBooks Bank Feeds</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 2-4 hours troubleshooting</li>
                  <li>• Manual corrections needed</li>
                  <li>• Frequent disconnections</li>
                  <li>• Limited control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">ReconcileBook Method</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 30 minutes total</li>
                  <li>• 90%+ auto-matching</li>
                  <li>• No connection issues</li>
                  <li>• Full control</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Conclusion
          </h2>

          <p className="text-gray-600 mb-6">
            QuickBooks bank feed issues are frustrating but fixable. Try the solutions above in order, 
            and if problems persist, consider switching to a more reliable reconciliation method.
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">
              Ready for Reliable Reconciliation?
            </h3>
            <p className="mb-4">
              Stop fighting with bank feeds. Get started with ReconcileBook today and experience 
              faster, more accurate reconciliation.
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