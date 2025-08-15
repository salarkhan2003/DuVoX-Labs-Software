import { NextRequest, NextResponse } from 'next/server'

import { withErrorHandler } from '@/lib/errors'

async function handleLogout(request: NextRequest) {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: 'Logout successful',
  })
  
  // Clear the auth token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
  })
  
  return response
}

// Apply error handling
export const POST = withErrorHandler(handleLogout)