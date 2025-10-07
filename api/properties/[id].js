import pool from '../../server/db.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ success: false, message: 'ID required' });
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Property not found' });
    const row = rows[0];
    const data = { id: row.id, title: row.title, description: row.description, price: row.price, price_formatted: row.price_formatted, location: row.location, address: row.address, bedrooms: row.bedrooms, bathrooms: row.bathrooms, land_area: row.land_area, building_area: row.building_area, property_type: row.property_type, status: row.status, featured: !!row.featured, image_url: row.image_url, images: row.images ? JSON.parse(row.images || '[]') : [], created_at: row.created_at, updated_at: row.updated_at };
    return res.json({ success: true, data });
  } catch (err) {
    console.error('properties detail error (api/properties/[id]):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
