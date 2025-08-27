'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Download,
  Send,
  Play,
  FileText
} from 'lucide-react'

interface ClientDetailsModalProps {
  client: any
  isOpen: boolean
  onClose: () => void
  onStartReconciliation?: () => void
  onGenerateReport?: () => void
}

export default function ClientDetailsModal({ 
  client, 
  isOpen, 
  onClose, 
  onStartReconciliation,
  onGenerateReport 
}: ClientDetailsModalProps) {
  if (!client) return null

  const matchedTransactions = Math.floor((client.totalTransactions || 0) * 0.87)
  const needReview = (client.totalTransactions || 0) - matchedTransactions
  const matchPercentage = client.totalTransactions > 0 ? Math.round((matchedTransactions / client.totalTransactions) * 100) : 0

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-yellow-100 text-yellow-800'
      case 'needs_review': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-blue-600" />
            {client.name}
          </DialogTitle>
          <DialogDescription>
            Complete reconciliation details and quick actions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(client.status)}>
                  {client.status || 'Unknown'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(client.lastUpload || client.last_upload)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Statement Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Statement Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Statement Period
                  </p>
                  <p className="text-sm">January 1 - 31, 2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Account
                  </p>
                  <p className="text-sm">Business Checking ****{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{client.totalTransactions || 0}</p>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{matchedTransactions}</p>
                  <p className="text-sm text-gray-600">Matched</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{needReview}</p>
                  <p className="text-sm text-gray-600">Need Review</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reconciliation Progress</span>
                  <span className="font-medium">{matchPercentage}%</span>
                </div>
                <Progress value={matchPercentage} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{matchPercentage}% Match Rate</span>
                </div>
                {needReview > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{needReview} items need review</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={onStartReconciliation}
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Reconciliation
                </Button>
                
                <Button 
                  onClick={onGenerateReport}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    // Export CSV functionality
                    console.log('Exporting CSV for client:', client.name)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={async () => {
                    try {
                      console.log('Sending report to client:', client.name)
                      
                      // Call the generate reports API for this specific client
                      const response = await fetch('/api/generate-reports', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          reconciliationJobs: [{
                            clientId: client.id,
                            clientName: client.name,
                            totalTransactions: client.totalTransactions || 0,
                            matchedTransactions: Math.floor((client.totalTransactions || 0) * 0.87),
                            unmatchedTransactions: Math.ceil((client.totalTransactions || 0) * 0.13)
                          }],
                          templateId: 'summary',
                          autoDeliver: true
                        })
                      })
                      
                      const result = await response.json()
                      
                      if (result.success) {
                        alert(`✅ Report sent successfully to ${client.name}!\n\nDelivery details:\n• Client report sent to their email\n• Summary sent to your email`)
                      } else {
                        alert(`❌ Failed to send report: ${result.error}`)
                      }
                    } catch (error) {
                      console.error('Send report error:', error)
                      alert('❌ Failed to send report. Please try again.')
                    }
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Client
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
