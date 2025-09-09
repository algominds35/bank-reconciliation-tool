'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

const Logos = () => {
  const testimonials = [
    {
      name: 'Michael Chen',
      title: 'Senior Accountant',
      company: 'Deloitte & Touche',
      rating: 5,
      content: 'Finally, a reconciliation tool that actually works! QuickBooks kept auto-matching wrong transactions and creating reconciliation nightmares. This platform catches every discrepancy.',
      avatar: 'MC'
    },
    {
      name: 'Sarah Rodriguez',
      title: 'CFO',
      company: 'TechStart Ventures',
      rating: 5,
      content: 'This tool has transformed our entire accounting workflow. The automated reports are professional and our clients love the transparency.',
      avatar: 'SR'
    },
    {
      name: 'David Thompson',
      title: 'Accounting Manager',
      company: 'Fortune 500 Corp',
      rating: 5,
      content: 'We handle 50+ clients and this platform has been a game-changer. The multi-bank integration and automated matching save us 30+ hours weekly.',
      avatar: 'DT'
    },
    {
      name: 'Lisa Park',
      title: 'Senior Bookkeeper',
      company: 'Park & Associates',
      rating: 5,
      content: 'QuickBooks reconciliation was a nightmare - wrong matches, missing transactions, constant errors. This tool fixed everything and our accuracy went from 70% to 98%.',
      avatar: 'LP'
    },
    {
      name: 'James Wilson',
      title: 'Financial Controller',
      company: 'Global Manufacturing Inc',
      rating: 5,
      content: 'Outstanding support team and the platform is incredibly intuitive. We\'ve automated 90% of our reconciliation tasks.',
      avatar: 'JW'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Star and Chart */}
        <div className="flex justify-between items-start mb-12">
          {/* Left - Star and Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <Star className="h-4 w-4 text-[#F45B49] fill-current" />
            <span className="text-sm text-gray-600">Rated 4.9/5 on G2 for QuickBooks Reconciliation</span>
          </motion.div>

          {/* Right - Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-3 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <div className="w-12 h-6 bg-gray-100 rounded-sm relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-0.5 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="absolute right-0 top-0 w-1 h-1 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <div className="w-12 h-6 bg-gray-100 rounded-sm relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-0.5 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Finally, a Reconciliation Tool That Actually Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join hundreds of accountants who have solved QuickBooks reconciliation problems with our automated platform that catches what QuickBooks misses.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-[#F45B49] to-[#E24C3A] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-600 text-xs">{testimonial.title}</div>
                  <div className="text-gray-500 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#F45B49]">500+</span>
              <span>QuickBooks Users Saved</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#F45B49]">95%</span>
              <span>Fewer Reconciliation Errors</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#F45B49]">20hrs</span>
              <span>Saved Monthly</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Logos
