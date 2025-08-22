import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nusantara_estates'
};

async function createSampleUser() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Check if sample user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      ['testuser', 'testuser@example.com']
    );
    
    if (existingUsers.length > 0) {
      console.log('Sample user already exists. Skipping creation.');
      return;
    }
    
    // Insert sample user
    const [result] = await connection.execute(`
      INSERT INTO users (username, email, password, role, is_active, email_verified) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'testuser',
      'testuser@example.com', 
      'password123',
      'user',
      true,
      true
    ]);
    
    console.log('✅ Sample user created successfully!');
    console.log('Username: testuser');
    console.log('Email: testuser@example.com');
    console.log('Password: password123');
    console.log('Role: user');
    
  } catch (error) {
    console.error('Error creating sample user:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup
createSampleUser();