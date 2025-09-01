'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How does the bank reconciliation automation work?',
      answer: 'Our tool connects directly to your bank feeds and QuickBooks, automatically matching transactions based on amount, date, and payee. It learns from your reconciliation patterns and gets smarter over time, reducing manual work by up to 90%.'
    },
    {
      question: 'Can I use this with multiple clients?',
      answer: 'Yes! Our Professional and Enterprise plans support multiple clients. Each client gets their own secure workspace with separate bank feeds and reconciliation settings. You can easily switch between clients and manage them all from one dashboard.'
    },
    {
      question: 'What if the automation makes a mistake?',
      answer: 'Our system is designed to be conservative - it will flag uncertain matches for your review rather than making assumptions. You can always override any suggestions, and the system learns from your corrections to improve future matching.'
    },
    {
      question: 'How secure is my financial data?',
      answer: 'We use bank-level encryption and security protocols. All data is encrypted in transit and at rest. We never store your banking credentials - we use secure APIs that only provide read-only access to transaction data.'
    },
    {
      question: 'Can I export the reconciled data back to QuickBooks?',
      answer: 'Absolutely! Once reconciliation is complete, you can export the matched transactions back to QuickBooks with a single click. The system maintains all your existing QuickBooks categories and account mappings.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'All plans include email support, with priority support for Professional and Enterprise plans. We also offer live chat during business hours and comprehensive documentation with video tutorials.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Everything you need to know about our reconciliation tool
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="mailto:support@reconcilebookpro.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
