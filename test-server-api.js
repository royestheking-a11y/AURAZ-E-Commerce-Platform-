// Test Server API Endpoints
const http = require('http');

const API_BASE = 'http://localhost:3001';

function testEndpoint(name, path) {
  return new Promise((resolve) => {
    const req = http.get(`${API_BASE}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            name,
            path,
            status: res.statusCode,
            success: json.success === true,
            hasData: !!json.data,
            dataCount: Array.isArray(json.data) ? json.data.length : (json.data ? 1 : 0),
            error: json.error || null
          });
        } catch (e) {
          resolve({
            name,
            path,
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON'
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        name,
        path,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        name,
        path,
        status: 'TIMEOUT',
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function testAll() {
  console.log('🧪 Testing Server API Endpoints...\n');
  
  const endpoints = [
    { name: 'Ping', path: '/api/ping' },
    { name: 'Test Connection', path: '/api/test-connection' },
    { name: 'Products', path: '/api/products' },
    { name: 'Users', path: '/api/users' },
    { name: 'Orders', path: '/api/orders' },
    { name: 'Carousel', path: '/api/carousel' },
    { name: 'Vouchers', path: '/api/vouchers' },
    { name: 'Promo Cards', path: '/api/promo-cards' },
  ];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.path);
    
    if (result.success) {
      console.log(`✅ ${result.name.padEnd(20)} - Status: ${result.status} - Data: ${result.dataCount} items`);
    } else {
      console.log(`❌ ${result.name.padEnd(20)} - Status: ${result.status} - Error: ${result.error || 'Failed'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n✅ Test complete!');
}

testAll();

