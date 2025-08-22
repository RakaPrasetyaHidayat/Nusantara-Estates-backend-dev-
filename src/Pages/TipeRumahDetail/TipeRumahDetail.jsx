import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/navbar/navbar';
import './TipeRumahDetail.css';

const TipeRumahDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [tipeData, setTipeData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data lengkap untuk setiap tipe rumah
    const tipeRumahData = {
        minimalis: {
            id: 1,
            title: "Rumah Minimalis",
            description: "Desain sederhana dengan fungsi maksimal, cocok untuk keluarga modern yang menginginkan kemudahan perawatan dan efisiensi ruang.",
            features: [
                "Desain clean dan sederhana",
                "Ruang terbuka yang luas",
                "Material berkualitas tinggi",
                "Pencahayaan alami optimal",
                "Storage tersembunyi",
                "Taman minimalis"
            ],
            specifications: {
                "Luas Tanah": "120-200 m²",
                "Luas Bangunan": "80-150 m²",
                "Kamar Tidur": "2-3 kamar",
                "Kamar Mandi": "2-3 kamar",
                "Carport": "1-2 mobil",
                "Listrik": "2200-4400 VA"
            },
            priceRange: "Rp 800 Juta - Rp 1.5 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Melati No. 15", price: "Rp 950 Juta", status: "Available" },
                { id: 2, address: "Jl. Anggrek No. 22", price: "Rp 1.2 Milyar", status: "Available" },
                { id: 3, address: "Jl. Mawar No. 8", price: "Rp 1.1 Milyar", status: "Sold" }
            ]
        },
        modern: {
            id: 2,
            title: "Rumah Modern",
            description: "Arsitektur kontemporer dengan teknologi terkini, menggabungkan estetika modern dengan kenyamanan hidup masa kini.",
            features: [
                "Smart home technology",
                "Fasad kaca dan beton",
                "Open floor plan",
                "Kitchen island modern",
                "Home theater room",
                "Swimming pool"
            ],
            specifications: {
                "Luas Tanah": "200-400 m²",
                "Luas Bangunan": "150-300 m²",
                "Kamar Tidur": "3-4 kamar",
                "Kamar Mandi": "3-4 kamar",
                "Carport": "2-3 mobil",
                "Listrik": "4400-6600 VA"
            },
            priceRange: "Rp 1.5 Milyar - Rp 3 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Sudirman No. 45", price: "Rp 2.1 Milyar", status: "Available" },
                { id: 2, address: "Jl. Thamrin No. 12", price: "Rp 2.8 Milyar", status: "Available" }
            ]
        },
        klasik: {
            id: 3,
            title: "Rumah Klasik",
            description: "Gaya tradisional yang elegan dan timeless, memadukan keanggunan arsitektur klasik dengan kenyamanan modern.",
            features: [
                "Pilar dan ornamen klasik",
                "Ruang formal yang elegan",
                "Material kayu berkualitas",
                "Taman klasik dengan air mancur",
                "Library/study room",
                "Dining room formal"
            ],
            specifications: {
                "Luas Tanah": "250-500 m²",
                "Luas Bangunan": "200-400 m²",
                "Kamar Tidur": "4-5 kamar",
                "Kamar Mandi": "4-5 kamar",
                "Carport": "2-4 mobil",
                "Listrik": "6600-10000 VA"
            },
            priceRange: "Rp 2 Milyar - Rp 5 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Diponegoro No. 88", price: "Rp 3.5 Milyar", status: "Available" },
                { id: 2, address: "Jl. Veteran No. 33", price: "Rp 4.2 Milyar", status: "Available" }
            ]
        },
        skandinavia: {
            id: 4,
            title: "Rumah Skandinavia",
            description: "Desain Nordic yang hangat dan fungsional, mengutamakan kenyamanan dengan sentuhan alam yang menenangkan.",
            features: [
                "Warna netral dan hangat",
                "Material kayu natural",
                "Fireplace untuk kehangatan",
                "Large windows untuk cahaya",
                "Hygge living concept",
                "Indoor plants corner"
            ],
            specifications: {
                "Luas Tanah": "150-300 m²",
                "Luas Bangunan": "100-200 m²",
                "Kamar Tidur": "2-4 kamar",
                "Kamar Mandi": "2-3 kamar",
                "Carport": "1-2 mobil",
                "Listrik": "3500-5500 VA"
            },
            priceRange: "Rp 1.2 Milyar - Rp 2.5 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Cemara No. 19", price: "Rp 1.8 Milyar", status: "Available" },
                { id: 2, address: "Jl. Pinus No. 7", price: "Rp 2.1 Milyar", status: "Available" }
            ]
        },
        industrial: {
            id: 5,
            title: "Rumah Industrial",
            description: "Gaya urban dengan material mentah yang stylish, cocok untuk yang menyukai estetika pabrik yang telah direnovasi.",
            features: [
                "Exposed brick walls",
                "Steel beam structure",
                "Concrete floors",
                "Large industrial windows",
                "Open loft concept",
                "Industrial lighting fixtures"
            ],
            specifications: {
                "Luas Tanah": "180-350 m²",
                "Luas Bangunan": "120-250 m²",
                "Kamar Tidur": "2-3 kamar",
                "Kamar Mandi": "2-3 kamar",
                "Carport": "2-3 mobil",
                "Listrik": "4400-6600 VA"
            },
            priceRange: "Rp 1.3 Milyar - Rp 2.8 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Industri No. 25", price: "Rp 1.9 Milyar", status: "Available" },
                { id: 2, address: "Jl. Pabrik No. 14", price: "Rp 2.3 Milyar", status: "Available" }
            ]
        },
        kontemporer: {
            id: 6,
            title: "Rumah Kontemporer",
            description: "Perpaduan modern dan tradisional yang harmonis, menciptakan hunian yang stylish namun tetap hangat dan nyaman.",
            features: [
                "Mixed materials (kayu, batu, kaca)",
                "Asymmetrical design",
                "Large sliding doors",
                "Indoor-outdoor living",
                "Zen garden",
                "Multi-level design"
            ],
            specifications: {
                "Luas Tanah": "200-400 m²",
                "Luas Bangunan": "150-300 m²",
                "Kamar Tidur": "3-4 kamar",
                "Kamar Mandi": "3-4 kamar",
                "Carport": "2-3 mobil",
                "Listrik": "5500-8800 VA"
            },
            priceRange: "Rp 1.8 Milyar - Rp 4 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Modern No. 31", price: "Rp 2.5 Milyar", status: "Available" },
                { id: 2, address: "Jl. Kontemporer No. 18", price: "Rp 3.2 Milyar", status: "Available" }
            ]
        },
        tropis: {
            id: 7,
            title: "Rumah Tropis",
            description: "Desain yang sesuai dengan iklim Indonesia, mengoptimalkan sirkulasi udara dan pencahayaan alami untuk kenyamanan maksimal.",
            features: [
                "Ventilasi silang optimal",
                "Atap tinggi untuk sirkulasi",
                "Teras luas dengan pergola",
                "Material tahan cuaca tropis",
                "Taman tropis dengan kolam",
                "Overstek lebar untuk teduh"
            ],
            specifications: {
                "Luas Tanah": "150-350 m²",
                "Luas Bangunan": "100-250 m²",
                "Kamar Tidur": "3-4 kamar",
                "Kamar Mandi": "2-4 kamar",
                "Carport": "1-3 mobil",
                "Listrik": "3500-6600 VA"
            },
            priceRange: "Rp 1 Milyar - Rp 2.5 Milyar",
            images: [
                "/img/tipe rumah.png",
                "/img/tipe rumah.png",
                "/img/tipe rumah.png"
            ],
            availableProperties: [
                { id: 1, address: "Jl. Tropis No. 42", price: "Rp 1.4 Milyar", status: "Available" },
                { id: 2, address: "Jl. Kelapa No. 29", price: "Rp 1.9 Milyar", status: "Available" }
            ]
        }
    };

    useEffect(() => {
        const data = tipeRumahData[slug];
        if (data) {
            setTipeData(data);
        }
        setLoading(false);
    }, [slug]);

    const handleBackClick = () => {
        navigate('/');
    };

    const handleContactAgent = () => {
        navigate('/contact-agent');
    };

    const handlePropertyDetail = (propertyId) => {
        navigate(`/property/${propertyId}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Memuat data tipe rumah...</p>
            </div>
        );
    }

    if (!tipeData) {
        return (
            <div className="error-container">
                <Navbar />
                <div className="error-content">
                    <h2>Tipe Rumah Tidak Ditemukan</h2>
                    <p>Maaf, tipe rumah yang Anda cari tidak tersedia.</p>
                    <button onClick={handleBackClick} className="btn-back">
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="tipe-rumah-detail">
            <Navbar />
            
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <button onClick={handleBackClick} className="btn-back-hero">
                        ← Kembali
                    </button>
                    <h1>{tipeData.title}</h1>
                    <p className="hero-description">{tipeData.description}</p>
                    <div className="price-range">
                        <span className="price-label">Kisaran Harga:</span>
                        <span className="price-value">{tipeData.priceRange}</span>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="gallery-section">
                <div className="container">
                    <h2>Galeri Foto</h2>
                    <div className="image-gallery">
                        {tipeData.images.map((img, index) => (
                            <div key={index} className="gallery-item">
                                <img src={img} alt={`${tipeData.title} ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <div className="container">
                    <h2>Fitur & Keunggulan</h2>
                    <div className="features-grid">
                        {tipeData.features.map((feature, index) => (
                            <div key={index} className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section">
                <div className="container">
                    <h2>Spesifikasi</h2>
                    <div className="specs-grid">
                        {Object.entries(tipeData.specifications).map(([key, value]) => (
                            <div key={key} className="spec-item">
                                <div className="spec-label">{key}</div>
                                <div className="spec-value">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Available Properties */}
            <div className="properties-section">
                <div className="container">
                    <h2>Properti Tersedia</h2>
                    <div className="properties-grid">
                        {tipeData.availableProperties.map(property => (
                            <div key={property.id} className="property-card">
                                <div className="property-info">
                                    <h3>{property.address}</h3>
                                    <p className="property-price">{property.price}</p>
                                    <span className={`property-status ${property.status.toLowerCase()}`}>
                                        {property.status}
                                    </span>
                                </div>
                                <div className="property-actions">
                                    <button 
                                        onClick={() => handlePropertyDetail(property.id)}
                                        className="btn-detail"
                                        disabled={property.status === 'Sold'}
                                    >
                                        Lihat Detail
                                    </button>
                                    <button 
                                        onClick={handleContactAgent}
                                        className="btn-contact"
                                        disabled={property.status === 'Sold'}
                                    >
                                        Hubungi Agen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Tertarik dengan {tipeData.title}?</h2>
                        <p>Hubungi agen kami untuk konsultasi gratis dan survey lokasi</p>
                        <div className="cta-buttons">
                            <button onClick={handleContactAgent} className="btn-primary">
                                Hubungi Agen Sekarang
                            </button>
                            <button onClick={handleBackClick} className="btn-secondary">
                                Lihat Tipe Lainnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipeRumahDetail;