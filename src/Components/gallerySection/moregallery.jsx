import React, { useState } from 'react';
import './moregallery.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';

const images = [
  { src: '/img/kamar.png', alt: 'Kamar tidur' },
  { src: '/img/kamaar-mandi.png', alt: 'Kamar mandi' },
  { src: '/img/dapur.png', alt: 'Dapur' },
  { src: '/img/halaman.png', alt: 'Halaman' },
  { src: '/img/teras.png', alt: 'Teras' },
];

const MoreGallery = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <Navbar />
      <div className="more-gallery-container">
        <h2 className="gallery-title">
          <button className="back-button" onClick={() => navigate('/detailsPage')}>←</button>Semua gambar
        </h2>

        <div className="carousel">
          <button className="carousel-button left" onClick={goToPrevious}><img src="/img/Frame 34.svg" /></button>
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="carousel-image"
          />
          <button className="carousel-button right" onClick={goToNext}><img src="/img/Frame 35.svg" /></button>
        </div>
      </div>

      <div className="thumbnail-row">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => selectImage(index)}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MoreGallery;
