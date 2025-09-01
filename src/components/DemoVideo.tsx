'use client'

import { motion } from 'framer-motion'
import { Play, Search, ChevronDown, Plus } from 'lucide-react'

const DemoVideo = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">ReconcileBook Pro</h3>
                <span className="px-2 py-1 bg-[#F45B49] text-white text-xs rounded">AI</span>
              </div>
              <p className="text-gray-600 text-sm">Reconcile and manage your client accounts with AI assistance</p>
            </div>
            <button className="px-4 py-2 bg-[#F45B49] text-white rounded-lg hover:bg-[#E24C3A] transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Client</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="text-sm text-gray-600 mb-1">TOTAL CLIENTS</div>
              <div className="text-2xl font-bold text-gray-900">12</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="text-sm text-gray-600 mb-1">ACTIVE</div>
              <div className="text-2xl font-bold text-gray-900">8</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="text-sm text-gray-600 mb-1">PENDING</div>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="text-sm text-gray-600 mb-1">COMPLETED</div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F45B49] focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 text-gray-700 hover:bg-gray-50">
              <span>All Status</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Client List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h4 className="font-semibold text-gray-900">John's Bakery LLC</h4>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">PENDING</span>
                </div>
                <p className="text-gray-600 text-sm">Monthly bank reconciliation ready for review. 26 transactions processed with 98% match rate.</p>
              </div>
              <div className="text-gray-500 text-sm">Aug 1, 2025</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h4 className="font-semibold text-gray-900">TechStart Ventures</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">ACTIVE</span>
                </div>
                <p className="text-gray-600 text-sm">Multi-bank reconciliation completed. P&L and Balance Sheet reports generated.</p>
              </div>
              <div className="text-gray-500 text-sm">Jul 28, 2025</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h4 className="font-semibold text-gray-900">ABC Manufacturing</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">DRAFT</span>
                </div>
                <p className="text-gray-600 text-sm">Bank statement uploaded. AI processing transactions for matching.</p>
              </div>
              <div className="text-gray-500 text-sm">Jul 25, 2025</div>
            </div>
          </div>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-[#F45B49] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E24C3A] transition-colors group">
                  <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                0:30
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Watch How It Works</h3>
              <p className="text-gray-600 text-sm">See our AI reconciliation tool process transactions in real-time</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DemoVideo
