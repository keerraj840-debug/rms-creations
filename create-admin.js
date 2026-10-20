/**
 * Script to initialize an admin user in Supabase.
 * For security reasons, NEVER hardcode plain-text passwords in source files.
 * 
 * Usage:
 *   ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="YourStrongPassword!" node create-admin.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://igwbbfrhgyrfavvkpheh.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tooz3bkl3NXwLVgKMlT4zA_yZWxdYbZ';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('\n⚠️ Security Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
  console.error('Do not hardcode credentials in source code.');
  console.error('\nExample usage:');
  console.error('  ADMIN_EMAIL="rmsgifthampers@gmail.com" ADMIN_PASSWORD="<YourSecurePassword>" node create-admin.js\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
  console.log(`Setting up admin user for: ${adminEmail}...`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
    return;
  }

  console.log('Assigning admin role in public.users...');
  const { error: dbError } = await supabase.from('users').upsert({
    email: adminEmail,
    name: 'RMS Admin',
    role: 'admin',
    is_active: true
  }, { onConflict: 'email' });

  if (dbError) {
    console.error('Database Error:', dbError.message);
  } else {
    console.log(`✅ Success! Admin privileges configured for ${adminEmail}.`);
  }
}

setupAdmin();
