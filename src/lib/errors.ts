import { NextResponse } from 'next/server'

export enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
}

export interface APIError {
  error: {
    code: ErrorCodes
    message: string
    details?: any
    timestamp: string
  }
}

export class AppError extends Error {
  public readonly code: ErrorCodes
  public readonly statusCode: number
  public readonly details?: any

  constructor(code: ErrorCodes, message: string, statusCode: number = 500, details?: any) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.name = 'AppError'
  }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  code: ErrorCodes,
  message: string,
  statusCode: number = 500,
  details?: any
): NextResponse {
  const errorResponse: APIError = {
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  }

  return NextResponse.json(errorResponse, { status: statusCode })
}

/**
 * Handle errors in API routes
 */
export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return createErrorResponse(error.code, error.message, error.statusCode, error.details)
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Unique constraint')) {
      return createErrorResponse(ErrorCodes.CONFLICT, 'Resource already exists', 409)
    }

    if (error.message.includes('Record to update not found')) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, 'Resource not found', 404)
    }

    // Generic error
    return createErrorResponse(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }

  return createErrorResponse(ErrorCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred', 500)
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleAPIError(error)
    }
  }
}