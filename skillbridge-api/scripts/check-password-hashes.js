require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');

const fixPasswordHashing = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users\n`);

    if (users.length === 0) {
      console.log('No users found to check.');
      await mongoose.disconnect();
      return;
    }

    // Check each user's password to see if it needs rehashing
    let fixedCount = 0;
    for (const user of users) {
      // Try to compare with a test password to see if comparison works
      // If the password starts with $2a$ or $2b$ (bcrypt hash), it's already hashed once
      // If it starts with something else or looks wrong, it might be double-hashed
      
      if (!user.password.startsWith('$2')) {
        console.log(`⚠️  User "${user.email}" has an invalid password hash format!`);
        console.log(`   Password value preview: ${user.password.substring(0, 20)}...`);
      }
    }

    console.log('\n✅ Password hash check complete');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

fixPasswordHashing();
