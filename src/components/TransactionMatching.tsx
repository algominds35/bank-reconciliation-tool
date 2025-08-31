'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Database, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Eye,
  Download
} from 'lucide-react'
import PDFUpload from './PDFUpload'

interface Client {
  id: string
  name: string
  email: string
  status: string
  total_transactions?: number
  unmatched_transactions?: number
  last_upload?: string
}

interface TransactionMatch {
  id: string
  bankTransaction: any
  bookTransaction?: any
  matchType: 'exact' | 'fuzzy' | 'manual' | 'unmatched'
  confidence: number
  difference?: number
  notes?: string
}

export default function TransactionMatching() {
  const [activeTab, setActiveTab] = useState('upload')
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [matches, setMatches] = useState<TransactionMatch[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const handleBankUpload = async (files: any[]) => {
    console.log('Bank files uploaded:', files)
    // Refresh clients list
    await loadClients()
  }

  const handleQuickBooksUpload = async (files: any[]) => {
    console.log('QuickBooks files uploaded:', files)
    // Refresh clients list
    await loadClients()
  }

  const loadClients = async () => {
    try {
      const response = await fetch('/api/bookkeeper/clients', {
        headers: { 'user-id': 'demo-user' }
      })
      const data = await response.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
  }

  const runMatching = async (clientId: string) => {
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const response = await fetch('/api/bulk-reconciliation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'demo-user'
        },
        body: JSON.stringify({
          clientJobs: [{
            clientId: clientId,
            clientName: selectedClient?.name || 'Unknown Client'
          }]
        })
      })

      clearInterval(progressInterval)
      setProcessingProgress(100)

      const result = await response.json()
      
      if (result.success) {
        // Transform matches to our format
        const transformedMatches: TransactionMatch[] = result.result.jobs[0]?.matches?.map((match: any) => ({
          id: match.id,
          bankTransaction: match.bankTransaction,
          bookTransaction: match.bookTransaction,
          matchType: match.matchType,
          confidence: match.confidence,
          difference: match.difference,
          notes: match.notes
        })) || []

        setMatches(transformedMatches)
        setActiveTab('results')
      } else {
        console.error('Matching failed:', result.error)
      }
    } catch (error) {
      console.error('Matching error:', error)
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const approveMatch = (matchId: string) => {
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, status: 'approved' }
          : match
      )
    )
  }

  const rejectMatch = (matchId: string) => {
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, status: 'rejected' }
          : match
      )
    )
  }

  const exportResults = () => {
    const approvedMatches = matches.filter(m => m.status === 'approved')
    const csvContent = generateCSV(approvedMatches)
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reconciliation-results-${selectedClient?.name || 'client'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateCSV = (matches: TransactionMatch[]) => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Match Confidence', 'Notes']
    const rows = matches.map(match => [
      match.bankTransaction.date,
      match.bankTransaction.description,
      match.bankTransaction.amount,
      match.bankTransaction.type,
      `${(match.confidence * 100).toFixed(1)}%`,
      match.notes || ''
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Transaction Matching</span>
          </CardTitle>
          <CardDescription>
            Upload bank statements and QuickBooks data for AI-powered transaction matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="process">Process Matches</TabsTrigger>
              <TabsTrigger value="results">Review Results</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>Bank Statements</span>
                    </CardTitle>
                    <CardDescription>
                      Upload bank statement CSV files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFUpload 
                      fileType="bank"
                      onFilesUploaded={handleBankUpload}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>QuickBooks Data</span>
                    </CardTitle>
                    <CardDescription>
                      Upload QuickBooks CSV export
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFUpload 
                      fileType="quickbooks"
                      onFilesUploaded={handleQuickBooksUpload}
                    />
                  </CardContent>
                </Card>
              </div>

              {clients.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready Clients</CardTitle>
                    <CardDescription>
                      Clients with uploaded data ready for matching
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clients.map(client => (
                        <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-gray-600">
                              {client.total_transactions || 0} transactions
                            </p>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedClient(client)
                              setActiveTab('process')
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Process
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              {selectedClient ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Process Matches for {selectedClient.name}</CardTitle>
                    <CardDescription>
                      AI will match bank transactions to QuickBooks data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isProcessing ? (
                      <div className="space-y-4">
                        <Progress value={processingProgress} className="h-2" />
                        <p className="text-sm text-gray-600">
                          Processing {processingProgress}% complete...
                        </p>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => runMatching(selectedClient.id)}
                        className="w-full"
                        size="lg"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Start AI Matching
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">Please select a client to process</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {matches.length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Matching Results</CardTitle>
                          <CardDescription>
                            Review and approve AI-generated matches
                          </CardDescription>
                        </div>
                        <Button onClick={exportResults}>
                          <Download className="h-4 w-4 mr-2" />
                          Export Results
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {matches.map(match => (
                          <div key={match.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge className={
                                  match.confidence >= 0.9 ? 'bg-green-100 text-green-800' :
                                  match.confidence >= 0.7 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-orange-100 text-orange-800'
                                }>
                                  {(match.confidence * 100).toFixed(0)}% match
                                </Badge>
                                <span className="text-sm text-gray-600">{match.matchType}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm"
                                  onClick={() => approveMatch(match.id)}
                                  variant="outline"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => rejectMatch(match.id)}
                                  variant="outline"
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm mb-2">Bank Transaction</h4>
                                <div className="text-sm space-y-1">
                                  <p><strong>Date:</strong> {match.bankTransaction.date}</p>
                                  <p><strong>Description:</strong> {match.bankTransaction.description}</p>
                                  <p><strong>Amount:</strong> ${match.bankTransaction.amount}</p>
                                </div>
                              </div>
                              
                              {match.bookTransaction && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">QuickBooks Transaction</h4>
                                  <div className="text-sm space-y-1">
                                    <p><strong>Date:</strong> {match.bookTransaction.date}</p>
                                    <p><strong>Description:</strong> {match.bookTransaction.description}</p>
                                    <p><strong>Amount:</strong> ${match.bookTransaction.amount}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {match.notes && (
                              <p className="text-sm text-gray-600 mt-2">{match.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">No matches to display</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
