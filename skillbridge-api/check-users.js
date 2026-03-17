require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { email: 1, fullName: 1, isVerified: 1, createdAt: 1 });
    console.log('\n📋 Users in database:');
    if (users.length === 0) {
      console.log('  No users found');
    } else {
      users.forEach(u => {
        console.log(`  - ${u.email} (${u.fullName}) - Verified: ${u.isVerified}`);
      });
    }
    
    // Check specifically for test user
    const testUser = await User.findOne({ email: 'test@example.com' }).select('+password');
    if (testUser) {
      console.log('\n✅ Test user found:');
      console.log(`  Email: ${testUser.email}`);
      console.log(`  Name: ${testUser.fullName}`);
      console.log(`  Verified: ${testUser.isVerified}`);
      console.log(`  Password hash: ${testUser.password ? testUser.password.substring(0, 10) + '...' : 'none'}`);
    } else {
      console.log('\n❌ Test user (test@example.com) not found');
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
