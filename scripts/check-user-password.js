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

async function checkUserPassword() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Check user1 password
    const [users] = await connection.execute('SELECT username, email, password FROM users WHERE username = ?', ['user1']);
    
    if (users.length > 0) {
      const user = users[0];
      console.log('\n👤 User1 details:');
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
    } else {
      console.log('User1 not found');
    }
    
    // Check admin user
    const [adminUsers] = await connection.execute('SELECT username, email, password FROM users WHERE username = ?', ['admin']);
    
    if (adminUsers.length > 0) {
      const admin = adminUsers[0];
      console.log('\n👤 Admin user details:');
      console.log(`Username: ${admin.username}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Password: ${admin.password}`);
    } else {
      console.log('Admin user not found');
    }
    
  } catch (error) {
    console.error('Error checking user password:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the check
checkUserPassword();