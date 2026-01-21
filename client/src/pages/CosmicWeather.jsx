import React, { useState, useEffect } from 'react';
import './CosmicWeather.css';
import { Wind, Activity, Zap, Radio, AlertTriangle, ShieldAlert } from 'lucide-react';

const CosmicWeather = () => {
    const [solarWind, setSolarWind] = useState(null);
    const [magField, setMagField] = useState(null);
    const [kIndex, setKIndex] = useState(null);
    const [protonFlux, setProtonFlux] = useState(null);
    const [flares, setFlares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weatherStatus, setWeatherStatus] = useState({ status: 'Loading...', color: 'text-gray-400', message: 'Analyzing data...' });

    const API_BASE = 'http://localhost:5000/api';

    const calculateStatus = (wind, k, bz) => {
        let score = 0;
        // K-Index weights
        if (k?.kp_index >= 5) score += 3;
        else if (k?.kp_index >= 3) score += 1;

        // Wind Speed weights
        if (wind?.speed > 600) score += 2;
        else if (wind?.speed > 450) score += 1;

        // Bz weights
        if (bz?.bz_gsm < -10) score += 3;
        else if (bz?.bz_gsm < -5) score += 1;

        if (score >= 3) return { status: 'CRITICAL', color: 'text-red-500', message: 'Geomagnetic Storm Alert! High activity detected.' };
        if (score >= 1) return { status: 'MODERATE', color: 'text-yellow-400', message: 'Unsettled space weather conditions.' };
        return { status: 'CALM', color: 'text-green-400', message: 'Solar output is stable. No major disturbances.' };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [windRes, magRes, kRes, protonRes, flaresRes] = await Promise.all([
                    fetch(`${API_BASE}/solar-wind`),
                    fetch(`${API_BASE}/magnetic-field`),
                    fetch(`${API_BASE}/k-index`),
                    fetch(`${API_BASE}/proton-flux`),
                    fetch(`${API_BASE}/solar-flares`)
                ]);

                const windData = await windRes.json();
                const magData = await magRes.json();
                const kData = await kRes.json();
                const protonData = await protonRes.json();
                const flaresData = await flaresRes.json();

                // Get latest valid data point
                const latestWind = windData[windData.length - 1];
                const latestMag = magData[magData.length - 1];
                const latestK = kData[kData.length - 1];

                setSolarWind(latestWind);
                setMagField(latestMag);
                setKIndex(latestK);
                setProtonFlux(protonData[protonData.length - 1]);
                setFlares(flaresData.slice(0, 5)); // Latest 5 flares

                setWeatherStatus(calculateStatus(latestWind, latestK, latestMag));
                setLoading(false);
            } catch (error) {
                console.warn("API Failed, loading dummy data for Cosmic Weather:", error);
                // DUMMY FALLBACK DATA
                setSolarWind({ speed: 550, density: 4.5 }); // Moderate/High speed
                setMagField({ bz_gsm: -6.2, bt: 12.1 });    // Negative Bz (Storm condition)
                setKIndex({ kp_index: 6 });                 // Moderate/Strong Storm
                setProtonFlux({ flux: 15.2 });              // Elevated flux
                setFlares([
                    { classType: "M2.4", beginTime: new Date().toISOString() },
                    { classType: "C4.1", beginTime: new Date(Date.now() - 86400000).toISOString() },
                    { classType: "X1.1", beginTime: new Date(Date.now() - 172800000).toISOString() }
                ]);

                // Calculate status for dummy data
                setWeatherStatus({
                    status: 'MODERATE',
                    color: 'text-yellow-400',
                    message: '-- SIMULATED DATA -- Unsettled space weather conditions.'
                });
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const getKIndexStatus = (k) => {
        if (k <= 2) return { status: 'Calm', color: 'text-green-400' };
        if (k <= 4) return { status: 'Unstable', color: 'text-yellow-400' };
        return { status: 'Storm', color: 'text-red-500' };
    };

    if (loading) return <div className="loading-screen">Scanning Cosmic Environment...</div>;

    const kStatus = kIndex ? getKIndexStatus(kIndex.kp_index) : { status: 'Unknown', color: 'text-gray-400' };

    return (
        <div className="cosmic-weather-container">
            <header className="weather-header">
                <h1 className="page-title glow-text">Cosmic Weather Station</h1>
                <div className={`status-banner glass-panel ${weatherStatus.color === 'text-red-500' ? 'border-red-500' : ''}`}>
                    <div className="status-main">
                        <span className="status-label">Current Condition:</span>
                        <span className={`status-value ${weatherStatus.color}`}>{weatherStatus.status}</span>
                    </div>
                    <p className="status-message">{weatherStatus.message}</p>
                </div>
            </header>

            {/* 3D EARTH VISUALIZATION */}
            <Live3DEarth
                kIndex={kIndex?.kp_index || 0}
                solarWindSpeed={solarWind?.speed || 400}
                bzGsm={magField?.bz_gsm || 0}
            />

            <div className="weather-grid">
                {/* Solar Wind Speed */}
                <div className="glass-panel weather-card">
                    <div className="card-header">
                        <Wind className="card-icon" />
                        <h3>Solar Wind Speed</h3>
                    </div>
                    <div className="card-value">
                        {solarWind?.speed ? Math.round(solarWind.speed) : '--'} <span className="unit">km/s</span>
                    </div>
                    <p className="card-desc">Higher speed (&gt;500 km/s) increases storm chance.</p>
                </div>

                {/* Solar Wind Density */}
                <div className="glass-panel weather-card">
                    <div className="card-header">
                        <Activity className="card-icon" />
                        <h3>Solar Density</h3>
                    </div>
                    <div className="card-value">
                        {solarWind?.density ? parseFloat(solarWind.density).toFixed(1) : '--'} <span className="unit">p/cm³</span>
                    </div>
                    <p className="card-desc">Particle density impacting magnetosphere.</p>
                </div>

                {/* Magnetic Field Bz */}
                <div className="glass-panel weather-card">
                    <div className="card-header">
                        <Zap className="card-icon" />
                        <h3>Magnetic Field (Bz)</h3>
                    </div>
                    <div className={`card-value ${magField?.bz_gsm < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {magField?.bz_gsm ? parseFloat(magField.bz_gsm).toFixed(1) : '--'} <span className="unit">nT</span>
                    </div>
                    <p className="card-desc">Negative Bz allows energy into Earth's system.</p>
                </div>

                {/* K-Index */}
                <div className="glass-panel weather-card">
                    <div className="card-header">
                        <Radio className="card-icon" />
                        <h3>Geomagnetic K-Index</h3>
                    </div>
                    <div className={`card-value ${kStatus.color}`}>
                        {kIndex?.kp_index || '--'}
                    </div>
                    <p className="card-status">{kStatus.status}</p>
                </div>

                {/* --- NEW IMPACT METER --- */}
                <ImpactMeter kIndex={kIndex?.kp_index || 0} />

                {/* Radiation */}
                <div className="glass-panel weather-card">
                    <div className="card-header">
                        <ShieldAlert className="card-icon" />
                        <h3>Proton Flux</h3>
                    </div>
                    <div className="card-value">
                        {protonFlux?.flux ? parseFloat(protonFlux.flux).toExponential(1) : '--'}
                    </div>
                    <p className="card-desc">Radiation hazard level for satellites.</p>
                </div>

                {/* Flares Monitor */}
                <div className="glass-panel weather-card wide-card">
                    <div className="card-header">
                        <AlertTriangle className="card-icon" />
                        <h3>Recent Solar Flares</h3>
                    </div>
                    <div className="flares-list">
                        {flares.length > 0 ? flares.map((flare, idx) => (
                            <div key={idx} className="flare-item">
                                <span className={`flare-class ${flare.classType.startsWith('X') || flare.classType.startsWith('M') ? 'text-red-500' : 'text-yellow-400'}`}>
                                    {flare.classType}
                                </span>
                                <span className="flare-time">{new Date(flare.beginTime).toLocaleDateString()}</span>
                            </div>
                        )) : <p>No recent major flares detected.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImpactMeter = ({ kIndex }) => {
    // Logic based on NOAA Scales
    const getImpacts = (k) => {
        if (k >= 7) return {
            gps: "Degraded Accuracy (Errors > 20m)",
            radio: "HF Radio Blackout Likely",
            grid: "Voltage Corrections Required",
            aurora: "Visible in N. India / Florida",
            color: "text-red-500",
            stress: "HIGH"
        };
        if (k >= 5) return {
            gps: "Minor Fluctuations",
            radio: "Minor Fade on Sunlit Side",
            grid: "Weak Power Grid Fluctuations",
            aurora: "Visible in New York / Germany",
            color: "text-yellow-400",
            stress: "MODERATE"
        };
        return {
            gps: "Nominal (< 3m Accuracy)",
            radio: "Signal Stable",
            grid: "Stable",
            aurora: "High Latitudes Only (Poles)",
            color: "text-green-400",
            stress: "LOW"
        };
    };

    const impact = getImpacts(kIndex);

    return (
        <div className="glass-panel weather-card wide-card impact-meter-card">
            <div className="card-header">
                <ShieldAlert className="card-icon" />
                <h3>Infrastructure Impact Meter</h3>
            </div>
            <div className={`stress-level ${impact.color}`}>STRESS LEVEL: {impact.stress}</div>

            <div className="impact-grid">
                <div className="impact-item">
                    <span className="impact-label">GPS / SatNav</span>
                    <span className="impact-val">{impact.gps}</span>
                </div>
                <div className="impact-item">
                    <span className="impact-label">HF Radio</span>
                    <span className="impact-val">{impact.radio}</span>
                </div>
                <div className="impact-item">
                    <span className="impact-label">Power Grid</span>
                    <span className="impact-val">{impact.grid}</span>
                </div>
                <div className="impact-item">
                    <span className="impact-label">Aurora Borealis</span>
                    <span className="impact-val">{impact.aurora}</span>
                </div>
            </div>
        </div>
    );
};

// 3D EARTH WITH SPACE WEATHER VISUALIZATION
const Live3DEarth = ({ kIndex, solarWindSpeed, bzGsm }) => {
    // Calculate shield status based on conditions
    const getShieldStatus = () => {
        if (kIndex >= 5) return { color: '#ff4444', intensity: 'critical', compression: 0.85 };
        if (kIndex >= 3) return { color: '#ffaa00', intensity: 'moderate', compression: 0.92 };
        return { color: '#00ff88', intensity: 'calm', compression: 1.0 };
    };

    // Calculate aurora expansion based on Kp index
    const getAuroraExpansion = () => {
        if (kIndex >= 7) return 50; // Expands to lower latitudes
        if (kIndex >= 5) return 40;
        if (kIndex >= 3) return 30;
        return 20; // Normal polar aurora
    };

    // Calculate particle speed based on solar wind
    const getParticleSpeed = () => {
        if (solarWindSpeed > 600) return 2;
        if (solarWindSpeed > 500) return 3;
        return 4; // Slower = higher number
    };

    const shield = getShieldStatus();
    const auroraSize = getAuroraExpansion();
    const particleSpeed = getParticleSpeed();

    return (
        <div className="earth-3d-container glass-panel">
            <div className="earth-scene">
                {/* Sun indicator (left side) */}
                <div className="sun-indicator">
                    <div className="sun-glow"></div>
                    <span className="sun-label">☀️ SUN</span>
                </div>

                {/* Solar Wind Particles */}
                <div className="solar-wind-particles">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${particleSpeed + Math.random()}s`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Earth with Magnetic Shield */}
                <div className="earth-wrapper">
                    {/* Magnetic Shield */}
                    <div
                        className={`magnetic-shield ${shield.intensity}`}
                        style={{
                            borderColor: shield.color,
                            boxShadow: `0 0 40px ${shield.color}, inset 0 0 40px ${shield.color}`,
                            transform: `scale(${shield.compression}) translateX(${shield.compression < 0.9 ? '10px' : '0'})`
                        }}
                    >
                        <div className="shield-ripple"></div>
                    </div>

                    {/* Earth Globe */}
                    <div className="earth-globe">
                        {/* Earth surface */}
                        <div className="earth-surface"></div>

                        {/* Aurora Borealis (North) */}
                        <div
                            className="aurora aurora-north"
                            style={{
                                height: `${auroraSize}%`,
                                opacity: kIndex >= 3 ? 0.8 : 0.5
                            }}
                        ></div>

                        {/* Aurora Australis (South) */}
                        <div
                            className="aurora aurora-south"
                            style={{
                                height: `${auroraSize}%`,
                                opacity: kIndex >= 3 ? 0.8 : 0.5
                            }}
                        ></div>

                        {/* Atmosphere glow */}
                        <div className="atmosphere-glow"></div>
                    </div>
                </div>

                {/* Legend */}
                <div className="earth-legend">
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: shield.color }}></div>
                        <span>Magnetic Shield: {shield.intensity.toUpperCase()}</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color aurora-color"></div>
                        <span>Aurora Zone: ±{auroraSize}° Latitude</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color particle-color"></div>
                        <span>Solar Wind: {Math.round(solarWindSpeed)} km/s</span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="earth-stats">
                    <div className="stat-row">
                        <span className="stat-label">Kp Index:</span>
                        <span className={`stat-value ${kIndex >= 5 ? 'text-red-400' : kIndex >= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {kIndex}
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Bz Component:</span>
                        <span className={`stat-value ${bzGsm < -5 ? 'text-red-400' : 'text-green-400'}`}>
                            {bzGsm.toFixed(1)} nT
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Shield Status:</span>
                        <span className={`stat-value`} style={{ color: shield.color }}>
                            {shield.compression < 0.9 ? 'COMPRESSED' : 'STABLE'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="earth-description">
                <h3>🌍 Live Space Weather Shield</h3>
                <p>
                    Watch Earth's magnetic field protect us in real-time.
                    {kIndex >= 5 && " ⚠️ High activity detected - shield under stress!"}
                    {kIndex >= 3 && kIndex < 5 && " ⚡ Moderate activity - aurora expanding!"}
                    {kIndex < 3 && " ✅ Calm conditions - shield stable."}
                </p>
            </div>
        </div>
    );
};

export default CosmicWeather;

