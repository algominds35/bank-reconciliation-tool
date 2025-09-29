'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import ResultsPreview from './ResultsPreview';
import EmailModal from './EmailModal';
import { useToast } from '@/hooks/use-toast';

interface CSVResult {
  sessionId: string;
  summary: {
    totalTransactions: number;
    duplicatesFound: number;
    unmatchedCount: number;
    timeSaved: number;
  };
  transactions: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
  }>;
  duplicates: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
  }>;
  unmatched: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
  }>;
}

export default function CSVDropZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<CSVResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [uploadedSessionId, setUploadedSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('csv', file);

      const response = await fetch('/api/upload/anonymous', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process CSV file');
      }

      const data = await response.json();
      
      // Store session ID and show email modal instead of results
      setUploadedSessionId(data.sessionId);
      setShowEmailModal(true);
      
      toast({
        title: "CSV Processed Successfully!",
        description: "Enter your email to view your reconciliation results.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process CSV';
      setError(errorMessage);
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleEmailSuccess = (results: CSVResult) => {
    setResults(results);
    setShowEmailModal(false);
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    setUploadedSessionId(null);
  };

  // Show results if we have them
  if (results) {
    return (
      <ResultsPreview results={results} onSignup={() => {}} />
    );
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-[#F45B49] bg-[#F45B49]/5' 
            : 'border-slate-300 hover:border-slate-400'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => document.getElementById('csv-upload')?.click()}
      >
        <input
          id="csv-upload"
          type="file"
          accept=".csv,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="h-12 w-12 text-[#F45B49] animate-spin" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Processing Your CSV...</h4>
                <p className="text-sm text-slate-600">Finding duplicates and matching transactions</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div>
                <h4 className="font-semibold text-red-600 mb-1">
                  {error.includes('already used') ? 'Free Trial Used' : 'Upload Failed'}
                </h4>
                <p className="text-sm text-red-500 mb-3">{error}</p>
                {error.includes('already used') ? (
                  <button 
                    onClick={() => window.location.href = '/#pricing'}
                    className="mt-2 px-4 py-2 bg-[#F45B49] text-white text-sm rounded-lg hover:bg-[#E24C3A] transition-colors"
                  >
                    Start Free Trial
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setError(null);
                    }}
                    className="mt-2 text-sm text-[#F45B49] hover:underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Upload className="h-12 w-12 text-slate-400" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  {isDragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
                </h4>
                <p className="text-sm text-slate-600 mb-2">
                  or click to browse your files
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>CSV files only • Max 10MB</span>
                  </div>
                  <a 
                    href="/sample-bank-transactions.csv" 
                    download="sample-bank-transactions.csv"
                    className="flex items-center gap-1 text-[#F45B49] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-3 w-3" />
                    <span>Download sample CSV</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Indicators */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>One-Time Only</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Professional</span>
        </div>
      </div>

      {/* Email Modal */}
      {uploadedSessionId && (
        <EmailModal
          isOpen={showEmailModal}
          onClose={handleEmailModalClose}
          sessionId={uploadedSessionId}
          onSuccess={handleEmailSuccess}
        />
      )}
    </div>
  );
}
