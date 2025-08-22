import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './Result.css';

const Result = ({ tipe, lokasi }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchTipe = tipe || (location.state && location.state.tipe) || 'rumah';
  const searchLokasi = lokasi || (location.state && location.state.lokasi) || 'lokasi yang dipilih';

  return (
    <div className="result-kosong-wrapper">
      <div className="result-kosong-card">
       <img
        src="/public/img/result.png"
        alt="Tidak ditemukan"
        className="kosong-img"
      />
        <p className="kosong-text">
          Maaf, {searchTipe} yang kamu pilih tidak tersedia di {searchLokasi}.
          <br />
          Kamu bisa cari tipe rumah lain atau lokasi lain.
        </p>
        <div className="result-actions">
          <button 
            className="back-search-btn"
            onClick={() => navigate('/')}
          >
            Cari Lagi
          </button>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/rumah')}
          >
            Lihat Semua Rumah
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
