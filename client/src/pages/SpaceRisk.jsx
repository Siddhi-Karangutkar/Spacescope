import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, AlertTriangle, Wind, Zap, Satellite, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationHistory from '../components/LocationHistory';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './SpaceRisk.css';

const SpaceRisk = () => {
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [riskData, setRiskData] = useState(null);
    const [error, setError] = useState('');
    const [globalRiskTrends, setGlobalRiskTrends] = useState([]);
    const [riskDistribution, setRiskDistribution] = useState([]);
    const [coordinates, setCoordinates] = useState(null);

    // Initialize mock data for charts
    useEffect(() => {
        // Generate global risk trends (last 30 days)
        const trends = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            trends.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                solarRisk: 20 + Math.random() * 40,
                orbitalRisk: 15 + Math.random() * 25,
                radiationRisk: 10 + Math.random() * 30,
                communicationRisk: 5 + Math.random() * 20
            });
        }
        setGlobalRiskTrends(trends);

        // Risk distribution by category
        const distribution = [
            { category: 'Low Risk', value: 45, color: '#10b981' },
            { category: 'Medium Risk', value: 35, color: '#f59e0b' },
            { category: 'High Risk', value: 15, color: '#ef4444' },
            { category: 'Critical Risk', value: 5, color: '#991b1b' }
        ];
        setRiskDistribution(distribution);
    }, []);

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
            setCoordinates({ lat: latitude, lon: longitude });

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,wind_speed_10m,cloud_cover&hourly=uv_index&forecast_days=1`
            );
            const weatherData = await weatherRes.json();
            const current = weatherData.current;

            // 3. Real-Time Space Weather (Kp-Index & Proton Flux)
            const API_BASE = 'http://localhost:5002/api';
            const [kRes, protonRes] = await Promise.all([
                fetch(`${API_BASE}/k-index`),
                fetch(`${API_BASE}/proton-flux`)
            ]);

            const kData = await kRes.json();
            const protonData = await protonRes.json();

            const latestK = kData && kData.length > 0 ? kData[kData.length - 1].kp_index : 0;
            const latestProton = protonData && protonData.length > 0 ? protonData[protonData.length - 1].flux : 0;

            // 3. Risk Calculation Logic
            // Cyclone Risk: Based on Wind Speed (km/h)
            // > 60km/h = High, > 30 = Medium
            let cycloneRisk = Math.min(current.wind_speed_10m / 10, 10).toFixed(1);
            let cycloneLabel = current.wind_speed_10m > 60 ? "Active Storm Threat" : current.wind_speed_10m > 30 ? "Moderate Turbulance" : "Stable Atmosphere";

            // Flood Risk: Based on Precipitation (mm)
            // > 5mm = High
            let floodRisk = Math.min(current.precipitation * 3, 10).toFixed(1);
            let floodLabel = current.precipitation > 5 ? "Flash Flood Warning" : current.precipitation > 1 ? "Heavy Rainfall" : "Dry Baseline";

            // Solar Risk (Real-time Kp-Index + Latitude factor)
            // Kp-index 0-9 translates well to risk score
            const latFactor = Math.abs(latitude) / 90;
            let solarRisk = (parseFloat(latestK) + (latFactor * 2)).toFixed(1);
            let solarLabel = solarRisk > 7 ? "Geomagnetic Storm Inbound" : solarRisk > 4 ? "Unsettled Space Weather" : "Normal Solar Wind";

            // Satellite Dependency Score (Real-time Proton Flux + Tech factor)
            const techScore = (name.length + 5) % 10;
            const protonModifier = Math.log10(Math.max(latestProton, 1)) * 2;
            let satRisk = (3 + (techScore / 2) + protonModifier).toFixed(1);
            satRisk = Math.min(satRisk, 10);

            // Total Score
            const totalScore = ((parseFloat(cycloneRisk) + parseFloat(floodRisk) + parseFloat(solarRisk) + parseFloat(satRisk)) / 4).toFixed(1);

            setRiskData({
                location: `${name}, ${country}`,
                totalScore,
                breakdown: {
                    cyclone: { score: cycloneRisk, label: cycloneLabel, val: `${current.wind_speed_10m} km/h Wind` },
                    flood: { score: floodRisk, label: floodLabel, val: `${current.precipitation} mm Rain` },
                    solar: { score: solarRisk, label: solarLabel, val: `Kp-Index: ${latestK}` },
                    satellite: { score: satRisk, label: "Network Vulnerability", val: `Proton Flux: ${parseFloat(latestProton).toExponential(1)}` }
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


            {/* Location History Feature */}
            {coordinates && riskData && (
                <LocationHistory city={riskData.location} coordinates={coordinates} />
            )}

            {/* Global Risk Analytics Section */}
            {
                !riskData && (
                    <div className="global-risk-analytics">
                        <h2 className="analytics-title">Global Space Risk Analytics</h2>

                        {/* 30-Day Risk Trends */}
                        <div className="glass-panel risk-chart-panel">
                            <h3>30-Day Global Risk Trends</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={globalRiskTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="solarRisk" stroke="#f59e0b" strokeWidth={2} name="Solar Storm Risk" />
                                    <Line type="monotone" dataKey="orbitalRisk" stroke="#3b82f6" strokeWidth={2} name="Orbital Debris Risk" />
                                    <Line type="monotone" dataKey="radiationRisk" stroke="#ef4444" strokeWidth={2} name="Radiation Risk" />
                                    <Line type="monotone" dataKey="communicationRisk" stroke="#8b5cf6" strokeWidth={2} name="Communication Risk" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="risk-charts-grid">
                            {/* Risk Distribution Pie Chart */}
                            <div className="glass-panel risk-chart-panel">
                                <h3>Global Risk Distribution</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={riskDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.category}: ${entry.value}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {riskDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Regional Risk Comparison */}
                            <div className="glass-panel risk-chart-panel">
                                <h3>Regional Risk Comparison</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={[
                                        { region: 'North America', solar: 35, orbital: 25, radiation: 20 },
                                        { region: 'Europe', solar: 30, orbital: 20, radiation: 25 },
                                        { region: 'Asia', solar: 40, orbital: 30, radiation: 35 },
                                        { region: 'Africa', solar: 45, orbital: 15, radiation: 40 },
                                        { region: 'South America', solar: 35, orbital: 20, radiation: 30 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="region" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                        <Legend />
                                        <Bar dataKey="solar" fill="#f59e0b" name="Solar Risk" />
                                        <Bar dataKey="orbital" fill="#3b82f6" name="Orbital Risk" />
                                        <Bar dataKey="radiation" fill="#ef4444" name="Radiation Risk" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
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
