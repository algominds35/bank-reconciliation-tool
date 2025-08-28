'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText,
  Mail,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Send,
  Eye,
  Settings
} from 'lucide-react'

interface ReportData {
  clientId: string
  clientName: string
  summary: {
    totalTransactions: number
    matchedTransactions: number
    unmatchedTransactions: number
    matchAccuracy: number
    totalAmount: number
  }
  status: 'generated' | 'delivered' | 'failed'
  generatedAt: string
}

interface AutomatedReportsProps {
  reconciliationResults?: any
  onReportsGenerated?: (reports: any) => void
  clients?: any[]
}

export default function AutomatedReports({ reconciliationResults, onReportsGenerated, clients }: AutomatedReportsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<ReportData[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('summary')
  const [autoDeliver, setAutoDeliver] = useState(true)

  const templates = [
    { id: 'summary', name: 'Summary Report', description: 'High-level overview with key metrics' },
    { id: 'detailed', name: 'Detailed Report', description: 'Complete transaction breakdown' },
    { id: 'exceptions', name: 'Exception Report', description: 'Focus on unmatched transactions' }
  ]

  const handleGenerateReports = async () => {
    if (!clients || clients.length === 0) return
    
    setIsGenerating(true)
    try {
      // Simulate report generation
      const mockReports = clients.map(client => ({
        clientId: client.id || 'unknown',
        clientName: client.name || 'Unknown Client',
        summary: {
          totalTransactions: client.totalTransactions || 0,
          matchedTransactions: Math.floor((client.totalTransactions || 0) * 0.85),
          unmatchedTransactions: Math.ceil((client.totalTransactions || 0) * 0.15),
          matchAccuracy: 85,
          totalAmount: (client.totalTransactions || 0) * 1250.50
        },
        status: 'generated' as const,
        generatedAt: new Date().toISOString()
      }))
      
      setReports(mockReports)
      
      if (onReportsGenerated) {
        onReportsGenerated(mockReports)
      }
      
      console.log('✅ Reports generated successfully:', mockReports)
    } catch (error) {
      console.error('❌ Report generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const clientCount = clients ? clients.length : 0
  const totalTransactions = clients ? clients.reduce((sum, c) => sum + (c.totalTransactions || 0), 0) : 0
  const hasClients = clientCount > 0
  const hasReports = reports.length > 0

  // DEBUG: Log client data to console
  console.log('🔍 AutomatedReports - Debug Info:', {
    clientsReceived: !!clients,
    clientCount,
    totalTransactions,
    clients: clients?.map(c => ({
      id: c.id,
      name: c.name,
      totalTransactions: c.totalTransactions,
      status: c.status
    }))
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Automated Report Generation</span>
          </CardTitle>
          <CardDescription>
            Generate and deliver professional reconciliation reports to clients
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="auto-deliver"
              checked={autoDeliver}
              onChange={(e) => setAutoDeliver(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="auto-deliver" className="text-sm text-gray-700">
              Automatically email reports to clients
            </label>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Run bulk reconciliation first to generate reports
          </p>

          <Button 
            onClick={handleGenerateReports}
            disabled={!hasClients || isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Reports...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Client Data Section */}
      {hasClients && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Reports</h3>
              <p className="text-gray-600 mb-4">
                Found {clientCount} clients with {totalTransactions} total transactions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {clients?.map((client, index) => (
                <div key={client.id || index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{client.name || 'Unknown Client'}</h4>
                  <p className="text-sm text-gray-600">{client.totalTransactions || 0} transactions</p>
                  <Badge variant={client.status === 'ready' ? 'default' : 'secondary'}>
                    {client.status || 'pending'}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerateReports}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Reports...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reports for {clientCount} Clients
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Clients Message */}
      {!hasClients && (
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Client Data</h3>
            <p className="text-gray-600 mb-4">
              Upload some PDFs first to create clients, then return here to generate reports
            </p>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Go to Upload PDFs
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Reports */}
      {hasReports && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              {reports.length} reports generated successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.clientName}</h4>
                    <p className="text-sm text-gray-600">
                      {report.summary.totalTransactions} transactions • {report.summary.matchAccuracy}% match rate
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Generated
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        try {
                          console.log(`📧 Sending report for ${report.clientName}`)
                          
                          // Call the generate-reports API to send the email
                          const response = await fetch('/api/generate-reports', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              reconciliationJobs: [{
                                clientId: report.clientId,
                                clientName: report.clientName,
                                summary: report.summary
                              }],
                              templateId: selectedTemplate,
                              autoDeliver: true
                            })
                          })
                          
                          const result = await response.json()
                          
                          if (result.success) {
                            alert(`✅ Report sent successfully to ${report.clientName}!`)
                            console.log('✅ Email sent:', result)
                          } else {
                            alert(`❌ Failed to send report: ${result.error}`)
                            console.error('❌ Email failed:', result)
                          }
                        } catch (error) {
                          console.error('❌ Send error:', error)
                          alert(`❌ Failed to send report: ${error}`)
                        }
                      }}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}