import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../App';

const AdminNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isLandingPage = location.pathname === '/';
    const { user, logout } = useAuth();

    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleLayananClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            scrollToSection('layanan-kami-section');
        } else {
            navigate('/');
            setTimeout(() => {
                scrollToSection('layanan-kami-section');
            }, 500);
        }
    };

    const handleKontakClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            scrollToSection('kontak-section');
        } else {
            navigate('/');
            setTimeout(() => {
                scrollToSection('kontak-section');
            }, 500);
        }
    };

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''} ${isLandingPage ? 'landing' : 'inner'}`}>
            <div className="nav-logo">
                <img src="/logo/logo.png" alt="logo" />
                <NavLink to="/">Nusantara Estates</NavLink>
            </div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" end>
                        Beranda
                    </NavLink>
                </li>
                <li>
                    <a href="#layanan-kami-section" onClick={handleLayananClick}>
                        Layanan
                    </a>
                </li>
                <li>
                    <a href="#kontak-section" onClick={handleKontakClick}>
                        Kontak
                    </a>
                </li>
            </ul>
            <div className="nav-buttons">
                {user ? (
                    <div className="user-info">
                        <span className="welcome-text">Halo, {user.username}!</span>
                        {user.isAdmin && (
                            <button
                                className="dashboard-btn"
                                onClick={() => navigate('/admin')}
                            >
                                Dashboard
                            </button>
                        )}
                        <button className="logout" onClick={handleLogout}>
                            Keluar
                        </button>
                    </div>
                ) : (
                    <>
                        <button className="login" onClick={handleLogin}>
                            Masuk
                        </button>
                        <button className="register" onClick={handleRegister}>
                            Daftar
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default AdminNavbar;
