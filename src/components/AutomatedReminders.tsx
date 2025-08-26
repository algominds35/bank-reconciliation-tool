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
  Bell, 
  Clock, 
  Mail, 
  Calendar, 
  Users, 
  Send,
  Edit,
  Trash2,
  Plus,
  PlayCircle,
  PauseCircle,
  CheckCircle
} from 'lucide-react'

interface ReminderTemplate {
  id: string
  name: string
  subject: string
  message: string
  triggerType: 'days_after' | 'monthly' | 'quarterly' | 'custom'
  triggerValue: number
  isActive: boolean
  category: 'onboarding' | 'documents' | 'follow_up' | 'reporting'
}

interface ScheduledReminder {
  id: string
  clientName: string
  clientEmail: string
  templateId: string
  templateName: string
  scheduledDate: string
  status: 'pending' | 'sent' | 'failed'
  sentDate?: string
}

export default function AutomatedReminders() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([])
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([])
  const [activeTab, setActiveTab] = useState<'templates' | 'scheduled'>('templates')
  const [editingTemplate, setEditingTemplate] = useState<ReminderTemplate | null>(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)

  useEffect(() => {
    loadTemplates()
    loadScheduledReminders()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/reminder-templates')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const loadScheduledReminders = async () => {
    try {
      const response = await fetch('/api/scheduled-reminders')
      const data = await response.json()
      if (data.success) {
        setScheduledReminders(data.reminders)
      }
    } catch (error) {
      console.error('Failed to load scheduled reminders:', error)
    }
  }

  const defaultTemplates: ReminderTemplate[] = [
    {
      id: 'welcome-day1',
      name: 'Welcome Email (Day 1)',
      subject: 'Welcome to J2 Bookkeeping - Next Steps',
      message: `Hi {CLIENT_NAME},

Welcome to J2 Bookkeeping! We're excited to help streamline your financial operations.

Here's what happens next:
• We'll review your business requirements
• Schedule your consultation call within 24 hours
• Create your custom service plan
• Begin onboarding within 5 business days

Please have the following ready for our call:
✓ Recent bank statements (last 3 months)
✓ Current accounting software access
✓ List of specific pain points you want to solve

We'll be in touch soon!

Best regards,
Jimmie Williams
J2 Bookkeeping`,
      triggerType: 'days_after',
      triggerValue: 1,
      isActive: true,
      category: 'onboarding'
    },
    {
      id: 'document-reminder',
      name: 'Document Request Reminder',
      subject: 'Missing Documents - {CLIENT_NAME}',
      message: `Hi {CLIENT_NAME},

I hope you're doing well! I wanted to follow up on the documents we discussed for your bookkeeping setup.

Still needed:
• Bank statements (last 3 months)
• Credit card statements
• Current QuickBooks file (if applicable)
• Vendor and customer lists

Having these documents will help us get your books up to date quickly and accurately.

Could you please upload these to your secure client portal or email them to me by {DUE_DATE}?

Thanks!
Jimmie`,
      triggerType: 'days_after',
      triggerValue: 3,
      isActive: true,
      category: 'documents'
    },
    {
      id: 'monthly-checkin',
      name: 'Monthly Check-in',
      subject: 'Monthly Financial Update - {CLIENT_NAME}',
      message: `Hi {CLIENT_NAME},

Hope your business is going well! Time for our monthly check-in.

This month I've completed:
✓ Bank reconciliation for all accounts
✓ Categorized all transactions
✓ Updated your financial statements
✓ Identified any discrepancies or issues

Your reports are ready and will be sent separately. 

Questions for you:
1. Any new business expenses or income sources?
2. Planning any major purchases or investments?
3. Any bookkeeping concerns or questions?

Let me know if you'd like to schedule a quick call to review your numbers.

Best,
Jimmie`,
      triggerType: 'monthly',
      triggerValue: 1,
      isActive: true,
      category: 'reporting'
    },
    {
      id: 'quarterly-review',
      name: 'Quarterly Business Review',
      subject: 'Q{QUARTER} Review Ready - {CLIENT_NAME}',
      message: `Hi {CLIENT_NAME},

Your Q{QUARTER} financial review is complete! Here's a quick summary:

📊 Key Metrics:
• Revenue: {REVENUE}
• Expenses: {EXPENSES}  
• Net Profit: {PROFIT}
• Cash Position: {CASH}

📈 Insights:
• Revenue trend vs last quarter
• Top expense categories
• Cash flow analysis
• Tax planning recommendations

I've prepared your complete quarterly report with detailed P&L, Balance Sheet, and Cash Flow statements.

Would you like to schedule a 30-minute review call to go through these numbers and discuss strategy for next quarter?

Best regards,
Jimmie`,
      triggerType: 'quarterly',
      triggerValue: 1,
      isActive: true,
      category: 'reporting'
    },
    {
      id: 'follow-up-no-response',
      name: 'Follow-up (No Response)',
      subject: 'Checking In - {CLIENT_NAME}',
      message: `Hi {CLIENT_NAME},

I wanted to follow up on my previous email. I know you're busy running your business!

I'm here to help make your bookkeeping as smooth as possible. If there's anything blocking you from moving forward, please let me know.

Common concerns I can help with:
• "I don't have time to gather documents" - I can work with what you have
• "My books are a mess" - That's exactly what I specialize in fixing
• "I'm not sure what I need" - Let's start with a simple conversation

Would a quick 15-minute call help clarify next steps?

I'm here when you're ready.

Best,
Jimmie`,
      triggerType: 'days_after',
      triggerValue: 7,
      isActive: true,
      category: 'follow_up'
    }
  ]

  const handleSaveTemplate = async (template: ReminderTemplate) => {
    try {
      const response = await fetch('/api/reminder-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      })

      if (response.ok) {
        await loadTemplates()
        setEditingTemplate(null)
        setShowTemplateForm(false)
      }
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const toggleTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) return

      await handleSaveTemplate({
        ...template,
        isActive: !template.isActive
      })
    } catch (error) {
      console.error('Failed to toggle template:', error)
    }
  }

  const sendTestEmail = async (templateId: string) => {
    try {
      const response = await fetch('/api/send-test-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          templateId,
          testEmail: 'jimmie@j2bookkeeping.com'
        })
      })

      if (response.ok) {
        alert('Test email sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send test email:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      onboarding: 'bg-blue-100 text-blue-800',
      documents: 'bg-orange-100 text-orange-800',
      follow_up: 'bg-purple-100 text-purple-800',
      reporting: 'bg-green-100 text-green-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Initialize with default templates if none exist
  useEffect(() => {
    if (templates.length === 0) {
      setTemplates(defaultTemplates)
    }
  }, [templates.length])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automated Reminders</h2>
          <p className="text-gray-600">Manage client communication workflows</p>
        </div>
        <Button onClick={() => setShowTemplateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {templates.filter(t => t.isActive).length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledReminders.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledReminders.filter(r => 
                    r.status === 'sent' && 
                    r.sentDate === new Date().toISOString().split('T')[0]
                  ).length}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledReminders.filter(r => r.status === 'sent').length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('templates')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button
          variant={activeTab === 'scheduled' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('scheduled')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Scheduled
        </Button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Trigger:</strong> {' '}
                      {template.triggerType === 'days_after' && `${template.triggerValue} days after intake`}
                      {template.triggerType === 'monthly' && 'Monthly'}
                      {template.triggerType === 'quarterly' && 'Quarterly'}
                      {template.triggerType === 'custom' && `Custom: ${template.triggerValue} days`}
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="whitespace-pre-wrap line-clamp-3">
                        {template.message.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendTestEmail(template.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTemplate(template.id)}
                    >
                      {template.isActive ? (
                        <PauseCircle className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Scheduled Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          {scheduledReminders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Reminders</h3>
                <p className="text-gray-600">
                  Reminders will appear here when clients trigger automated workflows
                </p>
              </CardContent>
            </Card>
          ) : (
            scheduledReminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{reminder.clientName}</h4>
                      <p className="text-sm text-gray-600">{reminder.clientEmail}</p>
                      <p className="text-sm text-gray-600">{reminder.templateName}</p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(reminder.status)}>
                        {reminder.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {reminder.status === 'sent' ? 'Sent' : 'Scheduled'}: {' '}
                        {reminder.sentDate || reminder.scheduledDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
