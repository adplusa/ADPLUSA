#!/usr/bin/env ts-node

import mongoose from 'mongoose';
import { User } from '../database/schemas/user.schema';
import { config } from '../config/env';

/**
 * Script to list all users in the database
 */
async function listUsers() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log('📭 No users found in the database');
      return;
    }

    console.log(`\n👥 Found ${users.length} user(s):\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt?.toLocaleDateString()}`);
      console.log(`   Last Login: ${user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  listUsers();
}

export { listUsers };