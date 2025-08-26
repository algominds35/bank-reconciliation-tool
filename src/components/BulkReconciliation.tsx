'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Zap,
  TrendingUp,
  Eye
} from 'lucide-react'

interface Client {
  id: string
  name: string
  lastUpload?: string
  bankTransactions?: any[]
  status: 'ready' | 'processing' | 'completed' | 'error' | 'pending' | 'needs_review'
  progress?: number
  matches?: number
  unmatched?: number
  unmatchedTransactions?: number
  totalTransactions?: number
}

interface BulkReconciliationProps {
  clients: Client[]
  onReconciliationComplete?: (results: any) => void
}

export default function BulkReconciliation({ clients, onReconciliationComplete }: BulkReconciliationProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedClients, setProcessedClients] = useState<Client[]>([])
  const [results, setResults] = useState<any>(null)

  const readyClients = clients.filter(c => c.bankTransactions && c.bankTransactions.length > 0)
  const totalTransactions = readyClients.reduce((sum, c) => sum + (c.bankTransactions?.length || 0), 0)

  const handleBulkReconciliation = async () => {
    if (readyClients.length === 0) return

    setIsProcessing(true)
    setProcessedClients(readyClients.map(c => ({ ...c, status: 'processing', progress: 0 })))

    try {
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProcessedClients(prev => 
          prev.map(client => ({
            ...client,
            progress: Math.min((client.progress || 0) + Math.random() * 20, 95)
          }))
        )
      }, 500)

      // Call the API
      const response = await fetch('/api/bulk-reconciliation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientJobs: readyClients.map(client => ({
            clientId: client.id,
            clientName: client.name,
            bankTransactions: client.bankTransactions || []
          }))
        })
      })

      clearInterval(progressInterval)

      const result = await response.json()

      if (result.success) {
        // Update clients with results
        const updatedClients = result.result.jobs.map((job: any) => ({
          id: job.clientId,
          name: job.clientName,
          bankTransactions: job.bankTransactions,
          status: job.status,
          progress: 100,
          matches: job.matches.filter((m: any) => m.matchType !== 'unmatched').length,
          unmatched: job.unmatchedBank.length + job.unmatchedBook.length,
          lastUpload: new Date().toISOString().split('T')[0],
          unmatchedTransactions: job.unmatchedBank.length + job.unmatchedBook.length,
          totalTransactions: job.bankTransactions?.length || 0
        }))

        setProcessedClients(updatedClients)
        setResults(result.result)

        if (onReconciliationComplete) {
          onReconciliationComplete(result.result)
        }
      } else {
        throw new Error(result.error)
      }

    } catch (error) {
      console.error('Bulk reconciliation error:', error)
      setProcessedClients(prev => 
        prev.map(client => ({ ...client, status: 'error', progress: 100 }))
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'ready': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      case 'ready': return <Play className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Bulk Action Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Bulk Reconciliation</span>
          </CardTitle>
          <CardDescription>
            Process reconciliation for multiple clients simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{readyClients.length}</p>
                <p className="text-sm text-gray-600">Clients Ready</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
              {results && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{results.totalMatches}</p>
                    <p className="text-sm text-gray-600">Matches Found</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{results.totalUnmatched}</p>
                    <p className="text-sm text-gray-600">Need Review</p>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={handleBulkReconciliation}
              disabled={isProcessing || readyClients.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Process All Clients
                </>
              )}
            </Button>
          </div>

          {results && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Bulk reconciliation completed successfully!
                </span>
              </div>
              <p className="text-sm text-green-700">
                Processed {results.completedJobs}/{results.totalJobs} clients in {(results.processingTime / 1000).toFixed(1)} seconds
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {processedClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
            <CardDescription>Real-time reconciliation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(client.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {client.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {client.bankTransactions?.length || 0} bank transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {client.status === 'processing' && (
                      <div className="w-24">
                        <Progress value={client.progress} className="h-2" />
                      </div>
                    )}

                    {client.status === 'completed' && (
                      <div className="text-right text-sm">
                        <p className="text-green-600 font-medium">
                          {client.matches} matches
                        </p>
                        {client.unmatched! > 0 && (
                          <p className="text-yellow-600">
                            {client.unmatched} need review
                          </p>
                        )}
                      </div>
                    )}

                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>

                    {client.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {readyClients.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-4">
              Upload PDF bank statements to automatically create clients and enable bulk reconciliation. The system will extract transactions and create client profiles automatically.
            </p>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Upload PDFs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
