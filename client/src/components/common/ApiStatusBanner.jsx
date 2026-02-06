import React from 'react';
import { ShieldAlert, RefreshCw, Clock } from 'lucide-react';
import './ApiStatusBanner.css';

const ApiStatusBanner = ({ status }) => {
    return null; // Banner disabled as per user request

    if (!status || status.live) return null;

    const formattedTime = status.timestamp
        ? new Date(status.timestamp).toLocaleString()
        : 'Unknown Time';

    return (
        <div className="api-status-banner glass-panel warning-mode">
            <div className="banner-content">
                <div className="banner-icon">
                    <ShieldAlert size={18} className="pulse-amber" />
                </div>
                <div className="banner-text">
                    <span className="warning-label">GRACEFUL DEGRADATION ACTIVE:</span>
                    <span className="warning-message">
                        Live telemetry connection failed. Viewing last stabilized data cache.
                    </span>
                    <div className="cache-timestamp">
                        <Clock size={12} />
                        <span>Data stabilized at: {formattedTime}</span>
                    </div>
                </div>
                <button
                    className="retry-hint"
                    onClick={() => window.location.reload()}
                    title="Attempt to reconnect to orbital sensors"
                >
                    <RefreshCw size={14} />
                    <span>RECONNECT</span>
                </button>
            </div>
        </div>
    );
};

export default ApiStatusBanner;
