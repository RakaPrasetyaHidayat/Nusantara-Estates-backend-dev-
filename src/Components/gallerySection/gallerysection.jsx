import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GallerySection.css';

const GallerySection = () => {
  const navigate = useNavigate();

  return (
    <div className="gallery-container">
      <div className="gallery-left">
        <img src="/img/kamar.png" alt="Kamar tidur" className="big-image" />
      </div>
      <div className="gallery-right">
        <img src="/img/kamaar-mandi.png" alt="Kamar mandi" className="small-image" />
        <img src="/img/dapur.png" alt="Dapur" className="small-image" />
        <button className="btn-semua" onClick={() => navigate('/semua-gambar')}>Semua Gambar</button>
      </div>
    </div>
  );
};

export default GallerySection;
