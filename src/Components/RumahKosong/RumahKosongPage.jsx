import React, { useState, useEffect } from 'react'
import './RumahKosongPage.css'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'
import RumahKosong from './RumahKosong';

const RumahKosongPage = () => {
    const [showTipeDropdown, setShowTipeDropdown] = useState(false);
    const [selectedTipe, setSelectedTipe] = useState('Semua Tipe');
    const [searchLocation, setSearchLocation] = useState('');

    // Data tipe rumah yang sama seperti di landing page
    const tipeRumahList = [
        { id: 1, label: "Semua Tipe" },
        { id: 2, label: "Rumah Modern" },
        { id: 3, label: "Rumah Industrial" },
        { id: 4, label: "Rumah Skandinavia" },
        { id: 5, label: "Rumah Minimalis" },
        { id: 6, label: "Rumah Klasik" },
        { id: 7, label: "Rumah Kontemporer" }

    ];

    const handleTipeSelect = (tipe) => {
        setSelectedTipe(tipe.label);
        setShowTipeDropdown(false);
    };

    const handleSearch = () => {
        // Implementasi pencarian berdasarkan lokasi dan tipe
        console.log('Searching for:', searchLocation, 'Type:', selectedTipe);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowTipeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Navbar />
            <div className='content-title' style={{marginTop:'100px', padding:'20px', textAlign:'center'}}>
                <h1>Rumah Dijual</h1>
                <p>Temukan pilihan rumah impian Anda dengan lokasi strategis, arsitektur yang kokoh serta elegan, dan harga yang kompetitif.</p>
            </div>
            <div className="carirumah-container">
                <div className="search-section">
                    <div className="search-box-carirumah">
                        <input
                            type="text"
                            placeholder="Cari Lokasi"
                            className="search-input"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>Cari</button>
                    </div>
                    <div className="filter">
                        <div className="dropdown-container">
                            <button 
                                className="filter-button"
                                onClick={() => setShowTipeDropdown(!showTipeDropdown)}
                            >
                                {selectedTipe} {showTipeDropdown ? '▲' : '▼'}
                            </button>
                            {showTipeDropdown && (
                                <div className="dropdown-menu">
                                    {tipeRumahList.map(tipe => (
                                        <div 
                                            key={tipe.id}
                                            className="dropdown-item"
                                            onClick={() => handleTipeSelect(tipe)}
                                        >
                                            {tipe.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <RumahKosong selectedTipe={selectedTipe} searchLocation={searchLocation} />
            <nav aria-label="Page navigation example">
                <ul className="pagination custom-pagination justify-content-center">
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#" aria-label="Previous">
                            &lt;
                        </a>
                    </li>
                    <li className="page-item active">
                        <a className="page-link rounded-circle" href="#">1</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">2</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">3</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">4</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">5</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#" aria-label="Next">
                            &gt;
                        </a>
                    </li>
                </ul>
            </nav>
            <Footer />
        </div>
    );  
};
export default RumahKosongPage