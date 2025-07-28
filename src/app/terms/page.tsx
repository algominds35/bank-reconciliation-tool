import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Terms of Service
            </CardTitle>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700">
                  By accessing and using ReconcilePro, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please 
                  do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 mb-4">
                  ReconcilePro provides bank reconciliation software that helps businesses:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Connect bank accounts securely</li>
                  <li>Import and reconcile transactions</li>
                  <li>Match bank and bookkeeping records</li>
                  <li>Generate reconciliation reports</li>
                  <li>Manage financial data efficiently</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. User Accounts
                </h2>
                <p className="text-gray-700 mb-4">
                  To use our service, you must:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Create an account with valid information</li>
                  <li>Maintain the security of your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Subscription and Payment
                </h2>
                <p className="text-gray-700 mb-4">
                  Our service operates on a subscription basis:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Free Trial:</strong> 14-day free trial with credit card required</li>
                  <li><strong>Billing:</strong> Automatic billing after trial period</li>
                  <li><strong>Cancellation:</strong> Cancel anytime through your account</li>
                  <li><strong>Refunds:</strong> No refunds for partial months</li>
                  <li><strong>Price Changes:</strong> 30-day notice for price increases</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Acceptable Use
                </h2>
                <p className="text-gray-700 mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use the service for illegal purposes</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the service or other users</li>
                  <li>Upload malicious code or data</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Data and Privacy
                </h2>
                <p className="text-gray-700 mb-4">
                  Your data is important to us:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>We protect your data with industry-standard security</li>
                  <li>You retain ownership of your data</li>
                  <li>We only access your data to provide our service</li>
                  <li>You can export your data at any time</li>
                  <li>We delete your data upon account cancellation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Service Availability
                </h2>
                <p className="text-gray-700">
                  We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
                  We may perform maintenance that temporarily affects availability. We will notify 
                  you of scheduled maintenance when possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-700">
                  Our liability is limited to the amount you paid for our service in the 12 months 
                  preceding the claim. We are not liable for indirect, incidental, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Termination
                </h2>
                <p className="text-gray-700">
                  You may cancel your account at any time. We may terminate accounts that violate 
                  these terms. Upon termination, your access will end and your data will be deleted 
                  within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Contact Information
                </h2>
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact us at:{' '}
                  <a href="mailto:legal@reconcilepro.com" className="text-blue-600 hover:underline">
                    legal@reconcilepro.com
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 