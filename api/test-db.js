import withCors from './_cors.js';
import supabaseAdmin from './_supabase.js';

export default withCors(async function handler(req, res) {
  if (req.method === 'GET') {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Supabase not configured' });
    try {
      const { error, count } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'DB OK', users_count: typeof count === 'number' ? count : null });
    } catch (e) {
      console.error('test-db error:', e);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
  }
  return res.status(405).json({ success: false, message: 'Method not allowed' });
});