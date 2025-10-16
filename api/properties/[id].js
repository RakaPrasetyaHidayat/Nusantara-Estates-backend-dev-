import dotenv from 'dotenv';
import supabaseAdmin from '../_supabase.js';
import withCors from '../_cors.js';

dotenv.config();

export default withCors(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ success: false, message: 'ID required' });
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Supabase not configured' });
    const { data, error } = await supabaseAdmin.from('properties').select('*').eq('id', id).maybeSingle();
    if (error) {
      console.error('Supabase properties detail error:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (!data) return res.status(404).json({ success: false, message: 'Property not found' });
    return res.json({ success: true, data });
  } catch (err) {
    console.error('properties detail error (api/properties/[id]):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
