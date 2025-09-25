'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock, Download, FileText, ArrowRight } from 'lucide-react';

interface CSVResult {
  sessionId: string;
  summary: {
    totalTransactions: number;
    duplicatesFound: number;
    unmatchedCount: number;
    timeSaved: number;
  };
  transactions: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
  }>;
  duplicates: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
  }>;
  unmatched: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
  }>;
}

interface ResultsPreviewProps {
  results: CSVResult;
  onSignup: () => void;
}

export default function ResultsPreview({ results, onSignup }: ResultsPreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportResults = (results: CSVResult) => {
    // Create CSV content for download
    const csvContent = [
      ['Transaction ID', 'Date', 'Amount', 'Description', 'Type', 'Status'],
      ...results.duplicates.map(dup => [
        dup.id,
        dup.date,
        dup.amount.toString(),
        dup.description,
        'Duplicate',
        'Needs Review'
      ]),
      ...results.unmatched.map(unm => [
        unm.id,
        unm.date,
        unm.amount.toString(),
        unm.description,
        'Unmatched',
        'Needs Review'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconciliation-preview-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Success Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Your Reconciliation Results
        </h3>
        <p className="text-slate-600">
          Analysis complete! Here's what we found in your data:
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-slate-900">
            {results.summary.totalTransactions.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Transactions Processed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-red-600">
            {results.summary.duplicatesFound}
          </div>
          <div className="text-sm text-red-600">Duplicates Found</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">
            {results.summary.unmatchedCount}
          </div>
          <div className="text-sm text-yellow-600">Need Review</div>
        </motion.div>

      </div>

      {/* Transactions Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-500" />
          <h4 className="font-semibold text-slate-900">
            Processed Transactions ({results.summary.totalTransactions})
          </h4>
        </div>
        
        <div className="space-y-3">
          {(results.transactions || []).slice(0, 8).map((transaction: any, index: number) => (
            <motion.div
              key={transaction.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">T</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {formatCurrency(transaction.amount || 0)}
                  </div>
                  <div className="text-sm text-slate-600 truncate max-w-xs">
                    {transaction.description || 'Unknown Transaction'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
              </div>
            </motion.div>
          ))}
          
          {(!results.transactions || results.transactions.length === 0) && (
            <div className="text-sm text-slate-500 text-center py-4">
              No transaction details available in preview
            </div>
          )}
          
          {results.summary.totalTransactions > 8 && (
            <div className="text-sm text-slate-500 text-center pt-2">
              +{results.summary.totalTransactions - 8} more transactions processed
            </div>
          )}
        </div>
      </motion.div>

      {/* Duplicates Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h4 className="font-semibold text-slate-900">
            Duplicates Detected ({results.duplicates.length})
          </h4>
        </div>
        
        <div className="space-y-3">
          {(results.duplicates || []).slice(0, 5).map((duplicate: any, index: number) => (
            <motion.div
              key={duplicate.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-red-600">D</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {formatCurrency(duplicate.amount || 0)}
                  </div>
                  <div className="text-sm text-slate-600 truncate max-w-xs">
                    {duplicate.description || 'Unknown Transaction'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {duplicate.date ? new Date(duplicate.date).toLocaleDateString() : 'N/A'}
              </div>
            </motion.div>
          ))}
          
          {(!results.duplicates || results.duplicates.length === 0) && (
            <div className="text-sm text-green-600 text-center py-4">
              ✅ No duplicates found - your data looks clean!
            </div>
          )}
          
          {results.duplicates.length > 5 && (
            <div className="text-sm text-slate-500 text-center pt-2">
              +{results.duplicates.length - 5} more duplicates found
            </div>
          )}
        </div>
      </motion.div>

      {/* Conversion CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-[#F45B49] to-[#E24C3A] rounded-xl p-6 text-white text-center"
      >
        <h4 className="text-xl font-bold mb-2">
          Ready to get the full reconciliation experience?
        </h4>
        <p className="text-red-100 mb-6">
          Start your free trial to export professional reports, save your work, and process unlimited CSV files.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Export Excel reports</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Save work permanently</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Upload multiple files</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/#pricing'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#F45B49] font-semibold rounded-full hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText className="h-4 w-4" />
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => exportResults(results)}
            className="inline-flex items-center gap-2 px-6 py-4 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <Download className="h-4 w-4" />
            Download Preview
          </button>
        </div>
        
      </motion.div>

    </motion.div>
  );
}
