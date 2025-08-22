import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/navbar/navbar';
import Hero from '../Components/hero/hero';
import LayananKami from '../Components/layananKami/LayananKami';
import TipeRumah from '../Components/tiperumah/tipeRumah';
import Footer from '../Components/footer/footer';

const HomePage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.DEV; 
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then(r => r.json())
      .then(d => setItems(d.data || d))
      .catch(() => setItems([]));
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <LayananKami />
      <TipeRumah />

      <div className="cards">
        {items.map((p) => (
          <div className="card" key={p.id}>
            <img src={(p.image_url?.startsWith('http') ? p.image_url : `${API_BASE_URL}${p.image_url}`)} alt={p.title} />
            <h3>{p.price_formatted || `Rp ${Number(p.price||0).toLocaleString('id-ID')}`}</h3>
            <p>{p.location}</p>
            <button onClick={() => navigate(`/DetailRumah/${p.id}`)}>Lihat Detail</button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
