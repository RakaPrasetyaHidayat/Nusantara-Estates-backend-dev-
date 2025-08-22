import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../Components/navbar/navbar';
import Footer from '../../Components/footer/footer';
import Result from '../../Components/result/Result';
import './ResultPage.css';

const ResultPage = () => {
    const location = useLocation();
    const { tipe, lokasi } = location.state || {};

    return (
        <div>
            <Navbar />
            <div className='content-title' style={{marginTop:'1700px'}}>
                <h1>Hasil Pencarian</h1>
                <p>
                    {tipe && lokasi 
                        ? `Menampilkan hasil pencarian untuk ${tipe} di ${lokasi}`
                        : 'Hasil pencarian tidak ditemukan'
                    }
                </p>
            </div>
            <div className="carirumah-container">
                <div className="search-section">
                    <div className="search-box-carirumah">
                        <input
                            type="text"
                            placeholder="Cari Lokasi"
                            className="search-input"
                            defaultValue={lokasi || ''}
                        />
                        <button className="search-button">Cari</button>
                    </div>
                    <div className="filter">
                        <button className="filter-button">Tipe ^ </button>
                    </div>
                </div>
            </div>
            <Result tipe={tipe} lokasi={lokasi} />
            <Footer />
        </div>
    );
};

export default ResultPage;