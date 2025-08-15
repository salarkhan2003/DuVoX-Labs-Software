import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateRequestBody, loginSchema, type LoginData } from '@/lib/validation'
import { withErrorHandler, AppError, ErrorCodes } from '@/lib/errors'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { comparePassword, generateToken } from '@/lib/auth'

async function handleLogin(request: NextRequest) {
  // Validate request body
  const data: LoginData = await validateRequestBody(request, loginSchema)
  
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })
  
  if (!user) {
    throw new AppError(
      ErrorCodes.AUTHENTICATION_ERROR,
      'Invalid email or password',
      401
    )
  }
  
  // Verify password
  const isValidPassword = await comparePassword(data.password, user.passwordHash)
  if (!isValidPassword) {
    throw new AppError(
      ErrorCodes.AUTHENTICATION_ERROR,
      'Invalid email or password',
      401
    )
  }
  
  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
  
  // Create response with token
  const response = NextResponse.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    },
  })
  
  // Set HTTP-only cookie for additional security
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
  
  return response
}

// Apply rate limiting and error handling
export const POST = withRateLimit(
  rateLimitConfigs.auth,
  withErrorHandler(handleLogin)
)