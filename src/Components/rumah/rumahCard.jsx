import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import './rumahcard.css'; 

const RumahCard = ({ filters = {} }) => {
    const navigate = useNavigate();
    const { properties, loading, error } = useProperties(filters);
    const [displayProperties, setDisplayProperties] = useState([]);
    const API_BASE_URL = 'http://localhost:5174';

    useEffect(() => {
        // Limit tampilan ke 8 properties untuk homepage
        setDisplayProperties(properties.slice(0, 8));
    }, [properties]);

    const handleClick = (propertyId) => {
        navigate(`/property/${propertyId}`);
    };

    const handleChatClick = () => {
        navigate('/contact-agent');
    };

    if (loading) {
        return (
            <div className="container-card">
                <div className="loading-message">
                    <p>Loading properties...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-card">
                <div className="error-message">
                    <p>Error loading properties: {error}</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        );
    }

    if (displayProperties.length === 0) {
        return (
            <div className="container-card">
                <div className="no-properties">
                    <p>No properties available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container-card">
                {/* ✅ Rumah Card Section */}
                <div className="card-list">
                    {displayProperties.map((property, index) => (
                        <div className="card" key={property.id}>
                            <img 
                                src={property.image_url ? `${API_BASE_URL}${property.image_url}` : "/img/tipe rumah.png"} 
                                alt={property.title || `Property ${index + 1}`}
                                onError={(e) => { e.target.src = "/img/tipe rumah.png"; }}
                            />
                            <div className="card-body">
                                <h3>{property.price_formatted || (property.price ? `Rp ${property.price.toLocaleString('id-ID')}` : 'Price not available')}</h3>
                                <p>{property.title || property.property_type || 'Property'}</p>
                                <p>{property.location || 'Location not specified'}</p>
                                <a href="#" className="status">{property.status || 'Dijual'}</a>

                                <div className="pagination">
                                    {/* ✅ Tambahan info properti */}
                                    <div className="info-detail">
                                        <span><strong>LT</strong> {property.land_area || 0}m²</span>
                                        <span><strong>LB</strong> {property.building_area || 0}m²</span>
                                        <span><strong>KT</strong> {property.bedrooms || 0}</span>
                                        <span><strong>KM</strong> {property.bathrooms || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="btn-detail" onClick={() => handleClick(property.id)}>Lihat Detail</button>
                                <button className="btn-chat" onClick={handleChatClick}><i className="fa-brands fa-whatsapp"></i> Chat</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RumahCard