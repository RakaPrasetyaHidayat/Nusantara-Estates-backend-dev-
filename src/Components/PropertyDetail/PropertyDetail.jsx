import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import './PropertyDetail.css';

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_BASE_URL = 'http://localhost:5174';

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/properties/${id}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch data');
        }

        setProperty(result.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetail();
    }
  }, [id]);

  const handleContactAgent = () => {
    navigate('/contact-agent');
  };

  const handlePrevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="property-detail-container">
          <div className="loading-container">
            <p>Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="property-detail-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
            <button onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div>
        <Navbar />
        <div className="property-detail-container">
          <div className="empty-state">
            <p>Property not found</p>
            <button onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = [
    property.image_url,
    ...(property.images || [])
  ].filter(Boolean);

  return (
    <div>
      <Navbar />
      
      <div className="property-detail-container">
        <div className="property-detail-content">
          {/* Header */}
          <div className="property-header">
            <h1>{property.title || 'Property Details'}</h1>
            <div className="property-status">
              <span className={`status-badge ${property.status?.toLowerCase()}`}>
                {property.status || 'Dijual'}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="property-images">
            <div className="main-image-container">
              <img
                src={allImages.length > 0 ? `${API_BASE_URL}${allImages[currentImageIndex]}` : '/img/tipe rumah.png'}
                alt={property.title || 'Property'}
                className="main-image"
                onError={(e) => { e.target.src = '/img/tipe rumah.png'; }}
              />
              
              {allImages.length > 1 && (
                <>
                  <button className="image-nav prev" onClick={handlePrevImage}>
                    &#8249;
                  </button>
                  <button className="image-nav next" onClick={handleNextImage}>
                    &#8250;
                  </button>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="image-thumbnails">
                {allImages.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_BASE_URL}${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => { e.target.src = '/img/tipe rumah.png'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="property-info">
            <div className="property-main-info">
              <div className="price-section">
                <h2 className="property-price">
                  {property.price_formatted || 
                    (property.price ? `Rp ${property.price.toLocaleString('id-ID')}` : 'Price not available')}
                </h2>
              </div>

              <div className="property-specs">
                <div className="spec-item">
                  <span className="spec-label">Kamar Tidur</span>
                  <span className="spec-value">{property.bedrooms || 0}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Kamar Mandi</span>
                  <span className="spec-value">{property.bathrooms || 0}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Luas Tanah</span>
                  <span className="spec-value">{property.land_area || 0} m²</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Luas Bangunan</span>
                  <span className="spec-value">{property.building_area || 0} m²</span>
                </div>
              </div>

              <div className="property-location">
                <h3>Lokasi</h3>
                <p>{property.location || 'Location not specified'}</p>
                {property.address && <p className="address">{property.address}</p>}
              </div>

              {property.description && (
                <div className="property-description">
                  <h3>Deskripsi</h3>
                  <p>{property.description}</p>
                </div>
              )}

              <div className="property-type">
                <h3>Tipe Properti</h3>
                <p>{property.house_type || property.property_type || 'House'}</p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <div className="contact-card">
                <h3>Tertarik dengan properti ini?</h3>
                <p>Hubungi agen kami untuk informasi lebih lanjut</p>
                <button className="contact-btn" onClick={handleContactAgent}>
                  <i className="fa-brands fa-whatsapp"></i>
                  Hubungi Agen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PropertyDetail;