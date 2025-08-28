'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// Removed BulkReconciliation - not needed for simple client management
import PDFUpload from '@/components/PDFUpload'

import AutomatedReminders from '@/components/AutomatedReminders'
import CommunicationDashboard from '@/components/CommunicationDashboard'
import ClientDetailsModal from '@/components/ClientDetailsModal'
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
  Mail,
  Bell,
  MessageSquare
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
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'reminders' | 'communications'>('overview')
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const [reconciliationResults, setReconciliationResults] = useState<any>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientModal, setShowClientModal] = useState(false)

  // Load real client data from API
  const loadClients = async () => {
    try {
      const response = await fetch('/api/bookkeeper/clients', {
        headers: {
          'user-id': 'demo-user' // TODO: Get from auth context
        }
      })
      const data = await response.json()
      
      if (data.success) {
        const realClients = data.clients.map((client: any) => ({
          id: client.id,
          name: client.name,
          lastUpload: client.last_upload,
          status: client.status || 'pending',
          unmatchedTransactions: client.unmatched_transactions || 0,
          totalTransactions: client.total_transactions || 0,
          bankTransactions: client.bank_transactions || [],
          progress: 0
        }))
        
        setClients(realClients)
        setStats({
          totalClients: realClients.length,
          pendingUploads: realClients.filter((c: any) => c.status === 'pending').length,
          completedToday: realClients.filter((c: any) => c.status === 'completed').length,
          totalTransactions: realClients.reduce((sum: number, c: any) => sum + c.totalTransactions, 0)
        })

        // DEBUG: Log loaded client data
        console.log('🔍 Dashboard loadClients - Debug Info:', {
          rawClientsFromAPI: data.clients?.length || 0,
          transformedClients: realClients.length,
          totalTransactionsCalculated: realClients.reduce((sum: number, c: any) => sum + c.totalTransactions, 0),
          clientDetails: realClients.map((c: any) => ({
            id: c.id,
            name: c.name,
            totalTransactions: c.totalTransactions,
            status: c.status
          }))
        })
      } else {
        // If no real clients exist, show empty state but keep functionality working
        setClients([])
        setStats({
          totalClients: 0,
          pendingUploads: 0,
          completedToday: 0,
          totalTransactions: 0
        })
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      // Show empty state on error
      setClients([])
      setStats({
        totalClients: 0,
        pendingUploads: 0,
        completedToday: 0,
        totalTransactions: 0
      })
    }
  }

  useEffect(() => {
    loadClients()
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
              {/* Removed Bulk Reconcile - not what Jimmie needs */}
              <Button 
                variant={activeTab === 'upload' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload PDFs
              </Button>
              
              <Button 
                variant={activeTab === 'reminders' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('reminders')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Reminders
              </Button>
              <Button 
                variant={activeTab === 'communications' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('communications')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="bg-green-50 border-green-200 hover:bg-green-100"
                onClick={() => alert('Add clients by processing their PDF documents in the Upload PDFs tab')}
              >
                <Plus className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-green-600 font-medium">New Client</span>
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
                     onClick={() => setActiveTab('upload')}
                   >
                     <Upload className="h-4 w-4 mr-2" />
                     Upload Client Documents
                   </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload More PDFs
                  </Button>
                  

                  {/* EMERGENCY DELETE BROKEN CLIENTS BUTTON */}
                  <Button
                    variant="outline"
                    onClick={async () => {
                      console.log('🔄 Manual refresh requested...')
                      await loadClients()
                      alert('✅ Client list refreshed!')
                    }}
                  >
                    🔄 Refresh Clients
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={async () => {
                      console.log('🗑️ DELETE BUTTON CLICKED!')
                      console.log('Current clients:', clients)
                      
                      if (confirm('🚨 DELETE ALL BROKEN CLIENTS? This will remove clients with 0 transactions!')) {
                        try {
                          // Find broken clients (0 transactions or fake names)
                          const brokenClients = clients.filter(c => 
                            c.totalTransactions === 0 || 
                            !c.totalTransactions || 
                            c.name === 'alex' || 
                            c.name === 'Test Client' ||
                            c.name.toLowerCase().includes('test')
                          )
                          
                          console.log('Broken clients to delete:', brokenClients)
                          
                          if (brokenClients.length === 0) {
                            alert('✅ No broken clients found!')
                            return
                          }
                          
                          // Delete each broken client
                          let deletedCount = 0
                          for (const client of brokenClients) {
                            console.log(`Attempting to delete client: ${client.name} (ID: ${client.id})`)
                            
                            const response = await fetch(`/api/delete-client?id=${client.id}`, {
                              method: 'DELETE',
                              headers: {
                                'user-id': 'demo-user'
                              }
                            })
                            
                            if (response.ok) {
                              console.log(`✅ Successfully deleted: ${client.name}`)
                              deletedCount++
                            } else {
                              const errorText = await response.text()
                              console.error(`❌ Failed to delete ${client.name}:`, errorText)
                            }
                          }
                          
                          // Force refresh the client list
                          console.log('🔄 Refreshing client list...')
                          await loadClients()
                          
                          alert(`✅ Successfully deleted ${deletedCount} broken clients!\n\nNow upload your PDFs to create real clients.`)
                          
                        } catch (error) {
                          console.error('❌ Delete operation failed:', error)
                          alert(`❌ Failed to delete clients: ${error}`)
                        }
                      }
                    }}
                  >
                    🗑️ Delete Broken Clients
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

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client)
                            setShowClientModal(true)
                          }}
                        >
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

        {/* Removed complex reconciliation - focusing on simple client management */}

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
                onFilesUploaded={async (files) => {
                  console.log('Files uploaded:', files)
                  // Refresh client data after upload
                  try {
                    const response = await fetch('/api/bookkeeper/clients', {
                      headers: {
                        'user-id': 'demo-user'
                      }
                    })
                    const data = await response.json()
                    if (data.success) {
                      const realClients = data.clients.map((client: any) => ({
                        id: client.id,
                        name: client.name,
                        lastUpload: client.last_upload,
                        status: client.status || 'ready',
                        unmatchedTransactions: client.unmatched_transactions || 0,
                        totalTransactions: client.total_transactions || 0,
                        bankTransactions: client.bank_transactions || [],
                        progress: 0
                      }))
                      setClients(realClients)
                      // Update stats
                      setStats({
                        totalClients: realClients.length,
                        pendingUploads: realClients.filter((c: any) => c.status === 'pending').length,
                        completedToday: realClients.filter((c: any) => c.status === 'completed').length,
                        totalTransactions: realClients.reduce((sum: number, c: any) => sum + c.totalTransactions, 0)
                      })
                    }
                  } catch (error) {
                    console.error('Failed to refresh client data:', error)
                  }
                }}
                maxFiles={20}
              />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How It Works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                                   <li>• Upload multiple PDFs at once - the system handles them in parallel</li>
                 <li>• Automatically creates client profiles from documents</li>
                 <li>• Organizes files by client and date</li>
                 <li>• Sets up automated reminders for missing documents</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        

        {activeTab === 'reminders' && (
          <AutomatedReminders />
        )}

        {activeTab === 'communications' && (
          <CommunicationDashboard />
        )}
      </div>

      {/* Professional Client Details Modal */}
      <ClientDetailsModal
        client={selectedClient}
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false)
          setSelectedClient(null)
        }}
                 onStartReconciliation={() => {
           setActiveTab('upload')
           setShowClientModal(false)
         }}
        onGenerateReport={() => {
          setActiveTab('reports')
          setShowClientModal(false)
        }}
      />
    </div>
  )
}
