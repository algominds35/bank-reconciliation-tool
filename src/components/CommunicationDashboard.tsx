'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Send,
  Reply,
  Archive,
  Star,
  Search,
  Filter,
  Plus
} from 'lucide-react'

interface ClientMessage {
  id: string
  clientName: string
  clientEmail: string
  businessName: string
  subject: string
  message: string
  timestamp: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high'
  category: 'general' | 'documents' | 'billing' | 'technical'
}

interface QuickReply {
  id: string
  title: string
  content: string
  category: string
}

export default function CommunicationDashboard() {
  const [messages, setMessages] = useState<ClientMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ClientMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showQuickReplies, setShowQuickReplies] = useState(false)

  const quickReplies: QuickReply[] = [
    {
      id: 'documents-received',
      title: 'Documents Received',
      content: `Hi {CLIENT_NAME},

Thank you for sending the documents! I've received them and will review everything within 24 hours.

I'll let you know if I need any additional information.

Best regards,
ReconcileBook Team`,
      category: 'documents'
    },
    {
      id: 'reconciliation-complete',
      title: 'Reconciliation Complete',
      content: `Hi {CLIENT_NAME},

Your monthly reconciliation is complete! Here's a quick summary:

✅ All transactions categorized
✅ Bank accounts reconciled  
✅ Financial statements updated
✅ Any discrepancies noted and resolved

Your reports are attached. Let me know if you have any questions!

Best,
ReconcileBook Team`,
      category: 'general'
    },
    {
      id: 'missing-documents',
      title: 'Missing Documents Follow-up',
      content: `Hi {CLIENT_NAME},

I'm working on your books and need a few additional documents to complete the reconciliation:

• Bank statement for {ACCOUNT_NAME} (missing pages)
• Credit card statement for {MONTH}
• Receipts for the following transactions: {TRANSACTION_LIST}

Could you please send these when you have a moment?

Thanks!
ReconcileBook Team`,
      category: 'documents'
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Review Meeting',
      content: `Hi {CLIENT_NAME},

I'd like to schedule a brief call to review your financial position and discuss any questions you might have.

I'm available:
• Tuesday 2-4 PM
• Wednesday 10 AM - 12 PM  
• Friday 1-3 PM

Which works best for you? The call should take about 30 minutes.

Best regards,
ReconcileBook Team`,
      category: 'general'
    }
  ]

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/client-messages')
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      } else {
        setMessages([]) // No mock data - show empty state
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessages([]) // No mock data - show empty state
    }
  }

  // NO MORE MOCK DATA - ALL REAL!

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    try {
      const response = await fetch('/api/send-client-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          clientEmail: selectedMessage.clientEmail,
          clientName: selectedMessage.clientName,
          replyContent: replyText,
          originalSubject: selectedMessage.subject
        })
      })

      if (response.ok) {
        // Update message status
        setMessages(prev => 
          prev.map(msg => 
            msg.id === selectedMessage.id 
              ? { ...msg, status: 'replied' as const }
              : msg
          )
        )
        setReplyText('')
        alert('Reply sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('Failed to send reply. Please try again.')
    }
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    if (!selectedMessage) return
    
    let content = quickReply.content
    content = content.replace(/{CLIENT_NAME}/g, selectedMessage.clientName)
    content = content.replace(/{BUSINESS_NAME}/g, selectedMessage.businessName)
    
    setReplyText(content)
    setShowQuickReplies(false)
  }

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: msg.status === 'unread' ? 'read' : msg.status }
          : msg
      )
    )
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = statusFilter === 'all' || message.status === statusFilter
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Communications</h2>
          <p className="text-gray-600">Manage all client messages and communications</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Badge className="bg-red-500">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <Mail className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Replied Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => 
                    m.status === 'replied' && 
                    new Date(m.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Reply className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.priority === 'high').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Messages</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      } ${message.status === 'unread' ? 'bg-yellow-50' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message)
                        markAsRead(message.id)
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {message.clientName} - {message.businessName}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate flex-1">
                          {message.message.substring(0, 100)}...
                        </p>
                        <p className="text-xs text-gray-500 ml-2">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail & Reply */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reply</span>
                {selectedMessage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                  >
                    Quick Replies
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  {/* Message Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">{selectedMessage.subject}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      From: {selectedMessage.clientName} ({selectedMessage.clientEmail})
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {/* Quick Replies */}
                  {showQuickReplies && (
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">Quick Replies</h5>
                      <div className="space-y-2">
                        {quickReplies.map((reply) => (
                          <Button
                            key={reply.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="w-full text-left justify-start"
                          >
                            {reply.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="space-y-3">
                    <Label htmlFor="reply">Your Reply</Label>
                    <Textarea
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={8}
                    />
                    <Button 
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a message to reply</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
