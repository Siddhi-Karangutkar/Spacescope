import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Radio, ShieldAlert, ChevronDown, Telescope, Activity, Satellite, Rocket } from 'lucide-react';
import './LandingPage.css';
import SolarSystem from '../components/SolarSystem';
import SpaceTimeline from '../components/SpaceTimeline'; // Import Feature
import '../pages/LandingPage.css';

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page cinematic-theme">

            {/* --- HERO SPLIT SECTION --- */}
            <section className="hero-split-section">

                {/* LEFT: CONTENT */}
                <div className="hero-left-content">
                    <div className="hero-text-wrapper" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
                        <div className="mission-badge">
                            <Activity size={16} className="pulse-icon" />
                            <span>LIVE TELEMETRY ACTIVE</span>
                        </div>

                        <h1 className="cinematic-title">
                            EXPLORE THE <br />
                            <span className="text-highlight">COSMIC FRONTIER</span>
                        </h1>

                        <p className="cinematic-subtitle">
                            We bridge the gap between Earth and the Void. Real-time tracking of
                            solar winds, asteroids, and orbital assets. Your personal command center
                            for the solar system.
                        </p>

                        <div className="hero-actions">
                            <Link to="/dashboard" className="explore-btn primary-btn">
                                <Telescope size={20} />
                                LAUNCH DASHBOARD
                            </Link>
                            <Link to="/missions" className="explore-btn secondary-btn">
                                <Rocket size={20} />
                                FLIGHT SCHEDULE
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">400+</span>
                                <span className="stat-label">SATELLITES</span>
                            </div>
                            <div className="stat-separator"></div>
                            <div className="stat-item">
                                <span className="stat-value">LIVE</span>
                                <span className="stat-label">SOLAR DATA</span>
                            </div>
                            <div className="stat-separator"></div>
                            <div className="stat-item">
                                <span className="stat-value">24/7</span>
                                <span className="stat-label">SURVEILLANCE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: 3D SOLAR SYSTEM */}
                <div className="hero-right-visual">
                    <div className="solar-system-container">
                        <SolarSystem />
                    </div>
                    <div className="visual-overlay-gradient"></div>
                </div>

                <div className="scroll-hint">
                    <span>SYSTEM MODULES</span>
                    <ChevronDown size={20} className="bounce" />
                </div>
            </section>

            {/* --- SPACE TIMELINE SECTION --- */}
            <SpaceTimeline />

            {/* --- FEATURE MODULES (Rest of Page) --- */}
            <section className="modules-section">
                <div className="modules-header">
                    <h2>OPERATIONAL MODULES</h2>
                    <div className="header-line"></div>
                </div>

                <div className="interface-grid">
                    <Link to="/earth-link" className="interface-card">
                        <div className="card-visual visual-earth"></div>
                        <div className="card-content">
                            <Globe size={32} className="card-icon" />
                            <h3>EarthLink</h3>
                            <p>Biosphere scanning and atmospheric analysis.</p>
                            <span className="card-link">ACCESS DATA <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/cosmic-weather" className="interface-card">
                        <div className="card-visual visual-sun"></div>
                        <div className="card-content">
                            <Radio size={32} className="card-icon" />
                            <h3>Solar Watch</h3>
                            <p>Geomagnetic storm alerts and solar flares.</p>
                            <span className="card-link">VIEW TELEMETRY <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/asteroid-radar" className="interface-card">
                        <div className="card-visual visual-asteroid"></div>
                        <div className="card-content">
                            <ShieldAlert size={32} className="card-icon" />
                            <h3>Asteroid Radar</h3>
                            <p>Near-Earth Object defense network tracking.</p>
                            <span className="card-link">TRACK THREATS <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/missions" className="interface-card">
                        <div className="card-visual visual-launch"></div>
                        <div className="card-content">
                            <Rocket size={32} className="card-icon" />
                            <h3>Missions</h3>
                            <p>Upcoming launches and flight manifests.</p>
                            <span className="card-link">CHECK SCHEDULE <ArrowRight size={14} /></span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="cinematic-footer">
                <div className="footer-left">
                    <div className="brand flex items-center gap-2">
                        <Telescope size={20} className="text-cyan-400" />
                        <span>
                            <span className="font-bold tracking-widest text-white">SPACE</span>
                            <span className="font-light tracking-widest text-cyan-400">SCOPE</span>
                        </span>
                    </div>
                    <span className="divider">|</span>
                    <span className="status">SYSTEMS NOMINAL</span>
                </div>
                <div className="footer-right">
                    <span className="version">Classified Access Only</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
