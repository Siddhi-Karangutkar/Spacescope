import React, { useState, useEffect } from 'react';
import { Rocket, Clock, Calendar, Globe, Satellite, Filter, ChevronRight, Play } from 'lucide-react';
import './Missions.css';

const Missions = () => {
    const [launches, setLaunches] = useState([]);
    const [nextLaunch, setNextLaunch] = useState(null);
    const [filter, setFilter] = useState('ALL'); // ALL, SPACEX, ISRO, MOON, MARS
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loading, setLoading] = useState(true);

    const HISTORICAL_MISSIONS = [
        {
            id: 'h1',
            name: 'Apollo 11',
            status: { name: 'Success' },
            net: '1969-07-16T13:32:00Z',
            mission: { description: 'First humans land on the Moon.', type: 'Lunar' },
            launch_service_provider: { name: 'NASA' },
            isHistory: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/i/i5/Saturn_V_launch_-_Apollo_11.jpg/800px-Saturn_V_launch_-_Apollo_11.jpg'
        },
        {
            id: 'h2',
            name: 'Chandrayaan-3',
            status: { name: 'Success' },
            net: '2023-07-14T09:05:00Z',
            mission: { description: 'ISRO\'s third lunar exploration mission.', type: 'Lunar' },
            launch_service_provider: { name: 'ISRO' },
            isHistory: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Chandrayaan-3_Launch.jpg/800px-Chandrayaan-3_Launch.jpg'
        },
        {
            id: 'h3',
            name: 'Mars 2020 (Perseverance)',
            status: { name: 'Success' },
            net: '2020-07-30T11:50:00Z',
            mission: { description: 'Seeking signs of ancient life on Mars.', type: 'Mars' },
            launch_service_provider: { name: 'NASA' },
            isHistory: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Mars_2020_Atlas_V_launch.jpg/800px-Mars_2020_Atlas_V_launch.jpg'
        },
        {
            id: 'h4',
            name: 'Voyager 1',
            status: { name: 'Success' },
            net: '1977-09-05T12:56:00Z',
            mission: { description: 'First probe to leave the solar system.', type: 'Deep Space' },
            launch_service_provider: { name: 'NASA' },
            isHistory: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Voyager_Titan_Centaur_launch.jpg/800px-Voyager_Titan_Centaur_launch.jpg'
        },
        {
            id: 'h5',
            name: 'JWST Launch',
            status: { name: 'Success' },
            net: '2021-12-25T12:20:00Z',
            mission: { description: 'Next generation space telescope.', type: 'Astrophysics' },
            launch_service_provider: { name: 'ESA/NASA' },
            isHistory: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ariane_5_VA256_launch_JWST_%28clean%29.jpg/800px-Ariane_5_VA256_launch_JWST_%28clean%29.jpg'
        },
        {
            id: 'h6',
            name: 'Mangalyaan (MOM)',
            status: { name: 'Success' },
            net: '2013-11-05T09:08:00Z',
            mission: { description: 'India\'s first Mars orbiter mission.', type: 'Mars' },
            launch_service_provider: { name: 'ISRO' },
            isHistory: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/PSLV_C25_launch.jpg/600px-PSLV_C25_launch.jpg'
        }
    ];

    const DUMMY_UPCOMING = [
        {
            id: 'u1',
            name: 'Artemis II',
            status: { name: 'Scheduled' },
            net: '2025-09-01T12:00:00Z', // Future date
            mission: { description: 'First crewed flight of SLS/Orion around the Moon.', type: 'Lunar' },
            launch_service_provider: { name: 'NASA' },
            pad: { location: { name: 'Kennedy Space Center, FL' } },
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Artemis_1_launch_SLS_liftoff_closeup.jpg/800px-Artemis_1_launch_SLS_liftoff_closeup.jpg'
        },
        {
            id: 'u2',
            name: 'Starship Orbital Test 4',
            status: { name: 'Scheduled' },
            net: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
            mission: { description: 'Next integrated flight test of Starship.', type: 'Test Flight' },
            launch_service_provider: { name: 'SpaceX' },
            pad: { location: { name: 'Starbase, TX' } },
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Starship_Flight_2_%28cropped%29.jpg/800px-Starship_Flight_2_%28cropped%29.jpg'
        },
        {
            id: 'u3',
            name: 'Europa Clipper',
            status: { name: 'Scheduled' },
            net: '2024-10-10T16:00:00Z',
            mission: { description: 'Mission to study Jupiter\'s moon Europa.', type: 'Deep Space' },
            launch_service_provider: { name: 'NASA' },
            pad: { location: { name: 'Cape Canaveral, FL' } },
            image: null
        }
    ];

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchLaunches = async () => {
            try {
                // Fetch Upcoming
                let upcoming = [];
                try {
                    const res = await fetch(`${API_BASE}/launches/upcoming`);
                    const data = await res.json();
                    upcoming = data.results || [];
                } catch (e) {
                    console.warn("API failed, using dummy data");
                }

                // Merge API data with DUMMY_UPCOMING if API returns few/no results (for demo)
                // In a real app, you'd only use API, but for this "Portfolio" request, we allow mixing to ensure visuals.
                const mergedUpcoming = [...DUMMY_UPCOMING, ...upcoming];

                // Remove duplicates by ID just in case
                const uniqueUpcoming = Array.from(new Map(mergedUpcoming.map(item => [item.id, item])).values());

                const combined = [...HISTORICAL_MISSIONS, ...uniqueUpcoming].sort((a, b) => new Date(a.net) - new Date(b.net));

                setLaunches(combined);

                // Set Next Launch (First upcoming future launch)
                const future = uniqueUpcoming.filter(l => new Date(l.net) > new Date()).sort((a, b) => new Date(a.net) - new Date(b.net));
                if (future.length > 0) {
                    setNextLaunch(future[0]);
                } else if (uniqueUpcoming.length > 0) {
                    setNextLaunch(uniqueUpcoming[0]); // Fallback
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching launches:", error);
                setLoading(false);
            }
        };

        fetchLaunches();
    }, []);

    // Countdown Timer logic
    useEffect(() => {
        if (!nextLaunch) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const launchTime = new Date(nextLaunch.net).getTime();
            const distance = launchTime - now;

            if (distance < 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextLaunch]);

    const getFilteredLaunches = () => {
        if (filter === 'ALL') return launches;
        return launches.filter(l => {
            const provider = l.launch_service_provider?.name?.toLowerCase() || '';
            const desc = l.mission?.description?.toLowerCase() || '';
            const title = l.name?.toLowerCase() || '';

            if (filter === 'SPACEX') return provider.includes('spacex');
            if (filter === 'ISRO') return provider.includes('isro');
            if (filter === 'MOON') return desc.includes('moon') || desc.includes('lunar') || title.includes('moon');
            if (filter === 'MARS') return desc.includes('mars') || title.includes('mars');
            return true;
        });
    };

    if (loading) return <div className="loading-screen">Aligning Telemetry...</div>;

    const filtered = getFilteredLaunches();

    return (
        <div className="missions-container">
            {/* Hero: Next Launch Countdown */}
            {nextLaunch && (
                <div className="launch-hero" style={{
                    backgroundImage: nextLaunch.image ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url(${nextLaunch.image})` : undefined
                }}>
                    <div className="hero-content">
                        <div className="badge-live">NEXT MISSION</div>
                        <h1 className="hero-title">{nextLaunch.name}</h1>
                        <p className="hero-provider">{nextLaunch.launch_service_provider?.name}</p>

                        <div className="countdown-grid">
                            <div className="count-box">
                                <span className="val">{countdown.days}</span>
                                <span className="label">DAYS</span>
                            </div>
                            <div className="count-box">
                                <span className="val">{countdown.hours}</span>
                                <span className="label">HRS</span>
                            </div>
                            <div className="count-box">
                                <span className="val">{countdown.minutes}</span>
                                <span className="label">MIN</span>
                            </div>
                            <div className="count-box">
                                <span className="val">{countdown.seconds}</span>
                                <span className="label">SEC</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline Section */}
            <div className="timeline-section">
                <div className="timeline-header">
                    <h2>Mission Timeline</h2>
                    <div className="filters">
                        {['ALL', 'SPACEX', 'ISRO', 'MOON', 'MARS'].map(f => (
                            <button
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="timeline-track">
                    {filtered.map((mission, idx) => {
                        const isPast = new Date(mission.net) < new Date();
                        return (
                            <div key={mission.id} className={`timeline-card ${isPast ? 'past' : 'future'}`}>
                                <div className="timeline-marker">
                                    {isPast ? <div className="dot past"></div> : <Rocket className="icon-marker" size={16} />}
                                    <div className="line"></div>
                                </div>
                                <div className="card-content glass-panel">
                                    <div className="card-top">
                                        <span className={`status-badge ${mission.status?.name === 'Success' ? 'success' : 'pending'}`}>
                                            {mission.status?.name || 'Scheduled'}
                                        </span>
                                        <span className="mission-date">
                                            {new Date(mission.net).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="mission-name">{mission.name}</h3>
                                    <p className="mission-desc">{mission.mission?.description || "No mission description available."}</p>
                                    <div className="mission-meta">
                                        <div className="meta-item">
                                            <Globe size={14} />
                                            <span>{mission.launch_service_provider?.name}</span>
                                        </div>
                                        {mission.pad && (
                                            <div className="meta-item">
                                                <Satellite size={14} />
                                                <span>{mission.pad.location?.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Missions;
