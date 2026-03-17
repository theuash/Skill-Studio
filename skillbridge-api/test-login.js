const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

(async () => {
  try {
    console.log('Testing login endpoint...');
    const res = await api.post('/auth/login', {
      email: 'test@example.com',
      password: 'Test123456'
    });

    console.log('\n✅ Login successful!');
    console.log('\nFull Response:');
    console.log(JSON.stringify(res.data, null, 2));

    console.log('\nResponse data structure:');
    console.log(`  res.data =`, Object.keys(res.data));
    console.log(`  res.data.data =`, Object.keys(res.data.data || {}));

    const { token, user } = res.data.data;
    console.log('\nExtracted values:');
    console.log(`  Token: ${token.substring(0, 20)}...`);
    console.log(`  User ID: ${user.id}`);
    console.log(`  User Email: ${user.email}`);
    console.log(`  User Name: ${user.fullName}`);

  } catch (err) {
    console.error('\n❌ Login failed!');
    console.error('Status:', err.response?.status);
    console.error('Data:', err.response?.data);
    console.error('Message:', err.message);
    console.error('Full error:', err);
  }
})();
