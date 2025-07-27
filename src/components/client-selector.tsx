'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Client } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

interface ClientSelectorProps {
  clients: Client[]
  selectedClientId: string | null
  onClientChange: (clientId: string | null) => void
  loading?: boolean
}

export function ClientSelector({ clients, selectedClientId, onClientChange, loading }: ClientSelectorProps) {
  const selectedClient = clients.find(c => c.id === selectedClientId)

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Client:</span>
      </div>
      
      <Select
        value={selectedClientId || 'all'}
        onValueChange={(value) => onClientChange(value === 'all' ? null : value)}
        disabled={loading}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a client">
            {selectedClient ? (
              <div className="flex items-center space-x-2">
                <span>{selectedClient.business_name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedClient.name}
                </Badge>
              </div>
            ) : (
              <span>All Clients</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex flex-col">
                <span className="font-medium">{client.business_name}</span>
                <span className="text-xs text-gray-500">{client.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 