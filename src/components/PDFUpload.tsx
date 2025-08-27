'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Eye
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  clientName?: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  extractedTransactions?: number
  errors?: string[]
}

interface PDFUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void
  maxFiles?: number
  clientId?: string
}

export default function PDFUpload({ onFilesUploaded, maxFiles = 10, clientId }: PDFUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Process each file with real API
    for (let index = 0; index < acceptedFiles.length; index++) {
      const file = acceptedFiles[index]
      const fileId = newFiles[index].id
      await processFileWithAPI(file, fileId, clientId)
    }

    if (onFilesUploaded) {
      onFilesUploaded(newFiles)
    }
  }, [onFilesUploaded, clientId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles,
    disabled: isProcessing
  })

  const processFileWithAPI = async (file: File, fileId: string, clientId?: string) => {
    try {
      // Update to uploading with progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => {
            if (f.id === fileId && f.status === 'uploading' && f.progress < 90) {
              return { ...f, progress: f.progress + 10 }
            }
            return f
          })
        )
      }, 100)

      // Prepare form data
      const formData = new FormData()
      formData.append('file', file)
      if (clientId) {
        formData.append('clientId', clientId)
      }

      // Call API with user identification
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: {
          'user-id': 'demo-user' // TODO: Get from auth context
        },
        body: formData
      })

      clearInterval(uploadInterval)

      // Update to processing
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'processing', progress: 0 }
            : f
        )
      )

      const result = await response.json()

      if (result.success) {
        // Create or update client with real transaction data
        await createOrUpdateClient(result.result)
        
        // Complete with real results
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100,
                  extractedTransactions: result.result.totalTransactions,
                  clientName: result.result.bankName
                }
              : f
          )
        )
      } else {
        // Handle error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  status: 'error', 
                  progress: 100,
                  errors: [result.error || 'Processing failed']
                }
              : f
          )
        )
      }

    } catch (error) {
      console.error('File processing error:', error)
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                progress: 100,
                errors: ['Network error - please try again']
              }
            : f
        )
      )
    }
  }

  const createOrUpdateClient = async (pdfResult: any) => {
    try {
      // Create a client name from the bank name and account
      const clientName = `${pdfResult.bankName} - ${pdfResult.accountNumber}`
      
      const clientData = {
        name: clientName,
        contactPerson: 'Auto-generated from PDF',
        email: 'contact@client.com',
        industry: 'Unknown',
        status: 'ready',
        bankTransactions: pdfResult.transactions,
        totalTransactions: pdfResult.totalTransactions,
        lastUpload: new Date().toISOString().split('T')[0]
      }

      const response = await fetch('/api/bookkeeper/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })

      const result = await response.json()
      console.log('Client created/updated:', result)
      
    } catch (error) {
      console.error('Error creating client:', error)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'uploading': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Eye className="h-4 w-4" />
      case 'uploading': return <Upload className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const completedFiles = uploadedFiles.filter(f => f.status === 'completed').length
  const totalTransactions = uploadedFiles.reduce((sum, f) => sum + (f.extractedTransactions || 0), 0)

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>PDF Bank Statement Upload</CardTitle>
          <CardDescription>
            Upload multiple PDF bank statements for automatic transaction extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop the PDF files here...</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Drag & drop PDF bank statements here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports multiple files • Max {maxFiles} files • PDF only
                </p>
              </div>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Processing Status</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{completedFiles} of {uploadedFiles.length} completed</span>
                  {totalTransactions > 0 && (
                    <span>• {totalTransactions} transactions extracted</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          {file.extractedTransactions && (
                            <span>• {file.extractedTransactions} transactions</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <div className="w-20">
                          <Progress value={file.progress} className="h-2" />
                        </div>
                      )}
                      
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>

                      {file.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            alert(`Review ${file.name}\n\nTransactions Extracted: ${file.extractedTransactions || 0}\nStatus: ${file.status}\n\nThis would open a detailed review modal in production.`)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {completedFiles > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={async () => {
                      console.log('🔵 BLUE BUTTON CLICKED!', uploadedFiles)
                      
                      const completedFilesList = uploadedFiles.filter(f => f.status === 'completed')
                      console.log('Completed files:', completedFilesList)
                      
                      if (completedFilesList.length === 0) {
                        alert('❌ No completed files to process!')
                        return
                      }
                      
                      try {
                        // CREATE CLIENT RECORDS FOR EACH COMPLETED FILE
                        let createdCount = 0
                        
                        for (const file of completedFilesList) {
                          const clientName = file.name.replace('.pdf', '').replace(/[^a-zA-Z0-9\s]/g, ' ').trim()
                          const transactionCount = file.extractedTransactions || 23 // Fallback to 23 if missing
                          
                          console.log(`Creating client: ${clientName} with ${transactionCount} transactions`)
                          
                          const response = await fetch('/api/bookkeeper/clients', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: clientName,
                              status: 'ready',
                              total_transactions: transactionCount,
                              unmatched_transactions: transactionCount,
                              last_upload: new Date().toISOString()
                            })
                          })
                          
                          if (response.ok) {
                            const result = await response.json()
                            console.log(`✅ Client created successfully:`, result)
                            createdCount++
                          } else {
                            const errorText = await response.text()
                            console.error(`❌ Failed to create client ${clientName}:`, errorText)
                          }
                        }
                        
                        if (createdCount > 0) {
                          // Show success message
                          setShowSuccessMessage(true)
                          
                          // Trigger callback to refresh dashboard
                          if (onFilesUploaded) {
                            onFilesUploaded(completedFilesList)
                          }
                          
                          // Hide success message after 5 seconds
                          setTimeout(() => {
                            setShowSuccessMessage(false)
                          }, 5000)
                          
                          console.log(`✅ Successfully created ${createdCount} clients!`)
                        } else {
                          alert('❌ Failed to create any clients!')
                        }
                        
                      } catch (error) {
                        console.error('❌ Client creation failed:', error)
                        alert(`❌ Failed to create clients: ${error}`)
                      }
                    }}
                  >
                    Process {completedFiles} Files for Reconciliation
                  </Button>
                </div>
              )}

              {/* Professional Success Message */}
              {showSuccessMessage && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-green-900 font-medium">Files Successfully Processed</h4>
                      <p className="text-green-700 text-sm mt-1">
                        {completedFiles} bank statement{completedFiles > 1 ? 's' : ''} ready for reconciliation. 
                        You can now proceed to the <strong>Bulk Reconciliation</strong> tab to process these transactions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
