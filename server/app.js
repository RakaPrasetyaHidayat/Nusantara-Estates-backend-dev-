import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import pool from './db.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { authenticateToken, requireAdmin, generateToken } from './middleware/auth.js';
import { validateRegistrationData, sanitizeInput } from './utils/validation.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5174;
// Allow multiple origins (frontend local and deployed)
const DEFAULT_ORIGINS = [process.env.FRONTEND_URL || 'http://localhost:5173'];
if (process.env.ADDITIONAL_ORIGINS) {
  // comma separated list
  const extras = process.env.ADDITIONAL_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
  DEFAULT_ORIGINS.push(...extras);
}

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (process.env.FRONTEND_URL === '*') return callback(null, true);
      if (DEFAULT_ORIGINS.includes(origin)) return callback(null, true);
      // Allow vercel apps (e.g. https://my-app.vercel.app)
      try {
        const url = new URL(origin);
        if (url.hostname && url.hostname.endsWith('.vercel.app')) return callback(null, true);
      } catch (e) {
        // ignore parse errors
      }
      // Deny CORS but do not throw an exception here (just false)
      return callback(null, false);
    },
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
// AUTH: Register & Login
// ============================================================

// Register user baru
app.post('/api/register', async (req, res) => {
  try {
    const payload = {
      username: sanitizeInput(req.body?.username || ''),
      email: sanitizeInput(req.body?.email || ''),
      password: req.body?.password || '',
      confirmPassword: req.body?.confirmPassword || req.body?.password || ''
    };

    const { isValid, errors } = validateRegistrationData(payload);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors });
    }

    // cek eksisting
    const [exists] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [payload.username, payload.email]
    );
    if (exists.length) {
      return res.status(409).json({ success: false, message: 'Username atau email sudah terdaftar' });
    }

    // hash password
    const hashed = await bcrypt.hash(payload.password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, role, is_active, email_verified, created_at, updated_at)
       VALUES (?, ?, ?, 'user', 1, 0, NOW(), NOW())`,
      [payload.username, payload.email, hashed]
    );

    return res.status(201).json({ success: true, message: 'Registrasi berhasil', id: result.insertId });
  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Login
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
      'SELECT id, username, email, password, role, is_active, email_verified FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    if (!users.length) {
      return res
        .status(401)
        .json({ success: false, message: 'Kredensial tidak valid' });
    }

    const user = users[0];
    let isValid = false;
    if (user.password && user.password.startsWith('$2')) {
      // bcrypt hash detected
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // fallback plaintext for legacy accounts
      isValid = user.password === password;
    }

    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Kredensial tidak valid' });
    }

    if (user.is_active === 0) {
      return res.status(403).json({ success: false, message: 'Akun tidak aktif' });
    }
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [
      user.id,
    ]);

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user',
      isAdmin: (user.role || 'user') === 'admin',
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

// Test DB connection (untuk frontend /health)
app.get('/api/test-db', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ success: true, message: 'Database OK', data: rows[0] });
  } catch (error) {
    console.error('DB test error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Search rumah (backward compatibility)
app.post('/api/search-rumah', async (req, res) => {
  try {
    const { lokasi, tipe } = req.body || {};
    const params = [];
    const whereParts = ["status IN ('Dijual','Disewa','Terjual')"]; // mengikuti schema
    if (tipe && tipe !== 'Semua Tipe') {
      whereParts.push('property_type = ?');
      params.push(tipe);
    }
    if (lokasi && String(lokasi).trim() !== '') {
      whereParts.push('location LIKE ?');
      params.push(`%${lokasi}%`);
    }
    const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';
    const [rows] = await pool.query(`SELECT * FROM properties ${whereClause} ORDER BY id DESC LIMIT 50`, params);
    res.json({ success: true, data: rows.map(rowToProperty) });
  } catch (error) {
    console.error('Error search:', error);
    res.status(500).json({ success: false, message: 'Gagal mencari properti' });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const { tipe, lokasi, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereParts = ["status IN ('Dijual','Disewa','Terjual')"]; // sesuaikan dengan schema
    const params = [];

    if (tipe && tipe !== 'Semua Tipe') {
      whereParts.push('property_type = ?');
      params.push(tipe);
    }
    if (lokasi && String(lokasi).trim() !== '') {
      whereParts.push('location LIKE ?');
      params.push(`%${lokasi}%`);
    }

    const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';

    const [rows] = await pool.query(
      `SELECT * FROM properties ${whereClause}
       ORDER BY featured DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM properties ${whereClause}`,
      params
    );

    res.json({ success: true, data: rows.map(rowToProperty), page: Number(page), limit: Number(limit), total });
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
    const prop = rowToProperty(rows[0]);
    // ensure images is array for frontend
    prop.images = Array.isArray(prop.images) ? prop.images : (prop.images ? [prop.images] : []);
    res.json({ success: true, data: prop });
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
  async (req, res) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const offset = (page - 1) * limit;
      const [rows] = await pool.query(
        'SELECT * FROM properties ORDER BY id DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM properties');
      res.json({
        success: true,
        data: rows.map(rowToProperty),
        page,
        limit,
        total
      });
    } catch (error) {
      console.error('Error list properti:', error);
      res
        .status(500)
        .json({ success: false, message: 'Gagal mengambil data properti' });
    }
  }
);

// Admin stats sederhana
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const [[{ users }]] = await pool.query('SELECT COUNT(*) as users FROM users');
    const [[{ properties }]] = await pool.query('SELECT COUNT(*) as properties FROM properties');
    const [[{ featured }]] = await pool.query("SELECT COUNT(*) as featured FROM properties WHERE featured = 1");
    res.json({ success: true, data: { users, properties, featured } });
  } catch (error) {
    console.error('Error stats:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
  }
});

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
