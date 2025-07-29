'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Smartphone, 
  Key,
  Copy,
  QrCode,
  AlertTriangle
} from 'lucide-react'

interface TwoFactorAuthProps {
  userId: string
  userEmail: string
}

export function TwoFactorAuth({ userId, userEmail }: TwoFactorAuthProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isEnabling, setIsEnabling] = useState(false)
  const [isDisabling, setIsDisabling] = useState(false)
  const [setupStep, setSetupStep] = useState<'disabled' | 'generating' | 'verify' | 'enabled'>('disabled')
  const [secretKey, setSecretKey] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkTwoFactorStatus()
  }, [userId])

  const checkTwoFactorStatus = async () => {
    try {
      // Check if user has 2FA enabled
      const { data, error } = await supabase
        .from('user_mfa_factors')
        .select('*')
        .eq('user_id', userId)
        .eq('factor_type', 'totp')
        .eq('status', 'verified')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking 2FA status:', error)
        return
      }

      if (data) {
        setIsEnabled(true)
        setSetupStep('enabled')
      } else {
        setIsEnabled(false)
        setSetupStep('disabled')
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSecret = () => {
    // Generate a random secret key (in production, this would be done server-side)
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(20)), byte => 
      byte.toString(16).padStart(2, '0')
    ).join('').toUpperCase()
    
    setSecretKey(secret)
    
    // Generate QR code URL for authenticator apps
    const issuer = 'ReconcileBook'
    const label = `${issuer}:${userEmail}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
    
    setQrCodeUrl(qrUrl)
    setSetupStep('verify')
  }

  const startSetup = () => {
    setIsEnabling(true)
    setError('')
    setSetupStep('generating')
    generateSecret()
  }

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    try {
      // In production, you would verify the TOTP code server-side
      // For demo purposes, we'll accept any 6-digit code
      if (!/^\d{6}$/.test(verificationCode)) {
        setError('Invalid verification code format')
        return
      }

      // Generate backup codes
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      )
      setBackupCodes(codes)

      // Store 2FA settings (in production, this would be handled securely server-side)
      const { error } = await supabase
        .from('user_mfa_factors')
        .insert({
          user_id: userId,
          factor_type: 'totp',
          secret_key: secretKey,
          status: 'verified',
          backup_codes: codes
        })

      if (error) {
        setError('Failed to enable 2FA. Please try again.')
        return
      }

      setIsEnabled(true)
      setSetupStep('enabled')
      setIsEnabling(false)
      setVerificationCode('')

    } catch (error) {
      console.error('Error enabling 2FA:', error)
      setError('An unexpected error occurred')
    }
  }

  const disable2FA = async () => {
    setIsDisabling(true)
    setError('')

    try {
      const { error } = await supabase
        .from('user_mfa_factors')
        .delete()
        .eq('user_id', userId)
        .eq('factor_type', 'totp')

      if (error) {
        setError('Failed to disable 2FA. Please try again.')
        return
      }

      setIsEnabled(false)
      setSetupStep('disabled')
      setSecretKey('')
      setQrCodeUrl('')
      setBackupCodes([])

    } catch (error) {
      console.error('Error disabling 2FA:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsDisabling(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
    alert('Copied to clipboard!')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isEnabled ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldX className="h-5 w-5 text-red-600" />
              )}
              <span>Two-Factor Authentication</span>
            </div>
            <Badge variant={isEnabled ? 'default' : 'secondary'}>
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Add an extra layer of security to your account by requiring a verification code from your mobile device.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {setupStep === 'disabled' && (
            <Button 
              onClick={startSetup} 
              disabled={isEnabling}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>{isEnabling ? 'Setting up...' : 'Enable 2FA'}</span>
            </Button>
          )}

          {setupStep === 'enabled' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm">Two-factor authentication is active on your account</span>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={disable2FA}
                disabled={isDisabling}
                className="flex items-center space-x-2"
              >
                <ShieldX className="h-4 w-4" />
                <span>{isDisabling ? 'Disabling...' : 'Disable 2FA'}</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Steps */}
      {setupStep === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Setup Authenticator App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: QR Code */}
            <div>
              <h3 className="font-medium mb-3 flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>1. Scan QR Code</span>
              </h3>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="2FA QR Code" 
                    className="mx-auto mb-4"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>
            </div>

            {/* Step 2: Manual Entry */}
            <div>
              <h3 className="font-medium mb-3 flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>2. Or Enter Manually</span>
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono break-all">{secretKey}</code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(secretKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: Verify */}
            <div>
              <h3 className="font-medium mb-3">3. Enter Verification Code</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono text-lg"
                  maxLength={6}
                />
                <Button 
                  onClick={verifyAndEnable}
                  disabled={verificationCode.length !== 6}
                >
                  Verify & Enable
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Codes */}
      {backupCodes.length > 0 && setupStep === 'enabled' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Backup Codes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Save these backup codes!</p>
                  <p>Use these codes to access your account if you lose your authenticator device. Each code can only be used once.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backupCodes.map((code, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded font-mono text-center">
                  {code}
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Codes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 