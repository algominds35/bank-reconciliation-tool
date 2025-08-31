'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Database,
  Calculator
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress?: number
  extractedTransactions?: number
  clientName?: string
  errors?: string[]
}

interface PDFUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void
  maxFiles?: number
  clientId?: string
  fileType?: 'bank' | 'quickbooks'
}

interface ClientInfo {
  name: string
  email: string
}

export default function PDFUpload({ onFilesUploaded, maxFiles = 10, clientId, fileType = 'bank' }: PDFUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [clientInfoMap, setClientInfoMap] = useState<Record<string, ClientInfo>>({})

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

    // Call callback AFTER all files are processed
    if (onFilesUploaded) {
      onFilesUploaded(newFiles)
    }
  }, [onFilesUploaded, clientId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv']
    },
    maxFiles,
    disabled: isProcessing
  })

  const processFileWithAPI = async (file: File, fileId: string, clientId?: string) => {
    try {
      // Update to uploading with progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.min((f.progress || 0) + 10, 90) }
              : f
          )
        )
      }, 200)

      // Determine which API to call based on file type
      const apiEndpoint = fileType === 'quickbooks' ? '/api/upload-quickbooks' : '/api/process-pdf'
      
      const formData = new FormData()
      formData.append('file', file)
      
      if (fileType === 'bank') {
        // For bank files, collect client info if not provided
        const clientInfo = clientInfoMap[fileId] || {
          name: file.name.replace(/\.(pdf|csv)$/i, ''),
          email: `client-${Date.now()}@example.com`
        }
        formData.append('clientName', clientInfo.name)
        formData.append('clientEmail', clientInfo.email)
      } else {
        // For QuickBooks files, require client ID
        if (!clientId) {
          throw new Error('Client ID required for QuickBooks upload')
        }
        formData.append('clientId', clientId)
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'user-id': 'demo-user' },
        body: formData
      })

      clearInterval(uploadInterval)

      const result = await response.json()

      if (result.success) {
        // Complete with real results
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100,
                  extractedTransactions: result.result.totalTransactions,
                  clientName: result.result.bankName || result.result.fileName
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

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'uploading':
      case 'processing':
        return <Database className="h-5 w-5 text-blue-600 animate-pulse" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'uploading':
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {fileType === 'quickbooks' ? (
              <>
                <Calculator className="h-5 w-5" />
                <span>Upload QuickBooks Data</span>
              </>
            ) : (
              <>
                <Database className="h-5 w-5" />
                <span>Upload Bank Statement</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {fileType === 'quickbooks' 
              ? 'Upload QuickBooks CSV export to match with bank transactions'
              : 'Upload bank statement (PDF or CSV) to extract transactions'
            }
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
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive 
                ? 'Drop files here...' 
                : `Drag & drop ${fileType === 'quickbooks' ? 'QuickBooks CSV' : 'bank statement'} files here`
              }
            </p>
            <p className="text-sm text-gray-600 mb-4">
              or click to select files
            </p>
            <p className="text-xs text-gray-500">
              Supports {fileType === 'quickbooks' ? 'CSV' : 'PDF and CSV'} files
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
            <CardDescription>Real-time file processing progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.extractedTransactions && (
                        <p className="text-xs text-green-600">
                          {file.extractedTransactions} transactions extracted
                        </p>
                      )}
                      {file.errors && file.errors.length > 0 && (
                        <p className="text-xs text-red-600">
                          {file.errors[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {file.status === 'uploading' && (
                      <div className="w-24">
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}

                    <Badge className={getStatusColor(file.status)}>
                      {file.status}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Files uploaded successfully!
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
