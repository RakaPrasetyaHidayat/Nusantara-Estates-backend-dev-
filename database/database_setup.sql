-- Database setup untuk Nusantara Estates (Supabase otomatis buatkan schema public)
-- Tidak perlu CREATE DATABASE, cukup gunakan schema default

-- Membuat tabel users untuk sistem login dan register
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('user', 'admin'))
);

-- Trigger agar updated_at otomatis update saat ada perubahan
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Membuat tabel properties untuk data properti
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(15,2) NOT NULL,
    price_formatted VARCHAR(50),
    location VARCHAR(255),
    address VARCHAR(255),
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    land_area INT DEFAULT 0,
    building_area INT DEFAULT 0,
    property_type VARCHAR(100) DEFAULT 'house',
    house_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Dijual' CHECK (status IN ('Dijual', 'Disewa', 'Terjual')),
    featured BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500),
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Membuat tabel user_sessions untuk tracking sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat index untuk mempercepat query
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_created_at ON users(created_at);

CREATE INDEX idx_price ON properties(price);
CREATE INDEX idx_location ON properties(location);
CREATE INDEX idx_property_type ON properties(property_type);
CREATE INDEX idx_house_type ON properties(house_type);
CREATE INDEX idx_status ON properties(status);
CREATE INDEX idx_featured ON properties(featured);

CREATE INDEX idx_user_id ON user_sessions(user_id);
CREATE INDEX idx_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_expires_at ON user_sessions(expires_at);
