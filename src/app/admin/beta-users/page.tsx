'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Activity, MessageSquare, Calendar, Mail } from 'lucide-react'

interface BetaUser {
  id: string
  user_id: string
  email: string
  signup_date: string
  signup_source: string
  status: 'active' | 'inactive' | 'converted'
  last_login: string | null
  total_logins: number
  files_uploaded: number
  transactions_processed: number
  feedback_submitted: number
  features_used: string[]
  notes: string | null
}

export default function BetaUsersDashboard() {
  const [betaUsers, setBetaUsers] = useState<BetaUser[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    converted: 0,
    totalLogins: 0,
    totalFiles: 0,
    totalTransactions: 0
  })

  useEffect(() => {
    fetchBetaUsers()
  }, [])

  const fetchBetaUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('beta_users')
        .select('*')
        .order('signup_date', { ascending: false })

      if (error) throw error

      setBetaUsers(data || [])

      // Calculate stats
      const total = data?.length || 0
      const active = data?.filter(u => u.status === 'active').length || 0
      const inactive = data?.filter(u => u.status === 'inactive').length || 0
      const converted = data?.filter(u => u.status === 'converted').length || 0
      const totalLogins = data?.reduce((sum, u) => sum + (u.total_logins || 0), 0) || 0
      const totalFiles = data?.reduce((sum, u) => sum + (u.files_uploaded || 0), 0) || 0
      const totalTransactions = data?.reduce((sum, u) => sum + (u.transactions_processed || 0), 0) || 0

      setStats({
        total,
        active,
        inactive,
        converted,
        totalLogins,
        totalFiles,
        totalTransactions
      })
    } catch (error) {
      console.error('Error fetching beta users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('beta_users')
        .update({ status })
        .eq('id', userId)

      if (error) throw error

      // Refresh the data
      fetchBetaUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'converted':
        return <Badge className="bg-blue-100 text-blue-800">Converted</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beta Users Dashboard</h1>
          <p className="text-gray-600">Manage and track beta program participants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Beta Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Logins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLogins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Files Uploaded</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Beta Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Beta Users ({betaUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Signup Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {betaUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">
                            {user.last_login ? `Last login: ${formatDate(user.last_login)}` : 'Never logged in'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.signup_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Logins: {user.total_logins}</div>
                          <div>Files: {user.files_uploaded}</div>
                          <div>Transactions: {user.transactions_processed}</div>
                          <div>Feedback: {user.feedback_submitted}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className={user.status === 'active' ? 'bg-green-50' : ''}
                          >
                            Active
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, 'inactive')}
                            className={user.status === 'inactive' ? 'bg-gray-50' : ''}
                          >
                            Inactive
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, 'converted')}
                            className={user.status === 'converted' ? 'bg-blue-50' : ''}
                          >
                            Converted
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Features Used Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Features Used by Beta Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['CSV Upload', 'Excel Processing', 'Auto-Matching', 'Duplicate Detection', 'Single-File Analysis', 'PDF Export', 'Client Management', 'Invoice Collections'].map((feature) => {
                const count = betaUsers.filter(user => 
                  user.features_used && user.features_used.includes(feature)
                ).length
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                
                return (
                  <div key={feature} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{feature}</div>
                    <div className="text-xs text-gray-500">{percentage}% of users</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
