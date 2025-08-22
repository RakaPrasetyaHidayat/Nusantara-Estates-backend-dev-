import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../App';

const Navbar = () => {
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
        navigate('/LoginForm');
    };

    const handleRegister = () => {
        navigate('/RegisterForm');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const scrollToSection = (sectionId) => {
        try {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } catch (error) {
            console.error('Scroll error:', error);
        }
    };

    const handleLayananClick = (e) => {
        e.preventDefault();
        try {
            if (location.pathname === '/') {
                // Jika di homepage, scroll ke section layanan
                scrollToSection('layanan-kami-section');
            } else {
                // Jika di halaman lain, navigasi ke homepage lalu scroll
                navigate('/');
                setTimeout(() => {
                    scrollToSection('layanan-kami-section');
                }, 500); // Increase timeout
            }
        } catch (error) {
            console.error('Navigation error:', error);
            navigate('/');
        }
    };

    const handleKontakClick = (e) => {
        e.preventDefault();
        try {
            if (location.pathname === '/') {
                scrollToSection('kontak-section');
            } else {
                navigate('/');
                setTimeout(() => {
                    scrollToSection('kontak-section');
                }, 500); // Increase timeout
            }
        } catch (error) {
            console.error('Navigation error:', error);
            navigate('/');
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
                    <NavLink 
                        to="/" 
                        end
                        onClick={(e) => {
                            // Untuk admin, gunakan simple navigation tanpa scroll
                            if (user?.isAdmin && location.pathname !== '/') {
                                e.preventDefault();
                                window.location.href = '/';
                            }
                        }}
                    >
                        Beranda
                    </NavLink>
                </li>
                <li><a href="#layanan-kami-section" onClick={handleLayananClick}>Layanan</a></li>
                <li><a href="#kontak-section" onClick={handleKontakClick}>Kontak</a></li>
            </ul>
            <div className="nav-buttons">
                {user ? (
                    <div className="user-info">
                        <span className="welcome-text">Halo, {user.username}!</span>
                        {/* Tampilkan tombol Admin Panel hanya untuk admin */}
                        {user.isAdmin && (
                            <button 
                                className="dashboard-btn" 
                                onClick={() => {
                                    try {
                                        navigate('/admin/table');
                                    } catch (error) {
                                        console.error('Navigation error:', error);
                                        window.location.href = '/admin/table';
                                    }
                                }}
                            >
                                Admin Panel
                            </button>
                        )}
                        <button className="logout" onClick={handleLogout}>Keluar</button>
                    </div>
                ) : (
                    <>
                        <button className="login" onClick={handleLogin}>Masuk</button>
                        <button className="register" onClick={handleRegister}>Daftar</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
