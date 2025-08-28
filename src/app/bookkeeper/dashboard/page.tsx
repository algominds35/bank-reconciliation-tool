'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BookkeeperDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Simple Dashboard</CardTitle>
            <CardDescription>Basic working page - no complex features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This is a simple, working page without any of the complex client management features that were causing problems.
            </p>
            <Button variant="outline">
              Basic Button
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
