import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Rocket, Telescope } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar glass-panel">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Telescope className="logo-icon text-cyan-400" size={28} />
                    <span className="logo-text">
                        <span className="font-bold tracking-widest text-white">SPACE</span>
                        <span className="font-light tracking-widest text-cyan-400">SCOPE</span>
                    </span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/cosmic-weather" className="nav-link">Cosmic Weather</Link>
                    <Link to="/space-events" className="nav-link">Space Events</Link>
                    <Link to="/asteroid-radar" className="nav-link">Asteroid Radar</Link>
                    <Link to="/missions" className="nav-link">Missions</Link>
                    <Link to="/learn" className="nav-link">Learn</Link>
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
