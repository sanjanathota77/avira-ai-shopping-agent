const http = require('http');

async function testQuery(prompt, currentCart = []) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      currentCart
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/agent',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Home Page...');
  await new Promise((resolve) => {
    http.get('http://localhost:3000', res => {
      console.log('Home Page Status:', res.statusCode);
      resolve();
    });
  });

  const testCases = [
    'Show me black shoes under 2000',
    'What sizes are available for Urban Black Sneakers?',
    'Is size 8 available for Urban Black Sneakers?',
    'How much does Urban Black Sneakers cost?',
    'Show me the best rated shoes under 2500',
    'Add Urban Black Sneakers to my cart',
    'Find a red dress under 3000 in size M'
  ];

  for (const tc of testCases) {
    console.log('\n=======================================');
    console.log('TEST QUERY:', tc);
    const res = await testQuery(tc);
    console.log('HTTP Status:', res.status);
    if (res.data && res.data.message) {
      console.log('Tool Executed:', res.data.message.toolCalls ? res.data.message.toolCalls.map(t => t.tool).join(', ') : 'none');
      console.log('Assistant Response:', res.data.message.content);
      if (res.data.message.actionTaken) {
        console.log('Action Taken:', JSON.stringify(res.data.message.actionTaken));
      }
      if (res.data.message.products) {
        console.log('Products Count:', res.data.message.products.length);
        console.log('Products:', res.data.message.products.map(p => p.name + ' (₹' + p.price + ')').join(', '));
      }
    } else {
      console.log('Response:', res);
    }
  }
}

runTests();
