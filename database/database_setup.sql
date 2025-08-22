-- Database setup untuk Nusantara Estates
CREATE DATABASE IF NOT EXISTS nusantara_estates;
USE nusantara_estates;

-- Membuat tabel users untuk sistem login dan register
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Membuat tabel properties untuk data properti
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
);

-- Membuat tabel user_sessions untuk tracking sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);
