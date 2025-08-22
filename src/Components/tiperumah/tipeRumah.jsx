import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tiperumah.css';
import DetailsPage from '../../Pages/details/detailsPage';

const TipeRumah = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/detailsPage');
    };

    const handleLihatLainnya = () => {
        navigate('/rumah-kosong');
    };

    const handleChatClick = () => {
        navigate('/contact-agent');
    };

    const handleTipeRumahClick = (slug) => {
        navigate(`/tipe-rumah/${slug}`);
    };

    const tipeListRef = useRef(null);
    const btnLeftRef = useRef(null);
    const btnRightRef = useRef(null);

    useEffect(() => {
        const tipeList = tipeListRef.current;
        const btnLeft = btnLeftRef.current;
        const btnRight = btnRightRef.current;

        const scrollLeft = () => {
            tipeList.scrollBy({ left: -250, behavior: 'smooth' });
        };

        const scrollRight = () => {
            tipeList.scrollBy({ left: 250, behavior: 'smooth' });
        };

        if (btnLeft) btnLeft.addEventListener('click', scrollLeft);
        if (btnRight) btnRight.addEventListener('click', scrollRight);

        return () => {
            if (btnLeft) btnLeft.removeEventListener('click', scrollLeft);
            if (btnRight) btnRight.removeEventListener('click', scrollRight);
        };
    }, []);

    // ✅ Data rumah (dijual)
    const rumahList = [
        {
            id: 1,
            harga: "Rp 1.4 Milyar",
            lokasi: "Jl Angkrek",
            status: "Dijual",
            img: "/img/tipe rumah.png"
        },
        {
            id: 2,
            harga: "Rp 1.2 Milyar",
            lokasi: "Jl Melati",
            status: "Dijual",
            img: "/img/tipe rumah.png"
        },
        {
            id: 3,
            harga: "Rp 1.8 Milyar",
            lokasi: "Jl Mawar",
            status: "Dijual",
            img: "/img/tipe rumah.png"
        },
        {
            id: 4,
            harga: "Rp 2 Milyar",
            lokasi: "Jl Kenanga",
            status: "Dijual",
            img: "/img/tipe rumah.png"
          }          
        // Tambahkan rumah baru di sini
    ];

    // ✅ Data 7 tipe rumah (untuk horizontal scroll)
    const tipeRumahList = [
        { 
            id: 1, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Minimalis",
            slug: "minimalis",
            description: "Desain sederhana dengan fungsi maksimal"
        },
        { 
            id: 2, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Modern",
            slug: "modern",
            description: "Arsitektur kontemporer dengan teknologi terkini"
        },
        { 
            id: 3, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Klasik",
            slug: "klasik",
            description: "Gaya tradisional yang elegan dan timeless"
        },
        { 
            id: 4, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Skandinavia",
            slug: "skandinavia",
            description: "Desain Nordic yang hangat dan fungsional"
        },
        { 
            id: 5, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Industrial",
            slug: "industrial",
            description: "Gaya urban dengan material mentah yang stylish"
        },
        { 
            id: 6, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Kontemporer",
            slug: "kontemporer",
            description: "Perpaduan modern dan tradisional yang harmonis"
        },
        { 
            id: 7, 
            img: "/img/tipe rumah.png", 
            label: "Rumah Tropis",
            slug: "tropis",
            description: "Desain yang sesuai dengan iklim Indonesia"
        }
    ];

    return (
        <div>
            <div className="container">
                <h2 className="section-title">Baru Saja Dijual</h2>
                <p className="section-subtitle">Kami punya rekomendasi rumah untuk kamu</p>

                {/* ✅ Rumah Card Section */}
                <div className="card-list">
                    {rumahList.map((rumah, index) => (
                        <div className="card" key={rumah.id}>
                            <img src={rumah.img} alt={`Rumah ${index + 1}`} />
                            <div className="card-body">
                                <h3>{rumah.harga}</h3>
                                <p>{rumah.lokasi}</p>
                                <a href="#" className="status">{rumah.status}</a>
                                <div className="card-actions">
                                    <button className="btn-detail" onClick={handleClick}>Lihat Detail</button>
                                    <button className="btn-chat" onClick={handleChatClick}><i className="fa-brands fa-whatsapp"></i> Chat</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-lihat-lainnya" onClick={handleLihatLainnya}>Lihat lainnya</button>

                {/* ✅ Tipe Rumah Section */}
                <div className="tipe-header">
                    <h2 className="tipe-title">Tipe Rumah</h2>
                    <p className="tipe-subtitle">Kami menyediakan beberapa tipe rumah yang bisa kamu pilih</p>
                </div>

                <div className="tipe-list-wrapper">
                    <button className="arrow-btn left" ref={btnLeftRef}>
                        <img src="/img/Frame 34.svg" alt="Panah Kiri" />
                    </button>

                    <div className="tipe-list" ref={tipeListRef}>
                        {tipeRumahList.map(tipe => (
                            <div 
                                className="tipe-card" 
                                key={tipe.id}
                                onClick={() => handleTipeRumahClick(tipe.slug)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={tipe.img} alt={tipe.label} />
                                <div className="tipe-caption">{tipe.label}</div>
                                <div className="tipe-description">{tipe.description}</div>
                            </div>
                        ))}
                    </div>

                    <button className="arrow-btn right" ref={btnRightRef}>
                        <img src="/img/Frame 35.svg" alt="Panah Kanan" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TipeRumah;

