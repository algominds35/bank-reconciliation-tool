'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface BankAccount {
  id: string
  account_id: string
  bank_name: string
  account_type: string
  last_four: string
  status: string
  connected_at: string
  last_sync: string | null
}

interface BankConnectionProps {
  onAccountsConnected?: (accounts: BankAccount[]) => void
}

export default function BankConnection({ onAccountsConnected }: BankConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      if (session) {
        await loadConnectedAccounts()
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      if (session) {
        loadConnectedAccounts()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load Stripe.js
  useEffect(() => {
    const loadStripe = async () => {
      if (typeof window !== 'undefined' && !window.Stripe) {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        document.head.appendChild(script)
      }
    }
    loadStripe()
  }, [])


  const loadConnectedAccounts = async () => {
    try {
      setIsLoading(true)
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/bank/store-accounts', {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setConnectedAccounts(data.accounts || [])
        onAccountsConnected?.(data.accounts || [])
      }
    } catch (error) {
      console.error('Failed to load connected accounts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load connected bank accounts',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectBank = async () => {
    try {
      setIsConnecting(true)

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Please log in to connect your bank account')
      }

      // Create Financial Connections session
      const sessionResponse = await fetch('/api/bank/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const sessionData = await sessionResponse.json()

      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Failed to create bank connection session')
      }

      // Wait for Stripe to load
      const stripe = await new Promise((resolve, reject) => {
        if (window.Stripe) {
          resolve(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
        } else {
          const checkStripe = setInterval(() => {
            if (window.Stripe) {
              clearInterval(checkStripe)
              resolve(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
            }
          }, 100)
          
          setTimeout(() => {
            clearInterval(checkStripe)
            reject(new Error('Stripe failed to load'))
          }, 10000)
        }
      })

      // Open Financial Connections modal
      const { error } = await (stripe as any).financialConnections.open({
        clientSecret: sessionData.client_secret
      })

      if (error) {
        throw new Error(error.message || 'Failed to open bank connection')
      }

      // Check session status after modal closes
      const statusResponse = await fetch(`/api/bank/session?session_id=${sessionData.session_id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const statusData = await statusResponse.json()

      if (statusData.success && statusData.session.accounts.length > 0) {
        // Store the connected accounts
        const storeResponse = await fetch('/api/bank/store-accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            accounts: statusData.session.accounts
          })
        })

        const storeData = await storeResponse.json()

        if (storeData.success) {
          await loadConnectedAccounts()
          toast({
            title: 'Success!',
            description: `Connected ${storeData.accounts_stored} bank account(s)`,
            variant: 'default'
          })
        }
      }

    } catch (error) {
      console.error('Bank connection error:', error)
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect bank account',
        variant: 'destructive'
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSyncTransactions = async (accountId: string) => {
    try {
      setIsSyncing(accountId)
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/bank/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          account_id: accountId,
          days: 30
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sync Complete',
          description: `Synced ${data.transactions_synced} transactions`,
          variant: 'default'
        })
        
        // Refresh accounts to update last_sync time
        await loadConnectedAccounts()
      } else {
        throw new Error(data.error || 'Failed to sync transactions')
      }

    } catch (error) {
      console.error('Transaction sync error:', error)
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Failed to sync transactions',
        variant: 'destructive'
      })
    } finally {
      setIsSyncing(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Connections
          </CardTitle>
          <CardDescription>
            Loading your connected bank accounts...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Bank Connections
        </CardTitle>
        <CardDescription>
          Connect your bank accounts to automatically sync transactions - no more CSV uploads!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connect New Bank Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleConnectBank}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Bank...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Bank Account
              </>
            )}
          </Button>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-800">No CSV Uploads</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-800">Real-time Sync</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-purple-800">All US Banks</span>
          </div>
        </motion.div>

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Connected Accounts</h3>
            <div className="space-y-3">
              {connectedAccounts.map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{account.bank_name}</div>
                      <div className="text-sm text-gray-600">
                        {account.account_type} •••• {account.last_four}
                      </div>
                      <div className="text-xs text-gray-500">
                        Connected {formatDate(account.connected_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={account.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {account.status}
                    </Badge>
                    
                    <Button
                      onClick={() => handleSyncTransactions(account.account_id)}
                      disabled={isSyncing === account.account_id}
                      size="sm"
                      variant="outline"
                    >
                      {isSyncing === account.account_id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Not Authenticated */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center py-8"
          >
            <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Please Log In
            </h3>
            <p className="text-gray-600 mb-4">
              You need to be logged in to connect your bank accounts.
            </p>
            <Button asChild>
              <a href="/auth/login">Log In</a>
            </Button>
          </motion.div>
        )}

        {/* No Accounts Connected */}
        {isAuthenticated && connectedAccounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center py-8"
          >
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Bank Accounts Connected
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your bank account to automatically sync transactions and eliminate CSV uploads.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
