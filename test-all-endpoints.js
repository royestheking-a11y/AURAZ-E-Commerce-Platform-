// Test all API endpoints
require('dotenv').config({ path: '.env.local' });

const http = require('http');

const API_BASE = 'http://localhost:3001/api';

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${path}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ path, status: res.statusCode, success: json.success, count: json.data?.length || 0 });
        } catch (e) {
          resolve({ path, status: res.statusCode, error: 'Invalid JSON' });
        }
      });
    }).on('error', (err) => {
      reject({ path, error: err.message });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing all API endpoints...\n');
  
  const endpoints = [
    '/ping',
    '/test-connection',
    '/products',
    '/users',
    '/orders',
    '/carousel',
    '/vouchers',
    '/promo-cards',
    '/payments',
    '/refunds',
    '/notifications',
    '/reviews',
    '/conversations',
    '/settings',
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      results.push(result);
      const status = result.status === 200 ? '✅' : '❌';
      const count = result.count ? ` (${result.count} items)` : '';
      console.log(`${status} ${endpoint.padEnd(20)} ${result.status}${count}`);
    } catch (error) {
      results.push({ path: endpoint, error: error.error });
      console.log(`❌ ${endpoint.padEnd(20)} ERROR: ${error.error}`);
    }
  }
  
  console.log('\n📊 Summary:');
  const success = results.filter(r => r.status === 200).length;
  const failed = results.filter(r => r.status !== 200 || r.error).length;
  console.log(`   ✅ Working: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints working!');
  } else {
    console.log('\n⚠️  Some endpoints failed. Make sure server is running.');
  }
}

// Wait a bit for server to be ready
setTimeout(runTests, 2000);

