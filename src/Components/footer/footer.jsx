import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/logo/logo.png" alt="Nusantara Estates Logo" className="footer-logo" />
          <span className="footer-company">Nusantara Estates</span>
        </div>
        <nav className="footer-nav">
          <a href="/" className="footer-link">Beranda</a>
          <a href="/layanan" className="footer-link">Layanan</a>
          <a href="/kontak" className="footer-link">Kontak</a>
        </nav>
      </div>
      <div className="footer-bottom">

      </div>
    </footer>
  );
};

export default Footer;