import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default admin user
  const adminEmail = 'admin@duvox.com'
  const adminPassword = 'admin123' // Change this in production!
  
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'admin',
      },
    })

    console.log(`✅ Created admin user: ${admin.email}`)
    console.log(`🔑 Default password: ${adminPassword}`)
    console.log('⚠️  Please change the default password in production!')
  } else {
    console.log('ℹ️  Admin user already exists')
  }

  // Create some sample data for development
  if (process.env.NODE_ENV === 'development') {
    // Sample contact submissions
    const sampleContacts = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        message: 'Interested in learning more about CradAI for our business operations.',
        interest: 'CradAI',
      },
      {
        name: 'Jane Smith',
        email: 'jane@logistics.com',
        company: 'Logistics Plus',
        message: 'We need a mobility solution for our fleet management.',
        interest: 'Mobility',
      },
    ]

    for (const contact of sampleContacts) {
      const existing = await prisma.contactSubmission.findFirst({
        where: { email: contact.email },
      })

      if (!existing) {
        await prisma.contactSubmission.create({ data: contact })
        console.log(`✅ Created sample contact: ${contact.email}`)
      }
    }

    // Sample beta signups
    const sampleSignups = [
      {
        email: 'beta1@startup.com',
        product: 'CradAI',
        company: 'StartupCo',
        useCase: 'AI-powered customer service automation',
      },
      {
        email: 'beta2@transport.com',
        product: 'Mobility',
        company: 'Transport Solutions',
        useCase: 'Fleet optimization and route planning',
      },
    ]

    for (const signup of sampleSignups) {
      const existing = await prisma.betaSignup.findFirst({
        where: { email: signup.email },
      })

      if (!existing) {
        await prisma.betaSignup.create({ data: signup })
        console.log(`✅ Created sample beta signup: ${signup.email}`)
      }
    }
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })