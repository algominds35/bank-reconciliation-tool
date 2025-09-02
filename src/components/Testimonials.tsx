'use client'

import { motion } from 'framer-motion'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah M.',
      title: 'Senior Bookkeeper at Deloitte',
      quote: 'The automated reconciliation has cut our monthly close time by 80%. What used to take 3 days now takes just a few hours.'
    },
    {
      name: 'David L.',
      title: 'CFO at TechStart Inc.',
      quote: 'The AI matching accuracy is incredible. We\'ve eliminated 95% of manual reconciliation work and our team can focus on strategic analysis.'
    },
    {
      name: 'Jennifer R.',
      title: 'Accounting Manager at Fortune 500',
      quote: 'This tool has transformed how we handle multi-client bookkeeping. The client portal and automated reports save us 20+ hours per week.'
    }
  ]

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Testimonials */}
          <div className="lg:col-span-1 space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  {testimonial.name}, {testimonial.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Heading and Stats */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Teams Who've <span className="text-[#F45B49]">Transformed</span> Their Workflow
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our users are the reason we're here. Their success stories inspire us to keep pushing the boundaries of what's possible. Thousands of bookkeepers have already discovered the power of our platform.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#F45B49] mb-2">500+</div>
                <div className="text-gray-600">Teams worldwide rely on our platform</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#F45B49] mb-2">50K+</div>
                <div className="text-gray-600">Amount of transactions automated every day</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#F45B49] mb-2">99.9%</div>
                <div className="text-gray-600">Uptime guarantee for maximum productivity</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#F45B49] mb-2">85%</div>
                <div className="text-gray-600">Average increase in team productivity</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
