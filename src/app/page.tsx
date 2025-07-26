'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [featureInterest, setFeatureInterest] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email,
          role: role || null,
          feature_interest: featureInterest || null,
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setError('This email is already on our waitlist!')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setShowSuccess(true)
        setEmail('')
        setRole('')
        setFeatureInterest('')
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Reconcile Bank Transactions Without the{' '}
              <span className="text-blue-600">QuickBooks Headache</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A private, AI-free tool for small businesses and bookkeepers
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Clean, Simple Interface
            </h2>
            <p className="text-xl text-gray-600">
              No bloat, no confusion - just the tools you need
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Bank Reconciliation Tool</h3>
                  <span className="text-sm text-gray-600">Welcome, user@example.com</span>
                </div>
              </div>

              {/* Summary Bar */}
              <div className="bg-blue-600 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">2 of 16 transactions reconciled</div>
                  <div className="flex space-x-6 text-sm">
                    <span>Total: 16</span>
                    <span>Reconciled: 2</span>
                    <span>Unreconciled: 14</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Upload CSV
                    </button>
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>All Transactions</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Reconcile Selected (0)
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Export Reconciled
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Export as PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reconciled</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-900">1/23/2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Income - Consulting Services</td>
                      <td className="px-4 py-3 text-sm text-gray-900">$1500.00</td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-900">1/23/2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Marketing Expenses - Google Ads</td>
                      <td className="px-4 py-3 text-sm text-gray-900">$-200.00</td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-900">1/22/2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Client Refund Processing</td>
                      <td className="px-4 py-3 text-sm text-gray-900">$500.00</td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">No</span></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-900">1/22/2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Parking Fee</td>
                      <td className="px-4 py-3 text-sm text-gray-900">$-8.00</td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">No</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-900">1/20/2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Client Payment - DEF Inc</td>
                      <td className="px-4 py-3 text-sm text-gray-900">$750.00</td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">No</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need, Nothing You Don't
            </h2>
            <p className="text-xl text-gray-600">
              Built specifically for bank reconciliation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload CSV Files</h3>
              <p className="text-gray-600">Simply drag and drop your bank statements</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manually Reconcile Transactions</h3>
              <p className="text-gray-600">Full control over your reconciliation process</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export as PDF or CSV</h3>
              <p className="text-gray-600">Professional reports for your records</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clean UI, No Bloat</h3>
              <p className="text-gray-600">Focus on what matters - your data</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Human Data Review, No AI</h3>
              <p className="text-gray-600">Your financial data stays completely private</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Built for Small Business</h3>
              <p className="text-gray-600">Perfect for bookkeepers and business owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features in development
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Bank Connection Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    🏦 Connect Your Bank
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automatically import transactions from your bank — no more downloading CSVs manually.
                  </p>
                </div>
              </div>
            </div>

            {/* Multi-Client Mode Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    👥 Multi-Client Mode
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bookkeepers and accountants can manage multiple businesses from a single dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-700 mb-6">
              Want early access? Join the waitlist or try the free version now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Join Waitlist
              </button>
              <Link
                href="/dashboard"
                className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors"
              >
                Try Free Version
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist-section" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Early Access to Premium Features
            </h2>
            <p className="text-xl text-gray-600">
              Be the first to know about new features and updates
            </p>
          </div>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Thanks for joining our waitlist! We'll be in touch soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleWaitlistSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Role (Optional)
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your role</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Bookkeeper">Bookkeeper</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="feature-interest" className="block text-sm font-medium text-gray-700 mb-2">
                  What features interest you most? (Optional)
                </label>
                <textarea
                  id="feature-interest"
                  rows={3}
                  value={featureInterest}
                  onChange={(e) => setFeatureInterest(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Advanced reporting, integrations, mobile app, etc."
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Bank Reconciliation Tool. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 