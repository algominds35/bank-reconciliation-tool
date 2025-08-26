'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BulkReconciliation from '@/components/BulkReconciliation'
import PDFUpload from '@/components/PDFUpload'
import AutomatedReports from '@/components/AutomatedReports'
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Download,
  BarChart3,
  Settings,
  Zap,
  Plus,
  Mail
} from 'lucide-react'

interface Client {
  id: string
  name: string
  lastUpload: string
  status: 'pending' | 'processing' | 'completed' | 'needs_review' | 'ready'
  unmatchedTransactions: number
  totalTransactions: number
  bankTransactions?: any[]
  progress?: number
  matches?: number
}

export default function BookkeeperDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingUploads: 0,
    completedToday: 0,
    totalTransactions: 0
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'bulk-reconcile' | 'upload' | 'reports'>('overview')
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const [reconciliationResults, setReconciliationResults] = useState<any>(null)

  // Mock data for now - will connect to real API later
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'ABC Consulting LLC',
        lastUpload: '2025-01-26',
        status: 'ready',
        unmatchedTransactions: 0,
        totalTransactions: 45,
        bankTransactions: Array.from({length: 45}, (_, i) => ({
          id: `abc-${i}`,
          date: '2025-01-26',
          description: `Transaction ${i + 1}`,
          amount: Math.random() * 1000 + 50,
          type: Math.random() > 0.5 ? 'debit' : 'credit',
          confidence: 0.9
        }))
      },
      {
        id: '2', 
        name: 'XYZ Marketing Inc',
        lastUpload: '2025-01-25',
        status: 'ready',
        unmatchedTransactions: 3,
        totalTransactions: 67,
        bankTransactions: Array.from({length: 67}, (_, i) => ({
          id: `xyz-${i}`,
          date: '2025-01-25',
          description: `Marketing Transaction ${i + 1}`,
          amount: Math.random() * 500 + 25,
          type: Math.random() > 0.5 ? 'debit' : 'credit',
          confidence: 0.9
        }))
      },
      {
        id: '3',
        name: 'DEF Retail Store',
        lastUpload: '2025-01-24',
        status: 'ready',
        unmatchedTransactions: 0,
        totalTransactions: 89,
        bankTransactions: Array.from({length: 89}, (_, i) => ({
          id: `def-${i}`,
          date: '2025-01-24',
          description: `Retail Transaction ${i + 1}`,
          amount: Math.random() * 200 + 10,
          type: Math.random() > 0.5 ? 'debit' : 'credit',
          confidence: 0.9
        }))
      }
    ]

    setClients(mockClients)
    setStats({
      totalClients: mockClients.length,
      pendingUploads: mockClients.filter(c => c.status === 'pending').length,
      completedToday: mockClients.filter(c => c.status === 'completed').length,
      totalTransactions: mockClients.reduce((sum, c) => sum + c.totalTransactions, 0)
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'needs_review': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'needs_review': return <AlertTriangle className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'pending': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">ReconcileBook Pro</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Beta
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant={activeTab === 'overview' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button 
                variant={activeTab === 'bulk-reconcile' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('bulk-reconcile')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Bulk Reconcile
              </Button>
              <Button 
                variant={activeTab === 'upload' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload PDFs
              </Button>
              <Button 
                variant={activeTab === 'reports' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('reports')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Clients</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ready to Process</p>
                      <p className="text-3xl font-bold text-green-600">{clients.filter(c => c.status === 'ready').length}</p>
                    </div>
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Today</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.completedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump to common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('bulk-reconcile')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Bulk Reconciliation
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload More PDFs
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('reports')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client List */}
            <Card>
              <CardHeader>
                <CardTitle>Client Overview</CardTitle>
                <CardDescription>Manage all your clients from one dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(client.status)}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-600">Last upload: {client.lastUpload}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {client.totalTransactions} transactions
                          </p>
                          {client.unmatchedTransactions > 0 && (
                            <p className="text-sm text-yellow-600">
                              {client.unmatchedTransactions} need review
                            </p>
                          )}
                        </div>
                        
                        <Badge className={getStatusColor(client.status)}>
                          {client.status.replace('_', ' ')}
                        </Badge>

                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'bulk-reconcile' && (
          <BulkReconciliation 
            clients={clients}
            onReconciliationComplete={(results) => {
              console.log('Bulk reconciliation completed:', results)
              setReconciliationResults(results)
              // Update client statuses based on results
              setClients(prev => prev.map(client => {
                const result = results.jobs.find((job: any) => job.clientId === client.id)
                if (result) {
                  return {
                    ...client,
                    status: result.status,
                    matches: result.matches.filter((m: any) => m.matchType !== 'unmatched').length,
                    unmatchedTransactions: result.unmatchedBank.length + result.unmatchedBook.length
                  }
                }
                return client
              }))
              // Auto-switch to reports tab
              setActiveTab('reports')
            }}
          />
        )}

        {activeTab === 'upload' && (
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Bank Statements</CardTitle>
              <CardDescription>
                Upload PDF bank statements for your clients. The AI will extract transactions automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFUpload 
                onFilesUploaded={(files) => {
                  console.log('Files uploaded:', files)
                  // In a real app, this would update the client data
                }}
                maxFiles={20}
              />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pro Tip for Jimmie:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload multiple PDFs at once - the system handles them in parallel</li>
                  <li>• AI extracts transactions with 95% accuracy</li>
                  <li>• Each PDF gets processed and ready for bulk reconciliation</li>
                  <li>• You can review any low-confidence matches before finalizing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <AutomatedReports 
            reconciliationResults={reconciliationResults}
            onReportsGenerated={(reports) => {
              console.log('Reports generated:', reports)
              // In a real app, you might update some state here
            }}
          />
        )}
      </div>
    </div>
  )
}
