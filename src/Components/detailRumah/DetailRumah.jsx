import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailRumah.css';
import AdminNavbar from '../navbar/AdminNavbar';

function DetailRumah() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:5174';

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      const token = localStorage.getItem('token');
if (!token) {
  setError('Anda perlu login terlebih dahulu');
  navigate('/login');
  return;
}


      try {
        setLoading(true);
        setError(null);

        console.log(`Mengambil data properti ID: ${id}`);

      const response = await fetch(`${API_BASE_URL}/api/admin/properties/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const status = response.status;

          if (status === 401) {
            throw new Error('Unauthorized - Silakan login ulang');
          } else if (status === 403) {
            throw new Error('Forbidden - Akses ditolak');
          } else if (status === 404) {
            throw new Error('Properti tidak ditemukan');
          } else {
            throw new Error(errorData.message || `Error ${status}`);
          }
        }

        const result = await response.json();

        const transformedData = {
          ...result.data,
          images: Array.isArray(result.data.images) ? result.data.images : []
        };

        setProperty(transformedData);

      } catch (err) {
        console.error('Gagal mengambil data:', err);
        setError(err.message);

        if (err.message.includes('Unauthorized')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="detail-page">
        <AdminNavbar />
        <div className="main-content">
          <div className="skeleton-loading">
            <div className="skeleton-header"></div>
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <AdminNavbar />
        <div className="main-content">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button onClick={() => window.location.reload()}>Coba Lagi</button>
              <button onClick={() => navigate('/AdminPage')}>Kembali ke Admin</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="detail-page">
        <AdminNavbar />
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
      <AdminNavbar />
      <div className="main-content">
        <h1 className="page-title">Detail Properti</h1>
        <div className="detail-container">
          <h2>{property.title}</h2>
          <p>{property.description}</p>
          <p><strong>Lokasi:</strong> {property.location}</p>
          <p><strong>Alamat:</strong> {property.address}</p>
          <p><strong>Harga:</strong> {property.price_formatted || property.price}</p>
          <p><strong>Kamar Tidur:</strong> {property.bedrooms}</p>
          <p><strong>Kamar Mandi:</strong> {property.bathrooms}</p>
          <p><strong>Luas Tanah:</strong> {property.land_area} m²</p>
          <p><strong>Luas Bangunan:</strong> {property.building_area} m²</p>
          <p><strong>Status:</strong> {property.status}</p>
          <img src={property.image_url} alt="Gambar utama" className="main-image" />
          <div className="image-gallery">
            {property.images.map((img, index) => (
              <img key={index} src={img} alt={`Detail ${index + 1}`} className="detail-image" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailRumah;
