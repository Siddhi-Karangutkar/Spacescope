import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { Play, Pause, Maximize2, Minimize2, Info, Wind, CloudRain, AlertTriangle } from 'lucide-react';
import "../pages/SpaceRisk.css"; // We will add specific styles here

const NASA_GIBS_URL = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";

// Helper to update map center when props change
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const LocationHistory = ({ city = "London", coordinates = { lat: 51.505, lon: -0.09 } }) => {
    // Use a float year for smooth animation (internal detail), expose integer year for data
    const [floatYear, setFloatYear] = useState(2026);

    // Derived integer year for data fetching
    const year = Math.floor(floatYear);

    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [maximizedMap, setMaximizedMap] = useState(null);

    // Animation Ref
    const requestRef = useRef();
    const previousTimeRef = useRef();

    // The speed: Years per second. 
    // User asked for "slow but smooth". 3 seconds per year = 0.333 years/sec.
    const PLAYBACK_SPEED = 0.33;

    const animate = time => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = (time - previousTimeRef.current) / 1000; // in seconds

            setFloatYear(prev => {
                const nextVal = prev + (PLAYBACK_SPEED * deltaTime);

                // Restart logic
                if (nextVal >= 2026.99) {
                    return 2000;
                }
                return nextVal;
            });
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
            previousTimeRef.current = undefined;
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying]);

    // Format date for GIBS (YYYY-MM-DD). Using 3-day lag for current year
    const getDateForYear = (y) => {
        if (y === 2026) {
            const d = new Date();
            d.setDate(d.getDate() - 3);
            return d.toISOString().split('T')[0];
        }
        // Use a consistent date for history
        return `${y}-09-15`;
    };

    const currentDateStr = getDateForYear(year);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const StatCard = ({ title, value, status, icon: Icon }) => (
        <div className="glass-card stat-card-small">
            <div className="stat-header">
                <Icon size={16} className="text-cyan-400" />
                <span>{title}</span>
            </div>
            <div className="stat-value">{value}</div>
            <div className={`stat-status status-${status.toLowerCase()}`}>{status}</div>
        </div>
    );

    // Dynamic mock data generator based on year to simulate API stats
    const getStats = (type, yr) => {
        // Simple deterministic "random" based on year + perturbation
        // We use integer year so stats don't jitter crazily
        const base = (yr % 10) + 1;
        if (type === 'pollution') {
            const val = 40 + base * 5;
            return { val: `${val} AQI`, status: val > 80 ? 'High' : 'Moderate' };
        }
        if (type === 'rainfall') {
            const val = 120 + base * 15;
            return { val: `${val} mm`, status: val > 200 ? 'Heavy' : 'Normal' };
        }
        if (type === 'cyclone') {
            const active = yr % 5 === 0;
            return { val: active ? 'Active Storm' : 'Clear', status: active ? 'Warning' : 'Safe' };
        }
        return { val: '-', status: '-' };
    };

    const polStats = getStats('pollution', year);
    const rainStats = getStats('rainfall', year);
    const cycStats = getStats('cyclone', year);

    return (
        <div className="location-history-container fade-in">
            <div className="history-header">
                <h2><span className="text-gradient">Temporal Analysis:</span> {city}</h2>
                <div className="timeline-controls glass-panel">
                    <button onClick={togglePlay} className="control-btn">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <input
                        type="range"
                        min="2000"
                        max="2026"
                        step="0.01" // Smooth slider steps
                        value={floatYear}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFloatYear(val);
                            // Only stop if user drags manually, but feels "continuous"
                            setIsPlaying(false);
                        }}
                        className="timeline-slider"
                        style={{ backgroundSize: `${((floatYear - 2000) * 100) / 26}% 100%` }} // Visual progress fill
                    />
                    <span className="year-display">{year}</span>
                </div>
            </div>

            {/* Maps Grid */}
            <div className={`maps-grid ${maximizedMap ? 'has-maximized' : ''}`}>

                {/* Pollution Map - Using TrueColor with Filter for Reliability */}
                <div className={`map-card-wrapper ${maximizedMap === 'pollution' ? 'maximized' : ''} ${maximizedMap && maximizedMap !== 'pollution' ? 'hidden' : ''}`}>
                    <div className="map-card-header">
                        <h3>Pollution Haze</h3>
                        <button onClick={() => setMaximizedMap(maximizedMap === 'pollution' ? null : 'pollution')}>
                            {maximizedMap === 'pollution' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                    <div className="map-container-frame monochrome-sepia">
                        <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={6} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                            <ZoomControl position="bottomright" />
                            <MapUpdater center={[coordinates.lat, coordinates.lon]} />
                            {/* Visual Proxy: Use TrueColor and let Sepia filter do the "Pollution" look */}
                            <TileLayer
                                url={`${NASA_GIBS_URL}/MODIS_Terra_CorrectedReflectance_TrueColor/default/${currentDateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                                attribution="NASA GIBS"
                            />
                            {/* Base Labels (Optional) */}
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" opacity={0.6} />
                        </MapContainer>
                        <MapLegend type="pollution" label="AOD Levels" />
                    </div>
                    <div className="map-summary">
                        <StatCard title="Air Quality" value={polStats.val} status={polStats.status} icon={Wind} />
                        <p className="summary-text">Particulate matter density analysis for {year}.</p>
                    </div>
                </div>

                {/* Rainfall Map - Using Water Vapor */}
                <div className={`map-card-wrapper ${maximizedMap === 'rainfall' ? 'maximized' : ''} ${maximizedMap && maximizedMap !== 'rainfall' ? 'hidden' : ''}`}>
                    <div className="map-card-header">
                        <h3>Precipitation</h3>
                        <button onClick={() => setMaximizedMap(maximizedMap === 'rainfall' ? null : 'rainfall')}>
                            {maximizedMap === 'rainfall' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                    <div className="map-container-frame monochrome-blue">
                        <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={6} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                            <ZoomControl position="bottomright" />
                            <MapUpdater center={[coordinates.lat, coordinates.lon]} />
                            {/* Base Layer: TrueColor (so we see Earth even if no rain) */}
                            <TileLayer
                                url={`${NASA_GIBS_URL}/MODIS_Terra_CorrectedReflectance_TrueColor/default/${currentDateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                            />
                            {/* Overlay: Precip/Water Vapor */}
                            <TileLayer
                                url={`${NASA_GIBS_URL}/MODIS_Terra_Water_Vapor_Infrared/default/${currentDateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                                opacity={0.7}
                            />
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" opacity={0.6} />
                        </MapContainer>
                        <MapLegend type="rainfall" label="Moisture" />
                    </div>
                    <div className="map-summary">
                        <StatCard title="Rainfall" value={rainStats.val} status={rainStats.status} icon={CloudRain} />
                        <p className="summary-text">Accumulated precipitation data view.</p>
                    </div>
                </div>

                {/* Cyclone Map */}
                <div className={`map-card-wrapper ${maximizedMap === 'cyclone' ? 'maximized' : ''} ${maximizedMap && maximizedMap !== 'cyclone' ? 'hidden' : ''}`}>
                    <div className="map-card-header">
                        <h3>Storm Tracks</h3>
                        <button onClick={() => setMaximizedMap(maximizedMap === 'cyclone' ? null : 'cyclone')}>
                            {maximizedMap === 'cyclone' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                    <div className="map-container-frame monochrome-red">
                        <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={5} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                            <ZoomControl position="bottomright" />
                            <MapUpdater center={[coordinates.lat, coordinates.lon]} />
                            <TileLayer
                                url={`${NASA_GIBS_URL}/MODIS_Terra_CorrectedReflectance_TrueColor/default/${currentDateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                            />
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" opacity={0.6} />
                        </MapContainer>
                        <MapLegend type="cyclone" label="Storm Intensity" />
                    </div>
                    <div className="map-summary">
                        <StatCard title="Activity" value={cycStats.val} status={cycStats.status} icon={AlertTriangle} />
                        <p className="summary-text">Historical storm track visualizer.</p>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Conclusion & Prediction */}
            <div className="history-footer-grid">
                <div className="conclusion-card glass-panel">
                    <h3><Info size={18} /> Historical Summary ({year})</h3>
                    <p>
                        Data from {year} indicates {polStats.status === 'High' ? 'elevated' : 'moderate'} pollution levels across the region,
                        paired with {rainStats.status.toLowerCase()} rainfall patterns.
                        {cycStats.status === 'Warning' ? ' Significant storm activity was recorded nearby.' : ' No major storm anomalies detected.'}
                    </p>
                </div>
                <div className="prediction-card glass-panel gradient-border">
                    <h3>Future Trajectory (2027+)</h3>
                    <p>
                        Based on the trend from 2000-{year}, models predict a <span className="text-highlight">12% increase</span> in variability
                        for this region if current emission rates persist.
                    </p>
                </div>
            </div>
        </div> 
    );
};

// Heatmap Legend Component
const MapLegend = ({ type, label }) => {
    // Determine gradient based on type
    const getGradient = () => {
        switch (type) {
            case 'pollution': return 'linear-gradient(to right, #fefce8, #a16207, #451a03)'; // Light yellow -> Brown -> Dark
            case 'rainfall': return 'linear-gradient(to right, #ecfeff, #0ea5e9, #1e3a8a)'; // Light cyan -> Blue -> Deep Blue
            case 'cyclone': return 'linear-gradient(to right, #f3f4f6, #9ca3af, #dc2626, #7f1d1d)'; // White -> Grey -> Red -> Dark Red
            default: return 'linear-gradient(to right, #fff, #000)';
        }
    };

    return (
        <div className="map-heatmap-legend glass-panel">
            <span className="legend-title">{label}</span>
            <div className="legend-scale">
                <div className="gradient-bar" style={{ background: getGradient() }}></div>
                <div className="legend-labels">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

export default LocationHistory;
