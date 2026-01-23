import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './SatelliteView.css';

// --- CONFIGURATION ---
const NASA_GIBS_URL = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Tile Layer Components
const NASALayer = ({ layer, format = "image/jpeg", time = TODAY }) => (
    <TileLayer
        url={`${NASA_GIBS_URL}/${layer}/default/${time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${format === "image/png" ? "png" : "jpg"}`}
        attribution="NASA EOSDIS GIBS"
        tileSize={256}
    />
);

const SatelliteView = () => {
    const navigate = useNavigate();
    const [satelliteMode, setSatelliteMode] = useState(false);
    const [activeLayer, setActiveLayer] = useState("TrueColor"); // TrueColor, AQI, Rain, Thermal

    return (
        <div className="satellite-view-container">
            {/* Header / HUD */}
            <div className="satellite-header-hud">
                <div className="hud-panel">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="hud-back-btn"
                        >
                            <span>←</span>
                        </button>
                        <span className="hud-terminal-tag">Terminal / Orbital / V1.0</span>
                    </div>

                    <h1 className="hud-title">
                        SATELLITE<br />VISION
                    </h1>

                    <div className="hud-badges">
                        <div className="badge badge-realtime">
                            <div className="pulse-dot" />
                            Live Data Stream
                        </div>
                        <div className="badge badge-nasa">NASA GIBS Enabled</div>
                    </div>
                </div>

                {/* THE "SUPER UNIQUE" TOGGLE */}
                <div className="satellite-toggle-dock">
                    <div className="toggle-labels">
                        <div className={`label-group ${!satelliteMode ? 'active' : ''}`}>
                            <span className="label-tag">Map View</span>
                            <span className="label-main">STANDARD</span>
                        </div>

                        <button
                            onClick={() => setSatelliteMode(!satelliteMode)}
                            className={`custom-switch ${satelliteMode ? 'on' : ''}`}
                        >
                            <div className="switch-knob">🛰️</div>
                        </button>

                        <div className={`label-group ${satelliteMode ? 'active' : ''}`}>
                            <span className="label-tag">NASA Stream</span>
                            <span className="label-main">ORBITAL</span>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    <button
                        onClick={() => setSatelliteMode(!satelliteMode)}
                        className={`toggle-sub-link ${satelliteMode ? 'active' : ''}`}
                    >
                        👁 View From Satellite
                    </button>
                </div>
            </div>

            {/* Mode Selectors */}
            {satelliteMode && (
                <div className="layer-selectors-dock animate-in-right">
                    {[
                        { id: 'TrueColor', label: 'True Color (RGB)', desc: 'Direct sunlight reflection', icon: '🌍' },
                        { id: 'AQI', label: 'Pollution (AQI)', desc: 'MODIS Aerosol Optical Depth', icon: '🌫️' },
                        { id: 'Rain', label: 'Rain (Precip)', desc: 'GPM Precipitation Intensity', icon: '🌧️' },
                        { id: 'Thermal', label: 'Disaster (Heat)', desc: 'Fire & Hotspot Detection', icon: '🔥' }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveLayer(mode.id)}
                            className={`layer-btn ${activeLayer === mode.id ? 'active' : ''}`}
                        >
                            {activeLayer === mode.id && <div className="btn-indicator" />}
                            <span className="layer-icon">{mode.icon}</span>
                            <div className="layer-info">
                                <span className="layer-label">{mode.label}</span>
                                <span className="layer-desc">{mode.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Map Engine */}
            <div className="w-full h-full">
                <MapContainer
                    center={[20, 0]}
                    zoom={3}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={false}
                >
                    {!satelliteMode ? (
                        <TileLayer
                            attribution='&copy; CARTO'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    ) : (
                        <>
                            <NASALayer layer="VIIRS_SNPP_CorrectedReflectance_TrueColor" />
                            {activeLayer === 'AQI' && <NASALayer layer="MODIS_Terra_Aerosol" format="image/png" />}
                            {activeLayer === 'Rain' && <NASALayer layer="IMERG_Precipitation_Rate" format="image/png" />}
                            {activeLayer === 'Thermal' && <NASALayer layer="VIIRS_SNPP_Thermal_Anomalies_375m_Day" format="image/png" />}
                        </>
                    )}
                </MapContainer>
            </div>

            {/* Effects */}
            {satelliteMode && (
                <div className="scan-overlay" />
            )}

            {/* Status Panel */}
            <div className="status-panel-dock">
                <div className="status-card">
                    <div className="scanner-viz">
                        <div className="ring-dashed" />
                        <div className="viz-text">SCAN</div>
                    </div>

                    <div className="status-content">
                        <div className="status-meta">
                            <div className={`status-dot ${satelliteMode ? 'active' : ''}`} />
                            <span className="status-meta-text">Orbital Status // {satelliteMode ? 'Active' : 'Standby'}</span>
                        </div>
                        <div className="status-main-val">
                            {satelliteMode ? (
                                <>
                                    <span className="prefix">RAW:DATA</span> {activeLayer}
                                </>
                            ) : (
                                <span style={{ color: '#475569' }}>Ground Control</span>
                            )}
                        </div>
                        <div className="status-footer">
                            G-BACKBONE // NASA GIBS // {TODAY}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SatelliteView;
