import React, { useState } from 'react';
import GallerySection from '../Components/gallerySection/gallerysection';
import MoreGallery from '../Components/gallerySection/moregallery';

const GalleryPage = () => {
  const [showMoreGallery, setShowMoreGallery] = useState(false);

  const handleShowAll = () => {
    setShowMoreGallery(true);
  };

  return (
    <div>
      {!showMoreGallery ? (
        <GallerySection onShowAll={handleShowAll} />
      ) : (
        <MoreGallery />
      )}
    </div>
  );
};

export default GalleryPage;
