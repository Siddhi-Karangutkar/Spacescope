
import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    CloudRain,
    Thermometer,
    AlertTriangle,
    Sprout,
    Satellite,
    Map as MapIcon,
    Info,
    Droplets,
    Wind,
    Sun,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';
import './ClimateAgriculture.css';

// --- DATA CONSTANTS ---

// --- PROCEDURAL DATA GENERATION ---

const generateAgriData = (lat, lng, name) => {
    const absLat = Math.abs(lat);
    let stress = 'low';
    let risk = 'Stable Conditions';
    let crops = ['Wheat', 'Barley'];
    let details = { soilType: 'Loam', avgRainfall: '800mm', growingSeason: 'Apr - Oct' };

    // Tropical Zone
    if (absLat < 23.5) {
        stress = Math.random() > 0.6 ? 'high' : 'medium';
        risk = lat > 0 ? 'Monsoon Flooding' : 'Extreme Heat';
        crops = ['Rice', 'Sugarcane', 'Coconut', 'Coffee'];
        details = { soilType: 'Alluvial', avgRainfall: '1500mm+', growingSeason: 'Year-round' };
    }
    // Arid/Temperate Warm
    else if (absLat < 35) {
        stress = Math.random() > 0.5 ? 'high' : 'medium';
        risk = 'Water Scarcity & Drought';
        crops = ['Cotton', 'Grapes', 'Olives', 'Citrus'];
        details = { soilType: 'Sandy Loam', avgRainfall: '400mm', growingSeason: 'Feb - Nov' };
    }
    // Temperate Cold
    else {
        stress = Math.random() > 0.8 ? 'medium' : 'low';
        risk = 'Early Frost / Cold Snap';
        crops = ['Potatoes', 'Wheat', 'Rapeseed', 'Apples'];
        details = { soilType: 'Chernozem', avgRainfall: '600mm', growingSeason: 'May - Sep' };
    }

    return {
        id: `geo-${lat}-${lng}`,
        name: name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        stress,
        risk,
        crops,
        details
    };
};

const INITIAL_REGION = {
    id: 'mumbai-in',
    name: 'Mumbai, India',
    lat: 19.0760,
    lng: 72.8777,
    stress: 'medium',
    risk: 'Monsoon Flooding',
    crops: ['Rice', 'Vegetables', 'Coconut'],
    details: { soilType: 'Coastal Alluvial', avgRainfall: '2200mm', growingSeason: 'Year-round' }
};

// Generate somewhat realistic looking weather trends based on latitude roughly
const generateWeatherData = (lat) => {
    const isNorth = lat > 0;
    const baseTemp = Math.abs(lat) > 40 ? 10 : 25;

    return Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i; // 0=Jan
        // Simple seasonal curve
        let seasonFactor = Math.sin((monthIndex / 12) * Math.PI * 2 - (isNorth ? 1.5 : 4.5)); // Offset for hemisphere

        return {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
            rain: Math.max(10, Math.floor(Math.random() * 100 + 20 * seasonFactor)),
            temp: Math.floor(baseTemp + 10 * seasonFactor + Math.random() * 2),
            moisture: Math.max(20, Math.min(90, 50 + 20 * seasonFactor + (Math.random() * 10 - 5))),
            projectedProfit: Math.floor(5000 + (Math.random() * 2000) + (seasonFactor * 1500)),
            actualProfit: Math.floor(4500 + (Math.random() * 2500) + (seasonFactor * 1000))
        };
    });
};

const StressGauge = ({ stress }) => {
    // Convert stress to a visual rotation percentage for a gauge
    // Low = Green, Medium = Yellow, High = Red
    // Let's pretend a gauge from 0 to 100.
    let val = 25;
    let color = "#4ade80";
    let text = "OPTIMAL";

    if (stress === 'medium') { val = 65; color = "#facc15"; text = "WARNING"; }
    if (stress === 'high') { val = 90; color = "#ef4444"; text = "CRITICAL"; }

    return (
        <div className="stress-gauge-container">
            <div className={`stress-circle stress-${stress}`}>
                {/* This would be an SVG in a real polished app, but CSS semi-circle works for now */}
                <div className="stress-fill" style={{
                    transform: `rotate(${val * 1.8 - 180}deg)`, // 180 degrees correspond to 100%
                    background: color
                }}></div>
            </div>
            <div className="stress-value-text">
                <span className="stress-number">{val}%</span>
                <span className="stress-status" style={{ color }}>{text}</span>
            </div>
        </div>
    );
};

