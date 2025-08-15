import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

/**
 * Generate JWT token for user authentication
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Extract JWT token from request headers
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check for token in cookies
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }
  
  return null
}

/**
 * Middleware to verify authentication
 */
export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: { code: 'AUTHENTICATION_ERROR', message: 'No token provided' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return new Response(
        JSON.stringify({ error: { code: 'AUTHENTICATION_ERROR', message: 'Invalid token' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Add user info to request context
    ;(request as any).user = payload
    
    return handler(request, ...args)
  }
}