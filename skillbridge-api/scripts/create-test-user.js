require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createTestUser = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Delete existing test user if it exists (to reset with correct password hash)
    await User.deleteOne({ email: 'test@example.com' });

    // Create test user with plain password - the model will hash it in pre-save hook
    const testUser = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Test123456', // Pass plain password, model will hash it
      isVerified: true,
      avatar: null,
      sector: 'Tech',
      skillsLearned: ['JavaScript', 'React', 'Node.js'],
      savedJobs: [],
    });

    console.log('✅ Test user created successfully!\n');
    console.log('Login credentials:');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: Test123456');
    console.log('\nUser ID:', testUser._id);

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createTestUser();
