const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('SpaceScope Server is Running!');
});

// Proxy Routes
app.get('/api/solar-wind', async (req, res) => {
    try {
        const response = await axios.get('https://services.swpc.noaa.gov/json/ace/swepam_1m.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching solar wind:', error.message);
        res.status(500).json({ error: 'Failed to fetch solar wind data' });
    }
});

app.get('/api/magnetic-field', async (req, res) => {
    try {
        const response = await axios.get('https://services.swpc.noaa.gov/json/ace/mag_1m.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching magnetic field:', error.message);
        res.status(500).json({ error: 'Failed to fetch magnetic field data' });
    }
});

app.get('/api/k-index', async (req, res) => {
    try {
        const response = await axios.get('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching K-index:', error.message);
        res.status(500).json({ error: 'Failed to fetch K-index data' });
    }
});

app.get('/api/proton-flux', async (req, res) => {
    try {
        const response = await axios.get('https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching proton flux:', error.message);
        res.status(500).json({ error: 'Failed to fetch proton flux data' });
    }
});

app.get('/api/solar-flares', async (req, res) => {
    try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const response = await axios.get(`https://kauai.ccmc.gsfc.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching solar flares:', error.message);
        res.status(500).json({ error: 'Failed to fetch solar flares' });
    }
});

app.get('/api/cme', async (req, res) => {
    try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const response = await axios.get(`https://kauai.ccmc.gsfc.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching CME:', error.message);
        res.status(500).json({ error: 'Failed to fetch CME data' });
    }
});

// ISS Proxies
app.get('/api/iss-now', async (req, res) => {
    try {
        const response = await axios.get('http://api.open-notify.org/iss-now.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching ISS position:', error.message);
        res.status(500).json({ error: 'Failed to fetch ISS position' });
    }
});

app.get('/api/iss-pass', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) return res.status(400).json({ error: 'Latitude and Longitude required' });

        const response = await axios.get(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`);
        res.json(response.data);
    } catch (error) {
        // Open Notify might error if location is weird or rate limit
        console.error('Error fetching ISS pass:', error.message);
        res.status(500).json({ error: 'Failed to fetch ISS pass data' });
    }
});

// Meteor Shower Proxy
app.get('/api/meteor-showers', async (req, res) => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/astronexus/MeteorShowerCatalog/master/catalog.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching meteor showers:', error.message);
        res.status(500).json({ error: 'Failed to fetch meteor shower data' });
    }
});

// Asteroid Proxy (NeoWS Feed)
app.get('/api/asteroids', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // Fetching just today's asteroids
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching asteroids:', error.message);
        res.status(500).json({ error: 'Failed to fetch asteroid data' });
    }
});

// Asteroid Lookup Proxy (Specific ID)
app.get('/api/asteroid/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=DEMO_KEY`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching asteroid ${req.params.id}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch asteroid details' });
    }
});

// Space Launch Proxy (The Space Devs LL2)
app.get('/api/launches/upcoming', async (req, res) => {
    try {
        // Using lldev endpoint often has 429s, let's try the standard API with strict caching if possible, 
        // or fall back to a reliable mirror. For this hacked wrapper, we'll try the public dev endpoint.
        const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=10');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching launches:', error.message);
        // Fallback or specific error handling
        res.status(500).json({ error: 'Failed to fetch launch data' });
    }
});

// NASA EONET Proxy (Natural Events)
app.get('/api/eonet', async (req, res) => {
    try {
        // Fetch active events (limit to recent days if needed, but default is active)
        const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v2.1/events?status=open&limit=20');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching EONET data:', error.message);
        res.status(500).json({ error: 'Failed to fetch natural events' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
