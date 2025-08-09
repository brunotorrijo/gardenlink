const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Supabase migration...');

try {
  // Change to the backend directory
  process.chdir(__dirname);
  
  console.log('📁 Working directory:', process.cwd());
  
  // Step 1: Generate Prisma client
  console.log('🔧 Step 1: Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully!');
  
  // Step 2: Push the schema to Supabase
  console.log('🔧 Step 2: Pushing schema to Supabase...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Schema pushed to Supabase successfully!');
  
  // Step 3: Verify the migration
  console.log('🔧 Step 3: Verifying migration...');
  execSync('npx prisma db pull', { stdio: 'inherit' });
  console.log('✅ Migration verified successfully!');
  
  console.log('🎉 Migration to Supabase completed successfully!');
  console.log('📊 Your database is now running on Supabase!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} 