import { NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { withErrorHandler } from '@/lib/errors'

async function handleGetDashboard(request: NextRequest) {
  // Get dashboard statistics
  const [
    totalContacts,
    totalBetaSignups,
    recentContacts,
    recentBetaSignups,
    totalChatSessions,
  ] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.betaSignup.count(),
    prisma.contactSubmission.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        interest: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.betaSignup.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        product: true,
        company: true,
        createdAt: true,
      },
    }),
    prisma.chatSession.count(),
  ])
  
  return NextResponse.json({
    success: true,
    data: {
      statistics: {
        totalContacts,
        totalBetaSignups,
        totalChatSessions,
      },
      recentActivity: {
        contacts: recentContacts,
        betaSignups: recentBetaSignups,
      },
    },
  })
}

// Apply authentication and error handling
export const GET = requireAuth(withErrorHandler(handleGetDashboard))