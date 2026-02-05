import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Rocket, Telescope, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AdminLogin from './AdminLogin';
import NotificationBell from '../notifications/NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [logoClicks, setLogoClicks] = useState(0);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogoClick = (e) => {
        if (logoClicks + 1 === 5) {
            e.preventDefault();
            setShowAdminLogin(true);
            setLogoClicks(0);
        } else {
            setLogoClicks(prev => prev + 1);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <nav className="navbar glass-panel">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
                    <Telescope className="logo-icon" size={40} />
                    <span className="logo-text">
                        <span>SPACE</span>
                        <span>SCOPE</span>
                    </span>
                </Link>

                <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle Menu">
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}

                <div className={`navbar-links ${isMobileOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMobileOpen(false)}>Home</Link>
                    <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileOpen(false)}>Dashboard</Link>
                    <Link to="/climate-agriculture" className="nav-link" onClick={() => setIsMobileOpen(false)}>Climate</Link>
                    <Link to="/career-path" className="nav-link" onClick={() => setIsMobileOpen(false)}>Career Path</Link>
                    {/* <Link to="/community" className="nav-link">Crew Quarters</Link> */}
                    {/* <Link to="/cosmic-weather" className="nav-link">Cosmic Weather</Link>
                    <Link to="/space-events" className="nav-link">Space Events</Link>
                    <Link to="/asteroid-radar" className="nav-link">Asteroid Radar</Link>
                    <Link to="/missions" className="nav-link">Missions</Link>
                    <Link to="/learn" className="nav-link">Learn</Link> */}
                    <Link to="/instructor-connect" className="nav-link" onClick={() => setIsMobileOpen(false)}>Connect</Link>
                    <Link to="/earth-link" className="nav-link highlight" onClick={() => setIsMobileOpen(false)}>EarthLink</Link>

                    <NotificationBell />

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
