import { Metadata } from 'next'
import TransactionViewer from '@/components/TransactionViewer'

export const metadata: Metadata = {
  title: 'Bank Transactions - ReconcileBook Pro',
  description: 'View and manage your synced bank transactions. No more CSV uploads needed.',
}

export default function BankTransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bank Transactions
          </h1>
          <p className="text-lg text-gray-600">
            View and manage all your synced bank transactions in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Transaction Viewer */}
          <TransactionViewer />

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium text-gray-900">Reconcile with QuickBooks</div>
                <div className="text-sm text-gray-600">Match transactions automatically</div>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium text-gray-900">Generate Reports</div>
                <div className="text-sm text-gray-600">Create reconciliation reports</div>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium text-gray-900">Export Data</div>
                <div className="text-sm text-gray-600">Download as CSV or Excel</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
