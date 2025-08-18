'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Clock,
  ArrowRight,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Plus,
  Building2,
  CreditCard,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Demo data - fake but realistic
const demoClients = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    business_name: 'TechFlow Solutions Inc.',
    email: 'finance@techflow.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    status: 'active'
  },
  {
    id: '2', 
    name: 'Rodriguez Financial Services',
    business_name: 'Rodriguez Financial Services LLC',
    email: 'alex@rodriguezfinancial.com',
    phone: '+1 (555) 234-5678',
    address: '456 Business Blvd, Miami, FL 33101',
    status: 'active'
  },
  {
    id: '3',
    name: 'Thompson & Associates CPA',
    business_name: 'Thompson & Associates CPA Group',
    email: 'michael@thompsoncpa.com',
    phone: '+1 (555) 345-6789',
    address: '789 Professional Plaza, New York, NY 10001',
    status: 'active'
  }
];

const demoTransactions = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Client Payment - TechFlow Solutions',
    amount: 2500.00,
    type: 'credit',
    account: 'Chase Business Checking',
    status: 'unreconciled',
    category: 'Income',
    reference: 'INV-001'
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Office Supplies - Staples',
    amount: 156.78,
    type: 'debit',
    account: 'Chase Business Checking',
    status: 'unreconciled',
    category: 'Office Expenses',
    reference: 'PO-2024-001'
  },
  {
    id: '3',
    date: '2024-01-13',
    description: 'Client Payment - Rodriguez Financial',
    amount: 1800.00,
    type: 'credit',
    account: 'Chase Business Checking',
    status: 'unreconciled',
    category: 'Income',
    reference: 'INV-002'
  },
  {
    id: '4',
    date: '2024-01-12',
    description: 'Software Subscription - QuickBooks',
    amount: 89.99,
    type: 'debit',
    account: 'Chase Business Checking',
    status: 'unreconciled',
    category: 'Software',
    reference: 'QB-2024-01'
  },
  {
    id: '5',
    date: '2024-01-11',
    description: 'Client Payment - Thompson CPA',
    amount: 3200.00,
    type: 'credit',
    account: 'Chase Business Checking',
    status: 'unreconciled',
    category: 'Income',
    reference: 'INV-003'
  }
];

