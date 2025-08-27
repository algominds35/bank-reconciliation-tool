'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Shield,
  Lock
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  status: 'uploading' | 'completed' | 'processing' | 'error'
  category: string
  progress?: number
}

interface ClientInfo {
  name: string
  email: string
  businessName: string
  accountManager: string
}

export default function ClientPortalPage() {
  const [clientInfo] = useState<ClientInfo>({
    name: 'John Smith',
    email: 'john@business.com',
    businessName: 'Smith Consulting LLC',
    accountManager: 'ReconcileBook Team'
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [message, setMessage] = useState('')
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const fileId = `file-${Date.now()}-${Math.random()}`
      
      // Add file to state with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        category: categorizeFile(file.name),
        progress: 0
      }
      
      setUploadedFiles(prev => [...prev, newFile])
      
      // Simulate upload progress
      simulateUpload(fileId, file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const categorizeFile = (filename: string): string => {
    const lower = filename.toLowerCase()
    if (lower.includes('bank') || lower.includes('statement')) return 'Bank Statements'
    if (lower.includes('receipt') || lower.includes('expense')) return 'Receipts'
    if (lower.includes('invoice')) return 'Invoices'
    if (lower.includes('tax') || lower.includes('1099') || lower.includes('w2')) return 'Tax Documents'
    if (lower.includes('payroll')) return 'Payroll'
    return 'Other Documents'
  }

  const simulateUpload = async (fileId: string, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress }
            : f
        )
      )
    }
    
    // Simulate processing
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'processing', progress: undefined }
          : f
      )
    )
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete upload
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed' }
          : f
      )
    )
    
    // Send to backend API
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', categorizeFile(file.name))
      formData.append('clientEmail', clientInfo.email)
      
      await fetch('/api/client-portal/upload', {
        method: 'POST',
        body: formData
      })
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' }
            : f
        )
      )
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setIsSubmittingMessage(true)
    
    try {
      const response = await fetch('/api/client-portal/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: clientInfo.email,
          clientName: clientInfo.name,
          businessName: clientInfo.businessName,
          message: message
        })
      })
      
      if (response.ok) {
        setMessage('')
        alert('Message sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing': return <Clock className="h-4 w-4 text-orange-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-orange-100 text-orange-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const groupedFiles = uploadedFiles.reduce((groups, file) => {
    const category = file.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(file)
    return groups
  }, {} as Record<string, UploadedFile[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Secure Client Portal</h1>
          </div>
          <p className="text-gray-600">Upload documents and communicate with your bookkeeper</p>
        </div>

        {/* Client Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-semibold">{clientInfo.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Primary Contact</p>
                <p className="font-semibold">{clientInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{clientInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Manager</p>
                <p className="font-semibold">{clientInfo.accountManager}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Document Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload bank statements, receipts, invoices, and other financial documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: PDF, Images, Excel, CSV (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>All uploads are encrypted and secure</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Message Section */}
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>
                  Questions or special instructions for your bookkeeper
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSubmittingMessage}
                  className="w-full"
                >
                  {isSubmittingMessage ? 'Sending...' : 'Send Message'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Files Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Uploaded Documents</span>
                  </div>
                  <Badge variant="secondary">
                    {uploadedFiles.length} files
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents uploaded yet</p>
                    <p className="text-sm text-gray-500">
                      Upload your first document to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedFiles).map(([category, files]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
                        <div className="space-y-2">
                          {files.map((file) => (
                            <div key={file.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm font-medium truncate">
                                    {file.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(file.status)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(file.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{formatFileSize(file.size)}</span>
                                <Badge className={getStatusColor(file.status)}>
                                  {file.status}
                                </Badge>
                              </div>
                              
                              {file.status === 'uploading' && file.progress !== undefined && (
                                <Progress value={file.progress} className="mt-2 h-1" />
                              )}
                              
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(file.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
