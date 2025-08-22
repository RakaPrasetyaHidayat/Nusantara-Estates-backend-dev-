import React from 'react';
import './detailsCs.css';
import locationIcon from '/icons/wa.png';
import phoneIcon from '/icons/wa.png';
import emailIcon from '/icons/wa.png';
import facebookIcon from '/icons/wa.png';
import instagramIcon from '/icons/wa.png';
import tiktokIcon from '/icons/wa.png';

const DetailsCs = () => {
    return (
        <div id="kontak-section" className="contact-container">
            <h2 className="contact-title">Hubungi Kami</h2>

            <div className="contact-content">
                <div className="contact-left">
                    <div className="contact-info">
                        <h4>Kontak</h4>
                        <div className="contact-item">
                            <img src="/icons/lokasi (2).png" alt="lokasi" />
                            <span>Jl. Cibalong No.3</span>
                        </div>
                        <div className="contact-item">
                            <img src="/icons/mdi_telephone.png" alt="telepon" />
                            <span>0812-3456-7890</span>
                        </div>
                        <div className="contact-item">
                            <img src="/icons/email.png" alt="email" />
                            <span>rumahsinggah@gmail.com</span>
                        </div>
                    </div>

                    <div className="social-section">
                        <h4>Sosial media</h4>
                        <div className="social-icons">
                            <img src="/icons/facebook.png" alt="facebook" />
                            <img src="/icons/Vector.png" alt="instagram" />
                            <img src="/icons/tiktok.png" alt="tiktok" />
                            <a href="" >Nusantara Estates</a>
                        </div>
                    </div>
                </div>

                <div className="contact-form-card">
                    <div className="form-title">Ada Pertanyaan..?</div>
                    <form>
                        <input type="email" placeholder="email anda" />
                        <textarea placeholder="Pertanyaan anda" />
                        <button type="submit">Kirim</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetailsCs;
