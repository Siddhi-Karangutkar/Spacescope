import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './SatelliteView.css';

// --- CONFIGURATION ---
const NASA_GIBS_URL = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
};
const YESTERDAY = getYesterday(); // NASA data usually available for yesterday

// Tile Layer Components
const NASALayer = ({ layer, format = "image/jpeg", time = YESTERDAY }) => (
    <TileLayer
        url={`${NASA_GIBS_URL}/${layer}/default/${time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${format === "image/png" ? "png" : "jpg"}`}
        attribution="NASA EOSDIS GIBS"
        tileSize={256}
    />
);

const Legend = ({ type, isAnalyzing }) => {
    const legends = {
        AQI: {
            title: "Aerosol Optical Depth (AQI)",
            subtitle: "Tracking smoke, smog & dust particles",
            theme: "aqi-theme",
            scale: [
                { color: "#00E400", label: "0.0 (Clear)" },
                { color: "#FFFF00", label: "0.2" },
                { color: "#FF7E00", label: "0.5" },
                { color: "#FF0000", label: "0.8" },
                { color: "#8F3F97", label: "1.0+ (Critical)" }
            ]
        },
        Rain: {
            title: "Precipitation Rate (mm/hr)",
            subtitle: "GPM Global Satellite Rainfall Data",
            theme: "rain-theme",
            scale: [
                { color: "#00FFFF", label: "0.1 (Light)" },
                { color: "#22d3ee", label: "5.0" },
                { color: "#00FF00", label: "10.0" },
                { color: "#FFFF00", label: "25.0" },
                { color: "#FF0000", label: "50.0+ (Torrential)" }
            ]
        },
        Thermal: {
            title: "Thermal Intensity (K)",
            subtitle: "Fire hotspots & Volcanic activity",
            theme: "thermal-theme",
            scale: [
                { color: "#450a0a", label: "Ambient" },
                { color: "#991b1b", label: "Active" },
                { color: "#f87171", label: "Intense" },
                { color: "#fef08a", label: "Crit: 400K+" }
            ]
        },
        TrueColor: {
            title: "True Color (RGB)",
            subtitle: "Raw optical satellite composite",
            theme: "main-theme",
            scale: [
                { color: "#083344", label: "Oceanic" },
                { color: "#065f46", label: "Vegetation" },
                { color: "#d1d5db", label: "Cloud Cover" }
            ]
        }
    };

    if (!legends[type]) return null;
    const active = legends[type];

    // Generate accurate multi-stop CSS gradient
    const gradientStops = active.scale.map(s => s.color).join(', ');

    return (
        <div className={`satellite-legend-panel ${active.theme} ${isAnalyzing ? 'analyzing' : ''}`}>
            <div className="legend-header">
                <div className="flex justify-between items-center">
                    <span className="legend-tag">LEVEL_INTENSITY</span>
                    {isAnalyzing && <span className="analyzing-tag">ANALYZING...</span>}
                </div>
                <span className="legend-title">{active.title}</span>
            </div>

            <div className="legend-visual-scale">
                <div className="intensity-labels">
                    <span>MAX</span>
                    <span>MID</span>
                    <span>MIN</span>
                </div>
                <div className="scale-gradient-bar" style={{
                    background: `linear-gradient(to top, ${gradientStops})`
                }}>
                    {isAnalyzing && <div className="loading-bar-sweep" />}
                </div>
            </div>

            <div className="legend-scale-compact">
                {active.scale.map((item, i) => (
                    <div key={i} className="scale-item-mini">
                        <div className="swatch-mini" style={{ background: item.color }} />
                        <span className="label-mini">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="legend-footer">
                <span className="source-tag">SOURCE: NASA EOSDIS // GIBS</span>
            </div>
        </div>
    );
};

const SatelliteView = () => {
    const navigate = useNavigate();
    const [satelliteMode, setSatelliteMode] = useState(false);
    const [activeLayer, setActiveLayer] = useState("TrueColor"); // TrueColor, AQI, Rain, Thermal
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleLayerChange = (layer) => {
        setIsAnalyzing(true);
        setActiveLayer(layer);
        setTimeout(() => setIsAnalyzing(false), 2000); // Simulate network latency/analysis
    };

    return (
        <div className={`satellite-view-container theme-${activeLayer.toLowerCase()}`}>
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

                <div className="hud-right-group">
                    {/* Integrated Side Legend - Now in Header */}
                    {satelliteMode && <Legend type={activeLayer} isAnalyzing={isAnalyzing} />}

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
            </div >

            {/* Mode Selectors */}
            {
                satelliteMode && (
                    <div className="layer-selectors-dock animate-in-right">
                        {[
                            { id: 'TrueColor', label: 'True Color (RGB)', desc: 'Direct sunlight reflection', icon: '🌍', theme: 'main' },
                            { id: 'AQI', label: 'Pollution (AQI)', desc: 'MODIS Aerosol Optical Depth', icon: '🌫️', theme: 'aqi' },
                            { id: 'Rain', label: 'Rain (Precip)', desc: 'GPM Precipitation Intensity', icon: '🌧️', theme: 'rain' },
                            { id: 'Thermal', label: 'Disaster (Heat)', desc: 'Fire & Hotspot Detection', icon: '🔥', theme: 'thermal' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => handleLayerChange(mode.id)}
                                className={`layer-btn ${activeLayer === mode.id ? 'active' : ''} ${mode.theme}-btn`}
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
                )
            }

            {/* Map Engine */}
            <div className="map-wrapper">
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
            {
                satelliteMode && (
                    <>
                        <div className={`scan-overlay ${isAnalyzing ? 'fast-scan' : ''}`} />
                    </>
                )
            }

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
                                    <span className="prefix">{isAnalyzing ? 'FETCHING' : 'RAW:DATA'}</span> {activeLayer}
                                </>
                            ) : (
                                <span style={{ color: '#475569' }}>Ground Control</span>
                            )}
                        </div>
                        <div className="status-footer">
                            G-BACKBONE // NASA GIBS // {YESTERDAY}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SatelliteView;
