import React from 'react';
import './ContactAgen.css';
import { useNavigate } from 'react-router-dom';

const ContactAgent = () => {
    const navigate = useNavigate();
  return (
    <div className="agent-section">
        <div className='title-contact'>
        <h2 className="back-button">
          <button className="back-button" onClick={() => navigate('/detailsPage')}>←</button>
        </h2>
      <h2 className="agent-title">Hubungi Agen Penjualan Rumah</h2>
      <p className="agent-subtitle">
        Butuh info lebih lanjut soal rumah yang tersedia? Hubungi agen kami langsung lewat WhatsApp di bawah ini.
      </p>
    </div>

      <div className="agent-box">
        <img src="/img/barcodewa.png" alt="QR Code WhatsApp" className="agent-barcode" />
        <p className="agent-note">Untuk informasi lebih lanjut, silakan hubungi agen kami.</p>
      </div>
    </div>
  );
};

export default ContactAgent;
