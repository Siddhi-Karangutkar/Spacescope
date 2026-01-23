import React, { useState } from 'react';
import { ArrowLeft, Search, AlertTriangle, Wind, Zap, Satellite, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SpaceRisk.css';

const SpaceRisk = () => {
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [riskData, setRiskData] = useState(null);
    const [error, setError] = useState('');

    const calculateRisk = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setRiskData(null);

        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results) {
                throw new Error("City not found. Try a major city name.");
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. Weather Data (Wind, Rain)
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,wind_speed_10m,cloud_cover&hourly=uv_index&forecast_days=1`
            );
            const weatherData = await weatherRes.json();
            const current = weatherData.current;

            // 3. Risk Calculation Logic
            // Cyclone Risk: Based on Wind Speed (km/h)
            // > 60km/h = High, > 30 = Medium
            let cycloneRisk = Math.min(current.wind_speed_10m / 10, 10).toFixed(1);
            let cycloneLabel = current.wind_speed_10m > 60 ? "Active Storm Threat" : current.wind_speed_10m > 30 ? "Moderate Turbulance" : "Stable Atmosphere";

            // Flood Risk: Based on Precipitation (mm)
            // > 5mm = High
            let floodRisk = Math.min(current.precipitation * 3, 10).toFixed(1);
            let floodLabel = current.precipitation > 5 ? "Flash Flood Warning" : current.precipitation > 1 ? "Heavy Rainfall" : "Dry Baseline";

            // Solar Risk (Simulated real-time variance + Latitude factor)
            // Higher latitude = more exposure to geomagnetic storms
            const latFactor = Math.abs(latitude) / 90;
            const baseSolar = 3 + (Math.random() * 4); // Random fluctuation 3-7
            let solarRisk = (baseSolar + (latFactor * 2)).toFixed(1);
            let solarLabel = solarRisk > 7 ? "Geomagnetic Storm Inbound" : "Normal Solar Wind";

            // Satellite Dependency Score
            // Mocked based on "Technology Density" (Randomized for demo, but consistent for city)
            const techScore = (name.length + 5) % 10; // Deterministic randomish
            let satRisk = (4 + (techScore / 2)).toFixed(1);

            // Total Score
            const totalScore = ((parseFloat(cycloneRisk) + parseFloat(floodRisk) + parseFloat(solarRisk) + parseFloat(satRisk)) / 4).toFixed(1);

            setRiskData({
                location: `${name}, ${country}`,
                totalScore,
                breakdown: {
                    cyclone: { score: cycloneRisk, label: cycloneLabel, val: `${current.wind_speed_10m} km/h Wind` },
                    flood: { score: floodRisk, label: floodLabel, val: `${current.precipitation} mm Rain` },
                    solar: { score: solarRisk, label: solarLabel, val: `Kp-Index Projected` },
                    satellite: { score: satRisk, label: "Critical Infrastructure", val: "High Dependency" }
                }
            });

        } catch (err) {
            setError(err.message || "Failed to fetch scan data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-risk-page">
            {/* Header */}
            <header className="space-risk-header">
                <Link to="/dashboard" className="back-link">
                    <ArrowLeft size={18} /> BACK
                </Link>
                <div className="header-content">
                    <h1 className="risk-title">SPACE RISK <span className="text-cyan">SCANNER</span></h1>
                    <p className="risk-subtitle">Environmental & Orbital Threat Assessment</p>
                </div>
            </header>

            {/* Search Section */}
            <div className="risk-search-container">
                <form onSubmit={calculateRisk} className="risk-search-form">
                    <input
                        type="text"
                        placeholder="ENTER CITY NAME TO SCAN (e.g. TOKYO)"
                        className="risk-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                    <button type="submit" className="risk-submit-btn" disabled={loading}>
                        {loading ? <span className="animate-spin">🌀</span> : <Search size={24} strokeWidth={3} />}
                        SCAN
                    </button>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>

            {/* Results Section */}
            {riskData && (
                <div className="risk-results-wrapper">

                    {/* Main Score Card */}
                    <div className="risk-main-card">
                        <div className="card-top-glow"></div>
                        <h2 className="main-card-title">Composite Risk Assessment Score</h2>
                        <div className="location-name">{riskData.location}</div>

                        <div className="score-display">
                            <span className="total-score">{riskData.totalScore}</span>
                            <span className="score-max">/ 10</span>
                        </div>

                        <div className={`risk-status-badge ${riskData.totalScore > 7 ? 'status-critical' : 'status-safe'}`}>
                            {riskData.totalScore > 7 ? '⚠️ CRITICAL VULNERABILITY DETECTED' : '✅ SYSTEMS WITHIN SAFE TOLERANCE'}
                        </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="risk-grid">
                        {/* Solar */}
                        <RiskCard
                            icon={<Zap size={28} className="text-yellow" />}
                            title="Solar Storm Exposure"
                            score={riskData.breakdown.solar.score}
                            label={riskData.breakdown.solar.label}
                            detail={riskData.breakdown.solar.val}
                            theme="theme-yellow"
                            colorClass="text-yellow"
                            bgClass="bg-yellow"
                            iconBg="rgba(234, 179, 8, 0.1)"
                            iconBorder="rgba(234, 179, 8, 0.2)"
                        />
                        {/* Cyclone */}
                        <RiskCard
                            icon={<Wind size={28} className="text-blue" />}
                            title="Atmospheric Instability"
                            score={riskData.breakdown.cyclone.score}
                            label={riskData.breakdown.cyclone.label}
                            detail={riskData.breakdown.cyclone.val}
                            theme="theme-blue"
                            colorClass="text-blue"
                            bgClass="bg-blue"
                            iconBg="rgba(59, 130, 246, 0.1)"
                            iconBorder="rgba(59, 130, 246, 0.2)"
                        />
                        {/* Flood */}
                        <RiskCard
                            icon={<CloudRain size={28} className="text-cyan" />}
                            title="Hydrological Risk"
                            score={riskData.breakdown.flood.score}
                            label={riskData.breakdown.flood.label}
                            detail={riskData.breakdown.flood.val}
                            theme="theme-cyan"
                            colorClass="text-cyan"
                            bgClass="bg-cyan"
                            iconBg="rgba(6, 182, 212, 0.1)"
                            iconBorder="rgba(6, 182, 212, 0.2)"
                        />
                        {/* Satellite */}
                        <RiskCard
                            icon={<Satellite size={28} className="text-purple" />}
                            title="Satellite Dependency"
                            score={riskData.breakdown.satellite.score}
                            label={riskData.breakdown.satellite.label}
                            detail={riskData.breakdown.satellite.val}
                            theme="theme-purple"
                            colorClass="text-purple"
                            bgClass="bg-purple"
                            iconBg="rgba(168, 85, 247, 0.1)"
                            iconBorder="rgba(168, 85, 247, 0.2)"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const RiskCard = ({ icon, title, score, label, detail, theme, colorClass, bgClass, iconBg, iconBorder }) => (
    <div className={`factor-card ${theme}`}>
        <div className="icon-wrapper" style={{ backgroundColor: iconBg, borderColor: iconBorder }}>
            {icon}
        </div>
        <div className="card-content-wrapper">
            <div className="card-header">
                <h3 className="factor-title">{title}</h3>
                <span className={`factor-score ${colorClass}`}>{score}</span>
            </div>
            <div className="progress-track">
                <div
                    className={`progress-fill ${bgClass}`}
                    style={{ width: `${score * 10}%` }}
                ></div>
            </div>
            <p className="factor-label">{label}</p>
            <p className="factor-detail">{detail}</p>
        </div>
    </div>
);

export default SpaceRisk;
