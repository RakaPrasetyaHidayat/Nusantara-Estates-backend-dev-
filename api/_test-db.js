import dotenv from 'dotenv';
import supabaseAdmin from './_supabase.js';

dotenv.config();

(async () => {
  try {
    if (!supabaseAdmin) {
      console.error('❌ Supabase not configured. Check SUPABASE_URL and keys in .env');
      process.exit(1);
    }

    // Head request to get total count quickly
    const { error, count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Supabase query error:', error);
      process.exit(1);
    }

    console.log(`✅ Supabase connected. Users table count (approx): ${typeof count === 'number' ? count : 'unknown'}`);

    // Try simple fetch of one property row (optional)
    const { data: prop, error: propErr } = await supabaseAdmin
      .from('properties')
      .select('id')
      .limit(1);

    if (propErr) {
      console.error('⚠️ Properties query error:', propErr.message);
    } else {
      console.log(`🏠 Properties sample fetch OK. Rows fetched: ${Array.isArray(prop) ? prop.length : 0}`);
    }

    process.exit(0);
  } catch (e) {
    console.error('❌ Test failed with exception:', e.message || e);
    process.exit(1);
  }
})();