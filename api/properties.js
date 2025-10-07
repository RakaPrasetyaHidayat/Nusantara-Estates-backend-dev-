import pool from '../server/db.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const { tipe, lokasi, page = 1, limit = 10 } = req.query || {};
    const offset = (Number(page) - 1) * Number(limit);
    const whereParts = ["status IN ('Dijual','Disewa','Terjual')"];
    const params = [];
    if (tipe && tipe !== 'Semua Tipe') { whereParts.push('property_type = ?'); params.push(tipe); }
    if (lokasi && String(lokasi).trim() !== '') { whereParts.push('location LIKE ?'); params.push(`%${lokasi}%`); }
    const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';
    const [rows] = await pool.query(`SELECT * FROM properties ${whereClause} ORDER BY featured DESC, id DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM properties ${whereClause}`, params);
    const mapRow = (row) => ({ id: row.id, title: row.title, description: row.description, price: row.price, price_formatted: row.price_formatted, location: row.location, address: row.address, bedrooms: row.bedrooms, bathrooms: row.bathrooms, land_area: row.land_area, building_area: row.building_area, property_type: row.property_type, status: row.status, featured: !!row.featured, image_url: row.image_url, images: row.images ? JSON.parse(row.images || '[]') : [], created_at: row.created_at, updated_at: row.updated_at });
    return res.json({ success: true, data: rows.map(mapRow), page: Number(page), limit: Number(limit), total });
  } catch (err) {
    console.error('properties list error (api/properties):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