const ClimateAgriculture = () => {
    const [selectedRegion, setSelectedRegion] = useState(INITIAL_REGION);
    const [searchTerm, setSearchTerm] = useState(INITIAL_REGION.name);
    const [filteredRegions, setFilteredRegions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(generateWeatherData(INITIAL_REGION.lat));
    const searchRef = useRef(null);
    const debounceTimer = useRef(null);

    useEffect(() => {
        // Update data when region changes (simulating API fetch)
        setWeatherData(generateWeatherData(selectedRegion.lat));
        setSearchTerm(selectedRegion.name);
    }, [selectedRegion]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (value.trim().length > 2) {
            setIsLoading(true);
            debounceTimer.current = setTimeout(async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`);
                    const data = await response.json();

                    const suggestions = data.map(item => ({
                        id: item.place_id,
                        name: item.display_name,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lon),
                        // Add procedural agri data instantly
                        ...generateAgriData(item.lat, item.lon, item.display_name)
                    }));

                    setFilteredRegions(suggestions);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Geocoding failed:", error);
                } finally {
                    setIsLoading(false);
                }
            }, 600);
        } else {
            setFilteredRegions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (region) => {
        setSelectedRegion(region);
        setSearchTerm(region.name);
        setShowSuggestions(false);
    };

    return (
        <div className="climate-dashboard">
            <header className="climate-header">
                <div>
                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>SPACESCOPE INTELLIGENCE</span>
                    <h1>Agri-Climate Monitor</h1>
                    <p style={{ color: '#94a3b8', maxWidth: '600px' }}>
                        Real-time satellite monitoring of global agricultural hotspots.
                        Analyze crop health, moisture levels, and climate risks using multi-spectral orbital data.
                    </p>
                </div>

                <div className="region-selector-container">
                    <label className="region-label">Search Target Zone</label>
                    <div className="autocomplete-wrapper" ref={searchRef}>
                        <input
                            type="text"
                            className="region-selector-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                            placeholder="Search globally (e.g. London, Tokyo)..."
                        />
                        {isLoading && <div className="search-loader">Scanning Global Nodes...</div>}
                        {showSuggestions && filteredRegions.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredRegions.map(r => (
                                    <li
                                        key={r.id}
                                        onClick={() => handleSuggestionClick(r)}
                                        className="suggestion-item"
                                        title={r.name}
                                    >
                                        <div className="suggestion-name">{r.name}</div>
                                        <div className="suggestion-risk">{r.risk}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </header>

            <div className="climate-grid">

                {/* Soil Moisture Map Card */}
                <div className="dashboard-card map-card">
                    <div className="map-header">
                        <div className="card-title">
                            <MapIcon size={18} className="text-blue-400" />
                            <span>Satellite Moisture & Vegetation Map</span>
                        </div>
                    </div>

                    <div className="map-placeholder">
                        <MapContainer
                            center={[selectedRegion.lat, selectedRegion.lng]}
                            zoom={7}
                            style={{ height: '100%', width: '100%' }}
                            key={selectedRegion.id}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; CARTO'
                            />

                            {/* Main Region Market */}
                            <CircleMarker
                                center={[selectedRegion.lat, selectedRegion.lng]}
                                pathOptions={{
                                    color: selectedRegion.stress === 'high' ? '#ef4444' : selectedRegion.stress === 'medium' ? '#facc15' : '#4ade80',
                                    fillColor: selectedRegion.stress === 'high' ? '#ef4444' : selectedRegion.stress === 'medium' ? '#facc15' : '#4ade80',
                                    fillOpacity: 0.2,
                                    weight: 2
                                }}
                                radius={50}
                            >
                                <Popup className="custom-popup">
                                    <strong>{selectedRegion.name}</strong><br />
                                    Status: {selectedRegion.stress.toUpperCase()}
                                </Popup>
                            </CircleMarker>

                            {/* Simulated Field Polygons (Just decoration for "beauty") */}
                            <CircleMarker center={[selectedRegion.lat + 0.1, selectedRegion.lng + 0.1]} radius={10} pathOptions={{ color: 'white', opacity: 0.3, fillOpacity: 0.1 }} />
                            <CircleMarker center={[selectedRegion.lat - 0.15, selectedRegion.lng - 0.05]} radius={15} pathOptions={{ color: 'white', opacity: 0.3, fillOpacity: 0.1 }} />
                        </MapContainer>

                        <div className="map-overlay-detail">
                            <div className="detail-row">
                                <span className="detail-label">Surface Soil Moisture</span>
                                <span className="detail-val">
                                    {selectedRegion.stress === 'low' ? '0.35 m³/m³' : selectedRegion.stress === 'medium' ? '0.22 m³/m³' : '0.12 m³/m³'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Vegetation Index (NDVI)</span>
                                <span className="detail-val">
                                    {selectedRegion.stress === 'low' ? '0.78 (Native)' : selectedRegion.stress === 'medium' ? '0.55 (Fair)' : '0.32 (Poor)'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Precipitation (24h)</span>
                                <span className="detail-val">0.0 mm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crop Stress & Details */}
                <div className="dashboard-card stress-card">
                    <div className="card-title">
                        <Sprout size={18} className="text-green-400" />
                        <span>Crop Health Analytics</span>
                    </div>

                    <StressGauge stress={selectedRegion.stress} />

                    <div className="crop-tags">
                        {selectedRegion.crops.map(c => (
                            <span key={c} className="crop-tag">{c}</span>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                        <div className="risk-item">
                            <span><AlertTriangle size={14} style={{ display: 'inline', marginRight: 5 }} /> Primary Concern</span>
                            <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>{selectedRegion.risk}</span>
                        </div>
                    </div>

                    <div className="micro-card">
                        <span className="micro-card-title"><Satellite size={14} /> SATELLITE INSIGHT</span>
                        <p>
                            Multi-spectral analysis indicates {selectedRegion.stress === 'high' ? 'severe moisture deficit in root zones.' : 'healthy chlorophyll levels in canopy.'}
                            Predicted yield impact: <span style={{ color: selectedRegion.stress === 'high' ? '#f87171' : '#4ade80' }}>{selectedRegion.stress === 'high' ? '-15%' : '+5%'}</span>
                        </p>
                    </div>
                </div>

                {/* Rainfall & Temp Graph */}
                <div className="dashboard-card graph-card">
                    <div className="card-title">
                        <CloudRain size={18} className="text-blue-400" />
                        <span>Precipitation vs. Soil Moisture</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weatherData}>
                            <defs>
                                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" name="Rainfall (mm)" />
                            <Line type="monotone" dataKey="moisture" stroke="#4ade80" strokeWidth={2} dot={false} name="Soil Moisture Index" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Temperature Graph */}
                <div className="dashboard-card graph-card">
                    <div className="card-title">
                        <Thermometer size={18} className="text-orange-400" />
                        <span>Land Surface Temperature (LST)</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weatherData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} name="Temperature (°C)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Climate Risk Zones */}
                <div className="dashboard-card risk-card">
                    <div className="card-title">
                        <AlertTriangle size={18} className="text-yellow-400" />
                        <span>Forecasted Climate Risks & Recommendations</span>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="risk-grid">
                                <div className="risk-item">
                                    <span>Flood Probability</span>
                                    <span className="risk-level-badge risk-low">12% (Low)</span>
                                </div>
                                <div className="risk-item">
                                    <span>Heatwave Prediction</span>
                                    <span className={`risk-level-badge ${selectedRegion.stress === 'high' ? 'risk-high' : 'risk-medium'}`}>
                                        {selectedRegion.stress === 'high' ? 'High (>5 days)' : 'Moderate'}
                                    </span>
                                </div>
                                <div className="risk-item">
                                    <span>Pest Susceptibility</span>
                                    <span className="risk-level-badge risk-medium">Moderate</span>
                                </div>
                                <div className="risk-item">
                                    <span>Wind Erosion Risk</span>
                                    <span className="risk-level-badge risk-low">Stable</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Satellite size={16} /> AI-Driven Mitigation Strategies
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'start', gap: '12px' }}>
                                    <div style={{ background: 'rgba(74, 222, 128, 0.2)', padding: '8px', borderRadius: '8px' }}><Droplets size={18} color="#4ade80" /></div>
                                    <div>
                                        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>Irrigation Optimization</strong>
                                        Switch to drip irrigation to conserve 40% water during upcoming dry spell.
                                    </div>
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'start', gap: '12px' }}>
                                    <div style={{ background: 'rgba(250, 204, 21, 0.2)', padding: '8px', borderRadius: '8px' }}><Sprout size={18} color="#facc15" /></div>
                                    <div>
                                        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>Crop Cycle Adjustment</strong>
                                        Deploy heat-resistant seed varieties for next planting cycle ({selectedRegion.details.growingSeason}).
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Economic Impact / Farm Profits Card */}
                <div className="dashboard-card economic-card">
                    <div className="card-title">
                        <DollarSign size={18} className="text-yellow-400" />
                        <span>Economic Yield & Profit Forecast</span>
                    </div>

                    <div className="economic-summary">
                        <div className="econ-stat">
                            <span className="econ-label">Estimated Annual Profit</span>
                            <span className="econ-val">$ {selectedRegion.stress === 'high' ? '42,500' : selectedRegion.stress === 'medium' ? '68,200' : '94,800'}</span>
                            <span className={`econ-trend ${selectedRegion.stress === 'high' ? 'down' : 'up'}`}>
                                {selectedRegion.stress === 'high' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                {selectedRegion.stress === 'high' ? '-12.4%' : '+5.2%'} vs Last Year
                            </span>
                        </div>
                        <div className="econ-stat">
                            <span className="econ-label">Resource Efficiency</span>
                            <span className="econ-val">{selectedRegion.stress === 'high' ? '64%' : '88%'}</span>
                            <div className="efficiency-bar">
                                <div className="efficiency-fill" style={{ width: selectedRegion.stress === 'high' ? '64%' : '88%', background: selectedRegion.stress === 'high' ? '#f87171' : '#4ade80' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="profit-chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weatherData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', color: '#fff' }}
                                />
                                <Legend iconType="rect" />
                                <Bar dataKey="projectedProfit" fill="#3b82f6" name="Projected ($)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actualProfit" fill="#facc15" name="Actual ($)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="micro-card economics-insight">
                        <span className="micro-card-title"><Activity size={14} /> ECONOMIC GUARD</span>
                        <p>
                            Estimated loss due to {selectedRegion.risk}:
                            <span style={{ color: '#f87171', marginLeft: '5px', fontWeight: 'bold' }}>
                                $ {selectedRegion.stress === 'high' ? '12,400' : '2,100'}
                            </span>.
                            Satellites suggest adjusting insurance premiums based on 30-day volatility.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClimateAgriculture;
