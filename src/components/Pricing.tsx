'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Essential reconciliation for small bookkeeping practices',
      features: [
        'Up to 10 client accounts',
        'Automated bank reconciliation',
        'Monthly financial reports',
        'Email support (24/7)',
        'Bank statement processing',
        'Transaction matching engine'
      ],
      stripeLink: 'https://buy.stripe.com/3cI9AVe6i0ALcrfaee0Fi0a',
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Advanced automation for growing bookkeeping businesses',
             features: [
         'Up to 250 client accounts',
         'Intelligent reconciliation AI',
        'Custom financial reports',
        'Priority support (4-hour response)',
        'Client portal & collaboration',
        'Automated payment reminders',
        'Multi-bank integration',
        'Real-time sync with QuickBooks'
      ],
      stripeLink: 'https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'Complete automation suite for large bookkeeping firms',
      features: [
        'Unlimited client accounts',
        'Enterprise-grade automation',
        'Custom integrations & API',
        'Dedicated account manager',
        'Advanced analytics & insights',
        'White-label branding options',
        'Full API access',
        'Custom workflow automation'
      ],
      stripeLink: 'https://buy.stripe.com/28E4gBd2eerBdvjaee0Fi0c',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose the plan that fits your bookkeeping business. All plans include our core reconciliation features.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.stripeLink}
                className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial</p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-gray-600">Trusted by 500+ bookkeepers</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
