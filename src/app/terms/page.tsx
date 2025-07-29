import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReconcileBook</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/auth/signup">
                <Button variant="outline">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              By accessing and using ReconcileBook, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Service Description</h2>
            <p className="text-gray-700 mb-4">
              ReconcileBook provides bank reconciliation software that helps businesses:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Upload and process bank transaction data</li>
              <li>Match transactions between bank and bookkeeping records</li>
              <li>Generate reconciliation reports</li>
              <li>Manage multiple client accounts</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account and password.
              You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data and Privacy</h2>
            <p className="text-gray-700 mb-4">
              We take your data security seriously. All financial data is encrypted and stored securely.
              We do not share your data with third parties without your explicit consent.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscription and Billing</h2>
            <p className="text-gray-700 mb-4">
              ReconcileBook offers subscription-based services. Billing occurs automatically on a monthly basis.
              You may cancel your subscription at any time through your account settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">
              You agree not to use the service for any unlawful purpose or to solicit others to perform unlawful acts.
              You must not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The service and its original content, features, and functionality are owned by ReconcileBook
              and are protected by international copyright, trademark, patent, trade secret, and other
              intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability,
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall ReconcileBook, nor its directors, employees, partners, agents, suppliers,
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700 mb-6">
              Email: alex@usealgomind.com
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 