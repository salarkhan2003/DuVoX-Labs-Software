import { NextRequest } from 'next/server'
import { z } from 'zod'

import { AppError, ErrorCodes } from './errors'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  interest: z.enum(['CradAI', 'Mobility', 'Partnership', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid interest option' })
  }),
})

// Beta signup validation schema
export const betaSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  product: z.enum(['CradAI', 'Mobility'], {
    errorMap: () => ({ message: 'Please select a valid product' })
  }),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  useCase: z.string().max(500, 'Use case must be less than 500 characters').optional(),
})

// Chat message validation schema
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message must be less than 1000 characters'),
  sessionId: z.string().min(1, 'Session ID is required'),
})

// User login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// User registration validation schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  role: z.enum(['admin', 'user']).default('admin'),
})

// Page view tracking schema
export const pageViewSchema = z.object({
  page: z.string().min(1, 'Page is required'),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
})

/**
 * Validate request body against a Zod schema
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        400,
        error.errors
      )
    }
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'Invalid request body',
      400
    )
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  try {
    const params = Object.fromEntries(searchParams.entries())
    return schema.parse(params)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid query parameters',
        400,
        error.errors
      )
    }
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'Invalid query parameters',
      400
    )
  }
}

// Export types for use in API routes
export type ContactFormData = z.infer<typeof contactFormSchema>
export type BetaSignupData = z.infer<typeof betaSignupSchema>
export type ChatMessageData = z.infer<typeof chatMessageSchema>
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type PageViewData = z.infer<typeof pageViewSchema>