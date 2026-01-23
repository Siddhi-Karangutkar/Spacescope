import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Rocket, Telescope } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AdminLogin from './AdminLogin';
import './Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [logoClicks, setLogoClicks] = useState(0);
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    const handleLogoClick = (e) => {
        if (logoClicks + 1 === 5) {
            e.preventDefault();
            setShowAdminLogin(true);
            setLogoClicks(0);
        } else {
            setLogoClicks(prev => prev + 1);
        }
    };

    return (
        <nav className="navbar glass-panel">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
                    <Telescope className="logo-icon text-cyan-400" size={28} />
                    <span className="logo-text">
                        <span className="font-bold tracking-widest text-white">SPACE</span>
                        <span className="font-light tracking-widest text-cyan-400">SCOPE</span>
                    </span>
                </Link>

                {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    {/* <Link to="/community" className="nav-link">Crew Quarters</Link> */}
                    {/* <Link to="/cosmic-weather" className="nav-link">Cosmic Weather</Link>
                    <Link to="/space-events" className="nav-link">Space Events</Link>
                    <Link to="/asteroid-radar" className="nav-link">Asteroid Radar</Link>
                    <Link to="/missions" className="nav-link">Missions</Link>
                    <Link to="/learn" className="nav-link">Learn</Link> */}
                    <Link to="/instructor-connect" className="nav-link">Connect</Link>
                    <Link to="/earth-link" className="nav-link highlight">EarthLink</Link>

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
