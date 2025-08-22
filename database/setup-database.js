import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;
  
  try {
    // Koneksi ke MySQL tanpa database terlebih dahulu
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('✅ Terhubung ke MySQL server');

    // Buat database jika belum ada
    await connection.query('CREATE DATABASE IF NOT EXISTS nusantara_estates');
    console.log('✅ Database nusantara_estates sudah siap');

    // Gunakan database
    await connection.query('USE nusantara_estates');

    // Buat tabel users
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createTableQuery);
    console.log('✅ Tabel users berhasil dibuat');

    // Insert sample data dengan IGNORE untuk menghindari duplicate
    try {
      await connection.query(
        "INSERT IGNORE INTO users (username, email, password) VALUES ('admin', 'admin@example.com', 'admin123')"
      );
      
      await connection.query(
        "INSERT IGNORE INTO users (username, email, password) VALUES ('user1', 'user1@example.com', 'password123')"
      );
      
      console.log('✅ Sample data berhasil diinsert');
    } catch (insertError) {
      console.log('ℹ️ Sample data sudah ada atau error insert:', insertError.message);
    }


    console.log('\n🎉 Database setup selesai!');
    console.log('\nAnda bisa login dengan:');
    console.log('- Username: admin, Password: admin123');
    console.log('- Username: user1, Password: password123');

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