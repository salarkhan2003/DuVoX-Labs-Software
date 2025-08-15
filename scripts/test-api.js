const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test data
const testData = {
  contact: {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    message: 'This is a test message for the contact form.',
    interest: 'CradAI'
  },
  betaSignup: {
    email: 'beta@example.com',
    product: 'CradAI',
    company: 'Beta Company',
    useCase: 'Testing the beta signup functionality'
  },
  chat: {
    message: 'Hello, tell me about CradAI',
    sessionId: 'test-session-' + Date.now()
  },
  auth: {
    email: 'admin@duvox.com',
    password: 'admin123'
  }
};

async function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test contact form
    console.log('📝 Testing contact form...');
    const contactResult = await makeRequest('POST', '/api/contact', testData.contact);
    console.log(`Status: ${contactResult.status}`);
    console.log(`Response: ${JSON.stringify(contactResult.data, null, 2)}\n`);

    // Test beta signup
    console.log('🚀 Testing beta signup...');
    const betaResult = await makeRequest('POST', '/api/beta-signup', testData.betaSignup);
    console.log(`Status: ${betaResult.status}`);
    console.log(`Response: ${JSON.stringify(betaResult.data, null, 2)}\n`);

    // Test chat
    console.log('💬 Testing chat...');
    const chatResult = await makeRequest('POST', '/api/chat', testData.chat);
    console.log(`Status: ${chatResult.status}`);
    console.log(`Response: ${JSON.stringify(chatResult.data, null, 2)}\n`);

    // Test auth login
    console.log('🔐 Testing authentication...');
    const authResult = await makeRequest('POST', '/api/auth/login', testData.auth);
    console.log(`Status: ${authResult.status}`);
    console.log(`Response: ${JSON.stringify(authResult.data, null, 2)}\n`);

    if (authResult.data.data && authResult.data.data.token) {
      // Test protected endpoint
      console.log('🛡️  Testing protected endpoint...');
      const token = authResult.data.data.token;
      
      const protectedReq = new Promise((resolve, reject) => {
        const url = new URL('/api/admin/dashboard', BASE_URL);
        const options = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        };

        const req = http.request(url, options, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(body);
              resolve({ status: res.statusCode, data: response });
            } catch (e) {
              resolve({ status: res.statusCode, data: body });
            }
          });
        });

        req.on('error', reject);
        req.end();
      });

      const dashboardResult = await protectedReq;
      console.log(`Status: ${dashboardResult.status}`);
      console.log(`Response: ${JSON.stringify(dashboardResult.data, null, 2)}\n`);
    }

    console.log('✅ API testing completed!');

  } catch (error) {
    console.error('❌ API testing failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

// Check if server is running first
console.log('🔍 Checking if development server is running...');
makeRequest('GET', '/api/health').then(() => {
  testAPI();
}).catch(() => {
  console.log('❌ Development server is not running.');
  console.log('💡 Start the server first:');
  console.log('   npm run dev');
  console.log('\nThen run this test script again:');
  console.log('   node scripts/test-api.js');
});