import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withErrorHandler } from '@/lib/errors'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { validateRequestBody, contactFormSchema, type ContactFormData } from '@/lib/validation'

async function handleContactSubmission(request: NextRequest) {
  // Validate request body
  const data: ContactFormData = await validateRequestBody(request, contactFormSchema)
  
  // Save to database
  const submission = await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company || null,
      message: data.message,
      interest: data.interest,
      status: 'new',
    },
  })
  
  // Return success response
  return NextResponse.json({
    success: true,
    message: 'Contact form submitted successfully',
    data: {
      id: submission.id,
      submittedAt: submission.createdAt,
    },
  }, { status: 201 })
}

// Apply rate limiting and error handling
export const POST = withRateLimit(
  rateLimitConfigs.contact,
  withErrorHandler(handleContactSubmission)
)