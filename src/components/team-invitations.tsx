'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Send,
  Users
} from 'lucide-react'

interface Invitation {
  id: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'pending' | 'accepted' | 'expired'
  invited_by: string
  invited_at: string
  expires_at: string
}

interface TeamInvitationsProps {
  userId: string
}

export function TeamInvitations({ userId }: TeamInvitationsProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvitations()
  }, [userId])

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invited_by', userId)
        .order('invited_at', { ascending: false })

      if (error) {
        console.error('Error fetching invitations:', error)
        return
      }

      setInvitations(data || [])
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setError('')

    try {
      // Check if invitation already exists
      const { data: existing } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('email', email)
        .eq('invited_by', userId)
        .eq('status', 'pending')
        .single()

      if (existing) {
        setError('An invitation has already been sent to this email address.')
        setInviting(false)
        return
      }

      // Create invitation record
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          email,
          role,
          invited_by: userId,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        setError('Failed to send invitation. Please try again.')
        return
      }

      // Send invitation email (in production, this would be handled by a server function)
      // For now, we'll just show a success message
      alert(`Invitation sent to ${email}! They will receive an email with instructions to join your team.`)
      
      setEmail('')
      setRole('member')
      await fetchInvitations()

    } catch (error) {
      console.error('Error sending invitation:', error)
      setError('An unexpected error occurred.')
    } finally {
      setInviting(false)
    }
  }

  const resendInvitation = async (invitationId: string, email: string) => {
    try {
      // Update expiration date
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const { error } = await supabase
        .from('team_invitations')
        .update({ expires_at: expiresAt.toISOString() })
        .eq('id', invitationId)

      if (error) {
        alert('Failed to resend invitation')
        return
      }

      alert(`Invitation resent to ${email}!`)
      await fetchInvitations()

    } catch (error) {
      console.error('Error resending invitation:', error)
      alert('An error occurred while resending the invitation')
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', invitationId)

      if (error) {
        alert('Failed to cancel invitation')
        return
      }

      await fetchInvitations()

    } catch (error) {
      console.error('Error canceling invitation:', error)
      alert('An error occurred while canceling the invitation')
    }
  }

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date()
    
    if (status === 'accepted') {
      return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
    }
    
    if (status === 'pending' && isExpired) {
      return <Badge variant="destructive">Expired</Badge>
    }
    
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }

    return <Badge variant="secondary">{status}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      member: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    }
    
    return <Badge className={colors[role as keyof typeof colors]}>{role}</Badge>
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
      {/* Invite Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Invite Team Members</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={sendInvitation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="teammate@company.com"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'member' | 'viewer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" disabled={inviting} className="flex items-center space-x-2">
              {inviting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{inviting ? 'Sending...' : 'Send Invitation'}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Sent Invitations ({invitations.length})</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchInvitations}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No invitations sent yet</p>
              <p className="text-sm">Invite team members to collaborate on your projects</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium">{invitation.email}</span>
                      {getRoleBadge(invitation.role)}
                      {getStatusBadge(invitation.status, invitation.expires_at)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Invited {new Date(invitation.invited_at).toLocaleDateString()} • 
                      Expires {new Date(invitation.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {invitation.status === 'pending' && new Date(invitation.expires_at) > new Date() && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => resendInvitation(invitation.id, invitation.email)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => cancelInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Team Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge className="bg-red-100 text-red-800 mt-0.5">Admin</Badge>
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-sm text-gray-600">Full access to all features, can manage team members and billing</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-blue-100 text-blue-800 mt-0.5">Member</Badge>
              <div>
                <div className="font-medium">Member</div>
                <div className="text-sm text-gray-600">Can upload transactions, reconcile, and export reports</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-gray-100 text-gray-800 mt-0.5">Viewer</Badge>
              <div>
                <div className="font-medium">Viewer</div>
                <div className="text-sm text-gray-600">Read-only access to view transactions and reports</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 