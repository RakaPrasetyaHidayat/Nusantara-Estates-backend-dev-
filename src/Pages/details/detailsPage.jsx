import React, { useState } from 'react';
import Navbar from '../../Components/navbar/navbar';
import GallerySection from '../../Components/gallerySection/gallerysection';
import PropertyDetails from '../../Components/detail/PropertyDetails';
import Footer from '../../Components/footer/footer'; // komponen untuk semua gambar
import './detailsPage.css';

const DetailsPage = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {showFullGallery ? (
          <FullGallery onBack={() => setShowFullGallery(false)} />
        ) : (
          <>
            <GallerySection onShowAll={() => setShowFullGallery(true)} />
            <PropertyDetails />
          </>
        )}
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </>
  );
};

export default DetailsPage;
