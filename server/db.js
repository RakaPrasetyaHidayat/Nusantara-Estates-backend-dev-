import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Konfigurasi database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nusantara_estates',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Opsi yang valid untuk mysql2:
  connectTimeout: 60000, // Timeout koneksi dalam milidetik
  idleTimeout: 60000,    // Timeout koneksi idle
  enableKeepAlive: true  // Untuk reconnect otomatis
};

// Buat connection pool
const pool = mysql.createPool(dbConfig);

// Fungsi untuk test koneksi
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ Berhasil terhubung ke database MySQL');
    return true;
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:', error.message);
    
    // Berikan informasi troubleshooting yang lebih membantu
    console.log('\n🔧 Tips Troubleshooting:');
    console.log('1. Pastikan MySQL server sedang berjalan');
    console.log(`2. Verifikasi kredensial di .env: DB_HOST=${process.env.DB_HOST}, DB_USER=${process.env.DB_USER}`);
    console.log('3. Cek apakah user memiliki akses ke database');
    console.log('4. Pastikan tidak ada blok firewall');
    
    return false;
  } finally {
    if (connection) connection.release();
  }
};

// Test koneksi saat startup (tanpa menghentikan aplikasi)
testConnection().then(isConnected => {
  if (!isConnected) {
    console.log('⚠️  Aplikasi tetap berjalan tetapi koneksi database gagal');
    console.log('⚠️  Endpoint yang membutuhkan database akan mengembalikan error');
  }
});

// Export pool untuk digunakan di seluruh aplikasi
export default pool;