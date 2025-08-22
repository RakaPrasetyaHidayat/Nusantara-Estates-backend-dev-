import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './rumahkosong.css'; 

const RumahKosong = ({ selectedTipe = 'Semua Tipe', searchLocation = '' }) => {
  
    const navigate = useNavigate();
    
    // Menggunakan custom hook untuk data properties
    const { 
        properties, 
        loading, 
        error, 
        pagination, 
        searchProperties 
    } = useProperties();

    const handleClick = () => {
        navigate('/detailsPage');
    };

    const handleChatClick = () => {
        navigate('/contact-agent');
    };

    const tipeListRef = useRef(null);
    const btnLeftRef = useRef(null);
    const btnRightRef = useRef(null);

    // Effect untuk scroll functionality
    useEffect(() => {
        const tipeList = tipeListRef.current;
        const btnLeft = btnLeftRef.current;
        const btnRight = btnRightRef.current;

        const scrollLeft = () => {
            tipeList.scrollBy({ left: -250, behavior: 'smooth' });
        };

        const scrollRight = () => {
            tipeList.scrollBy({ left: 250, behavior: 'smooth' });
        };

        if (btnLeft) btnLeft.addEventListener('click', scrollLeft);
        if (btnRight) btnRight.addEventListener('click', scrollRight);

        return () => {
            if (btnLeft) btnLeft.removeEventListener('click', scrollLeft);
            if (btnRight) btnRight.removeEventListener('click', scrollRight);
        };
    }, []);

    // Effect untuk search ketika filter berubah
    useEffect(() => {
        searchProperties({
            tipe: selectedTipe,
            lokasi: searchLocation
        });
    }, [selectedTipe, searchLocation, searchProperties]);

    // Transform data dari database ke format yang dibutuhkan frontend
    const transformedProperties = properties.map(property => ({
        id: property.id,
        harga: property.price_formatted || `Rp ${(property.price / 1000000000).toFixed(1)} Milyar`,
        tipe: property.house_type,
        lokasi: property.location,
        status: property.status,
        lt: property.land_area,
        lb: property.building_area,
        kt: property.bedrooms,
        km: property.bathrooms,
        img: property.image_url || "/img/tipe rumah.png",
        title: property.title,
        description: property.description
    }));

    // ✅ Data tipe rumah (untuk horizontal scroll)
    const tipeRumahList = [
        { id: 1, img: "/img/tipe rumah.png", label: "Tipe rumah Modern" },
        { id: 2, img: "/img/tipe rumah.png", label: "Tipe rumah Industrial" },
        { id: 3, img: "/img/tipe rumah.png", label: "Tipe rumah Skandinavia" },
        { id: 4, img: "/img/tipe rumah.png", label: "Tipe rumah Modern" },
        { id: 5, img: "/img/tipe rumah.png", label: "Tipe rumah Industrial" },
        { id: 6, img: "/img/tipe rumah.png", label: "Tipe rumah Skandinavia" },
    ];

    return (
        <div>
            <div className="container-card">
                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <p>Memuat data rumah...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="error-state">
                        <h3>Terjadi Kesalahan</h3>
                        <p>{error}</p>
                    </div>
                )}

                {/* ✅ Rumah Card Section */}
                {!loading && !error && (
                    transformedProperties.length === 0 ? (
                        <div className="no-results">
                            <h3>Tidak ada rumah yang ditemukan</h3>
                            <p>Coba ubah filter atau kata kunci pencarian Anda</p>
                        </div>
                    ) : (
                        <div className="card-list">
                            {transformedProperties.map((rumah, index) => (
                            <div className="card" key={rumah.id}>
                                <img src={rumah.img} alt={`${rumah.title || 'Rumah'} ${index + 1}`} />
                                <div className="card-body">
                                    <h3>{rumah.harga}</h3>
                                     <p>{rumah.tipe}</p>
                                    <p>{rumah.lokasi}</p>
                                    <a href="#" className="status">{rumah.status}</a>

                                     <div className="pagination">

                          
                                    {/* ✅ Tambahan info properti */}
                                    <div className="info-detail">
                                        <span><strong>LT</strong> {rumah.lt}m²</span>
                                        <span><strong>LB</strong> {rumah.lb}m²</span>
                                        <span><strong>KT</strong> {rumah.kt}</span>
                                        <span><strong>KM</strong> {rumah.km}</span>
                                    </div>
                                </div>
                                    <div className="card-actions">
                                        <button className="btn-detail" onClick={handleClick}>Lihat Detail</button>
                                        <button className="btn-chat" onClick={handleChatClick}><i className="fa-brands fa-whatsapp"></i> Chat</button>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>

    );
}

export default RumahKosong