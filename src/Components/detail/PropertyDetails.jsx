import React from 'react';
import './PropertyDetails.css';
import { useNavigate } from 'react-router-dom';

const PropertyDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="property-container">
      <div className="left-column">
        <h2 className="price">Rp 1.4 Milyar</h2>
        <p className="type">Tipe Minimalis</p>
        <p className="location">Jl Angkrek</p>
        <span className="status">Dijual</span>

        <div className="section">
          <h3>Tentang Properti</h3>
          <p>
            Bagi Anda yang sedang mencari rumah dengan sentuhan modern namun tetap hangat untuk keluarga, Natavasa Townhouse adalah jawaban yang tepat. Terletak tak jauh dari Jl. Juanda Depok, cluster ini hadir untuk memenuhi gaya hidup urban yang menginginkan kenyamanan, estetika, dan aksesibilitas dalam satu paket lengkap. Dengan desain high ceiling yang memberikan kesan lega dan elegan, rumah di Natavasa bukan sekadar tempat tinggal tapi juga tempat pulang yang penuh makna.
            Dengan luas bangunan 100m² di atas lahan 65m², Anda akan mendapatkan 3 kamar tidur dan 3 kamar mandi, cukup untuk memenuhi kebutuhan keluarga muda maupun pasangan yang sedang merencanakan masa depan. Dan yang paling menarik? Rumah ini bisa Anda miliki mulai dari Rp 1,3 M-an (belum termasuk diskon) Sebuah penawaran yang sangat masuk akal untuk kualitas hidup yang jauh lebih tinggi.
          </p>
        </div>

        <div className="section">
          <h3>Fasilitas</h3>
          <p>
          Setiap rumah di Bimo Cluster dirancang dengan sentuhan modern dan tata ruang yang fungsional, mulai dari ruang keluarga yang cozy hingga area privat yang memberikan ketenangan maksimal. Keunggulan high ceiling membuat sirkulasi udara lebih optimal dan menciptakan nuansa luas di dalam rumah.
          Selain desain yang mengedepankan estetika dan kenyamanan, cluster ini juga menjawab kebutuhan gaya hidup masa kini. Dikelilingi oleh fasilitas penunjang seperti pusat perbelanjaan, rumah sakit, sekolah, hingga akses langsung ke tol, Natavasa Townhouse sangat cocok untuk Anda yang ingin hidup praktis tanpa mengorbankan kenyamanan.
          </p>
        </div>

        <div className="section">
          <h3>Lokasi</h3>
          <p>
            Jalan Angkrek RT 02 RW 08, Desa Angkrek, Kecamatan Angkrek, Kabupaten Sumedang, Provinsi Jawa Barat
          </p>
        </div>
      </div>

      <div className="right-column">
        <div className="agent-card">
          <div className="agent-profile">
            <img src="/icons/profile-agen.png" alt="Bimo Daesuke" className="agent-img" />
            <div className="agent-info">
              <p className="agent-name">Bimo Daesuke</p>
              <p className="agent-role">Agen Property</p>
            </div>
          </div>
          <button className="chat-button" onClick={() => navigate('/contact-agent')}>
            <img src="/icons/wa.png" alt="whatsapp"/> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
