'use client';

import { motion } from 'framer-motion';

export default function DemoScreenshots() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Live Demo & Screenshots
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            See ReconcileBook Pro in action. Watch our AI-powered reconciliation transform your bookkeeping workflow.
          </motion.p>
        </div>

        {/* Dual Screenshots Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Screenshot - Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-slate-500">ReconcileBook Pro Dashboard</div>
              </div>
              
              {/* Dashboard Content */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">12</div>
                    <div className="text-sm text-slate-500">Total Clients</div>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-slate-500">Active</div>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-sm text-slate-500">Pending</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-2">Recent Activity</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">John's Bakery LLC</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">TechStart Ventures</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Screenshot - Auto-Match Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-slate-500">AI Auto-Match Engine</div>
              </div>
              
              {/* Auto-Match Content */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-3">Transaction Matching</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-slate-600">Starbucks Coffee</span>
                      <span className="text-sm font-medium text-green-600">✓ Matched</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-slate-600">Office Supplies Co</span>
                      <span className="text-sm font-medium text-green-600">✓ Matched</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm text-slate-600">Unknown Transaction</span>
                      <span className="text-sm font-medium text-yellow-600">Review Needed</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Match Rate</span>
                    <span className="text-lg font-bold text-green-600">94%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
