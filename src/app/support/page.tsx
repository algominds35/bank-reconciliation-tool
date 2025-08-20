import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ReconcilePro
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/support" className="text-blue-600 font-medium">
                Support
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Need Help? We've Got You Covered
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant answers to common questions, troubleshoot issues, and connect with our support team.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 mb-4">Find answers to the most common questions about our platform.</p>
            <a href="#faq" className="text-blue-600 hover:text-blue-700 font-medium">
              Browse FAQ →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Step-by-step guides and tutorials for all features.</p>
            <a href="#documentation" className="text-green-600 hover:text-green-700 font-medium">
              View Docs →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">Get personalized help from our support team.</p>
            <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">
              Contact Us →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does the QuickBooks integration work?
              </h3>
              <p className="text-gray-600">
                Our platform uses OAuth 2.0 to securely connect to your QuickBooks account. Once connected, 
                we can automatically sync your bank transactions and invoices, allowing for instant reconciliation 
                and automated payment reminders.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my financial data safe?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use bank-level encryption and never store your actual bank credentials. 
                All data is transmitted securely via HTTPS, and we only access the data you explicitly 
                authorize through QuickBooks.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How accurate is the AI reconciliation?
              </h3>
              <p className="text-gray-600">
                Our AI achieves 95%+ accuracy in matching transactions. It learns from your patterns 
                and gets smarter over time. You can always manually adjust any matches, and the system 
                remembers your preferences for future reconciliations.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens if I have overdue invoices?
              </h3>
              <p className="text-gray-600">
                Our system automatically detects overdue invoices and sends professional payment reminders 
                at optimal intervals (Day 7, 14, and 21+). The tone escalates appropriately while 
                maintaining professional relationships with your clients.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I customize the email templates?
              </h3>
              <p className="text-gray-600">
                Yes! You can customize all email templates to match your brand voice and business 
                requirements. You can also set different reminder schedules and add your company 
                logo and contact information.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does it take to set up?
              </h3>
              <p className="text-gray-600">
                Setup takes less than 5 minutes. Simply connect your QuickBooks account, and our 
                system will automatically import your existing data. The AI reconciliation starts 
                working immediately, and you'll see results within minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div id="documentation" className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Started Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">QuickBooks Setup</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                <li>Click "Connect to QuickBooks" on your dashboard</li>
                <li>Sign in to your QuickBooks account</li>
                <li>Grant necessary permissions for bank feeds and invoices</li>
                <li>Select your company file</li>
                <li>Wait for initial data sync (usually 2-5 minutes)</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">First Reconciliation</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                <li>Review automatically matched transactions</li>
                <li>Manually match any unmatched items</li>
                <li>Verify all matches are correct</li>
                <li>Export reconciliation report</li>
                <li>Save your preferences for future reconciliations</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Issues & Solutions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-yellow-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                QuickBooks Connection Failed
              </h3>
              <p className="text-gray-600 mb-3">
                If you're having trouble connecting to QuickBooks:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Ensure you're using the correct QuickBooks account</li>
                <li>Check that your QuickBooks subscription is active</li>
                <li>Try disconnecting and reconnecting</li>
                <li>Clear your browser cache and cookies</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sync Not Working
              </h3>
              <p className="text-gray-600 mb-3">
                If data isn't syncing properly:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Verify your QuickBooks connection is still active</li>
                <li>Check if your access token has expired</li>
                <li>Ensure you have the necessary QuickBooks permissions</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Reminders Not Sending
              </h3>
              <p className="text-gray-600 mb-3">
                If automated reminders aren't working:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Check your SendGrid API key is configured</li>
                <li>Verify your sender email is verified</li>
                <li>Ensure you have overdue invoices in the system</li>
                <li>Check the email campaign status in your dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our support team is here to help you succeed with ReconcilePro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <a 
              href="mailto:support@reconcilepro.com" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
