'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Star, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:pr-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F45B49]/10 border border-[#F45B49]/20 rounded-full text-sm font-medium text-[#F45B49] mb-6"
            >
              <TrendingUp className="h-4 w-4" />
              Revolutionize Your Workflow Now
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              AI-Powered{' '}
              <span className="text-[#F45B49]">Bank Reconciliation</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Stop wasting hours on manual reconciliation. Our AI matches transactions instantly, 
              generates professional reports, and handles your entire bookkeeping workflow automatically.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#F45B49] text-white font-semibold rounded-full hover:bg-[#E24C3A] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Free Trial
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 text-slate-700 font-semibold rounded-full border border-slate-300 hover:border-slate-400 transition-all duration-200 group"
              >
                <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Watch Demo
              </Link>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                <span className="font-semibold text-slate-900">4.9/5</span>
              </div>
              <span>stars from 500+ bookkeepers</span>
            </motion.div>
          </motion.div>

          {/* Right Column - Dual Screenshots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Main Dashboard Screenshot */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden mb-4"
              >
                {/* Dashboard Preview */}
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

              {/* Auto-Match Transactions Screenshot */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                {/* Auto-Match Preview */}
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

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4"
                >
                                     <div className="text-2xl font-bold text-slate-900">12.5 hrs</div>
                   <div className="text-sm text-slate-500">Time Saved Per Month</div>
                   <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                     <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                   </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4"
                >
                                     <div className="text-2xl font-bold text-slate-900">94%</div>
                   <div className="text-sm text-slate-500">Error Reduction</div>
                   <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                     <div className="w-[94%] h-full bg-blue-600 rounded-full"></div>
                   </div>
                </motion.div>
              </div>

              {/* Client Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 mt-4"
              >
                <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-[#F45B49] rounded-full flex items-center justify-center text-white font-semibold">
                     MA
                   </div>
                   <div className="flex-1">
                     <div className="font-semibold text-slate-900">Miller & Associates CPA</div>
                     <div className="text-sm text-slate-500">Monthly reconciliation automated</div>
                   </div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full -ml-2"></div>
                    <span className="text-xs text-slate-500 ml-1">+3</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-20 right-20 w-72 h-72 bg-[#F45B49]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}