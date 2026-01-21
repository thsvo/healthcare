#!/usr/bin/env node

/**
 * Admin Creation Script
 * Usage: node scripts/create-admin.js --email admin@example.com --password yourpassword
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// User Schema (inline to avoid import issues)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = { email: null, password: null };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      result.email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      result.password = args[i + 1];
      i++;
    }
  }
  
  return result;
}

async function createAdmin() {
  const { email, password } = parseArgs();
  
  if (!email || !password) {
    console.log('Usage: node scripts/create-admin.js --email <email> --password <password>');
    console.log('Example: node scripts/create-admin.js --email admin@example.com --password secret123');
    process.exit(1);
  }
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️  User with email "${email}" already exists.`);
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
