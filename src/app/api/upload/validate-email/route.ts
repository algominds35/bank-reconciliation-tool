import { NextRequest, NextResponse } from 'next/server';
import { getTemporaryResults, checkEmailUsage, markEmailAsUsed } from '@/lib/temporaryStorage';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email } = await request.json();
    
    if (!sessionId || !email) {
      return NextResponse.json(
        { error: 'Session ID and email are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Check if email has already been used
    if (checkEmailUsage(email)) {
      return NextResponse.json(
        { error: 'This email has already been used for a free CSV upload. Please start your free trial to continue processing CSV files.' },
        { status: 409 } // Conflict
      );
    }
    
    // Get temporary results
    const results = getTemporaryResults(sessionId);
    
    if (!results) {
      return NextResponse.json(
        { error: 'Session expired. Please upload your CSV file again.' },
        { status: 404 }
      );
    }
    
    // Mark email as used
    markEmailAsUsed(email);
    
    // Return results with email
    return NextResponse.json({
      success: true,
      email,
      results: {
        sessionId,
        summary: results.summary,
        transactions: results.transactions.slice(0, 10),
        duplicates: results.duplicates.slice(0, 10),
        unmatched: results.unmatched.slice(0, 10),
      }
    });
    
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate email' },
      { status: 500 }
    );
  }
}
