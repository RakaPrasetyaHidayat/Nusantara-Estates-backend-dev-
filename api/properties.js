import dotenv from 'dotenv';
import supabaseAdmin from './_supabase.js';
import withCors from './_cors.js';

dotenv.config();

export default withCors(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const { tipe, lokasi, page = 1, limit = 10 } = req.query || {};
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Supabase not configured' });

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabaseAdmin
      .from('properties')
      .select('*')
      .order('featured', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to);

    if (tipe && tipe !== 'Semua Tipe') query = query.eq('property_type', tipe);
    if (lokasi && String(lokasi).trim() !== '') query = query.ilike('location', `%${lokasi}%`);

    const { data, error } = await query;
    if (error) {
      console.error('Supabase properties error:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    return res.json({ success: true, data, page: Number(page), limit: Number(limit), total: Array.isArray(data) ? data.length : 0 });
  } catch (err) {
    console.error('properties list error (api/properties):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
