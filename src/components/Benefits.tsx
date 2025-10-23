'use client'

import { motion } from 'framer-motion'
import { Calculator, FileText, BarChart3, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Benefits() {
  const features = [
    {
      icon: Calculator,
      title: 'Automated CSV & PDF Matching',
      description: 'Smart transaction matching with 99% accuracy - supports both CSV and PDF uploads'
    },
    {
      icon: AlertTriangle,
      title: 'Find Missing Transactions',
      description: 'Automatically detect transactions missing from QuickBooks or your bank statement'
    },
    {
      icon: FileText,
      title: 'QuickBooks Compatible',
      description: 'Export directly to QB Desktop & QB Online with one click'
    },
    {
      icon: BarChart3,
      title: 'Multi-Format Export',
      description: 'Export to QuickBooks, Xero, or generic CSV instantly'
    },
    {
      icon: Clock,
      title: 'Save 10+ Hours',
      description: 'Automate manual reconciliation tasks every month'
    },
    {
      icon: CheckCircle,
      title: '100% Coverage',
      description: 'Never miss a discrepancy - every transaction is accounted for'
    }
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Revolutionize Your{' '}
              <span className="text-[#F45B49]">Bookkeeping Workflow</span>
            </h2>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-slate-600 leading-relaxed">
              Transform hours of manual work into minutes with our automated reconciliation platform. 
              Built specifically for bookkeepers and accounting professionals who demand accuracy and efficiency.
            </p>
          </motion.div>
        </div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#F45B49]/10 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-[#F45B49]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}