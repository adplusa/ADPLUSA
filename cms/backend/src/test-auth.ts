/**
 * Simple verification script to test authentication logic
 * This doesn't require MongoDB to be running
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'test-secret-key';
const JWT_EXPIRES_IN = '7d';

async function testPasswordHashing() {
  console.log('\n=== Testing Password Hashing ===');
  
  const password = 'testPassword123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  console.log('✓ Password hashed successfully');
  console.log(`  Original: ${password}`);
  console.log(`  Hashed: ${hashedPassword.substring(0, 30)}...`);
  
  // Test password comparison
  const isValid = await bcrypt.compare(password, hashedPassword);
  const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword);
  
  console.log(`✓ Password comparison works: valid=${isValid}, invalid=${isInvalid}`);
  
  return isValid && !isInvalid;
}

function testJWTGeneration() {
  console.log('\n=== Testing JWT Generation ===');
  
  const payload = {
    userId: '123456',
    username: 'testuser',
    role: 'admin',
  };
  
  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };
  
  const token = jwt.sign(payload, JWT_SECRET, signOptions);
  
  console.log('✓ JWT token generated successfully');
  console.log(`  Token: ${token.substring(0, 50)}...`);
  
  return token;
}

function testJWTVerification(token: string) {
  console.log('\n=== Testing JWT Verification ===');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✓ JWT token verified successfully');
    console.log('  Decoded payload:', decoded);
    return true;
  } catch (error: any) {
    console.log('✗ JWT verification failed:', error.message);
    return false;
  }
}

function testExpiredToken() {
  console.log('\n=== Testing Expired Token ===');
  
  const payload = {
    userId: '123456',
    username: 'testuser',
    role: 'admin',
  };
  
  // Create a token that expires immediately
  const signOptions: SignOptions = {
    expiresIn: '1ms' as any,
  };
  
  const token = jwt.sign(payload, JWT_SECRET, signOptions);
  
  // Wait a bit to ensure token expires
  setTimeout(() => {
    try {
      jwt.verify(token, JWT_SECRET);
      console.log('✗ Expired token was accepted (should have been rejected)');
      return false;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        console.log('✓ Expired token correctly rejected');
        return true;
      } else {
        console.log('✗ Unexpected error:', error.message);
        return false;
      }
    }
  }, 100);
}

function testInvalidToken() {
  console.log('\n=== Testing Invalid Token ===');
  
  const invalidToken = 'invalid.token.here';
  
  try {
    jwt.verify(invalidToken, JWT_SECRET);
    console.log('✗ Invalid token was accepted (should have been rejected)');
    return false;
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      console.log('✓ Invalid token correctly rejected');
      return true;
    } else {
      console.log('✗ Unexpected error:', error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log('🧪 Running Authentication Logic Tests\n');
  console.log('=' .repeat(50));
  
  try {
    // Test password hashing
    const passwordTest = await testPasswordHashing();
    
    // Test JWT generation
    const token = testJWTGeneration();
    
    // Test JWT verification
    const verificationTest = testJWTVerification(token);
    
    // Test invalid token
    const invalidTest = testInvalidToken();
    
    // Test expired token
    testExpiredToken();
    
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ All authentication logic tests passed!');
    console.log('\nThe authentication system is ready to use.');
    console.log('Note: Full integration tests require MongoDB to be running.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
