import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateRequestBody, registerSchema, type RegisterData } from '@/lib/validation'
import { withErrorHandler, AppError, ErrorCodes } from '@/lib/errors'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { hashPassword, generateToken } from '@/lib/auth'

async function handleRegister(request: NextRequest) {
  // Validate request body
  const data: RegisterData = await validateRequestBody(request, registerSchema)
  
  try {
    // Hash password
    const passwordHash = await hashPassword(data.password)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
      },
    })
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    
    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      },
    }, { status: 201 })
    
    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
    
    return response
  } catch (error: any) {
    // Handle unique constraint violation (duplicate email)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new AppError(
        ErrorCodes.CONFLICT,
        'Email already registered',
        409
      )
    }
    throw error
  }
}

// Apply rate limiting and error handling
export const POST = withRateLimit(
  rateLimitConfigs.auth,
  withErrorHandler(handleRegister)
)