import { Metadata } from 'next'
import BankConnection from '@/components/BankConnection'

export const metadata: Metadata = {
  title: 'Bank Connections - ReconcileBook Pro',
  description: 'Connect your bank accounts to automatically sync transactions. No more CSV uploads needed.',
}

export default function BankConnectionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bank Connections
          </h1>
          <p className="text-lg text-gray-600">
            Connect your bank accounts to automatically sync transactions and eliminate manual CSV uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bank Connection Component */}
          <div className="lg:col-span-2">
            <BankConnection />
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            {/* Why Connect Banks */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Connect Your Bank?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">No CSV Uploads</h4>
                    <p className="text-sm text-gray-600">Eliminate manual file uploads and formatting issues</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Real-time Sync</h4>
                    <p className="text-sm text-gray-600">Always up-to-date transaction data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-purple-100 rounded">
                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Bank-level Security</h4>
                    <p className="text-sm text-gray-600">Same security as your online banking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-orange-100 rounded">
                    <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Complete Data</h4>
                    <p className="text-sm text-gray-600">All transactions, no missing data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Banks */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Supported Banks
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>• Chase</div>
                <div>• Bank of America</div>
                <div>• Wells Fargo</div>
                <div>• Citibank</div>
                <div>• Capital One</div>
                <div>• PNC Bank</div>
                <div>• US Bank</div>
                <div>• And 11,000+ more</div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Your Data is Secure
              </h3>
              <p className="text-sm text-blue-800">
                We use bank-level security with read-only access. We can't move or withdraw money from your accounts. 
                You can disconnect your accounts anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
