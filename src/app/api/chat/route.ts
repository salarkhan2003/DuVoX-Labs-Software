import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withErrorHandler, AppError, ErrorCodes } from '@/lib/errors'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { validateRequestBody, chatMessageSchema, type ChatMessageData } from '@/lib/validation'

async function handleChatMessage(request: NextRequest) {
  // Validate request body
  const data: ChatMessageData = await validateRequestBody(request, chatMessageSchema)
  
  // Get or create chat session
  let session = await prisma.chatSession.findUnique({
    where: { sessionId: data.sessionId },
  })
  
  if (!session) {
    // Get client IP for session tracking
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const userIp = forwarded?.split(',')[0] || realIp || null
    
    session = await prisma.chatSession.create({
      data: {
        sessionId: data.sessionId,
        userIp,
      },
    })
  } else {
    // Update last activity
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    })
  }
  
  // Save user message
  const userMessage = await prisma.chatMessage.create({
    data: {
      sessionId: data.sessionId,
      message: data.message,
      sender: 'user',
    },
  })
  
  // Generate bot response (placeholder for now - will integrate with OpenAI later)
  const botResponse = generateBotResponse(data.message)
  
  // Save bot message
  const botMessage = await prisma.chatMessage.create({
    data: {
      sessionId: data.sessionId,
      message: botResponse,
      sender: 'bot',
    },
  })
  
  return NextResponse.json({
    success: true,
    data: {
      userMessage: {
        id: userMessage.id,
        message: userMessage.message,
        sender: userMessage.sender,
        timestamp: userMessage.createdAt,
      },
      botMessage: {
        id: botMessage.id,
        message: botMessage.message,
        sender: botMessage.sender,
        timestamp: botMessage.createdAt,
      },
    },
  })
}

// Simple bot response generator (placeholder)
function generateBotResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  if (message.includes('cradai') || message.includes('crad ai')) {
    return "CradAI is our revolutionary AI-powered platform that transforms how businesses interact with artificial intelligence. It provides intelligent automation, predictive analytics, and seamless integration capabilities. Would you like to know more about specific features or request a demo?"
  }
  
  if (message.includes('mobility') || message.includes('co-pilot')) {
    return "DuVoX Mobility Co-Pilot is our cutting-edge solution for intelligent transportation and logistics. It leverages advanced AI to optimize routes, predict maintenance needs, and enhance safety. Would you like to learn more about how it can benefit your operations?"
  }
  
  if (message.includes('demo') || message.includes('trial')) {
    return "I'd be happy to help you get started with a demo! You can request a personalized demonstration through our contact form, or I can connect you with our sales team. Which product are you most interested in - CradAI or Mobility Co-Pilot?"
  }
  
  if (message.includes('pricing') || message.includes('cost')) {
    return "Our pricing is tailored to your specific needs and scale. We offer flexible plans for both CradAI and Mobility Co-Pilot. I recommend scheduling a consultation with our team to discuss your requirements and get a customized quote. Would you like me to help you get in touch?"
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to DuVoX. I'm here to help you learn about our AI solutions - CradAI and Mobility Co-Pilot. What would you like to know more about?"
  }
  
  if (message.includes('help') || message.includes('support')) {
    return "I'm here to help! I can provide information about our products, help you request a demo, or connect you with our team. What specific information are you looking for?"
  }
  
  // Default response
  return "Thank you for your message! I'm here to help you learn about DuVoX's AI solutions. You can ask me about CradAI, Mobility Co-Pilot, request a demo, or get in touch with our team. How can I assist you today?"
}

// Get chat history endpoint
async function handleGetChatHistory(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'Session ID is required',
      400
    )
  }
  
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      message: true,
      sender: true,
      createdAt: true,
    },
  })
  
  return NextResponse.json({
    success: true,
    data: { messages },
  })
}

// Apply rate limiting and error handling
export const POST = withRateLimit(
  rateLimitConfigs.chat,
  withErrorHandler(handleChatMessage)
)

export const GET = withErrorHandler(handleGetChatHistory)