import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;

  try {
    // Koneksi ke MySQL tanpa database terlebih dahulu
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Terhubung ke MySQL server');

    // Buat database jika belum ada
    await connection.query('CREATE DATABASE IF NOT EXISTS nusantara_estates');
    console.log('✅ Database nusantara_estates sudah siap');

    // Gunakan database
    await connection.query('USE nusantara_estates');

    // Baca file SQL dan jalankan
    const sqlFilePath = path.join(__dirname, 'database_setup.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL commands dan jalankan satu per satu
    const sqlCommands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);

    for (const command of sqlCommands) {
      const trimmedCommand = command.trim();
      if (trimmedCommand) {
        try {
          await connection.query(trimmedCommand);
          console.log('✅ SQL command executed successfully');
        } catch (sqlError) {
          // Ignore duplicate table/key errors
          if (sqlError.code !== 'ER_TABLE_EXISTS_ERROR' && sqlError.code !== 'ER_DUP_KEYNAME') {
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

      await connection.query(
        `INSERT IGNORE INTO users (username, email, password, role, is_active, email_verified)
         VALUES (?, ?, ?, 'user', 1, 0)`,
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
      console.log('\n💡 Pastikan MySQL server sudah berjalan!');
      console.log('   - Jalankan XAMPP/WAMP/MAMP');
      console.log('   - Atau start MySQL service');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();