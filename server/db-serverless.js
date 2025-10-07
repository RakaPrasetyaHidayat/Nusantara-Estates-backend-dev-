import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create or reuse a global pool for serverless environments to avoid creating
// a new pool on every lambda invocation.
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nusantara_estates',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (!globalThis.__mysqlPool) {
  globalThis.__mysqlPool = mysql.createPool(dbConfig);
  console.log('Created new global mysql pool for serverless');
}

export default globalThis.__mysqlPool;
