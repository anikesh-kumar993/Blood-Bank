const http = require('http');

const data = JSON.stringify({
  email: 'test@example.com',
  password: 'password'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers));
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY:', body);
    if (res.statusCode === 405) {
      console.log('REPRODUCED: 405 Method Not Allowed');
    } else {
      console.log('NOT REPRODUCED: Status is ' + res.statusCode);
    }
  });
});

req.on('error', (e) => {
  console.error('Connection failed (server might not be running):', e.message);
});

req.write(data);
req.end();
