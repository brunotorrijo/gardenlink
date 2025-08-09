const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing Supabase connection from backend server...');
  
  try {
    // Test the connection
    console.log('📡 Attempting to connect to Supabase...');
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    console.log('🔍 Testing database queries...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in the database`);
    
    // Test profile count
    const profileCount = await prisma.yardWorkerProfile.count();
    console.log(`✅ Found ${profileCount} yard worker profiles`);
    
    console.log('🎉 All tests passed! Supabase connection is working perfectly!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 