'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

export default function QuickBooksVsReconcileBook() {
  const comparisons = [
    {
      painPoint: "Reconciling",
      quickbooks: "\"Difference\" errors & manual hunting",
      reconcilebook: "Auto-match & 1-click reconcile"
    },
    {
      painPoint: "CSV Imports",
      quickbooks: "Duplicates, missing rows",
      reconcilebook: "Clean imports, no duplicates"
    },
    {
      painPoint: "Reports",
      quickbooks: "Inaccurate due to missed transactions",
      reconcilebook: "Always accurate & audit-ready"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            QuickBooks vs{' '}
            <span className="text-[#F45B49]">ReconcileBook</span>
          </h2>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Pain Point</h3>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">QuickBooks</h3>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">ReconcileBook</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {comparisons.map((comparison, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="px-8 py-8 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-3 gap-8 items-center">
                  {/* Pain Point */}
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {comparison.painPoint}
                    </h4>
                  </div>

                  {/* QuickBooks */}
                  <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">
                        {comparison.quickbooks}
                      </p>
                    </div>
                  </div>

                  {/* ReconcileBook */}
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">
                        {comparison.reconcilebook}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
