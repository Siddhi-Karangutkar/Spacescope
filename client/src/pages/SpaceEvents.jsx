import React, { useState, useEffect } from 'react';
import SunCalc from 'suncalc';
import * as Astronomy from 'astronomy-engine';
import { Plane, Star, Sun as SunIcon, Moon, MapPin, Watch, Eye, Globe, AlertOctagon, Lightbulb } from 'lucide-react';
import './SpaceEvents.css';

const SpaceEvents = () => {
    const [issPosition, setIssPosition] = useState(null);
    const [issPass, setIssPass] = useState(null);
    const [meteors, setMeteors] = useState([]);
    const [astronomy, setAstronomy] = useState(null);
    const [planets, setPlanets] = useState([]);
    const [solarFlareAlert, setSolarFlareAlert] = useState(null);
    const [weather, setWeather] = useState({ cloudCover: null, condition: 'Unknown', score: 0 });
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        // Get User Location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                console.warn("Location access denied, defaulting to equator.");
                setLocation({ lat: 0, lon: 0 });
            }
        );
    }, []);

    useEffect(() => {
        if (location.lat === null) return;

        const fetchData = async () => {
            try {
                // 1. ISS Position (Live)
                const issNowRes = await fetch(`${API_BASE}/iss-now`);
                const issNowData = await issNowRes.json();
                setIssPosition(issNowData.iss_position);

                // 2. ISS Pass (Prediction) - Only if we have valid coords
                if (location.lat !== 0) {
                    const issPassRes = await fetch(`${API_BASE}/iss-pass?lat=${location.lat}&lon=${location.lon}`);
                    const issPassData = await issPassRes.json();
                    setIssPass(issPassData.response?.[0]); // Next pass
                }

                // 3. Meteor Showers
                const meteorRes = await fetch(`${API_BASE}/meteor-showers`);
                const meteorData = await meteorRes.json();
                // Filter active showers
                const today = new Date();
                const activeMeteors = meteorData.filter(m => {
                    const start = new Date(today.getFullYear(), getMonthIndex(m.start.split(' ')[0]), parseInt(m.start.split(' ')[1]));
                    const end = new Date(today.getFullYear(), getMonthIndex(m.end.split(' ')[0]), parseInt(m.end.split(' ')[1]));

                    // Handle year crossover (e.g. Dec to Jan)
                    if (end < start) end.setFullYear(end.getFullYear() + 1);

                    return today >= start && today <= end;
                });
                setMeteors(activeMeteors);

                // 4. Astronomy (Local Calc)
                const date = new Date();
                const sunTimes = SunCalc.getTimes(date, location.lat, location.lon);
                const moonIllum = SunCalc.getMoonIllumination(date);

                setAstronomy({
                    sunrise: sunTimes.sunrise,
                    sunset: sunTimes.sunset,
                    moonPhase: moonIllum.phase, // 0 - 1
                    moonFraction: moonIllum.fraction
                });

                // 5. Planetary Positions (Astronomy Engine)
                const observer = new Astronomy.Observer(location.lat, location.lon, 0);
                const visiblePlanets = [];
                const planetList = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

                planetList.forEach(p => {
                    const body = Astronomy.Body[p];
                    const equator = Astronomy.Equator(body, date, observer, true, true);
                    const horizon = Astronomy.Horizon(date, observer, equator.ra, equator.dec, 'normal');

                    if (horizon.altitude > 0) { // Above horizon
                        visiblePlanets.push({ name: p, altitude: horizon.altitude, azimuth: horizon.azimuth });
                    }
                });
                setPlanets(visiblePlanets);

                // 6. Solar Flares (for Alert)
                const flareRes = await fetch(`${API_BASE}/solar-flares`);
                const flareData = await flareRes.json();
                const strongFlare = flareData.find(f => f.classType.startsWith('X') || (f.classType.startsWith('M') && parseInt(f.classType.slice(1)) >= 5));
                if (strongFlare) {
                    setSolarFlareAlert(strongFlare);
                }

                // 7. Weather / Cloud Cover (Open-Meteo) [NEW]
                if (location.lat !== 0) {
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=cloud_cover&hourly=cloud_cover&forecast_days=1`);
                    const weatherData = await weatherRes.json();

                    const currentCloud = weatherData.current?.cloud_cover || 0;

                    // Score Calculation (0-100)
                    // 100% Clouds = 0 score
                    // 0% Clouds = 80 score
                    // Moon impact = -30 if full, 0 if new

                    let baseScore = Math.max(0, 100 - currentCloud);
                    let moonPenalty = moonIllum.fraction * 30; // Max 30 points off for full moon
                    let finalScore = Math.max(0, Math.round(baseScore - moonPenalty));

                    let condition = "Perfect";
                    if (finalScore < 20) condition = "Poor Visibility";
                    else if (finalScore < 50) condition = "Fair";
                    else if (finalScore < 80) condition = "Good";

                    setWeather({ cloudCover: currentCloud, condition, score: finalScore });
                }

                setLoading(false);
            } catch (error) {
                console.warn("API Failed, loading dummy data for Space Events:", error);

                // DUMMY DATA INJECTION
                setIssPosition({ latitude: "28.6139", longitude: "77.2090" }); // Over New Delhi
                setIssPass({ risetime: Math.floor(Date.now() / 1000) + 3600, duration: 600 });
                setMeteors([
                    { name: "Perseids", peak: "Aug 12", rating: "Strong", start: "Jul 17", end: "Aug 24" },
                    { name: "Geminids", peak: "Dec 14", rating: "Strong", start: "Dec 4", end: "Dec 17" }
                ]);
                setSolarFlareAlert({ classType: "M1.2", beginTime: new Date().toISOString() });

                // Mock Astronomy for fallback
                setAstronomy({
                    sunrise: new Date().setHours(6, 0, 0),
                    sunset: new Date().setHours(18, 0, 0),
                    moonPhase: 0.5,
                    moonFraction: 0.5
                });
                setWeather({ cloudCover: 20, condition: 'Good (Simulated)', score: 75 });

                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s for ISS updates
        return () => clearInterval(interval);

    }, [location]);

    const getMonthIndex = (monthAbbr) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(monthAbbr);
    };

    const getMoonPhaseName = (phase) => {
        if (phase === 0 || phase === 1) return 'New Moon';
        if (phase < 0.25) return 'Waxing Crescent';
        if (phase === 0.25) return 'First Quarter';
        if (phase < 0.5) return 'Waxing Gibbous';
        if (phase === 0.5) return 'Full Moon';
        if (phase < 0.75) return 'Waning Gibbous';
        if (phase === 0.75) return 'Last Quarter';
        return 'Waning Crescent';
    };

    const formatTime = (isoTime) => {
        if (!isoTime) return '--:--';
        return new Date(isoTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div className="loading-screen">Scanning Local Sky...</div>;

    return (
        <div className="space-events-container">
            <h1 className="page-title glow-text">Space Events Notifier</h1>

            <div className="events-grid">

                {/* ISS Tracker */}
                <div className="glass-panel event-card iss-card">
                    <div className="card-header">
                        <Plane className="card-icon" style={{ transform: 'rotate(-45deg)' }} />
                        <h3>ISS Live Tracker</h3>
                    </div>
                    <div className="iss-map-placeholder">
                        <div className="earth-visual"></div>
                        <div className="iss-dot" style={{ animation: 'orbit 10s linear infinite' }}></div>
                        <p className="iss-coords">
                            Lat: {parseFloat(issPosition?.latitude).toFixed(2)} <br />
                            Lon: {parseFloat(issPosition?.longitude).toFixed(2)}
                        </p>
                    </div>
                    <div className="next-pass">
                        <Watch size={16} />
                        <span>Next Pass: {issPass ? new Date(issPass.risetime * 1000).toLocaleString() : 'Calculating path...'}</span>
                    </div>
                </div>

                {/* Sky Info */}
                <div className="glass-panel event-card">
                    <div className="card-header">
                        <SunIcon className="card-icon" />
                        <h3>Sky Watch</h3>
                    </div>
                    <div className="astro-stats">
                        <div className="astro-row">
                            <span>Sunrise</span>
                            <span>{formatTime(astronomy?.sunrise)}</span>
                        </div>
                        <div className="astro-row">
                            <span>Sunset</span>
                            <span>{formatTime(astronomy?.sunset)}</span>
                        </div>
                        <div className="astro-divider"></div>
                        <div className="astro-row">
                            <span>Moon Phase</span>
                            <div className="moon-visual">
                                <Moon size={16} fill={astronomy?.moonFraction > 0.5 ? 'currentColor' : 'none'} />
                                <span>{getMoonPhaseName(astronomy?.moonPhase)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meteor Showers */}
                <div className="glass-panel event-card wide-card">
                    <div className="card-header">
                        <Star className="card-icon" />
                        <h3>Active Meteor Showers</h3>
                    </div>
                    <div className="meteors-list">
                        {meteors.length > 0 ? meteors.map((shower, idx) => (
                            <div key={idx} className="meteor-item">
                                <div className="meteor-name">{shower.name}</div>
                                <div className="meteor-peak">Peak: {shower.peak}</div>
                                <div className="meteor-rating">
                                    Rating: <span className={shower.rating === 'Strong' ? 'text-green-400' : 'text-yellow-400'}>{shower.rating}</span>
                                </div>
                            </div>
                        )) : <p>No major showers active right now.</p>}
                    </div>
                </div>

                {/* Event Summary */}
                <div className="glass-panel event-card">
                    <div className="card-header">
                        <Eye className="card-icon" />
                        <h3>Tonight's Summary</h3>
                    </div>
                    <ul className="summary-list">
                        <li>Moon is {getMoonPhaseName(astronomy?.moonPhase)}.</li>
                        <li>{meteors.length} Meteor Shower(s) active.</li>
                        <li>ISS pass: {issPass ? 'Yes, be ready!' : 'Not visible soon.'}</li>
                        <li>Visible Planets: {planets.length > 0 ? planets.map(p => p.name).join(', ') : 'None right now'}.</li>
                    </ul>
                </div>

                {/* Planetary Positions */}
                <div className="glass-panel event-card">
                    <div className="card-header">
                        <Globe className="card-icon" />
                        <h3>Visible Planets</h3>
                    </div>
                    <div className="planets-list">
                        {planets.length > 0 ? planets.map((p, idx) => (
                            <div key={idx} className="planet-item">
                                <span className="planet-name">{p.name}</span>
                                <span className="planet-pos">Alt: {p.altitude.toFixed(1)}°</span>
                            </div>
                        )) : <p>No planets currently above the horizon.</p>}
                    </div>
                    <p className="card-hint">Look closely! Values &gt; 20° are best.</p>
                </div>

                {/* Stargazing Forecast (Weather + Moon) */}
                <div className="glass-panel event-card">
                    <div className="card-header">
                        <Moon className="card-icon" />
                        <h3>Stargazing Forecast</h3>
                    </div>
                    <div className="forecast-display">
                        <div className={`score-circle ${weather.score >= 80 ? 'good' : weather.score >= 50 ? 'fair' : 'poor'}`}>
                            <span className="score-val">{weather.score}</span>
                            <span className="score-label">Visibility</span>
                        </div>
                        <div className="forecast-details">
                            <div className="f-row">
                                <span>Status:</span>
                                <span className="highlight">{weather.condition}</span>
                            </div>
                            <div className="f-row">
                                <span>Cloud Cover:</span>
                                <span>{weather.cloudCover}%</span>
                            </div>
                            <div className="f-row">
                                <span>Moon Brightness:</span>
                                <span>{Math.round(astronomy?.moonFraction * 100)}%</span>
                            </div>
                            <p className="prediction-text">
                                {weather.score > 70 ? "Great night for telescopes!" : "Clouds or Moon may interfere."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Viewing Tips */}
                <div className="glass-panel event-card wide-card">
                    <div className="card-header">
                        <Lightbulb className="card-icon" />
                        <h3>Viewing Conditions & Tips</h3>
                    </div>
                    <div className="tips-grid">
                        <div className="tip-box">
                            <h4>Meteor Visibility</h4>
                            <p className={astronomy?.moonFraction > 0.5 ? 'text-yellow-400' : 'text-green-400'}>
                                {astronomy?.moonFraction > 0.5 ? 'Poor (Bright Moon)' : 'Excellent (Dark Sky)'}
                            </p>
                        </div>
                        <div className="tip-box">
                            <h4>Solar Activity</h4>
                            {solarFlareAlert ? (
                                <div className="text-red-500 flex items-center gap-2">
                                    <AlertOctagon size={16} />
                                    <span>STRONG FLARE: {solarFlareAlert.classType}</span>
                                </div>
                            ) : <span className="text-green-400">Normal</span>}
                        </div>
                        <div className="tip-box full-width">
                            <h4>Best Time to Watch</h4>
                            <p>For Meteors: After midnight when the radiant is high. <br />
                                For Planets: Early evening or pre-dawn (check altitude).</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SpaceEvents;
