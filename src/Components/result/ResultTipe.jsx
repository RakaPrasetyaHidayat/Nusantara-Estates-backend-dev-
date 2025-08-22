import React from 'react'
import './ResultTipe.css'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'
import Result from './Result';

const ResultTipe = () => {
            return (
        <div>
              <Navbar />
            <div className='content-title' style={{marginTop:'1700px'}}>

                <h1>Tipe Rumah Classic</h1>
                <p>Menampilkan Tipe rumah classic yang berlokasi di Sumedang</p>
            </div>
            <div className="carirumah-container">
                <div className="search-section">
                    <div className="search-box-carirumah">
                        <input
                            type="text"
                            placeholder="Cari Lokasi"
                            className="search-input"
                        />
                        <button className="search-button">Cari</button>
                    </div>

                    <div className="filter">
                        <button className="filter-button">Tipe ^ </button>
                    </div>
                </div>
            </div>
            <Result />
            <Footer />
        </div>
    );  
};
export default ResultTipe