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

async function setupProperties() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Check if properties table exists and has data
    const [existingData] = await connection.execute('SELECT COUNT(*) as count FROM properties');
    
    if (existingData[0].count > 0) {
      console.log(`Found ${existingData[0].count} existing properties. Skipping insert.`);
      return;
    }
    
    console.log('Inserting sample properties...');
    
    const properties = [
      {
        title: 'Rumah Modern Angkrek',
        description: 'Rumah modern dengan desain kontemporer dan fasilitas lengkap',
        price: 1400000000,
        price_formatted: 'Rp 1.4 Milyar',
        location: 'Jl Angkrek',
        address: 'Jl Angkrek, Jakarta',
        bedrooms: 3,
        bathrooms: 2,
        land_area: 250,
        building_area: 175,
        property_type: 'house',
        house_type: 'Rumah Modern',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: true
      },
      {
        title: 'Rumah Industrial Melati',
        description: 'Rumah dengan konsep industrial modern yang elegan',
        price: 1200000000,
        price_formatted: 'Rp 1.2 Milyar',
        location: 'Jl Melati',
        address: 'Jl Melati, Jakarta',
        bedrooms: 3,
        bathrooms: 2,
        land_area: 220,
        building_area: 160,
        property_type: 'house',
        house_type: 'Rumah Industrial',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: false
      },
      {
        title: 'Rumah Skandinavia Mawar',
        description: 'Rumah bergaya Skandinavia dengan nuansa natural',
        price: 1800000000,
        price_formatted: 'Rp 1.8 Milyar',
        location: 'Jl Mawar',
        address: 'Jl Mawar, Jakarta',
        bedrooms: 4,
        bathrooms: 3,
        land_area: 300,
        building_area: 200,
        property_type: 'house',
        house_type: 'Rumah Skandinavia',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: true
      },
      {
        title: 'Rumah Minimalis Kenanga',
        description: 'Rumah minimalis dengan desain clean dan fungsional',
        price: 1600000000,
        price_formatted: 'Rp 1.6 Milyar',
        location: 'Jl Kenanga',
        address: 'Jl Kenanga, Jakarta',
        bedrooms: 3,
        bathrooms: 2,
        land_area: 280,
        building_area: 185,
        property_type: 'house',
        house_type: 'Rumah Minimalis',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: false
      },
      {
        title: 'Rumah Klasik Dahlia',
        description: 'Rumah klasik dengan sentuhan tradisional yang elegan',
        price: 1300000000,
        price_formatted: 'Rp 1.3 Milyar',
        location: 'Jl Dahlia',
        address: 'Jl Dahlia, Jakarta',
        bedrooms: 3,
        bathrooms: 2,
        land_area: 240,
        building_area: 170,
        property_type: 'house',
        house_type: 'Rumah Klasik',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: false
      },
      {
        title: 'Rumah Modern Cempaka',
        description: 'Rumah modern mewah dengan fasilitas premium',
        price: 1900000000,
        price_formatted: 'Rp 1.9 Milyar',
        location: 'Jl Cempaka',
        address: 'Jl Cempaka, Jakarta',
        bedrooms: 4,
        bathrooms: 3,
        land_area: 320,
        building_area: 210,
        property_type: 'house',
        house_type: 'Rumah Modern',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: true
      },
      {
        title: 'Rumah Industrial Tulip',
        description: 'Rumah industrial dengan konsep open space',
        price: 1500000000,
        price_formatted: 'Rp 1.5 Milyar',
        location: 'Jl Tulip',
        address: 'Jl Tulip, Jakarta',
        bedrooms: 3,
        bathrooms: 2,
        land_area: 260,
        building_area: 180,
        property_type: 'house',
        house_type: 'Rumah Industrial',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: false
      },
      {
        title: 'Rumah Skandinavia Sakura',
        description: 'Rumah Skandinavia premium dengan taman luas',
        price: 2000000000,
        price_formatted: 'Rp 2.0 Milyar',
        location: 'Jl Sakura',
        address: 'Jl Sakura, Jakarta',
        bedrooms: 4,
        bathrooms: 3,
        land_area: 350,
        building_area: 220,
        property_type: 'house',
        house_type: 'Rumah Skandinavia',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: true
      },
      {
        title: 'Rumah Kontemporer Anggrek Putih',
        description: 'Rumah kontemporer dengan desain futuristik',
        price: 1700000000,
        price_formatted: 'Rp 1.7 Milyar',
        location: 'Jl Anggrek Putih',
        address: 'Jl Anggrek Putih, Jakarta',
        bedrooms: 3,
        bathrooms: 2,
        land_area: 290,
        building_area: 195,
        property_type: 'house',
        house_type: 'Rumah Kontemporer',
        status: 'Dijual',
        image_url: '/img/tipe rumah.png',
        featured: false
      }
    ];
    
    const insertQuery = `
      INSERT INTO properties (
        title, description, price, price_formatted, location, address,
        bedrooms, bathrooms, land_area, building_area,
        property_type, house_type, status, image_url, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    for (const property of properties) {
      await connection.execute(insertQuery, [
        property.title,
        property.description,
        property.price,
        property.price_formatted,
        property.location,
        property.address,
        property.bedrooms,
        property.bathrooms,
        property.land_area,
        property.building_area,
        property.property_type,
        property.house_type,
        property.status,
        property.image_url,
        property.featured
      ]);
    }
    
    console.log(`Successfully inserted ${properties.length} properties!`);
    
    // Verify the data
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM properties');
    console.log(`Total properties in database: ${result[0].count}`);
    
  } catch (error) {
    console.error('Error setting up properties:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup
setupProperties();