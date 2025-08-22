import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './layanankami.css';

const LayananKami = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedHouseType, setSelectedHouseType] = useState('Tipe rumah');
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const houseTypes = [
       'Rumah Minimalis',
       'Rumah Modern',
       'Rumah Klasik',
       'Rumah Skandinavia',
       'Rumah Industrial',
       'Rumah Kontemporer',
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectHouseType = (type) => {
        setSelectedHouseType(type);
        setIsDropdownOpen(false);
    };

    const handleSearchClick = async () => {
        const locationInput = document.querySelector('.location input').value;
        
        // Validasi input
        if (!locationInput || locationInput.trim() === '') {
            alert('Silakan masukkan lokasi yang ingin dicari');
            return;
        }
        
        if (selectedHouseType === 'Tipe rumah') {
            alert('Silakan pilih tipe rumah terlebih dahulu');
            return;
        }
        
        setIsSearching(true);
        
        try {
            // Panggil API untuk mencari rumah berdasarkan tipe dan lokasi
            const response = await fetch(`http://localhost:5174/api/search-rumah`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipe: selectedHouseType,
                    lokasi: locationInput
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.results && data.results.length > 0) {
                // Jika ada hasil, arahkan ke halaman rumah dengan parameter pencarian
                navigate('/rumah', { 
                    state: { 
                        searchResults: data.results,
                        tipe: selectedHouseType,
                        lokasi: locationInput
                    }
                });
            } else {
                // Jika tidak ada hasil, arahkan ke halaman result (tidak ditemukan)
                navigate('/result', {
                    state: {
                        tipe: selectedHouseType,
                        lokasi: locationInput
                    }
                });
            }
        } catch (error) {
            console.error('Error searching rumah:', error);
            // Jika terjadi error, arahkan ke halaman result
            navigate('/result', {
                state: {
                    tipe: selectedHouseType,
                    lokasi: locationInput
                }
            });
        } finally {
            setIsSearching(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Only add listener if dropdown is open
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isDropdownOpen]);

    return (
        <div className="layanan-kami">

           
            <section id="layanan-kami-section" className="layanan-section">
                <h2 className="judul">Layanan Kami</h2>
                <div className="layanan-container">
                    <div className="layanan-card">
                        <img src="/icons/beli.png" alt="Beli Rumah"/>
                            <h3>Beli Rumah</h3>
                            <p>Disini anda bisa membeli rumah impian anda dengan berbagai pilihan lokasi dan harga yang sesuai kebutuhan.</p>
                    </div>
                    <div className="layanan-card">
                        <img src="/icons/jual.png" alt="Jual Rumah"/>
                            <h3>Jual Rumah</h3>
                            <p>Disini anda bisa menjual rumah anda dengan mudah dan cepat kepada calon pembeli yang terpercaya.</p>
                    </div>
                </div>
            </section>

            
            <section id="cari-rumah-section" className="hero-section">
                <div className="overlay"></div>
                <div className="content">
                    <h1>Cari Rumah</h1>
                    <p>Cari rumah dengan lingkungan yang nyaman untuk keluargamu</p>
                    <div className="search-box">
                        <div className="search-combined">
                            <div className="dropdown-container" ref={dropdownRef}>
                                <div className={`dropdown ${isDropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
                                    <img src="/icons/home.png" alt="icon rumah" className="icon-img"/>
                                    <span className="text">{selectedHouseType}</span>
                                    <img
                                        src="/icons/dropdown.png"
                                        alt="dropdown"
                                        className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown-list">
                                        {houseTypes.map((type, index) => (
                                            <div 
                                                key={index} 
                                                className="dropdown-item"
                                                onClick={() => selectHouseType(type)}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="location">
                                <img src="/icons/lokasi.png" alt="icon lokasi" className="icon-img"/>
                                <input type='textbox' placeholder='Masukan Lokasi' />
                            </div>
                        </div>
                            <button 
                                className="search-btn" 
                                onClick={handleSearchClick}
                                disabled={isSearching}
                            >
                                {isSearching ? 'Mencari...' : 'Cari'}
                            </button>
                        </div>
                    </div>
            </section>

            {/* <!-- MAU JUAL RUMAH --> */}
             <section className="jual-rumah">
                <div className="content">
                    <h1><span className="highlight">Mau Jual Rumah?</span></h1>
                    <p>Hubungi kami segera untuk menjual rumah anda<br/> dengan cepat, aman, dan harga terbaik!</p>
                </div>
                <div className="whatsapp-button">
                    <img src="/icons/wa.png" alt="whatsapp"/><a href="https://wa.me/qr/5GRVQJUYN4E5O1">Whatsapp kami sekarang</a>
                </div>
            </section> 
        </div>
    );
}

export default LayananKami;
