const axios = require('axios');

// Test the authentication flow exactly as the frontend would
async function debugAuthentication() {
  console.log('🔍 Debugging Frontend Authentication Flow\n');

  const API_BASE = 'http://localhost:5001/api';
  
  try {
    // Test 1: Check if backend is accessible
    console.log('1. Testing backend accessibility...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend accessible:', healthResponse.data.message);

    // Test 2: Test CORS headers
    console.log('\n2. Testing CORS configuration...');
    try {
      const corsResponse = await axios.get(`${API_BASE}/health`, {
        headers: {
          'Origin': 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ CORS working correctly');
    } catch (corsError) {
      console.log('❌ CORS issue detected:', corsError.message);
    }

    // Test 3: Test login flow with sample user
    console.log('\n3. Testing login exactly as frontend would...');
    const loginData = {
      email: 'john@devnovate.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log('✅ Login successful');
    console.log('Response structure:', {
      success: loginResponse.data.success,
      hasData: !!loginResponse.data.data,
      hasToken: !!(loginResponse.data.data && loginResponse.data.data.token),
      userName: loginResponse.data.data?.name,
      userEmail: loginResponse.data.data?.email
    });

    // Test 4: Test token usage
    console.log('\n4. Testing protected endpoint with token...');
    const token = loginResponse.data.data.token;
    
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log('✅ Protected endpoint accessible with token');
    console.log('Profile data:', {
      name: profileResponse.data.data.name,
      email: profileResponse.data.data.email,
      role: profileResponse.data.data.role
    });

    // Test 5: Test blog creation flow
    console.log('\n5. Testing blog creation flow...');
    const blogData = {
      title: 'Debug Test Blog',
      content: '# Debug Test\n\nTesting authentication and blog creation.',
      excerpt: 'A debug test blog',
      category: 'Technology',
      tags: 'debug, test'
    };

    const createResponse = await axios.post(`${API_BASE}/blogs`, blogData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log('✅ Blog creation successful');
    console.log('Created blog:', {
      id: createResponse.data.data._id,
      title: createResponse.data.data.title,
      status: createResponse.data.data.status
    });

    // Test 6: Test retrieving user's blogs
    console.log('\n6. Testing user blogs retrieval...');
    const myBlogsResponse = await axios.get(`${API_BASE}/blogs/my/blogs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log('✅ User blogs retrieval successful');
    console.log(`Found ${myBlogsResponse.data.data.blogs.length} user blogs`);

    console.log('\n🎉 Authentication flow is working perfectly!');
    console.log('\n💡 If you\'re experiencing frontend auth issues, check:');
    console.log('• Browser console for JavaScript errors');
    console.log('• Network tab for failed requests');
    console.log('• Local storage for token persistence');
    console.log('• REACT_APP_API_URL environment variable');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
    if (error.request) {
      console.error('Request failed - no response received');
      console.error('Request config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
    }
  }
}

// Run the debug
debugAuthentication();
