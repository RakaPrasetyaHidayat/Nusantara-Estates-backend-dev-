# Koneksi Database untuk Nusantara Estates

## Overview
Dokumen ini menjelaskan koneksi antara frontend React dan database MySQL untuk menampilkan data properti di website Nusantara Estates.

## Arsitektur Sistem

```
Frontend (React) ↔ API Server (Express.js) ↔ Database (MySQL)
```

## Komponen yang Dibuat/Dimodifikasi

### 1. Database Schema (`database/database_setup.sql`)
- **Tabel `properties`**: Menyimpan data properti dengan struktur yang sesuai dengan kebutuhan frontend
- **Fields utama**:
  - `id`: Primary key
  - `title`: Judul properti
  - `price`: Harga numerik
  - `price_formatted`: Harga dalam format string (Rp 1.4 Milyar)
  - `location`: Lokasi singkat (Jl Angkrek)
  - `address`: Alamat lengkap
  - `house_type`: Tipe rumah (Rumah Modern, Rumah Industrial, dll)
  - `bedrooms`, `bathrooms`: Jumlah kamar
  - `land_area`, `building_area`: Luas tanah dan bangunan
  - `status`: Status properti (Dijual, Disewa, Terjual)
  - `image_url`: URL gambar properti

### 2. API Endpoints (`server/app.js`)

#### GET `/api/properties`
- **Fungsi**: Mengambil daftar properti dengan filter dan pagination
- **Query Parameters**:
  - `tipe`: Filter berdasarkan tipe rumah
  - `lokasi`: Filter berdasarkan lokasi
  - `page`: Halaman (default: 1)
  - `limit`: Jumlah data per halaman (default: 10)
- **Response**:
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```

#### GET `/api/properties/:id`
- **Fungsi**: Mengambil detail properti berdasarkan ID
- **Response**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### 3. API Service (`src/services/api.js`)
- **Class `ApiService`**: Mengelola semua komunikasi dengan backend
- **Methods**:
  - `getProperties(filters)`: Mengambil daftar properti
  - `getPropertyById(id)`: Mengambil detail properti
  - `login(credentials)`: Login user
  - `register(userData)`: Register user

### 4. Custom Hook (`src/hooks/useProperties.js`)
- **Hook `useProperties`**: Mengelola state dan logic untuk data properti
- **Features**:
  - Loading state management
  - Error handling
  - Automatic data fetching
  - Search functionality
  - Pagination support

### 5. Updated Component (`src/Components/RumahKosong/RumahKosong.jsx`)
- **Perubahan utama**:
  - Mengganti data statis dengan data dari database
  - Menggunakan `useProperties` hook
  - Menambahkan loading dan error states
  - Transform data dari database ke format frontend

## Cara Kerja Koneksi

### 1. Inisialisasi
```javascript
// Di RumahKosong.jsx
const { 
    properties, 
    loading, 
    error, 
    searchProperties 
} = useProperties();
```

### 2. Filter Data
```javascript
// Ketika filter berubah
useEffect(() => {
    searchProperties({
        tipe: selectedTipe,
        lokasi: searchLocation
    });
}, [selectedTipe, searchLocation, searchProperties]);
```

### 3. API Call Flow
```
1. useProperties hook → 2. apiService.getProperties() → 3. GET /api/properties → 4. MySQL Query → 5. Response → 6. Update State → 7. Re-render Component
```

### 4. Data Transformation
```javascript
// Transform data dari database ke format frontend
const transformedProperties = properties.map(property => ({
    id: property.id,
    harga: property.price_formatted,
    tipe: property.house_type,
    lokasi: property.location,
    status: property.status,
    lt: property.land_area,
    lb: property.building_area,
    kt: property.bedrooms,
    km: property.bathrooms,
    img: property.image_url
}));
```

## Setup dan Instalasi

### 1. Database Setup
```bash
# Jalankan script setup database
node database/setup-database.js

# Atau gunakan batch file
scripts/init-database.bat
```

### 2. Environment Configuration
```bash
# Copy dan edit file .env
cp .env.example .env

# Edit konfigurasi database di .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nusantara_estates
```

### 3. Install Dependencies
```bash
# Install dependencies jika belum
npm install
```

### 4. Start Services
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

## Testing Koneksi

### 1. Test Database Connection
```bash
curl http://localhost:5174/api/test-db
```

### 2. Test Properties API
```bash
# Get all properties
curl http://localhost:5174/api/properties

# Get properties with filter
curl "http://localhost:5174/api/properties?tipe=Rumah Modern&lokasi=Angkrek"
```

### 3. Frontend Testing
1. Buka browser ke `http://localhost:5173`
2. Navigate ke halaman "Rumah Dijual"
3. Test filter berdasarkan tipe dan lokasi
4. Verify data loading dari database

## Error Handling

### 1. Database Connection Error
- Check MySQL service running
- Verify database credentials in `.env`
- Check database exists

### 2. API Error
- Check backend server running on port 5174
- Verify CORS configuration
- Check network connectivity

### 3. Frontend Error
- Check browser console for errors
- Verify API endpoints accessible
- Check data transformation logic

## Monitoring dan Logging

### Backend Logs
```javascript
// API calls logged in console
console.log('Properties API called with filters:', filters);
console.log('Database query result:', rows.length, 'properties found');
```

### Frontend Logs
```javascript
// Hook state changes logged
console.log('Properties loaded:', properties.length);
console.log('Search filters applied:', { tipe, lokasi });
```

## Future Enhancements

1. **Caching**: Implement Redis for API response caching
2. **Real-time Updates**: WebSocket for live property updates
3. **Image Upload**: File upload system for property images
4. **Advanced Filters**: Price range, area range, etc.
5. **Favorites**: User favorite properties system
6. **Analytics**: Track property views and searches