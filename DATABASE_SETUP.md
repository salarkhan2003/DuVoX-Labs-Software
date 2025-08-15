# Database Setup Guide

This guide will help you set up the PostgreSQL database for the DuVoX futuristic startup website.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud-based)

## Database Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a database named `duvox_website`
3. Update the `DATABASE_URL` in `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/duvox_website"
   ```

### Option 2: Cloud Database (Recommended)
Use a cloud service like:
- **Supabase** (Free tier available)
- **Railway** (Free tier available)
- **Neon** (Free tier available)
- **PlanetScale** (MySQL alternative)

For Supabase:
1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string and update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update the `.env` file with your database connection string:
```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Database Setup
```bash
npm run db:setup
```

This will:
- Generate Prisma client
- Run database migrations
- Create all necessary tables

### 4. Seed Database (Optional)
```bash
npm run db:seed
```

This creates:
- Default admin user (`admin@duvox.com` / `admin123`)
- Sample contact submissions
- Sample beta signups

## Database Schema

The database includes the following tables:

### Users
- Admin authentication
- JWT-based sessions
- Role-based access control

### Contact Submissions
- Contact form data
- Status tracking
- Interest categorization

### Beta Signups
- Product beta registrations
- Use case tracking
- Email uniqueness

### Chat Sessions & Messages
- AI chatbot conversations
- Session management
- Message history

### Page Views
- Analytics tracking
- User behavior data
- Referrer information

## Available Scripts

```bash
# Setup database (generate + migrate)
npm run db:setup

# Generate Prisma client only
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Open Prisma Studio (Database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## API Endpoints

Once the database is set up, the following API endpoints will be available:

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/beta-signup` - Beta program signup
- `POST /api/chat` - AI chatbot messages
- `GET /api/chat?sessionId=xxx` - Get chat history

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/logout` - Logout

### Protected Endpoints (Require Authentication)
- `GET /api/admin/dashboard` - Admin dashboard data

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS Configuration**: Proper cross-origin policies

## Rate Limits

- General API: 100 requests per 15 minutes
- Contact form: 5 submissions per hour
- Authentication: 5 attempts per 15 minutes
- Chat messages: 10 messages per minute
- Beta signups: 3 signups per 24 hours

## Troubleshooting

### Migration Errors
If migrations fail:
1. Check database connection string
2. Ensure database server is running
3. Verify database exists
4. Check user permissions

### Connection Issues
- Verify `DATABASE_URL` format
- Check firewall settings
- Ensure database accepts connections
- Test connection with database client

### Development Tips
- Use `npm run db:studio` to view/edit data
- Check logs for detailed error messages
- Use `npm run db:reset` to start fresh (development only)

## Production Considerations

1. **Environment Variables**: Use strong, unique secrets
2. **Database Hosting**: Use managed database service
3. **Connection Pooling**: Configure for high traffic
4. **Backups**: Set up automated backups
5. **Monitoring**: Monitor database performance
6. **SSL**: Ensure SSL connections in production

## Next Steps

After database setup:
1. Start development server: `npm run dev`
2. Test API endpoints with tools like Postman
3. Access admin dashboard after creating admin user
4. Customize chatbot responses in `/api/chat/route.ts`
5. Configure external services (OpenAI, Google Maps, etc.)