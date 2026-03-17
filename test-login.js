const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.log('Error status:', error.response ? error.response.status : 'N/A');
    console.log('Error data:', error.response ? error.response.data : error.message);
  }
}

testLogin();