const demoInvoices = [
  {
    id: '1',
    client: 'TechFlow Solutions',
    amount: 2500.00,
    due_date: '2024-01-31',
    status: 'paid',
    invoice_number: 'INV-001',
    created_date: '2024-01-01',
    paid_date: '2024-01-15'
  },
  {
    id: '2',
    client: 'Rodriguez Financial Services',
    amount: 1800.00,
    due_date: '2024-01-30',
    status: 'paid',
    invoice_number: 'INV-002',
    created_date: '2024-01-02',
    paid_date: '2024-01-13'
  },
  {
    id: '3',
    client: 'Thompson & Associates CPA',
    amount: 3200.00,
    due_date: '2024-02-15',
    status: 'overdue',
    invoice_number: 'INV-003',
    created_date: '2024-01-05',
    paid_date: null
  },
  {
    id: '4',
    client: 'GreenLeaf Retail',
    amount: 950.00,
    due_date: '2024-02-01',
    status: 'pending',
    invoice_number: 'INV-004',
    created_date: '2024-01-10',
    paid_date: null
  }
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [aiMatching, setAiMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Simulate QuickBooks sync
  const handleQuickBooksSync = async () => {
    setSyncing(true);
    setMatchingProgress(0);
    
    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setMatchingProgress(i);
    }
    
    setSyncComplete(true);
    setSyncing(false);
  };

  // Simulate AI matching
  const handleAiMatching = async () => {
    setAiMatching(true);
    setMatchingProgress(0);
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setMatchingProgress(i);
    }
    
    setAiMatching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white py-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Eye className="w-4 h-4" />
          <span className="font-medium">DEMO MODE - This is a live demonstration with fake data</span>
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">QB</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">ReconcilePro Demo</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Eye className="w-4 h-4 mr-2" />
                View Demo Guide
              </Button>
              <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'reconciliation', name: 'Bank Reconciliation', icon: RefreshCw },
              { id: 'invoices', name: 'Invoice Collections', icon: FileText },
              { id: 'quickbooks', name: 'QuickBooks Integration', icon: Building2 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ReconcilePro Demo</h1>
              <p className="text-gray-600">Experience the power of AI-powered financial automation with sample data</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Balance</p>
                      <p className="text-2xl font-bold text-gray-900">$7,253.23</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unreconciled</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Clients</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                      <p className="text-2xl font-bold text-gray-900">98.2%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('reconciliation')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span>Try Bank Reconciliation</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('invoices')}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <FileText className="w-6 h-6" />
                    <span>Try Invoice Collections</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('quickbooks')}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Building2 className="w-6 h-6" />
                    <span>Try QuickBooks Sync</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Data Info */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Data Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sample Clients</h4>
                    <div className="space-y-2">
                      {demoClients.map((client) => (
                        <div key={client.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{client.business_name}</p>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sample Transactions</h4>
                    <div className="space-y-2">
                      {demoTransactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                          <div className={`font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bank Reconciliation Tab */}
        {activeTab === 'reconciliation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Reconciliation Demo</h1>
              <p className="text-gray-600">See how AI automatically matches your bank transactions with QuickBooks data</p>
            </div>

            {/* AI Matching Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>AI-Powered Transaction Matching</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Click the button below to see our AI automatically match your demo transactions with QuickBooks data.
                  </p>
                  
                  <Button 
                    onClick={handleAiMatching}
                    disabled={aiMatching}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {aiMatching ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        AI Matching in Progress...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start AI Matching
                      </>
                    )}
                  </Button>
                </div>

                {aiMatching && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">AI Processing Progress</span>
                      <span className="text-sm font-medium text-gray-700">{matchingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${matchingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {matchingProgress === 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">AI Matching Complete!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Successfully matched 4 out of 5 transactions with 98.2% confidence
                    </p>
                  </div>
                )}

                {/* Transactions Table */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Demo Transactions</h4>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Match
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {demoTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {matchingProgress === 100 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Matched
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Invoice Collections Tab */}
        {activeTab === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Collections Demo</h1>
              <p className="text-gray-600">Experience automated invoice management and payment tracking</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                      <p className="text-2xl font-bold text-gray-900">4</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid</p>
                      <p className="text-2xl font-bold text-green-600">2</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">1</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">1</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Invoice Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <Button 
                    onClick={() => setShowInvoiceForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Invoice
                  </Button>
                  
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Invoices
                  </Button>
                  
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                {/* Invoices Table */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {demoInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoice_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${invoice.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.due_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : invoice.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {invoice.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {invoice.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {invoice.status !== 'paid' && (
                                <Button size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                                  <Mail className="w-4 h-4 mr-1" />
                                  Send Reminder
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-purple-900">Payment Prediction</span>
                    </div>
                    <p className="text-purple-700 text-sm">
                      Thompson & Associates CPA likely to pay within 3-5 days based on payment history
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-blue-900">Reminder Strategy</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Send personalized reminder to GreenLeaf Retail for best response rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* QuickBooks Integration Tab */}
        {activeTab === 'quickbooks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">QuickBooks Integration Demo</h1>
              <p className="text-gray-600">Experience seamless QuickBooks connection and data synchronization</p>
            </div>

            {/* Connection Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>QuickBooks Connection</CardTitle>
              </CardHeader>
              <CardContent>
                {!syncComplete ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connect to QuickBooks</h3>
                    <p className="text-gray-500 mb-6">
                      Click the button below to simulate connecting your QuickBooks account and syncing data.
                    </p>
                    
                    <Button 
                      onClick={handleQuickBooksSync}
                      disabled={syncing}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Connecting to QuickBooks...
                        </>
                      ) : (
                        <>
                          <Building2 className="w-4 h-4 mr-2" />
                          Connect QuickBooks
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-600 text-white text-lg font-bold rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">QuickBooks Connected!</h4>
                          <p className="text-green-600 font-medium">✓ Successfully Connected!</p>
                          <span className="text-sm text-gray-500">Realm ID: 9341455152432773</span>
                        </div>
                      </div>
                    </div>

                    {/* Sync Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">Sync completed successfully!</p>
                          <p className="text-sm text-blue-700">Last sync: {new Date().toLocaleDateString()} • Status: completed</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-xl p-4 text-center border">
                        <div className="text-2xl font-bold text-gray-900">$7,253.23</div>
                        <div className="text-sm text-gray-600">Total Balance</div>
                        <div className="text-xs text-green-600 mt-1">+$2,450.00 this month</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 text-center border">
                        <div className="text-2xl font-bold text-gray-900">8</div>
                        <div className="text-sm text-gray-600">Connected Accounts</div>
                        <div className="text-xs text-blue-600 mt-1">3 bank, 5 credit</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 text-center border">
                        <div className="text-2xl font-bold text-green-600">1,247</div>
                        <div className="text-sm text-gray-600">Synced Transactions</div>
                        <div className="text-xs text-green-600 mt-1">Last 30 days</div>
                      </div>
                    </div>

                    {/* Connected Accounts */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Connected Bank Accounts</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Chase Business Checking</p>
                              <p className="text-sm text-gray-500">****1234</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-green-600">$23,456.78</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Chase Business Credit</p>
                              <p className="text-sm text-gray-500">****5678</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-red-600">-$8,234.56</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Full Dashboard
                      </Button>
                      <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3">
                        <Download className="w-4 h-4 mr-2" />
                        Export Reconciliation Report
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3">
                        <X className="w-4 h-4 mr-2" />
                        Disconnect QuickBooks
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Use ReconcilePro with Your Real Data?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your free trial and experience the power of AI-powered financial automation for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://buy.stripe.com/bJe5kF7HUfvF62Raee0Fi0b" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="#demo">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg">
                <Play className="mr-2 w-5 h-5" />
                Continue Exploring Demo
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
