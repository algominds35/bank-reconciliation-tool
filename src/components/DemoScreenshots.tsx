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
            <div className="relative">
              {/* Browser Window Header */}
              <div className="flex items-center justify-between p-3 bg-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-slate-500">ReconcileBook Pro Dashboard</div>
              </div>
              
              {/* Dashboard Screenshot */}
              <img 
                src="/images/dashboard-screenshot.png" 
                alt="ReconcileBook Pro Dashboard - Client Management"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Right Screenshot - Auto-Match Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            <div className="relative">
              {/* Browser Window Header */}
              <div className="flex items-center justify-between p-3 bg-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-slate-500">AI Auto-Match Engine</div>
              </div>
              
              {/* Auto-Match Screenshot */}
              <img 
                src="/images/smart-matching-screenshot - Copy.png" 
                alt="AI Auto-Match Engine - Transaction Matching"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
