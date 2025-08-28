'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mail, 
  Smartphone, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MousePointer,
  AlertTriangle,
  DollarSign
} from 'lucide-react'

interface EmailTrackingEvent {
  id: string
  email: string
  event_type: string
  timestamp: string
  user_agent?: string
  ip_address?: string
  clicked_url?: string
  bounce_reason?: string
  device_info?: any
}

interface DeliveryRecord {
  id: string
  client_email: string
  client_name: string
  invoice_id: string
  delivery_channel: 'email' | 'sms' | 'phone'
  status: 'sent' | 'failed' | 'scheduled'
  error_message?: string
  message_id?: string
  phase: string
  sent_at: string
}

interface DeliveryStats {
  totalDeliveries: number
  emailSuccess: number
  smsSuccess: number
  phoneSuccess: number
  totalFailures: number
  guaranteeTriggered: number
}

export default function RealTrackingDashboard() {
  const [emailEvents, setEmailEvents] = useState<EmailTrackingEvent[]>([])
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([])
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStats>({
    totalDeliveries: 0,
    emailSuccess: 0,
    smsSuccess: 0,
    phoneSuccess: 0,
    totalFailures: 0,
    guaranteeTriggered: 0
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTrackingData()
    const interval = setInterval(fetchTrackingData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchTrackingData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch email tracking events
      const eventsResponse = await fetch('/api/tracking/email-events')
      if (eventsResponse.ok) {
        const events = await eventsResponse.json()
        setEmailEvents(events.data || [])
      }
      
      // Fetch delivery records
      const deliveryResponse = await fetch('/api/tracking/delivery-records')
      if (deliveryResponse.ok) {
        const records = await deliveryResponse.json()
        setDeliveryRecords(records.data || [])
      }
      
      // Fetch delivery statistics
      const statsResponse = await fetch('/api/tracking/delivery-stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setDeliveryStats(stats.data || {})
      }
      
    } catch (error) {
      console.error('Error fetching tracking data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'open': return <Eye className="w-4 h-4 text-blue-600" />
      case 'click': return <MousePointer className="w-4 h-4 text-purple-600" />
      case 'bounce': return <XCircle className="w-4 h-4 text-red-600" />
      case 'dropped': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default: return <Mail className="w-4 h-4 text-gray-600" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'click': return 'bg-purple-100 text-purple-800'
      case 'bounce': return 'bg-red-100 text-red-800'
      case 'dropped': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'sms': return <Smartphone className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getDeviceInfo = (deviceInfo: any) => {
    if (!deviceInfo) return 'Unknown Device'
    
    try {
      const parsed = typeof deviceInfo === 'string' ? JSON.parse(deviceInfo) : deviceInfo
      
      if (parsed.device?.family) {
        return `${parsed.device.family} ${parsed.device.brand || ''} ${parsed.device.model || ''}`.trim()
      }
      
      if (parsed.family && parsed.os?.family) {
        return `${parsed.family} on ${parsed.os.family}`
      }
      
      return parsed.family || 'Unknown Device'
    } catch {
      return 'Unknown Device'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📧 Real Email Tracking Dashboard</h1>
        <Button onClick={fetchTrackingData} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Across all channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Success</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveryStats.emailSuccess}</div>
            <p className="text-xs text-muted-foreground">
              Emails delivered successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Fallbacks</CardTitle>
            <Smartphone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{deliveryStats.smsSuccess}</div>
            <p className="text-xs text-muted-foreground">
              When email failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
            <Phone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{deliveryStats.phoneSuccess}</div>
            <p className="text-xs text-muted-foreground">
              When SMS failed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guarantee Alert */}
      {deliveryStats.guaranteeTriggered > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <DollarSign className="w-5 h-5" />
              <span>Money Back Guarantee Triggered</span>
              <Badge variant="destructive">{deliveryStats.guaranteeTriggered}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {deliveryStats.guaranteeTriggered} delivery failures require money back guarantees. 
              Check the delivery records for details.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="email-tracking">Email Tracking</TabsTrigger>
          <TabsTrigger value="delivery-records">Delivery Records</TabsTrigger>
          <TabsTrigger value="fallbacks">Fallbacks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Email Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Recent Email Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getEventIcon(event.event_type)}
                        <div>
                          <p className="font-medium text-sm">{event.email}</p>
                          <p className="text-xs text-gray-600">
                            {getDeviceInfo(event.device_info)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getEventColor(event.event_type)}>
                          {event.event_type}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatTimestamp(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Channel Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Email</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{deliveryStats.emailSuccess}</p>
                      <p className="text-xs text-gray-600">successful</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="text-sm">SMS</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{deliveryStats.smsSuccess}</p>
                      <p className="text-xs text-gray-600">successful</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{deliveryStats.phoneSuccess}</p>
                      <p className="text-xs text-gray-600">scheduled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Tracking Tab */}
        <TabsContent value="email-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Email Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getEventIcon(event.event_type)}
                        <Badge className={getEventColor(event.event_type)}>
                          {event.event_type.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{event.email}</p>
                        {event.device_info && (
                          <p className="text-sm text-gray-600">
                            Device: {getDeviceInfo(event.device_info)}
                          </p>
                        )}
                        {event.ip_address && (
                          <p className="text-sm text-gray-600">
                            IP: {event.ip_address}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        {event.clicked_url && (
                          <p className="text-sm text-gray-600">
                            Clicked: {event.clicked_url}
                          </p>
                        )}
                        {event.bounce_reason && (
                          <p className="text-sm text-red-600">
                            Bounce: {event.bounce_reason}
                          </p>
                        )}
                        {event.user_agent && (
                          <p className="text-xs text-gray-500 truncate">
                            {event.user_agent}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {emailEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No email tracking events yet. Send an email to see tracking data.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Records Tab */}
        <TabsContent value="delivery-records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Channel Delivery Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(record.delivery_channel)}
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {record.phase}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatTimestamp(record.sent_at)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{record.client_name}</p>
                        <p className="text-sm text-gray-600">{record.client_email}</p>
                        <p className="text-xs text-gray-500">Invoice: {record.invoice_id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">
                          Channel: {record.delivery_channel}
                        </p>
                        {record.message_id && (
                          <p className="text-xs text-gray-500">
                            ID: {record.message_id}
                          </p>
                        )}
                        {record.error_message && (
                          <p className="text-sm text-red-600">
                            Error: {record.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {deliveryRecords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No delivery records yet. Send invoice reminders to see delivery data.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fallbacks Tab */}
        <TabsContent value="fallbacks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMS Fallbacks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>SMS Fallbacks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Automatically triggered when emails fail
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">Pending SMS</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">Sent SMS</span>
                    <Badge variant="secondary">{deliveryStats.smsSuccess}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Call Fallbacks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Phone Call Fallbacks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Scheduled when SMS fails
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm">Scheduled Calls</span>
                    <Badge variant="secondary">{deliveryStats.phoneSuccess}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm">Completed Calls</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
