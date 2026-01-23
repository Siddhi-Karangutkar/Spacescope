import React from 'react';
import SmartTerm from '../components/SmartTerm';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>SpaceScope Dashboard</h1>
            <p>Welcome to your cosmic control center. Modules loading...</p>
            {/* Placeholder for future widgets */}
            <div className="dashboard-grid">
                {/* NEW FEATURE: Space Risk */}
                <div className="glass-panel widget weather-summary-widget" style={{ borderColor: '#22A6B3', boxShadow: '0 0 10px rgba(34, 166, 179, 0.1)' }}>
                    <h3>Space Risk Scanner</h3>
                    <div className="summary-status text-cyan-400">Analysis Ready</div>
                    <a href="/space-risk" className="view-details-link">Analyze City →</a>
                </div>
                {/* NEW FEATURE: Satellite Vision */}
                <div className="glass-panel widget weather-summary-widget" style={{ borderColor: '#2ecc71', boxShadow: '0 0 10px rgba(46, 204, 113, 0.1)' }}>
                    <h3>Satellite Vision</h3>
                    <div className="summary-status text-green-400">Live NASA Feed</div>
                    <a href="/satellite-view" className="view-details-link">Monitor Orbit →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3><SmartTerm term="Space Weather" /></h3>
                    <div className="summary-status text-green-400">Loading...</div>
                    <a href="/cosmic-weather" className="view-details-link">View Full Report →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3>Sky Events</h3>
                    <div className="summary-status text-blue-400">Night Watch</div>
                    <a href="/space-events" className="view-details-link">Check Visibility →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3>Asteroid Radar</h3>
                    <div className="summary-status text-yellow-400">Active Scan</div>
                    <a href="/asteroid-radar" className="view-details-link">Monitor NEOs →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3>Missions</h3>
                    <div className="summary-status text-purple-400">T-Minus 2 Days</div>
                    <a href="/missions" className="view-details-link">Launch Pad →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3>Learning Zone</h3>
                    <div className="summary-status text-green-400">Ready to Launch</div>
                    <a href="/learn" className="view-details-link">Start Learning →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3>EarthLink</h3>
                    <div className="summary-status text-blue-400">Monitoring Planet</div>
                    <a href="/earth-link" className="view-details-link">View Impact →</a>
                </div>
                <div className="glass-panel widget weather-summary-widget">
                    <h3>Crew Quarters</h3>
                    <div className="summary-status text-orange-400">Join the Mission</div>
                    <a href="/community" className="view-details-link">Community Hub →</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
