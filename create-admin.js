const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://igwbbfrhgyrfavvkpheh.supabase.co';
const supabaseKey = 'sb_publishable_tooz3bkl3NXwLVgKMlT4zA_yZWxdYbZ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
  console.log('Creating admin user in Supabase Auth...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'admin@rms.com',
    password: 'Admin@12345!'
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
    return;
  }

  console.log('Inserting admin role into public.users...');
  const { error: dbError } = await supabase.from('users').insert({
    email: 'admin@rms.com',
    name: 'Super Admin',
    role: 'admin',
    is_active: true
  });

  if (dbError) {
    console.error('DB Error:', dbError.message);
  } else {
    console.log('✅ Success! You can now log in with:');
    console.log('Email: admin@rms.com');
    console.log('Password: Admin@12345!');
  }
}

setupAdmin();
