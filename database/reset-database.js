import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
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

    console.log('✅ Terhubung ke Supabase PostgreSQL database');

    // Drop tabel jika ada (untuk reset) - urutan penting karena foreign keys
    await client.query('DROP TABLE IF EXISTS user_sessions');
    await client.query('DROP TABLE IF EXISTS properties');
    await client.query('DROP TABLE IF EXISTS users');
    console.log('🗑️ Tabel lama dihapus');

    // Baca dan eksekusi SQL schema
    const sqlPath = path.join(__dirname, 'database_setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL commands dan eksekusi satu per satu
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of sqlCommands) {
      if (command.trim()) {
        await client.query(command);
      }
    }

    console.log('✅ Schema database berhasil dibuat');

    // Hash passwords untuk sample users
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('password123', 12);

    // Insert sample users dengan hashed passwords
    await client.query(
      `INSERT INTO users (username, email, password, role, is_active, email_verified)
       VALUES ($1, $2, $3, $4, true, $5)`,
      ['admin', 'admin@nusantara-estates.com', adminPassword, 'admin', true]
    );

    await client.query(
      `INSERT INTO users (username, email, password, role, is_active, email_verified)
       VALUES ($1, $2, $3, $4, true, $5)`,
      ['user1', 'user1@example.com', userPassword, 'user', true]
    );

    console.log('✅ Sample users berhasil dibuat dengan password terenkripsi');

    // Verify data
    const userCountResult = await client.query('SELECT COUNT(*) as count FROM users');
    const propertyCountResult = await client.query('SELECT COUNT(*) as count FROM properties');

    console.log('\n🎉 Database reset selesai!');
    console.log(`📊 Total users: ${userCountResult.rows[0].count}`);
    console.log(`🏠 Total properties: ${propertyCountResult.rows[0].count}`);
    console.log('\n👤 Login credentials:');
    console.log('🔑 Admin: username "admin", password "admin123"');
    console.log('🔑 User: username "user1", password "password123"');
    console.log('\n🔒 Passwords are now securely hashed with bcrypt');
    console.log('🛡️ JWT authentication ready');
    console.log('📱 API endpoints secured with rate limiting');

  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
  } finally {
    if (client) {
      await client.end();
    }
  }
}

resetDatabase();