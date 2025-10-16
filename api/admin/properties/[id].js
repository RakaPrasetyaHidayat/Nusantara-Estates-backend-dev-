
import supabaseAdmin from '../../_supabase.js';
import { requireAdmin } from '../../_auth.js';

export default async function handler(req, res) {
  try {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ success: false, message: 'ID required' });

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Supabase not configured' });
    }

    if (req.method === 'GET') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });

      const { data, error } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });

      const images = data.images
        ? (Array.isArray(data.images) ? data.images : (() => { try { return JSON.parse(data.images || '[]'); } catch { return []; } })())
        : [];

      const mapped = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        price_formatted: data.price_formatted,
        location: data.location,
        address: data.address,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        land_area: data.land_area,
        building_area: data.building_area,
        property_type: data.property_type,
        status: data.status,
        featured: !!data.featured,
        image_url: data.image_url,
        images,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return res.json({ success: true, data: mapped });
    }

    if (req.method === 'PUT') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });

      const body = req.body || {};

      const { data: oldData, error: oldErr } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (oldErr) throw oldErr;
      if (!oldData) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });

      const updated = Object.assign({}, oldData, {
        title: body.title ?? oldData.title,
        description: body.description ?? oldData.description,
        price: body.price ?? oldData.price,
        price_formatted: body.price_formatted ?? oldData.price_formatted,
        location: body.location ?? oldData.location,
        address: body.address ?? oldData.address,
        bedrooms: body.bedrooms ?? oldData.bedrooms,
        bathrooms: body.bathrooms ?? oldData.bathrooms,
        land_area: body.land_area ?? oldData.land_area,
        building_area: body.building_area ?? oldData.building_area,
        property_type: body.property_type ?? oldData.property_type,
        status: body.status ?? oldData.status,
        featured: body.featured !== undefined ? (body.featured ? 1 : 0) : (oldData.featured ? 1 : 0),
        image_url: body.image_url ?? oldData.image_url,
        images: Array.isArray(body.images)
          ? JSON.stringify(body.images)
          : (body.images
              ? (Array.isArray(body.images) ? JSON.stringify(body.images) : body.images)
              : (Array.isArray(oldData.images) ? JSON.stringify(oldData.images) : (oldData.images ?? null))),
      });

      const { error: updErr } = await supabaseAdmin
        .from('properties')
        .update({
          title: updated.title,
          description: updated.description,
          price: updated.price,
          price_formatted: updated.price_formatted,
          location: updated.location,
          address: updated.address,
          bedrooms: updated.bedrooms,
          bathrooms: updated.bathrooms,
          land_area: updated.land_area,
          building_area: updated.building_area,
          property_type: updated.property_type,
          status: updated.status,
          featured: updated.featured,
          image_url: updated.image_url,
          images: updated.images,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('id')
        .single();

      if (updErr) throw updErr;

      return res.json({ success: true, message: 'Properti berhasil diperbarui (supabase)' });
    }

    if (req.method === 'DELETE') {
      const auth = requireAdmin(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, message: auth.message });

      const { data: delData, error: delErr } = await supabaseAdmin
        .from('properties')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

      if (delErr) throw delErr;
      if (!delData) return res.status(404).json({ success: false, message: 'Properti tidak ditemukan' });

      return res.json({ success: true, message: 'Properti berhasil dihapus (supabase)' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('admin property detail error (supabase):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
