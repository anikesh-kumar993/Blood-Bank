const http = require('http');

const data = JSON.stringify({ test: 'ping' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ping',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY:', body);
    try {
      const json = JSON.parse(body);
      if (json.status === 'OK' && res.statusCode === 200) {
        console.log('VERIFIED: /api/ping is working');
      }
    } catch (e) {
      console.log('FAILED: Response is not valid JSON');
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
