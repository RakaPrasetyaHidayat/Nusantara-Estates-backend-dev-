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

async function createPropertiesTable() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Create properties table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS properties (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(15,2) NOT NULL,
          price_formatted VARCHAR(50),
          location VARCHAR(255),
          address VARCHAR(255),
          bedrooms INT DEFAULT 0,
          bathrooms INT DEFAULT 0,
          land_area INT DEFAULT 0,
          building_area INT DEFAULT 0,
          property_type VARCHAR(100) DEFAULT 'house',
          house_type VARCHAR(100),
          status ENUM('Dijual', 'Disewa', 'Terjual') DEFAULT 'Dijual',
          featured BOOLEAN DEFAULT FALSE,
          image_url VARCHAR(500),
          images JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_price (price),
          INDEX idx_location (location),
          INDEX idx_property_type (property_type),
          INDEX idx_house_type (house_type),
          INDEX idx_status (status),
          INDEX idx_featured (featured)
      )
    `;
    
    await connection.execute(createTableSQL);
    console.log('✅ Properties table created successfully!');
    
    // Check if table exists and is empty
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM properties');
    console.log(`Current properties count: ${rows[0].count}`);
    
  } catch (error) {
    console.error('Error creating properties table:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup
createPropertiesTable();