import express from 'express';
import cors from 'cors';
import { authenticateToken, requireAdmin, generateToken } from './middleware/auth.js';
import { sanitizeInput } from './utils/validation.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5174;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

// In-memory sample data
let properties = [
  {
    id: 1,
    title: 'Rumah Contoh 1',
    description: 'Deskripsi rumah contoh 1',
    price: 1500000000,
    price_formatted: 'Rp 1.500.000.000',
    location: 'Jakarta',
    address: 'Jl. Contoh No.1',
    bedrooms: 3,
    bathrooms: 2,
    land_area: 120,
    building_area: 90,
    property_type: 'house',
    house_type: 'Tipe A',
    status: 'Dijual',
    featured: true,
    image_url: null,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Rumah Contoh 2',
    description: 'Deskripsi rumah contoh 2',
    price: 850000000,
    price_formatted: 'Rp 850.000.000',
    location: 'Bandung',
    address: 'Jl. Contoh No.2',
    bedrooms: 2,
    bathrooms: 1,
    land_area: 80,
    building_area: 60,
    property_type: 'apartment',
    house_type: 'Tipe B',
    status: 'Dijual',
    featured: false,
    image_url: null,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let lastPropertyId = properties.length;

// Helper to map row
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
  images: Array.isArray(row.images) ? row.images : [],
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// ============================================================
// AUTH
// ============================================================

app.post('/api/register', (req, res) => {
  // minimal register for no-db mode: accept and return created id
  const username = sanitizeInput(req.body?.username || '');
  const email = sanitizeInput(req.body?.email || '');
  const password = req.body?.password || '';
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, dan password diperlukan' });
  }
  // return fake id
  return res.status(201).json({ success: true, message: 'Registrasi (no-db) berhasil', id: Date.now() % 100000 });
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
    }

    const ADMIN = { username: 'NEadmin', email: 'admin@nusantara.com', password: 'BARA211' };
    const isAdmin = (username === ADMIN.username || username === ADMIN.email) && password === ADMIN.password;
    if (isAdmin) {
      const adminUser = { id: 0, username: ADMIN.username, email: ADMIN.email, role: 'admin', isAdmin: true };
      const token = generateToken(adminUser);
      return res.json({ success: true, message: 'Login admin berhasil', user: adminUser, token });
    }

    // sample user
    if ((username === 'testuser' || username === 'test@example.com') && password === 'password123') {
      const user = { id: 100, username: 'testuser', email: 'test@example.com', role: 'user', isAdmin: false };
      const token = generateToken(user);
      return res.json({ success: true, message: 'Login berhasil', user, token });
    }

    return res.status(401).json({ success: false, message: 'Kredensial tidak valid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// ============================================================
// PUBLIC ROUTES
// ============================================================

app.get('/api/test-db', (_req, res) => {
  res.json({ success: true, message: 'no-db mode - database not required' });
});

app.post('/api/search-rumah', (req, res) => {
  const { lokasi, tipe } = req.body || {};
  let results = properties.filter(p => ['Dijual','Disewa','Terjual'].includes(p.status));
  if (tipe && tipe !== 'Semua Tipe') results = results.filter(p => p.property_type === tipe);
  if (lokasi) results = results.filter(p => String(p.location).toLowerCase().includes(String(lokasi).toLowerCase()));
  res.json({ success: true, data: results.map(rowToProperty) });
});

app.get('/api/properties', (req, res) => {
  const { tipe, lokasi, page = 1, limit = 10 } = req.query;
  let results = properties.filter(p => ['Dijual','Disewa','Terjual'].includes(p.status));
  if (tipe && tipe !== 'Semua Tipe') results = results.filter(p => p.property_type === tipe);
  if (lokasi) results = results.filter(p => String(p.location).toLowerCase().includes(String(lokasi).toLowerCase()));
  const pageNum = Number(page), lim = Number(limit);
  const offset = (pageNum - 1) * lim;
  const paged = results.slice(offset, offset + lim);
  res.json({ success: true, data: paged.map(rowToProperty), page: pageNum, limit: lim, total: results.length });
});

app.get('/api/properties/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = properties.find(x => x.id === id);
  if (!p) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
  res.json({ success: true, data: rowToProperty(p) });
});

// ============================================================
// ADMIN ROUTES (in-memory)
// ============================================================

app.post('/api/admin/properties', authenticateToken, requireAdmin, (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.price || !body.location) return res.status(400).json({ success: false, message: 'Judul, harga, lokasi required' });
  lastPropertyId += 1;
  const newProp = {
    id: lastPropertyId,
    title: sanitizeInput(body.title || ''),
    description: body.description || '',
    price: Number(body.price) || 0,
    price_formatted: body.price_formatted || String(body.price || ''),
    location: body.location || '',
    address: body.address || '',
    bedrooms: Number(body.bedrooms) || 0,
    bathrooms: Number(body.bathrooms) || 0,
    land_area: Number(body.land_area) || 0,
    building_area: Number(body.building_area) || 0,
    property_type: body.property_type || 'house',
    status: body.status || 'Dijual',
    featured: body.featured ? true : false,
    image_url: body.image_url || null,
    images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  properties.unshift(newProp);
  res.json({ success: true, id: newProp.id, message: 'Properti berhasil ditambahkan (no-db)' });
});

app.get('/api/admin/properties', authenticateToken, requireAdmin, (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const offset = (page - 1) * limit;
  res.json({ success: true, data: properties.slice(offset, offset + limit).map(rowToProperty), page, limit, total: properties.length });
});

app.get('/api/admin/properties/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const p = properties.find(x => x.id === id);
  if (!p) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
  res.json({ success: true, data: rowToProperty(p) });
});

app.put('/api/admin/properties/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const idx = properties.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
  const body = req.body || {};
  const old = properties[idx];
  const updated = Object.assign({}, old, {
    title: body.title ?? old.title,
    description: body.description ?? old.description,
    price: body.price ?? old.price,
    price_formatted: body.price_formatted ?? old.price_formatted,
    location: body.location ?? old.location,
    address: body.address ?? old.address,
    bedrooms: body.bedrooms ?? old.bedrooms,
    bathrooms: body.bathrooms ?? old.bathrooms,
    land_area: body.land_area ?? old.land_area,
    building_area: body.building_area ?? old.building_area,
    property_type: body.property_type ?? old.property_type,
    status: body.status ?? old.status,
    featured: body.featured !== undefined ? !!body.featured : old.featured,
    image_url: body.image_url ?? old.image_url,
    images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : old.images),
    updated_at: new Date().toISOString(),
  });
  properties[idx] = updated;
  res.json({ success: true, message: 'Properti berhasil diperbarui (no-db)' });
});

app.delete('/api/admin/properties/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const idx = properties.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
  properties.splice(idx, 1);
  res.json({ success: true, message: 'Properti berhasil dihapus (no-db)' });
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, (_req, res) => {
  res.json({ success: true, data: { users: 2, properties: properties.length, featured: properties.filter(p => p.featured).length } });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Global error (no-db):', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

app.listen(port, () => {
  console.log(`No-DB server berjalan di http://localhost:${port}`);
  console.log('Gunakan script: npm run server:no-db');
});
