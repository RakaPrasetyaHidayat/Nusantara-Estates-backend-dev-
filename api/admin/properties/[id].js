import pool from '../../../../../server/db-serverless.js';
import { requireAdmin } from '../../_auth.js';

export default async function handler(req, res) {
  try {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ success: false, message: 'ID required' });
    if (req.method === 'GET') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
      const row = rows[0];
      const data = { id: row.id, title: row.title, description: row.description, price: row.price, price_formatted: row.price_formatted, location: row.location, address: row.address, bedrooms: row.bedrooms, bathrooms: row.bathrooms, land_area: row.land_area, building_area: row.building_area, property_type: row.property_type, status: row.status, featured: !!row.featured, image_url: row.image_url, images: row.images ? JSON.parse(row.images || '[]') : [], created_at: row.created_at, updated_at: row.updated_at };
      return res.json({ success: true, data });
    }

    if (req.method === 'PUT') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const body = req.body || {};
      const [oldRows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
      if (!oldRows.length) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
      const old = oldRows[0];
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
        featured: body.featured !== undefined ? !!body.featured : !!old.featured,
        image_url: body.image_url ?? old.image_url,
        images: Array.isArray(body.images) ? JSON.stringify(body.images) : (body.images ? JSON.stringify([body.images]) : old.images),
      });
      await pool.query('UPDATE properties SET title = ?, description = ?, price = ?, price_formatted = ?, location = ?, address = ?, bedrooms = ?, bathrooms = ?, land_area = ?, building_area = ?, property_type = ?, status = ?, featured = ?, image_url = ?, images = ?, updated_at = NOW() WHERE id = ?', [updated.title, updated.description, updated.price, updated.price_formatted, updated.location, updated.address, updated.bedrooms, updated.bathrooms, updated.land_area, updated.building_area, updated.property_type, updated.status, updated.featured ? 1 : 0, updated.image_url, updated.images, id]);
      return res.json({ success: true, message: 'Properti berhasil diperbarui (serverless)' });
    }

    if (req.method === 'DELETE') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [id]);
      if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });
      return res.json({ success: true, message: 'Properti berhasil dihapus (serverless)' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('admin property detail error (serverless):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
