import supabaseAdmin from '../../_supabase.js';
import { requireAdmin } from '../../_auth.js';
import withCors from '../../_cors.js';

export default withCors(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const offset = (page - 1) * limit;
      if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Supabase not configured' });
      const start = offset;
      const end = offset + limit - 1;
      const { data, error, count } = await supabaseAdmin
        .from('properties')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(start, end);
      if (error) throw error;
      const mapRow = (row) => ({ id: row.id, title: row.title, description: row.description, price: row.price, price_formatted: row.price_formatted, location: row.location, address: row.address, bedrooms: row.bedrooms, bathrooms: row.bathrooms, land_area: row.land_area, building_area: row.building_area, property_type: row.property_type, status: row.status, featured: !!row.featured, image_url: row.image_url, images: row.images ? (Array.isArray(row.images) ? row.images : JSON.parse(row.images || '[]')) : [], created_at: row.created_at, updated_at: row.updated_at });
      return res.json({ success: true, data: Array.isArray(data) ? data.map(mapRow) : [], page, limit, total: count ?? (Array.isArray(data) ? data.length : 0) });
    }

    if (req.method === 'POST') {
      // create property (JSON-only for serverless)
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });
      const body = req.body || {};
      const { title, price, price_formatted = '', location, address = '', bedrooms = 0, bathrooms = 0, land_area = 0, building_area = 0, property_type = 'house', status = 'Dijual', featured = false, image_url = null, images = [] } = body;
      if (!title || !price || !location) return res.status(400).json({ success: false, message: 'title, price, location required' });
      if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Supabase not configured' });
      const { data: insertData, error: insertError } = await supabaseAdmin.from('properties').insert([{
        title,
        description: body.description || '',
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
        featured: featured ? 1 : 0,
        image_url,
        images: JSON.stringify(images),
      }]).select('id');
      if (insertError) throw insertError;
      const newId = insertData && insertData[0] ? insertData[0].id : null;
      return res.json({ success: true, id: newId, message: 'Properti berhasil ditambahkan (serverless)' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('admin properties error (serverless):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
