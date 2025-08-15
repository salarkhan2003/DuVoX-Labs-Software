import { NextRequest } from 'next/server'
import { AppError, ErrorCodes } from './errors'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string // Custom key generator
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Get client identifier for rate limiting
 */
function getClientKey(request: NextRequest, keyGenerator?: (req: NextRequest) => string): string {
  if (keyGenerator) {
    return keyGenerator(request)
  }
  
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  return `rate_limit:${ip}`
}

/**
 * Clean up expired entries from rate limit store
 */
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest) => {
    const key = getClientKey(request, config.keyGenerator)
    const now = Date.now()
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      cleanupExpiredEntries()
    }
    
    let entry = rateLimitStore.get(key)
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
      }
      rateLimitStore.set(key, entry)
      return null // No rate limit exceeded
    }
    
    if (entry.count >= config.maxRequests) {
      const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000)
      throw new AppError(
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        `Rate limit exceeded. Try again in ${resetInSeconds} seconds.`,
        429,
        {
          resetTime: entry.resetTime,
          limit: config.maxRequests,
          windowMs: config.windowMs,
        }
      )
    }
    
    // Increment counter
    entry.count++
    rateLimitStore.set(key, entry)
    
    return null // No rate limit exceeded
  }
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // General API endpoints
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  
  // Contact form submissions
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  
  // Chat messages
  chat: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  },
  
  // Beta signups
  beta: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 3,
  },
}

/**
 * Wrapper to apply rate limiting to API handlers
 */
export function withRateLimit(config: RateLimitConfig, handler: Function) {
  const rateLimiter = rateLimit(config)
  
  return async (request: NextRequest, ...args: any[]) => {
    await rateLimiter(request)
    return handler(request, ...args)
  }
}