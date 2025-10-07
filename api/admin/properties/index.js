import pool from '../../../../server/db-serverless.js';
import { requireAdmin } from '../../_auth.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const offset = (page - 1) * limit;
      const [rows] = await pool.query('SELECT * FROM properties ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
      const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM properties');
      const mapRow = (row) => ({ id: row.id, title: row.title, description: row.description, price: row.price, price_formatted: row.price_formatted, location: row.location, address: row.address, bedrooms: row.bedrooms, bathrooms: row.bathrooms, land_area: row.land_area, building_area: row.building_area, property_type: row.property_type, status: row.status, featured: !!row.featured, image_url: row.image_url, images: row.images ? JSON.parse(row.images || '[]') : [], created_at: row.created_at, updated_at: row.updated_at });
      return res.json({ success: true, data: rows.map(mapRow), page, limit, total });
    }

    if (req.method === 'POST') {
      // create property (JSON-only for serverless)
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const body = req.body || {};
      const { title, price, price_formatted = '', location, address = '', bedrooms = 0, bathrooms = 0, land_area = 0, building_area = 0, property_type = 'house', status = 'Dijual', featured = false, image_url = null, images = [] } = body;
      if (!title || !price || !location) return res.status(400).json({ success: false, message: 'title, price, location required' });
      const [result] = await pool.query(`INSERT INTO properties (title, description, price, price_formatted, location, address, bedrooms, bathrooms, land_area, building_area, property_type, status, featured, image_url, images, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, [title, body.description || '', price, price_formatted, location, address, bedrooms, bathrooms, land_area, building_area, property_type, status, featured ? 1 : 0, image_url, JSON.stringify(images)]);
      return res.json({ success: true, id: result.insertId, message: 'Properti berhasil ditambahkan (serverless)' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('admin properties error (serverless):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
