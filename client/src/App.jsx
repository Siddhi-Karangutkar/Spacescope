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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cosmic-weather" element={<CosmicWeather />} />
              <Route path="/space-events" element={<SpaceEvents />} />
              <Route path="/asteroid-radar" element={<AsteroidRadar />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/earth-link" element={<EarthLink />} />
              <Route path="/community" element={<Community />} />
              <Route path="/cosmic-timeline" element={<CosmicTimeline />} />
            </Routes>
          </div>
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
