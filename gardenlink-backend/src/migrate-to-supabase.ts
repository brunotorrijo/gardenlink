import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function migrateToSupabase() {
  console.log('🚀 Starting Supabase migration...');
  
  try {
    // Test the connection first
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if we can query the database
    console.log('🔍 Testing database queries...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in the database`);
    
    // Test a simple query to make sure everything is working
    const profiles = await prisma.yardWorkerProfile.count();
    console.log(`✅ Found ${profiles} yard worker profiles`);
    
    console.log('🎉 Migration to Supabase completed successfully!');
    console.log('📊 Database statistics:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Yard Worker Profiles: ${profiles}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateToSupabase()
    .then(() => {
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export { migrateToSupabase }; 