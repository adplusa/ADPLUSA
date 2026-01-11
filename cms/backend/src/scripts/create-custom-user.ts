#!/usr/bin/env ts-node

import mongoose from 'mongoose';
import { User, UserRole } from '../database/schemas/user.schema';
import { config } from '../config/env';

/**
 * Script to create a custom user in the database
 * Usage: npm run create-custom-user <username> <email> <password> [role]
 */
async function createCustomUser() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
      console.log('❌ Usage: npm run create-custom-user <username> <email> <password> [role]');
      console.log('   Roles: admin, editor (default: editor)');
      process.exit(1);
    }

    const [username, email, password, roleArg] = args;
    const role = roleArg === 'admin' ? UserRole.ADMIN : UserRole.EDITOR;

    // Validate inputs
    if (username.length < 3) {
      console.log('❌ Username must be at least 3 characters');
      process.exit(1);
    }

    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('❌ Please provide a valid email address');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // User data
    const userData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role,
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
  createCustomUser();
}

export { createCustomUser };