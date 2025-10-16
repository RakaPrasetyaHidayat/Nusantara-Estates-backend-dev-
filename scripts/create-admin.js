import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

async function createAdmin() {
  let client;

  try {
    // Extract project ref from SUPABASE_URL
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL not found in environment variables');
    }
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (!projectRef) {
      throw new Error('Could not extract project ref from SUPABASE_URL');
    }

    // Create connection string for direct PostgreSQL access
    const connectionString = `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${projectRef}.supabase.co:5432/postgres`;

    client = new Client({ connectionString });
    await client.connect();

    console.log('✅ Connected to Supabase PostgreSQL database');

    // Admin credentials
    const adminUsername = 'NEadmin';
    const adminEmail = 'admin@nusantara.com';
    const adminPassword = 'BARA211'; // Note: This should be changed in production

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert admin user
    await client.query(
      `INSERT INTO users (username, email, password, role, is_active, email_verified)
       VALUES ($1, $2, $3, 'admin', true, true)
       ON CONFLICT (username) DO UPDATE SET
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         is_active = EXCLUDED.is_active,
         email_verified = EXCLUDED.email_verified`,
      [adminUsername, adminEmail, hashedPassword]
    );

    console.log('✅ Admin user created/updated successfully');
    console.log('Username: NEadmin');
    console.log('Email: admin@nusantara.com');
    console.log('Password: BARA211');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

createAdmin();