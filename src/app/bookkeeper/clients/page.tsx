'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  industry?: string
  dateAdded: string
  lastActivity: string
  status: 'active' | 'inactive' | 'pending'
  totalTransactions: number
  lastUpload?: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    industry: ''
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'ABC Consulting LLC',
        email: 'contact@abcconsulting.com',
        phone: '(555) 123-4567',
        industry: 'Consulting',
        dateAdded: '2024-01-15',
        lastActivity: '2025-01-26',
        status: 'active',
        totalTransactions: 245,
        lastUpload: '2025-01-26'
      },
      {
        id: '2',
        name: 'XYZ Marketing Inc',
        email: 'hello@xyzmarketing.com',
        phone: '(555) 987-6543',
        industry: 'Marketing',
        dateAdded: '2024-02-20',
        lastActivity: '2025-01-25',
        status: 'active',
        totalTransactions: 189,
        lastUpload: '2025-01-25'
      },
      {
        id: '3',
        name: 'DEF Retail Store',
        email: 'info@defretail.com',
        phone: '(555) 456-7890',
        industry: 'Retail',
        dateAdded: '2024-03-10',
        lastActivity: '2025-01-20',
        status: 'pending',
        totalTransactions: 0
      },
      {
        id: '4',
        name: 'GHI Tech Solutions',
        email: 'support@ghitech.com',
        industry: 'Technology',
        dateAdded: '2024-04-05',
        lastActivity: '2025-01-24',
        status: 'active',
        totalTransactions: 312,
        lastUpload: '2025-01-24'
      },
      {
        id: '5',
        name: 'JKL Construction',
        email: 'office@jklconstruction.com',
        phone: '(555) 321-0987',
        industry: 'Construction',
        dateAdded: '2024-05-12',
        lastActivity: '2025-01-22',
        status: 'inactive',
        totalTransactions: 156
      }
    ]
    setClients(mockClients)
  }, [])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.industry && client.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        ...newClient,
        dateAdded: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        status: 'pending',
        totalTransactions: 0
      }
      setClients([...clients, client])
      setNewClient({ name: '', email: '', phone: '', address: '', industry: '' })
      setShowAddForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <Clock className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    totalTransactions: clients.reduce((sum, c) => sum + c.totalTransactions, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {clients.length} Clients
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
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
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Setup</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clients by name, email, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Filter by Date
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Client Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
              <CardDescription>Enter client information to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="ABC Company LLC"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={newClient.industry}
                    onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                    placeholder="Consulting, Retail, Technology..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700">
                  Add Client
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>Manage your client relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {client.phone}
                          </div>
                        )}
                        {client.industry && (
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {client.industry}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {client.totalTransactions.toLocaleString()} transactions
                      </p>
                      <p className="text-sm text-gray-600">
                        {client.lastUpload ? `Last upload: ${client.lastUpload}` : 'No uploads yet'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(client.status)}
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Client
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
