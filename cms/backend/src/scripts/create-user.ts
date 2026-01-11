#!/usr/bin/env ts-node

import mongoose from 'mongoose';
import { User, UserRole } from '../database/schemas/user.schema';
import { config } from '../config/env';

/**
 * Script to create a user in the database
 */
async function createUser() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // User data
    const userData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123456', // This will be hashed automatically
      role: UserRole.ADMIN,
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    });

    if (existingUser) {
      console.log('⚠️  User already exists:');
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      return;
    }

    // Create new user
    console.log('👤 Creating new user...');
    const newUser = new User(userData);
    await newUser.save();

    console.log('✅ User created successfully!');
    console.log(`   Username: ${newUser.username}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`   ID: ${newUser._id}`);
    
    console.log('\n🔐 Login credentials:');
    console.log(`   Username: ${userData.username}`);
    console.log(`   Password: ${userData.password}`);

  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  createUser();
}

export { createUser };