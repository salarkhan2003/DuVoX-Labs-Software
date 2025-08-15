const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database for DuVoX Website...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one with DATABASE_URL');
  process.exit(1);
}

// Read .env file to check DATABASE_URL
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n🗄️  Running database migrations...');
  try {
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.log('\n⚠️  Migration failed. This might be because:');
    console.log('   - Database server is not running');
    console.log('   - Database connection string is incorrect');
    console.log('   - Database doesn\'t exist yet');
    console.log('\n📝 You can manually run migrations later with:');
    console.log('   npx prisma migrate dev --name init');
  }
  
  console.log('\n🎯 Database setup completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Make sure your PostgreSQL database is running');
  console.log('   2. Update DATABASE_URL in .env with your database credentials');
  console.log('   3. Run: npm run db:migrate (if migrations failed above)');
  console.log('   4. Run: npm run dev to start the development server');
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}