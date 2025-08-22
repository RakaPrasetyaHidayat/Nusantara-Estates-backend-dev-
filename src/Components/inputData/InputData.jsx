import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../App';
import './inputData.css';
import '../navbar/adminNavbar.css';
import Footer from '../footer/footer';
import AdminNavbar from '../navbar/AdminNavbar';

const InputData = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { authState } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    price_formatted: '',
    location: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    land_area: '',
    building_area: '',
    property_type: 'house',
    status: 'Dijual',
    featured: false,
    image_url: null,
    images: []
  });

  // Fetch property data when in edit mode
  useEffect(() => {
    const fetchProperty = async () => {
      if (!editId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5174/api/properties/${editId}`);
        
        if (!response.ok) {
          throw new Error('Gagal memuat data properti');
        }

        const result = await response.json();
        
        // Convert images string to array if needed
        const imagesArray = typeof result.images === 'string' 
          ? JSON.parse(result.images) 
          : result.images || [];

        setFormData({ 
          ...result,
          bedrooms: result.bedrooms?.toString() || '',
          bathrooms: result.bathrooms?.toString() || '',
          land_area: result.land_area?.toString() || '',
          building_area: result.building_area?.toString() || '',
          price: result.price?.toString() || '',
          featured: result.featured === 1,
          images: imagesArray
        });
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Gagal memuat data properti');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [editId]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (type === 'file') {
      if (name === 'images') {
        setFormData(prev => ({ ...prev, images: Array.from(files) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSimpan = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMessage('');

  try {
    const formDataToSend = new FormData();
    
    // Tambahkan semua field text
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image_url' && key !== 'images' && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    // Tambahkan file gambar utama jika ada
    if (formData.image_url instanceof File) {
      formDataToSend.append('image_url', formData.image_url);
    } else if (formData.image_url) {
      formDataToSend.append('existing_main_image', formData.image_url);
    }

    // Tambahkan gambar detail jika ada
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file, index) => {
        if (file instanceof File) {
          formDataToSend.append(`images`, file);
        }
      });
      
      if (editId) {
        formDataToSend.append('existing_images', JSON.stringify(
          formData.images
            .filter(img => typeof img === 'string')
            .map(img => img.startsWith('/img/') ? img : `/img/${img}`)
        ));
      }
    }

    const response = await fetch(
      editId 
        ? `http://localhost:5174/api/admin/properties/${editId}`
        : `http://localhost:5174/api/properties`,
      {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        },
        body: formDataToSend
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal menyimpan data');
    }

    const result = await response.json();
    setShowModal(true);
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan');
  } finally {
    setIsLoading(false);
  }
};

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      price_formatted: '',
      location: '',
      address: '',
      bedrooms: '',
      bathrooms: '',
      land_area: '',
      building_area: '',
      property_type: 'house',
      status: 'Dijual',
      featured: false,
      image_url: null,
      images: []
    });
  };

  return (
    <div className="input-data-page">
      <AdminNavbar />
      <div className="main-content">
        <div className="form-container">
          <h1 className="form-title">{editId ? 'Edit Data Properti' : 'Tambah Data Properti'}</h1>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSimpan} className="input-form">
            {/* Main Image */}
            <div className="form-group">
              <label>Gambar Utama</label>
              <input 
                type="file" 
                name="image_url" 
                onChange={handleChange} 
                accept="image/*"
                required={!editId}
              />
              {formData.image_url && !(formData.image_url instanceof File) && (
                <div className="current-image">
                  <img 
                    src={`http://localhost:5174${formData.image_url}`} 
                    alt="Current" 
                    width="100"
                  />
                  <p>Gambar saat ini</p>
                </div>
              )}
            </div>

            {/* Detail Images */}
            <div className="form-group">
              <label>Gambar Detail (Maks. 10)</label>
              <input 
                type="file" 
                name="images" 
                multiple 
                onChange={handleChange} 
                accept="image/*"
              />
              {formData.images && formData.images.length > 0 && !(formData.images[0] instanceof File) && (
                <div className="current-images">
                  <p>Gambar saat ini:</p>
                  <div className="image-grid">
                    {formData.images.map((img, index) => (
                      <img 
                        key={index} 
                        src={`http://localhost:5174${img}`} 
                        alt={`Detail ${index}`} 
                        width="80"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Text Inputs */}
            {['title','description','price','price_formatted','location','address'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.replace('_',' ').toUpperCase()}</label>
                <input
                  type={field === 'price' ? 'number' : 'text'}
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  required={field === 'title' || field === 'price' || field === 'location'}
                />
              </div>
            ))}

            {/* Numeric Inputs */}
            {['bedrooms','bathrooms','land_area','building_area'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.replace('_',' ').toUpperCase()}</label>
                <input
                  type="number"
                  min="0"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Property Type Select */}
            <div className="form-group">
              <label>Tipe Rumah</label>
              <select 
                name="property_type" 
                value={formData.property_type} 
                onChange={handleChange}
                required
              >
                <option value="Minimalis">Minimalis</option>
                <option value="Klasik">Klasik</option>
                <option value="Skandinavian">Industrial</option>
                <option value="Kontemporer">Kontemporer</option>
                <option value="Modern">Modern</option>
                <option value="American">American</option>
              </select>
            </div>

          
            {/* Action Buttons */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-simpan"
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/AdminPage')}
                className="btn-secondary"
              >
                Kembali
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-secondary"
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>{editId ? 'Data berhasil diubah!' : 'Data berhasil ditambahkan!'}</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  navigate('/AdminPage');
                }}
                className="btn-ok"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default InputData;