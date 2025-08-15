import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withErrorHandler, AppError, ErrorCodes } from '@/lib/errors'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { validateRequestBody, betaSignupSchema, type BetaSignupData } from '@/lib/validation'

async function handleBetaSignup(request: NextRequest) {
  // Validate request body
  const data: BetaSignupData = await validateRequestBody(request, betaSignupSchema)
  
  try {
    // Save to database
    const signup = await prisma.betaSignup.create({
      data: {
        email: data.email,
        product: data.product,
        company: data.company || null,
        useCase: data.useCase || null,
      },
    })
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Beta signup successful',
      data: {
        id: signup.id,
        product: signup.product,
        signedUpAt: signup.createdAt,
      },
    }, { status: 201 })
  } catch (error: any) {
    // Handle unique constraint violation (duplicate email)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new AppError(
        ErrorCodes.CONFLICT,
        'Email already registered for beta access',
        409
      )
    }
    throw error
  }
}

// Apply rate limiting and error handling
export const POST = withRateLimit(
  rateLimitConfigs.beta,
  withErrorHandler(handleBetaSignup)
)