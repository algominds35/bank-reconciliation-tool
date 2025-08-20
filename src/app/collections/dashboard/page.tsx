'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Send,
  RefreshCw,
  CheckCircle,
  XCircle,
  Settings,
  History,
  FileText
} from 'lucide-react'

interface CollectionStats {
  total: number
  overdue: number
  dueToday: number
  dueThisWeek: number
  friendly: number
  reminder: number
  final: number
}

export default function CollectionsDashboard() {
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [lastSent, setLastSent] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/collections/send-reminders')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const sendReminders = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/collections/send-reminders', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setLastSent(new Date().toLocaleString())
        fetchStats() // Refresh stats
        alert(`✅ Sent ${data.summary.emailsSent} reminders successfully!`)
      } else {
        alert('❌ Failed to send reminders')
      }
    } catch (error) {
      console.error('Failed to send reminders:', error)
      alert('❌ Error sending reminders')
    } finally {
      setSending(false)
    }
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Collections Dashboard
        </h1>
        <p className="text-gray-600">
          Manage automated payment reminders and track collection performance
        </p>
      </div>

      {/* Action Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Automated Collections</h3>
              <p className="text-gray-600">
                Send payment reminders automatically based on invoice status
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={sendReminders}
                disabled={sending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {sending ? 'Sending...' : 'Send Reminders Now'}
              </Button>
              <Button
                onClick={fetchStats}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          {lastSent && (
            <div className="mt-4 text-sm text-gray-600">
              Last sent: {lastSent}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Due Today</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.dueToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-2xl font-bold text-green-600">{stats.dueThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminder Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Reminder Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Friendly Reminders</span>
                </div>
                <Badge variant="secondary">{stats.friendly}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Payment Reminders</span>
                </div>
                <Badge variant="secondary">{stats.reminder}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Final Notices</span>
                </div>
                <Badge variant="secondary">{stats.final}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/settings/collections', '_blank')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Collection Settings
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/collections/history', '_blank')}
              >
                <History className="w-4 h-4 mr-2" />
                Reminder History
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/collections/templates', '_blank')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Email Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Automated Collections Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Detect Overdue</h4>
              <p className="text-sm text-gray-600">
                System automatically identifies overdue invoices from QuickBooks
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Smart Timing</h4>
              <p className="text-sm text-gray-600">
                Sends appropriate reminders based on how many days overdue
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Professional Emails</h4>
              <p className="text-sm text-gray-600">
                Sends personalized, professional payment reminder emails
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Track Results</h4>
              <p className="text-sm text-gray-600">
                Monitors email delivery and tracks payment responses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
