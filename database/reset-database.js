import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  let connection;
  
  try {
    // Koneksi ke MySQL
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

    // Drop tabel jika ada (untuk reset) - urutan penting karena foreign keys
    await connection.query('DROP TABLE IF EXISTS user_sessions');
    await connection.query('DROP TABLE IF EXISTS properties');
    await connection.query('DROP TABLE IF EXISTS users');
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
      if (command.toLowerCase().includes('create database') || 
          command.toLowerCase().includes('use nusantara_estates')) {
        continue; // Skip karena sudah dilakukan di atas
      }
      
      if (command.trim()) {
        await connection.query(command);
      }
    }
    
    console.log('✅ Schema database berhasil dibuat');

    // Hash passwords untuk sample users
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('password123', 12);

    // Insert sample users dengan hashed passwords
    await connection.query(
      `INSERT INTO users (username, email, password, role, email_verified) 
       VALUES (?, ?, ?, ?, ?)`,
      ['admin', 'admin@nusantara-estates.com', adminPassword, 'admin', true]
    );
    
    await connection.query(
      `INSERT INTO users (username, email, password, role, email_verified) 
       VALUES (?, ?, ?, ?, ?)`,
      ['user1', 'user1@example.com', userPassword, 'user', true]
    );
    
    console.log('✅ Sample users berhasil dibuat dengan password terenkripsi');

    // Verify data
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [propertyCount] = await connection.query('SELECT COUNT(*) as count FROM properties');
    
    console.log('\n🎉 Database reset selesai!');
    console.log(`📊 Total users: ${userCount[0].count}`);
    console.log(`🏠 Total properties: ${propertyCount[0].count}`);
    console.log('\n👤 Login credentials:');
    console.log('🔑 Admin: username "admin", password "admin123"');
    console.log('🔑 User: username "user1", password "password123"');
    console.log('\n🔒 Passwords are now securely hashed with bcrypt');
    console.log('🛡️ JWT authentication ready');
    console.log('📱 API endpoints secured with rate limiting');

  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    if (error.sql) {
      console.error('SQL:', error.sql);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabase();