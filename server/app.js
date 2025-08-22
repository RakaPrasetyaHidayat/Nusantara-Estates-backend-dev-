import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import pool from './db.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { authenticateToken, requireAdmin, generateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5174;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ---------- Middleware global ----------
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// serve file statis
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// logger sederhana
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Multer configuration ----------
const uploadDir = path.join(__dirname, 'public/img');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ---------- Helpers ----------
const normalizeImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return images ? [images] : [];
    }
  }
  return [];
};

const rowToProperty = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  price: row.price,
  price_formatted: row.price_formatted,
  location: row.location,
  address: row.address,
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  land_area: row.land_area,
  building_area: row.building_area,
  property_type: row.property_type,
  status: row.status,
  featured: !!row.featured,
  image_url: row.image_url,
  images: normalizeImages(row.images),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// ============================================================
// AUTH: Login
// ============================================================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Username dan password harus diisi' });
    }

    // Kredensial admin hardcode (demo)
    const ADMIN = {
      username: 'NEadmin',
      email: 'admin@nusantara.com',
      password: 'BARA211',
    };

    const isAdmin =
      (username === ADMIN.username || username === ADMIN.email) &&
      password === ADMIN.password;

    if (isAdmin) {
      const adminUser = {
        id: 0,
        username: ADMIN.username,
        email: ADMIN.email,
        role: 'admin',
        isAdmin: true,
      };
      const token = generateToken(adminUser);
      return res.json({
        success: true,
        message: 'Login admin berhasil',
        user: adminUser,
        token,
      });
    }

    // User biasa dari database
    const [users] = await pool.query(
      'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    if (!users.length || users[0].password !== password) {
      return res
        .status(401)
        .json({ success: false, message: 'Kredensial tidak valid' });
    }

    const user = users[0];
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [
      user.id,
    ]);

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: 'user',
      isAdmin: false,
    };
    const token = generateToken(userResponse);
    res.json({
      success: true,
      message: 'Login berhasil',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Error login:', error);
    res
      .status(500)
      .json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// ============================================================
// PUBLIC ROUTES (Homepage, DetailRumah)
// ============================================================
app.get('/api/properties', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM properties 
       WHERE status IN ('Dijual','Disewa','Tersedia') 
       ORDER BY featured DESC, id DESC`
    );
    res.json({ success: true, data: rows.map(rowToProperty) });
  } catch (error) {
    console.error('Error list publik:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil properti' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
    }
    res.json({ success: true, data: rowToProperty(rows[0]) });
  } catch (error) {
    console.error('Error detail publik:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail properti' });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================

// Create
app.post(
  '/api/admin/properties',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image_url', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        price_formatted,
        location,
        address,
        bedrooms,
        bathrooms,
        land_area,
        building_area,
        property_type,
        status,
        featured,
      } = req.body;

      if (!title || !price || !location) {
        return res.status(400).json({
          success: false,
          message: 'Judul, harga, dan lokasi harus diisi',
        });
      }

      const mainImage = req.files?.image_url?.[0]
        ? `/img/${req.files.image_url[0].filename}`
        : null;

      const detailImages = (req.files?.images || []).map(
        (f) => `/img/${f.filename}`
      );

      const [result] = await pool.query(
        `
        INSERT INTO properties
          (title, description, price, price_formatted, location, address,
           bedrooms, bathrooms, land_area, building_area,
           property_type, status, featured, image_url, images, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
        [
          title,
          description || '',
          price,
          price_formatted || '',
          location,
          address || '',
          bedrooms || 0,
          bathrooms || 0,
          land_area || 0,
          building_area || 0,
          property_type || 'house',
          status || 'Dijual',
          featured ? 1 : 0,
          mainImage,
          JSON.stringify(detailImages),
        ]
      );

      res.json({
        success: true,
        id: result.insertId,
        message: 'Properti berhasil ditambahkan',
      });
    } catch (error) {
      console.error('Error menambah properti:', error);
      res
        .status(500)
        .json({ success: false, message: 'Gagal menambah properti' });
    }
  }
);

// List
app.get(
  '/api/admin/properties',
  authenticateToken,
  requireAdmin,
  async (_req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM properties ORDER BY id DESC'
      );
      res.json({
        success: true,
        data: rows.map(rowToProperty),
      });
    } catch (error) {
      console.error('Error list properti:', error);
      res
        .status(500)
        .json({ success: false, message: 'Gagal mengambil data properti' });
    }
  }
);

// Detail
app.get(
  '/api/admin/properties/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM properties WHERE id = ?',
        [req.params.id]
      );
      if (!rows.length) {
        return res
          .status(404)
          .json({ success: false, message: 'Properti tidak ditemukan' });
      }
      res.json({ success: true, data: rowToProperty(rows[0]) });
    } catch (error) {
      console.error('[ERROR] Detail properti:', error);
      res
        .status(500)
        .json({ success: false, message: 'Terjadi kesalahan server' });
    }
  }
);

// Update
app.put(
  '/api/admin/properties/:id',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image_url', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const [oldRows] = await pool.query(
        'SELECT * FROM properties WHERE id = ?',
        [id]
      );
      if (!oldRows.length) {
        return res
          .status(404)
          .json({ success: false, message: 'Properti tidak ditemukan' });
      }
      const old = rowToProperty(oldRows[0]);

      const newMainImage = req.files?.image_url?.[0]
        ? `/img/${req.files.image_url[0].filename}`
        : old.image_url;

      const newDetailImages =
        req.files?.images?.length > 0
          ? JSON.stringify(req.files.images.map((f) => `/img/${f.filename}`))
          : JSON.stringify(old.images);

      const {
        title = old.title,
        description = old.description,
        price = old.price,
        price_formatted = old.price_formatted,
        location = old.location,
        address = old.address,
        bedrooms = old.bedrooms,
        bathrooms = old.bathrooms,
        land_area = old.land_area,
        building_area = old.building_area,
        property_type = old.property_type,
        status = old.status,
        featured = old.featured,
      } = req.body;

      await pool.query(
        `
        UPDATE properties SET
          title = ?, description = ?, price = ?, price_formatted = ?, location = ?, address = ?,
          bedrooms = ?, bathrooms = ?, land_area = ?, building_area = ?,
          property_type = ?, status = ?, featured = ?, image_url = ?, images = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [
          title,
          description,
          price,
          price_formatted,
          location,
          address,
          bedrooms,
          bathrooms,
          land_area,
          building_area,
          property_type,
          status,
          featured ? 1 : 0,
          newMainImage,
          newDetailImages,
          id,
        ]
      );

      res.json({ success: true, message: 'Properti berhasil diperbarui' });
    } catch (error) {
      console.error('Error update properti:', error);
      res
        .status(500)
        .json({ success: false, message: 'Gagal memperbarui properti' });
    }
  }
);

// Delete
app.delete(
  '/api/admin/properties/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM properties WHERE id = ?',
        [req.params.id]
      );
      if (!result.affectedRows) {
        return res
          .status(404)
          .json({ success: false, message: 'Properti tidak ditemukan' });
      }
      res.json({ success: true, message: 'Properti berhasil dihapus' });
    } catch (error) {
      console.error('Error menghapus properti:', error);
      res
        .status(500)
        .json({ success: false, message: 'Gagal menghapus properti' });
    }
  }
);

// ============================================================
// Error handling
// ============================================================
app.use((err, _req, res, _next) => {
  console.error('Error handler global:', err);
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(413)
      .json({ success: false, message: 'Ukuran file terlalu besar (maks 5MB)' });
  }
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

// ============================================================
// Start server
// ============================================================
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log('Endpoint publik:');
  console.log('GET  /api/properties            - List properti (homepage)');
  console.log('GET  /api/properties/:id        - Detail properti');
  console.log('Static image                    - http://localhost:%s/img/<filename>', port);
  console.log('Endpoint admin:');
  console.log('POST /api/login                 - Login');
  console.log('GET  /api/admin/properties      - List admin');
  console.log('POST /api/admin/properties      - Tambah properti');
  console.log('GET  /api/admin/properties/:id  - Detail admin');
  console.log('PUT  /api/admin/properties/:id  - Update properti');
  console.log('DELETE /api/admin/properties/:id- Hapus properti');
});
