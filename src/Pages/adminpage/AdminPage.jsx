import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Components/detailRumah/DetailRumah.css';
import AdminNavbar from '../../Components/navbar/AdminNavbar';
import Navbar from '../../Components/navbar/navbar';

const API_BASE_URL = 'http://localhost:5174';

export default function AdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);
  const isAdmin = !!user?.isAdmin;
  const token = localStorage.getItem('token');

  const prefixURL = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPublic = async () => {
      const res = await fetch(`${API_BASE_URL}/api/properties`);
      if (!res.ok) throw new Error(`PUB_${res.status}`);
      const data = await res.json();
      // bentuk {success, data} atau langsung object
      return data?.data ?? data;
    };

    const fetchAdmin = async () => {
      const res = await fetch(`${API_BASE_URL}/api/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`ADM_${res.status}`);
      const data = await res.json();
      return data?.data ?? data;
    };

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        try {
          data = await fetchPublic();
        } catch (e) {
          // Jika publik gagal & punya token → coba admin
          if (token) {
            data = await fetchAdmin();
          } else {
            throw e;
          }
        }

        if (cancelled) return;

        const imagesArr = Array.isArray(data.images) ? data.images : (data.detail_images || []);
        const normalized = {
          id: data.id,
          title: data.title || data.nama || 'Properti',
          description: data.description || data.deskripsi || '',
          location: data.location || data.kota || '',
          address: data.address || data.alamat || '',
          price: data.price,
          price_formatted: data.price_formatted,
          bedrooms: data.bedrooms || data.kamar_tidur || '',
          bathrooms: data.bathrooms || data.kamar_mandi || '',
          land_area: data.land_area || data.luas_tanah || '',
          building_area: data.building_area || data.luas_bangunan || '',
          status: data.status || 'Dijual',
          image_url: prefixURL(data.image_url || data.card_image),
          images: imagesArr.map(prefixURL),
          facilities: data.facilities || data.fasilitas || '',
          specification: data.specification || data.spesifikasi || '',
          house_type: data.house_type || data.tipe_rumah || '',
        };

        setProperty(normalized);
      } catch (err) {
        console.error(err);
        // Pesan lebih ramah
        if (String(err.message).startsWith('PUB_404') || String(err.message).startsWith('ADM_404')) {
          setError('Properti tidak ditemukan');
        } else if (String(err.message).startsWith('ADM_401')) {
          setError('Sesi admin kedaluwarsa. Silakan login ulang.');
        } else {
          setError('Gagal memuat detail properti');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const Topbar = isAdmin ? AdminNavbar : Navbar;

  if (loading) {
    return (
      <div className="detail-page">
        <Topbar />
        <div className="main-content">
          <div className="skeleton-loading">
            <div className="skeleton-header" />
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <Topbar />
        <div className="main-content">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <div className="error-actions">
              {isAdmin && error.includes('login') ? (
                <button onClick={() => navigate('/LoginForm')}>Login Ulang</button>
              ) : null}
              <button onClick={() => navigate(-1)}>Kembali</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="detail-page">
        <Topbar />
        <div className="main-content">
          <div className="empty-state">
            <p>Properti tidak ditemukan</p>
            <button onClick={() => navigate(-1)}>Kembali</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Topbar />
      <div className="main-content">
        <h1 className="page-title">Detail Properti</h1>

        <div className="detail-container">
          <h2>{property.title}</h2>
          <p className="detail-desc">{property.description}</p>

          {property.image_url && property.image_url.trim() !== "" && (
           <img src={property.image_url} alt={property.title} className="main-image" />
             )}
_+

          <div className="detail-grid">
            <p><strong>Lokasi:</strong> {property.location}</p>
            <p><strong>Alamat:</strong> {property.address}</p>
            <p><strong>Harga:</strong> {property.price_formatted || `Rp ${Number(property.price || 0).toLocaleString('id-ID')}`}</p>
            <p><strong>Kamar Tidur:</strong> {property.bedrooms}</p>
            <p><strong>Kamar Mandi:</strong> {property.bathrooms}</p>
            <p><strong>Luas Tanah:</strong> {property.land_area} m²</p>
            <p><strong>Luas Bangunan:</strong> {property.building_area} m²</p>
            <p><strong>Status:</strong> {property.status}</p>
            <p><strong>Tipe Rumah:</strong> {property.house_type}</p>
            <p><strong>Fasilitas:</strong> {property.facilities}</p>
            <p><strong>Spesifikasi:</strong> {property.specification}</p>
          </div>

              {property.images?.length > 0 && (
              <div className="image-gallery">
                {property.images
                  .filter(img => img && img.trim() !== "")
                  .map((img, i) => (
                  <img key={i} src={img} alt={`Detail ${i + 1}`} className="detail-image" />
                  ))}
              </div>
            )}


          <div className="detail-actions">
            <button onClick={() => navigate(-1)}>Kembali</button>
          </div>
        </div>
      </div>
    </div>
  );
}
