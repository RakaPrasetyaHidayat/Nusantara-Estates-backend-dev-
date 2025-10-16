import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
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

    // Baca file SQL dan jalankan
    const sqlFilePath = path.join(__dirname, 'database_setup.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL commands dan jalankan satu per satu
    const sqlCommands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);

    for (const command of sqlCommands) {
      const trimmedCommand = command.trim();
      if (trimmedCommand) {
        try {
          await client.query(trimmedCommand);
          console.log('✅ SQL command executed successfully');
        } catch (sqlError) {
          // Ignore duplicate table/key errors for PostgreSQL
          if (sqlError.code !== '42P07' && sqlError.code !== '42710') { // duplicate_table, duplicate_object
            console.log('⚠️ SQL command warning:', sqlError.message);
          }
        }
      }
    }

    console.log('✅ Semua tabel berhasil dibuat');

    // Insert sample user untuk testing
    try {
      // Hash password untuk user biasa
      const bcrypt = (await import('bcryptjs')).default;
      const hashedPassword = await bcrypt.hash('password123', 10);

      await client.query(
        `INSERT INTO users (username, email, password, role, is_active, email_verified)
         VALUES ($1, $2, $3, 'user', true, false)
         ON CONFLICT (username) DO NOTHING`,
        ['testuser', 'test@example.com', hashedPassword]
      );

      console.log('✅ Sample user berhasil diinsert: testuser / password123');
    } catch (insertError) {
      console.log('ℹ️ Sample user sudah ada atau error insert:', insertError.message);
    }

    console.log('\n🎉 Database setup selesai!');
    console.log('\nAnda bisa login dengan:');
    console.log('- Admin: NEadmin / BARA211 (hardcoded)');
    console.log('- User: testuser / password123');
    console.log('\nUntuk setup properties, jalankan: npm run setup-properties');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Pastikan koneksi internet stabil dan kredensial Supabase benar!');
    }
  } finally {
    if (client) {
      await client.end();
    }
  }
}

setupDatabase();