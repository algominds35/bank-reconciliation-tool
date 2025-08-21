'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Upload, 
  Download, 
  FileText, 
  DollarSign, 
  Calendar,
  User,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Invoice, InvoiceUpload } from '@/types'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<InvoiceUpload>({
    client_name: '',
    client_email: '',
    invoice_number: '',
    amount: 0,
    due_date: '',
    description: ''
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/invoices?user_id=temp_user')
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.invoices)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowForm(false)
        setFormData({
          client_name: '',
          client_email: '',
          invoice_number: '',
          amount: 0,
          due_date: '',
          description: ''
        })
        fetchInvoices()
        alert('Invoice created successfully!')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
      alert('Failed to create invoice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    
    try {
      setImporting(true)
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/invoices/import', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSelectedFile(null)
        fetchInvoices()
        alert(`Successfully imported ${data.imported} invoices!`)
      } else {
        alert(`Import failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to import CSV:', error)
      alert('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleViewInvoice = (invoiceId: string) => {
    // For now, just show an alert - you can implement a modal later
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      alert(`Invoice Details:\n\nInvoice #: ${invoice.invoice_number}\nClient: ${invoice.clients?.name}\nAmount: $${invoice.amount}\nStatus: ${invoice.status}`)
    }
  }

  const handleEditInvoice = (invoiceId: string) => {
    // For now, just show an alert - you can implement edit functionality later
    alert('Edit functionality coming soon!')
  }

  const handleSendReminder = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId)
      if (!invoice) return

      // Call the collections API to send a reminder
      const response = await fetch('/api/collections/send-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoice_id: invoiceId,
          user_id: 'temp_user'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`Payment reminder sent to ${invoice.clients?.email}!`)
        // Refresh invoices to update reminder status
        fetchInvoices()
      } else {
        alert(`Failed to send reminder: ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert('Failed to send reminder. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your invoices and automate collections without QuickBooks integration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.filter(i => i.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.filter(i => i.status === 'overdue').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.filter(i => i.status === 'paid').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="max-w-xs"
            />
            <Button 
              onClick={handleFileUpload}
              disabled={!selectedFile || importing}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import CSV'}
            </Button>
          </div>
        </div>

        {/* Invoice Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Invoice</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="client_email">Client Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Creating...' : 'Create Invoice'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading invoices...</div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No invoices yet. Create your first invoice or import from CSV.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Invoice #</th>
                      <th className="text-left py-3 px-4">Client</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Due Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{invoice.invoice_number}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{invoice.clients?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{invoice.clients?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p>{new Date(invoice.due_date).toLocaleDateString()}</p>
                            {invoice.status === 'overdue' && (
                              <p className="text-sm text-red-600">
                                {getDaysOverdue(invoice.due_date)} days overdue
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewInvoice(invoice.id)}
                              title="View Invoice"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditInvoice(invoice.id)}
                              title="Edit Invoice"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendReminder(invoice.id)}
                              title="Send Payment Reminder"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}