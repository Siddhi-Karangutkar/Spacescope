import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Radio, ShieldAlert, ChevronDown, Telescope, Activity } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page cinematic-theme">

            {/* Background Atmosphere */}
            <div className="space-void"></div>
            <div className="orbital-horizon">
                <div className="earth-glow"></div>
                <div className="earth-surface"></div>
            </div>

            <div className="stars-layer"></div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                    <h5 className="mission-tag">MISSION: PLANETARY AWARENESS</h5>
                    <h1 className="cinematic-title">
                        THE UNIVERSE <br />
                        <span className="text-highlight">IS WATCHING</span>
                    </h1>
                    <p className="cinematic-subtitle">
                        Real-time telemetry from 400+ satellites. <br />
                        Your personal downlink to Earth's biosphere and the cosmos beyond.
                    </p>

                    <div className="hero-actions">
                        <Link to="/dashboard" className="explore-btn">
                            ENTER DASHBOARD
                        </Link>
                    </div>
                </div>

                <div className="scroll-indicator" style={{ opacity: Math.max(0, 1 - scrollY / 300) }}>
                    <span>SCROLL TO EXPLORE</span>
                    <ChevronDown size={20} className="bounce" />
                </div>
            </section>

            {/* Feature Cards Interface */}
            <section className="interface-section">
                <div className="interface-grid">
                    <Link to="/earth-link" className="interface-card">
                        <div className="card-visual visual-earth"></div>
                        <div className="card-content">
                            <Globe size={32} className="card-icon" />
                            <h3>EarthLink</h3>
                            <p>Hyper-local biosphere scanning.</p>
                            <span className="card-link">ACCESS DATA <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/cosmic-weather" className="interface-card">
                        <div className="card-visual visual-sun"></div>
                        <div className="card-content">
                            <Radio size={32} className="card-icon" />
                            <h3>Solar Watch</h3>
                            <p>Real-time geomagnetic storm alerts.</p>
                            <span className="card-link">VIEW TELEMETRY <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/asteroid-radar" className="interface-card">
                        <div className="card-visual visual-asteroid"></div>
                        <div className="card-content">
                            <ShieldAlert size={32} className="card-icon" />
                            <h3>Asteroid Radar</h3>
                            <p>Near-Earth Object defense network.</p>
                            <span className="card-link">TRACK THREATS <ArrowRight size={14} /></span>
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
                    <a href="#">NASA</a>
                    <a href="#">ESA</a>
                    <a href="#">NOAA</a>
                    <span className="version">v2.5</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
