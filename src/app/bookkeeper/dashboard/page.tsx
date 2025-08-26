'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Download,
  BarChart3,
  Settings
} from 'lucide-react'

interface Client {
  id: string
  name: string
  lastUpload: string
  status: 'pending' | 'processing' | 'completed' | 'needs_review'
  unmatchedTransactions: number
  totalTransactions: number
}

export default function BookkeeperDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingUploads: 0,
    completedToday: 0,
    totalTransactions: 0
  })

  // Mock data for now - will connect to real API later
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'ABC Consulting LLC',
        lastUpload: '2025-01-26',
        status: 'completed',
        unmatchedTransactions: 0,
        totalTransactions: 45
      },
      {
        id: '2', 
        name: 'XYZ Marketing Inc',
        lastUpload: '2025-01-25',
        status: 'needs_review',
        unmatchedTransactions: 3,
        totalTransactions: 67
      },
      {
        id: '3',
        name: 'DEF Retail Store',
        lastUpload: '2025-01-24',
        status: 'pending',
        unmatchedTransactions: 0,
        totalTransactions: 0
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
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <p className="text-sm font-medium text-gray-600">Pending Uploads</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingUploads}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
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

        {/* Bulk Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>Process multiple clients at once</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Process All Pending
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate All Reports
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk PDF Upload
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
      </div>
    </div>
  )
}
