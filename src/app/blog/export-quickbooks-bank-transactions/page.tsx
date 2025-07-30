'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ExportQuickBooksBankTransactions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">How to Export Bank Transactions from QuickBooks Desktop in 3 Steps</h1>
              <p className="text-gray-600 mt-2">Get your QuickBooks data ready for faster reconciliation with these simple steps</p>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Why Export from QuickBooks Desktop?</h3>
                <p className="text-green-800">
                  Exporting your bank transactions from QuickBooks Desktop allows you to use better reconciliation tools 
                  while keeping your existing accounting software. It's the best of both worlds.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Access Your Bank Account</h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-700">
              Start by opening QuickBooks Desktop and navigating to your bank account:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Open QuickBooks Desktop</li>
              <li>Go to <strong>Banking</strong> in the left sidebar</li>
              <li>Select your bank account from the dropdown</li>
              <li>Make sure you're in the <strong>For Review</strong> tab</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1 mr-3" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Pro Tip</h4>
                <p className="text-yellow-800">
                  Make sure your bank transactions are up to date before exporting. 
                  This ensures you're working with the most current data.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Export to CSV Format</h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-700">
              Once you're in your bank account, follow these steps to export:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Click <strong>Reports</strong> in the top menu</li>
              <li>Select <strong>Banking</strong> from the report categories</li>
              <li>Choose <strong>Reconciliation</strong> report</li>
              <li>Set your date range (usually the current month)</li>
              <li>Click <strong>Export</strong> → <strong>Export to CSV</strong></li>
              <li>Save the file with a clear name like "Bank_Transactions_January_2024.csv"</li>
            </ol>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                What's Included in the Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">✅ Included Data:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Transaction dates</li>
                    <li>• Descriptions</li>
                    <li>• Amounts (positive/negative)</li>
                    <li>• Account names</li>
                    <li>• Transaction types</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">❌ Not Included:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Categories (you'll add these later)</li>
                    <li>• Notes or memos</li>
                    <li>• Attachments</li>
                    <li>• Reconciliation status</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Prepare for Reconciliation</h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-700">
              Now that you have your CSV file, you can use it with better reconciliation tools:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Open your CSV file to verify the data looks correct</li>
              <li>Upload it to your preferred reconciliation tool</li>
              <li>Use the tool's smart matching features</li>
              <li>Export the reconciled data back to QuickBooks</li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-blue-500 mt-1 mr-3" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Why This Works Better</h4>
                <p className="text-blue-800">
                  By exporting from QuickBooks and using specialized reconciliation tools, you get the best of both worlds: 
                  your familiar accounting software plus superior reconciliation capabilities.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Issues and Solutions</h2>
          
          <div className="space-y-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Issue: CSV File Won't Open</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  <strong>Problem:</strong> The exported CSV file shows as corrupted or won't open properly.
                </p>
                <p className="text-gray-700">
                  <strong>Solution:</strong> Try opening the file in a text editor first to check the format. 
                  If it looks like plain text with commas, it's working correctly. Use Excel or Google Sheets to open it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Issue: Missing Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  <strong>Problem:</strong> Some transactions are missing from the export.
                </p>
                <p className="text-gray-700">
                  <strong>Solution:</strong> Check your date range in the report. Make sure you're exporting 
                  the correct time period and that all transactions are downloaded from your bank.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Issue: Wrong Date Format</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  <strong>Problem:</strong> Dates appear in the wrong format (MM/DD vs DD/MM).
                </p>
                <p className="text-gray-700">
                  <strong>Solution:</strong> Most reconciliation tools can handle different date formats. 
                  If needed, you can reformat dates in Excel before uploading.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps: Use ReconcileBook</h2>
          
          <p className="text-gray-700 mb-6">
            Now that you have your QuickBooks data exported, you can use ReconcileBook for faster, 
            more accurate reconciliation:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  What ReconcileBook Does
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Upload your QuickBooks CSV file</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Smart auto-matching with 90% accuracy</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>One-click accept/reject control</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Export back to QuickBooks format</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Professional PDF reports</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Download className="h-5 w-5 mr-2" />
                  Benefits You Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span>80% time savings vs manual reconciliation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span>No more fighting with QuickBooks auto-matching</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Complete control over every match</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Professional reports for clients</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Works with any accounting software</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Try ReconcileBook?</h3>
            <p className="text-gray-700 mb-6">
              Now that you know how to export from QuickBooks Desktop, try ReconcileBook with your own data. 
              See how much faster and more accurate reconciliation can be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial (14 Days)
                </Button>
              </a>
              <a href="https://youtu.be/_K9NET1njog" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo Video
                </Button>
              </a>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5 mr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2"></div>
              </div>
              <p className="text-gray-700">
                <strong>Exporting from QuickBooks Desktop is simple</strong> - just 3 steps to get your data ready
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5 mr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2"></div>
              </div>
              <p className="text-gray-700">
                <strong>CSV format works with all reconciliation tools</strong> - including ReconcileBook
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5 mr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2"></div>
              </div>
              <p className="text-gray-700">
                <strong>You can use better tools while keeping QuickBooks</strong> - best of both worlds
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5 mr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2"></div>
              </div>
              <p className="text-gray-700">
                <strong>Try ReconcileBook with your exported data</strong> - see the difference firsthand
              </p>
            </div>
          </div>

          <div className="border-t pt-8 mt-12">
            <p className="text-gray-600 text-sm">
              <strong>Published:</strong> January 16, 2024 | <strong>Author:</strong> Alex | <strong>Category:</strong> Tutorial
            </p>
          </div>
        </div>
      </article>
    </div>
  )
} 