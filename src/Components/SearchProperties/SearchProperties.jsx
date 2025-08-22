import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import './SearchProperties.css';

const SearchProperties = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    tipe: '',
    lokasi: '',
    page: 1,
    limit: 12
  });
  
  const { properties, loading, error, pagination, searchProperties } = useProperties();
  const [hasSearched, setHasSearched] = useState(false);
  const API_BASE_URL = 'http://localhost:5174';

  const propertyTypes = [
    'Semua Tipe',
    'house',
    'apartment',
    'villa',
    'townhouse',
    'commercial'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    const filters = {
      ...searchFilters,
      tipe: searchFilters.tipe === 'Semua Tipe' ? '' : searchFilters.tipe
    };
    
    searchProperties(filters);
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handlePageChange = (newPage) => {
    setSearchFilters(prev => ({ ...prev, page: newPage }));
    searchProperties({ ...searchFilters, page: newPage });
  };

  const handleChatClick = () => {
    navigate('/contact-agent');
  };

  return (
    <div className="search-properties-container">
      <div className="search-header">
        <h1>Cari Rumah Impian Anda</h1>
        <p>Temukan properti yang sesuai dengan kebutuhan dan budget Anda</p>
      </div>

      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-inputs">
          <div className="input-group">
            <label htmlFor="tipe">Tipe Properti</label>
            <select
              id="tipe"
              name="tipe"
              value={searchFilters.tipe}
              onChange={handleInputChange}
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'house' ? 'Rumah' :
                   type === 'apartment' ? 'Apartemen' :
                   type === 'villa' ? 'Villa' :
                   type === 'townhouse' ? 'Townhouse' :
                   type === 'commercial' ? 'Komersial' :
                   type}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="lokasi">Lokasi</label>
            <input
              type="text"
              id="lokasi"
              name="lokasi"
              value={searchFilters.lokasi}
              onChange={handleInputChange}
              placeholder="Masukkan lokasi yang diinginkan..."
            />
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Mencari...' : 'Cari Properti'}
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="search-results">
        {loading && (
          <div className="loading-state">
            <p>Sedang mencari properti...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && hasSearched && (
          <>
            <div className="results-header">
              <h2>Hasil Pencarian</h2>
              <p>
                Ditemukan {pagination.total} properti
                {searchFilters.lokasi && ` di ${searchFilters.lokasi}`}
                {searchFilters.tipe && searchFilters.tipe !== 'Semua Tipe' && ` dengan tipe ${searchFilters.tipe}`}
              </p>
            </div>

            {properties.length === 0 ? (
              <div className="no-results">
                <p>Tidak ada properti yang sesuai dengan kriteria pencarian Anda.</p>
                <p>Coba ubah filter pencarian atau hubungi agen kami untuk bantuan.</p>
              </div>
            ) : (
              <>
                <div className="properties-grid">
                  {properties.map((property) => (
                    <div key={property.id} className="property-card">
                      <div className="property-image">
                        <img
                          src={property.image_url ? `${API_BASE_URL}${property.image_url}` : '/img/tipe rumah.png'}
                          alt={property.title || 'Property'}
                          onError={(e) => { e.target.src = '/img/tipe rumah.png'; }}
                        />
                        <div className="property-status">
                          {property.status || 'Dijual'}
                        </div>
                      </div>

                      <div className="property-info">
                        <h3 className="property-title">
                          {property.title || property.property_type || 'Property'}
                        </h3>
                        
                        <p className="property-location">
                          📍 {property.location || 'Location not specified'}
                        </p>

                        <div className="property-price">
                          {property.price_formatted || 
                            (property.price ? `Rp ${property.price.toLocaleString('id-ID')}` : 'Price not available')}
                        </div>

                        <div className="property-specs">
                          <span>🛏️ {property.bedrooms || 0} KT</span>
                          <span>🚿 {property.bathrooms || 0} KM</span>
                          <span>📐 {property.land_area || 0} m²</span>
                          <span>🏠 {property.building_area || 0} m²</span>
                        </div>

                        <div className="property-actions">
                          <button 
                            className="btn-detail"
                            onClick={() => handlePropertyClick(property.id)}
                          >
                            Lihat Detail
                          </button>
                          <button 
                            className="btn-chat"
                            onClick={handleChatClick}
                          >
                            💬 Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="pagination-btn"
                    >
                      ← Sebelumnya
                    </button>
                    
                    <span className="pagination-info">
                      Halaman {pagination.page} dari {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="pagination-btn"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!hasSearched && !loading && (
          <div className="initial-state">
            <p>Gunakan form di atas untuk mencari properti yang Anda inginkan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProperties;