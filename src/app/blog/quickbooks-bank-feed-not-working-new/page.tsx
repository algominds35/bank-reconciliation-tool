import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle, Clock, TrendingUp, Calculator, RefreshCw, Zap, Target, XCircle, Users, Shield, Star, Wifi, Database } from 'lucide-react'

export default function QuickBooksBankFeedNotWorkingNewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/blog" className="inline-flex items-center text-green-100 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            QuickBooks Bank Feed Not Working? Here's Your Complete Fix Guide
          </h1>
          <p className="text-green-100 text-lg">
            Troubleshoot and resolve QuickBooks bank feed issues with our comprehensive step-by-step solutions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              QuickBooks bank feed issues can be incredibly frustrating, especially when you're trying to keep your books up-to-date. 
              Whether your bank feed has stopped syncing, shows errors, or won't connect at all, this comprehensive guide will help you 
              identify and resolve the most common QuickBooks bank feed problems. From connection issues to data synchronization errors, 
              we'll cover everything you need to know to get your bank feed working properly again.
            </p>

            {/* Quick Fix Alert */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-green-800 font-semibold">Quick Fix: Need Immediate Help?</h3>
                  <p className="text-green-700 mt-1">
                    Try ReconcileBook - our automated reconciliation tool that works even when bank feeds fail. 
                    <Link href="/" className="text-green-600 hover:text-green-800 font-medium ml-1">
                      Start your free trial →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Wifi className="w-6 h-6 mr-2 text-green-600" />
              Common QuickBooks Bank Feed Issues
            </h2>
            <p className="text-gray-600 mb-6">
              Bank feed problems can manifest in several ways. Understanding the specific issue you're experiencing 
              is the first step toward finding the right solution.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 p-4 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Connection Failures</h3>
                <p className="text-red-700 text-sm">
                  Bank feed won't connect or shows "connection error" messages.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <RefreshCw className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Sync Issues</h3>
                <p className="text-red-700 text-sm">
                  Transactions aren't downloading or updates are delayed.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <Database className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Data Errors</h3>
                <p className="text-red-700 text-sm">
                  Duplicate transactions or missing data in bank feed.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Authentication Problems</h3>
                <p className="text-red-700 text-sm">
                  Login credentials rejected or account access denied.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              Step-by-Step Troubleshooting Guide
            </h2>
            <div className="space-y-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Check Your Internet Connection</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-800 font-medium">Test your internet connection</p>
                      <p className="text-gray-600 text-sm">Ensure you have a stable internet connection before attempting to sync.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-800 font-medium">Try accessing your bank's website directly</p>
                      <p className="text-gray-600 text-sm">Verify that your bank's online banking is working properly.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-800 font-medium">Check for firewall or antivirus interference</p>
                      <p className="text-gray-600 text-sm">Temporarily disable security software to test if it's blocking the connection.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Verify QuickBooks Online Status</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-800 font-medium">Check QuickBooks service status</p>
                      <p className="text-gray-600 text-sm">Visit QuickBooks status page to see if there are any known issues.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-800 font-medium">Update QuickBooks to latest version</p>
                      <p className="text-gray-600 text-sm">Ensure you're running the most recent version of QuickBooks.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-800 font-medium">Clear browser cache and cookies</p>
                      <p className="text-gray-600 text-sm">If using QuickBooks Online, clear your browser's cache and cookies.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Reconnect Your Bank Account</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-800 font-medium">Remove the existing bank connection</p>
                      <p className="text-gray-600 text-sm">Go to Banking → Bank Accounts → Remove the problematic connection.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-800 font-medium">Add the bank account again</p>
                      <p className="text-gray-600 text-sm">Use the "Connect Account" feature to re-establish the connection.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-800 font-medium">Enter fresh login credentials</p>
                      <p className="text-gray-600 text-sm">Use your current bank login credentials, not saved ones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-600" />
              Advanced Troubleshooting Solutions
            </h2>
            <div className="space-y-4 mb-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Solution: Clear QuickBooks Cache</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  QuickBooks stores temporary data that can cause connection issues.
                </p>
                <div className="text-yellow-700 text-sm space-y-1">
                  <p><strong>For QuickBooks Desktop:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Close QuickBooks completely</li>
                    <li>Navigate to QuickBooks installation folder</li>
                    <li>Delete the "QBW" folder contents</li>
                    <li>Restart QuickBooks and try connecting again</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Solution: Update Bank Credentials</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  Banks often require password updates or multi-factor authentication.
                </p>
                <div className="text-yellow-700 text-sm space-y-1">
                  <p><strong>Steps to follow:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Log into your bank's website directly</li>
                    <li>Update your password if prompted</li>
                    <li>Enable any required security features</li>
                    <li>Try connecting to QuickBooks again</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Solution: Check Bank Feed Settings</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  Incorrect settings can prevent proper synchronization.
                </p>
                <div className="text-yellow-700 text-sm space-y-1">
                  <p><strong>Verify these settings:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Account number matches your bank records</li>
                    <li>Routing number is correct</li>
                    <li>Account type (checking/savings) is accurate</li>
                    <li>Date range for transaction download is appropriate</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-green-600" />
              Security and Authentication Issues
            </h2>
            <p className="text-gray-600 mb-4">
              Many bank feed problems stem from security requirements and authentication protocols:
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-Factor Authentication (MFA)</h3>
                  <p className="text-gray-600 text-sm">
                    Many banks now require MFA. You may need to generate app-specific passwords or use 
                    authentication apps for QuickBooks connections.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">IP Restrictions</h3>
                  <p className="text-gray-600 text-sm">
                    Some banks restrict access based on IP addresses. Contact your bank to whitelist 
                    QuickBooks' servers if needed.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Session Timeouts</h3>
                  <p className="text-gray-600 text-sm">
                    Bank sessions may expire. Try reconnecting during business hours when bank systems 
                    are most responsive.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-600" />
              When to Contact Support
            </h2>
            <p className="text-gray-600 mb-4">
              While most bank feed issues can be resolved with the steps above, some situations require 
              professional assistance:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 p-4 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Persistent Connection Errors</h3>
                <p className="text-red-700 text-sm">
                  If you've tried all troubleshooting steps and still can't connect after 24-48 hours.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Data Corruption Issues</h3>
                <p className="text-red-700 text-sm">
                  If you notice missing transactions or duplicate entries that can't be resolved.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <Database className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Account Access Problems</h3>
                <p className="text-red-700 text-sm">
                  If your bank account has been locked or requires special authentication procedures.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <Shield className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Security Concerns</h3>
                <p className="text-red-700 text-sm">
                  If you suspect unauthorized access or security breaches in your account.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Prevention Tips for Future Issues
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Regular Password Updates</h3>
                  <p className="text-gray-600 text-sm">
                    Keep your bank login credentials current and follow your bank's security recommendations.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Monitor Bank Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    Stay informed about your bank's system updates, maintenance windows, and security changes.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Backup Manual Reconciliation</h3>
                  <p className="text-gray-600 text-sm">
                    Have a manual reconciliation process ready as a backup when bank feeds fail.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Use Alternative Solutions</h3>
                  <p className="text-gray-600 text-sm">
                    Consider automated reconciliation tools like ReconcileBook that work independently of bank feeds.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-2 text-green-600" />
              Alternative Solutions When Bank Feeds Fail
            </h2>
            <p className="text-gray-600 mb-6">
              When QuickBooks bank feeds are consistently problematic, consider these alternative approaches:
            </p>
            <div className="space-y-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual CSV Import</h3>
                <p className="text-gray-600 mb-3">
                  Download transaction files directly from your bank's website and import them into QuickBooks manually.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Reliable and always available</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>No dependency on bank feeds</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Reconciliation Tools</h3>
                <p className="text-gray-600 mb-3">
                  Use specialized tools like ReconcileBook that can process bank statements and match them 
                  with your QuickBooks transactions automatically.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Works with any bank statement format</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Advanced matching algorithms</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Bank Feed Services</h3>
                <p className="text-gray-600 mb-3">
                  Consider services like Plaid or Yodlee that provide more reliable bank connections 
                  than direct QuickBooks integration.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Better success rates</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Wider bank compatibility</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Don't Let Bank Feed Issues Slow You Down</h2>
              <p className="text-green-100 mb-6">
                When QuickBooks bank feeds fail, ReconcileBook provides a reliable alternative that works 
                with any bank statement format. Get your reconciliation done quickly and accurately, 
                regardless of bank feed status.
              </p>
              <Link 
                href="/" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
              >
                Try ReconcileBook Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 