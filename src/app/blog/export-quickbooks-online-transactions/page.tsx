import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export default function ExportQuickBooksOnlineTransactions() {
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
            How to Export Transactions from QuickBooks Online
          </h1>
          <p className="text-xl text-blue-100">
            Step-by-step guide to export your QuickBooks Online transactions for reconciliation.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Need to export transactions from QuickBooks Online for reconciliation? Whether you're 
            dealing with bank feed issues or want to use external reconciliation tools, this guide 
            shows you exactly how to export your data.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <FileText className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Pro Tip:</strong> Export transactions regularly to avoid data loss and 
                  enable faster reconciliation with tools like ReconcileBook.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Export QuickBooks Online Transactions?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Bank Feed Issues</h3>
              <p className="text-gray-600">
                When bank feeds fail, manual export is your backup plan for reconciliation.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">External Tools</h3>
              <p className="text-gray-600">
                Use specialized reconciliation tools for better accuracy and speed.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Data Backup</h3>
              <p className="text-gray-600">
                Keep local copies of your transaction data for security and compliance.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Audit Preparation</h3>
              <p className="text-gray-600">
                Export data for external audits or accountant reviews.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Method 1: Export Bank Transactions
          </h2>

          <div className="space-y-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 1: Navigate to Banking
              </h3>
              <p className="text-gray-600 mb-4">
                Log into QuickBooks Online and go to the Banking section in the left sidebar.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 1 minute</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 2: Select Your Bank Account
              </h3>
              <p className="text-gray-600 mb-4">
                Click on the bank account you want to export transactions from.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 1 minute</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 3: Set Date Range
              </h3>
              <p className="text-gray-600 mb-4">
                Use the date filter to select the period you want to export (e.g., last month, 
                this quarter, custom range).
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 1 minute</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 4: Export to CSV
              </h3>
              <p className="text-gray-600 mb-4">
                Look for the "Export" or "Download" button (usually in the top right). 
                Select CSV format and download the file.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Time: 2 minutes</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Method 2: Export All Transactions
          </h2>

          <div className="space-y-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 1: Go to Reports
              </h3>
              <p className="text-gray-600 mb-4">
                Navigate to Reports in the left sidebar of QuickBooks Online.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 2: Run Transaction Report
              </h3>
              <p className="text-gray-600 mb-4">
                Search for "Transaction List" or "General Ledger" report and run it for your desired period.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step 3: Export Report
              </h3>
              <p className="text-gray-600 mb-4">
                Click the "Export" button and select Excel or CSV format. This gives you all transactions 
                with more detailed information.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What Data Gets Exported?
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Standard Export Fields:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Transaction Date
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Description/Memo
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Amount
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Transaction Type
                </li>
              </ul>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Account Name
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Category/Class
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Reference Number
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  Balance
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Using Exported Data with ReconcileBook
          </h2>

          <p className="text-gray-600 mb-6">
            Once you have your QuickBooks Online transactions exported, you can use them with 
            ReconcileBook for faster, more accurate reconciliation:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Your Exports</h4>
                <p className="text-gray-600">
                  Upload both your bank statement CSV and QuickBooks transaction export to ReconcileBook.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Run Auto-Matching</h4>
                <p className="text-gray-600">
                  Let ReconcileBook's smart algorithm match transactions with 90%+ accuracy.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Review & Accept</h4>
                <p className="text-gray-600">
                  Review suggested matches and accept or reject them with one click.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Export Results</h4>
                <p className="text-gray-600">
                  Export the reconciled data back to QuickBooks or as a PDF report.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Common Export Issues & Solutions
          </h2>

          <div className="space-y-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Issue: Export Button Missing</h4>
              <p className="text-gray-600">
                <strong>Solution:</strong> Make sure you're in the correct view (Banking vs. Reports) 
                and that you have the necessary permissions in your QuickBooks account.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Issue: Incomplete Data</h4>
              <p className="text-gray-600">
                <strong>Solution:</strong> Check your date range and ensure you're exporting from 
                the correct account. Try using the Reports method for more complete data.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Issue: Wrong Format</h4>
              <p className="text-gray-600">
                <strong>Solution:</strong> Most reconciliation tools prefer CSV format. If Excel is 
                the only option, you can convert it to CSV in Excel.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Best Practices
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Regular Exports</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Export monthly for backup</li>
                <li>• Keep organized file names</li>
                <li>• Store in secure location</li>
                <li>• Include date in filename</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Quality</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Verify export completeness</li>
                <li>• Check for missing transactions</li>
                <li>• Validate date ranges</li>
                <li>• Test with small datasets first</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              Time Savings with ReconcileBook
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Manual QuickBooks Export</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 15-30 minutes per export</li>
                  <li>• Manual data cleaning</li>
                  <li>• Format conversion needed</li>
                  <li>• Limited matching options</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">ReconcileBook Workflow</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 5 minutes upload</li>
                  <li>• Automatic data processing</li>
                  <li>• Smart auto-matching</li>
                  <li>• One-click reconciliation</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Conclusion
          </h2>

          <p className="text-gray-600 mb-6">
            Exporting transactions from QuickBooks Online is straightforward once you know the process. 
            Whether you're dealing with bank feed issues or want to use specialized reconciliation tools, 
            this method gives you full control over your data.
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">
              Ready to Reconcile Faster?
            </h3>
            <p className="mb-4">
              Export your QuickBooks data and try ReconcileBook's smart auto-matching today.
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