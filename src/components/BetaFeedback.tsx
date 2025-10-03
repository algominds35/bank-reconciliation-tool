'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle } from 'lucide-react'

interface BetaFeedbackProps {
  userId?: string
  userEmail?: string
}

export default function BetaFeedback({ userId, userEmail }: BetaFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    'Bug Report',
    'Feature Request',
    'User Experience',
    'Performance',
    'General Feedback',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim() || !category) return

    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('beta_feedback')
        .insert({
          user_id: userId,
          user_email: userEmail,
          category,
          rating,
          feedback: feedback.trim(),
          created_at: new Date().toISOString()
        })

      if (error) throw error

      setSubmitted(true)
      setFeedback('')
      setRating(null)
      setCategory('')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSubmitted(false)
        setIsOpen(false)
      }, 2000)

    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-lg border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Feedback Submitted!</h3>
                <p className="text-sm text-green-700">Thank you for helping improve ReconcileBook</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-full p-4"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="ml-2 hidden sm:inline">Beta Feedback</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Beta Feedback
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate this experience?
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating && star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think, what's working well, or what could be improved..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                rows={4}
                required
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategory('Bug Report')
                  setRating(1)
                  setFeedback('I encountered a bug: ')
                }}
                className="flex-1 text-xs"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Report Bug
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategory('Feature Request')
                  setRating(5)
                  setFeedback('I would love to see: ')
                }}
                className="flex-1 text-xs"
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Request Feature
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting || !feedback.trim() || !category}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your feedback helps shape the future of ReconcileBook
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
