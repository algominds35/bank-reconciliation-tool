'use client'

import React from 'react'
import Link from 'next/link'

export default function EULAPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold">ReconcileBook End‑User License Agreement (EULA)</h1>
          <p className="mt-4 text-white/90 max-w-3xl">Please read this End‑User License Agreement carefully before using ReconcileBook.</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-700">By accessing or using ReconcileBook (the “Software”), you agree to be bound by this End‑User License Agreement (“Agreement”). If you do not agree, do not use the Software.</p>

          <h2 className="text-2xl font-bold text-gray-900">2. License Grant</h2>
          <p className="text-gray-700">Subject to payment of applicable fees and compliance with this Agreement, ReconcileBook, Inc. (“ReconcileBook”, “we”, “our”) grants you a limited, non‑exclusive, non‑transferable, non‑sublicensable license to access and use the Software solely for your internal business purposes.</p>

          <h2 className="text-2xl font-bold text-gray-900">3. Permitted Use</h2>
          <ul className="text-gray-700">
            <li>Reconcile bank and credit‑card transactions using CSV files you lawfully control.</li>
            <li>Generate reconciliation reports for internal records, accountants, auditors, and clients you serve.</li>
            <li>Create user accounts for team members within your subscription plan limits.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900">4. Prohibited Use</h2>
          <ul className="text-gray-700">
            <li>Reverse engineer, decompile, or attempt to derive the source code of the Software.</li>
            <li>Rent, lease, sell, sublicense, or otherwise redistribute the Software to third parties.</li>
            <li>Use the Software to process unlawful data or infringe third‑party rights.</li>
            <li>Access the Software in a manner intended to circumvent plan limits or fees.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900">5. Data & Privacy</h2>
          <p className="text-gray-700">We process customer data in accordance with our Privacy Policy. By using the Software, you consent to such processing. Do not upload data you are not authorized to share. You are responsible for maintaining your account security.</p>

          <h2 className="text-2xl font-bold text-gray-900">6. Intellectual Property</h2>
          <p className="text-gray-700">The Software is licensed, not sold. ReconcileBook retains all right, title, and interest in and to the Software, including all related intellectual property rights.</p>

          <h2 className="text-2xl font-bold text-gray-900">7. Subscription, Trials, and Payment</h2>
          <p className="text-gray-700">Use of the Software may require a paid subscription. Trials are provided for evaluation and may be changed or discontinued at any time. Fees are non‑refundable except as required by law or expressly stated otherwise.</p>

          <h2 className="text-2xl font-bold text-gray-900">8. Disclaimers</h2>
          <p className="text-gray-700">THE SOFTWARE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECONCILEBOOK DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON‑INFRINGEMENT. WE DO NOT WARRANT THAT THE SOFTWARE WILL BE ERROR‑FREE OR UNINTERRUPTED.</p>

          <h2 className="text-2xl font-bold text-gray-900">9. Limitation of Liability</h2>
          <p className="text-gray-700">TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECONCILEBOOK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE AMOUNTS PAID BY YOU FOR THE SOFTWARE IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>

          <h2 className="text-2xl font-bold text-gray-900">10. Term and Termination</h2>
          <p className="text-gray-700">This Agreement remains in effect while you use the Software. We may suspend or terminate access for breach. Upon termination, your right to use the Software ceases immediately; sections intended to survive (including Intellectual Property, Disclaimers, Limitation of Liability, and Governing Law) will continue in effect.</p>

          <h2 className="text-2xl font-bold text-gray-900">11. Governing Law</h2>
          <p className="text-gray-700">This Agreement is governed by the laws of the State of Delaware, without regard to conflict of laws principles. Venue shall lie exclusively in state or federal courts located in Delaware, and you consent to personal jurisdiction there.</p>

          <h2 className="text-2xl font-bold text-gray-900">12. Changes to this Agreement</h2>
          <p className="text-gray-700">We may update this Agreement from time to time. Material changes will be posted on this page with an updated effective date. Continued use of the Software after changes become effective constitutes acceptance.</p>

          <h2 className="text-2xl font-bold text-gray-900">13. Contact</h2>
          <p className="text-gray-700">Questions about this Agreement? Contact us at <a href="mailto:alex@usealgomind.com" className="text-blue-600 hover:text-blue-800">alex@usealgomind.com</a>.</p>

          <p className="text-gray-500 text-sm mt-8">Effective date: {new Date().toISOString().substring(0, 10)}</p>

          <div className="mt-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← Back to Home</Link>
          </div>
        </article>
      </main>
    </div>
  )
}