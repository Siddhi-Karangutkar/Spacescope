import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CosmicWeather from './pages/CosmicWeather';
import SpaceEvents from './pages/SpaceEvents';
import AsteroidRadar from './pages/AsteroidRadar';
import Missions from './pages/Missions';
import Learn from './pages/Learn';
import EarthLink from './pages/EarthLink';
import Community from './pages/Community';
import CosmicTimeline from './pages/CosmicTimeline';

import Chatbot from './components/Chatbot';
import InstructorVerification from './pages/InstructorVerification';
import SpaceRisk from './pages/SpaceRisk';
import SatelliteView from './pages/SatelliteView';
import AdminPortal from './pages/AdminPortal';
import InstructorConnect from './pages/InstructorConnect';
import InstructorPortal from './pages/InstructorPortal';

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("REACT CRASH:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#000', color: '#ff4b2b', height: '100vh', fontFamily: 'monospace' }}>
          <h1>ASTRO-ERROR DETECTED</h1>
          <p>The mission encountered an unexpected anomaly.</p>
          <pre style={{ background: '#111', padding: '20px', borderRadius: '8px' }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>REBOOT SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  React.useEffect(() => {
    console.log("🚀 SpaceScope: Systems Online (App Mounted)");
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/space-risk" element={<SpaceRisk />} /> {/* Phase 6 */}
                <Route path="/satellite-view" element={<SatelliteView />} /> {/* Phase 9 */}
                <Route path="/cosmic-weather" element={<CosmicWeather />} />
                <Route path="/space-events" element={<SpaceEvents />} />
                <Route path="/asteroid-radar" element={<AsteroidRadar />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/earth-link" element={<EarthLink />} />
                <Route path="/community" element={<Community />} />
                <Route path="/cosmic-timeline" element={<CosmicTimeline />} />
                <Route path="/instructor-verification" element={<InstructorVerification />} />
                <Route path="/instructor-connect" element={<InstructorConnect />} />
                <Route path="/instructor/portal" element={<InstructorPortal />} />
                <Route path="/admin" element={<AdminPortal />} />

              </Routes>
            </ErrorBoundary>
          </div>
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
