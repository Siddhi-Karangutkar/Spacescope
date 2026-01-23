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

// Helper to convert NOAA DSCOVR array-of-arrays to objects
const formatDSCVR = (data) => {
    if (!data || !Array.isArray(data) || data.length < 2) return [];
    const headers = data[0];
    return data.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
    });
};

// Proxy Routes
const fetchNOAA = async (url) => {
    return axios.get(url, {
        headers: {
            'User-Agent': 'SpaceScope/1.0 (Contact: space-labs@googledemo.com)'
        },
        timeout: 10000
    });
};

app.get('/api/solar-wind', async (req, res) => {
    try {
        const response = await fetchNOAA('https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json');
        res.json(formatDSCVR(response.data));
    } catch (error) {
        console.error('Error fetching solar wind:', error.message);
        res.status(500).json({ error: 'Failed to fetch solar wind data', message: error.message });
    }
});

app.get('/api/magnetic-field', async (req, res) => {
    try {
        const response = await fetchNOAA('https://services.swpc.noaa.gov/products/solar-wind/mag-5-minute.json');
        res.json(formatDSCVR(response.data));
    } catch (error) {
        console.error('Error fetching magnetic field:', error.message);
        res.status(500).json({ error: 'Failed to fetch magnetic field data', message: error.message });
    }
});

app.get('/api/k-index', async (req, res) => {
    try {
        const response = await fetchNOAA('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching K-index:', error.message);
        res.status(500).json({ error: 'Failed to fetch K-index data', message: error.message });
    }
});

app.get('/api/proton-flux', async (req, res) => {
    try {
        const response = await fetchNOAA('https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching proton flux:', error.message);
        res.status(500).json({ error: 'Failed to fetch proton flux data' });
    }
});

app.get('/api/solar-flares', async (req, res) => {
    try {
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        const startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        const response = await fetchNOAA(`https://kauai.ccmc.gsfc.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching solar flares:', error.message);
        // Return empty array instead of error - flares are optional
        res.json([]);
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
        // Switching to wheretheiss.at for better reliability
        const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
        // Map to expected format if needed, but the original frontend might expect open-notify format
        // Open-notify: { iss_position: { latitude, longitude }, message: "success", timestamp: ... }
        // Wheretheiss: { latitude, longitude, ... }
        const data = response.data;
        res.json({
            iss_position: {
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString()
            },
            message: "success",
            timestamp: data.timestamp
        });
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
        console.error('Error fetching ISS pass:', error.message);
        // Return 503 to signal service unavailability specifically
        res.status(503).json({ error: 'ISS Pass prediction service is currently offline' });
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
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startStr = today.toISOString().split('T')[0];
        const endStr = tomorrow.toISOString().split('T')[0];

        // Fetching today and tomorrow for a better radar view
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${endStr}&api_key=DEMO_KEY`);
        res.json(response.data);
    } catch (error) {
        console.warn('NASA API Throttled, providing simulation data');
        // Fallback to simulation data instead of empty objects
        const mockData = {
            element_count: 3,
            near_earth_objects: {
                "2026-01-23": [
                    {
                        id: "MOCK_01",
                        name: "(SIMULATION) 2011 AG5",
                        is_potentially_hazardous_asteroid: true,
                        estimated_diameter: { kilometers: { estimated_diameter_min: 0.14, estimated_diameter_max: 0.23 } },
                        close_approach_data: [{
                            close_approach_date: "2026-01-23",
                            relative_velocity: { kilometers_per_hour: "54200" },
                            miss_distance: { kilometers: "1850000" }
                        }]
                    },
                    {
                        id: "MOCK_02",
                        name: "(SIMULATION) 2024 BX1",
                        is_potentially_hazardous_asteroid: false,
                        estimated_diameter: { kilometers: { estimated_diameter_min: 0.05, estimated_diameter_max: 0.08 } },
                        close_approach_data: [{
                            close_approach_date: "2026-01-23",
                            relative_velocity: { kilometers_per_hour: "42000" },
                            miss_distance: { kilometers: "32000000" }
                        }]
                    },
                    {
                        id: "MOCK_03",
                        name: "(SIMULATION) Apophis",
                        is_potentially_hazardous_asteroid: true,
                        estimated_diameter: { kilometers: { estimated_diameter_min: 0.31, estimated_diameter_max: 0.45 } },
                        close_approach_data: [{
                            close_approach_date: "2026-01-23",
                            relative_velocity: { kilometers_per_hour: "108000" },
                            miss_distance: { kilometers: "31000" }
                        }]
                    }
                ]
            },
            status: "Simulation Mode (NASA API Throttled)"
        };
        res.status(200).json(mockData);
    }
});

// Asteroid Lookup Proxy (Specific ID)
app.get('/api/asteroid/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (id.startsWith('MOCK_')) {
            // Return simulation details for mock IDs
            return res.json({
                name: id === 'MOCK_01' ? "2011 AG5" : id === 'MOCK_03' ? "Apophis" : "2024 BX1",
                designation: id,
                orbital_data: {
                    orbit_id: "SIM-882",
                    orbit_class: { orbit_class_type: "APO", orbit_class_description: "Apollo-class (Simulated)" },
                    minimum_orbit_intersection: "0.0002"
                }
            });
        }
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
        const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=10');
        res.json(response.data);
    } catch (error) {
        console.warn('Upcoming launches throttled, using simulation');
        res.json({
            results: [
                {
                    id: 'u-sim-1',
                    name: '(SIMULATION) Artemis II',
                    status: { name: 'Scheduled' },
                    net: '2025-09-01T12:00:00Z',
                    mission: { description: 'First crewed flight of SLS/Orion around the Moon.', type: 'Lunar' },
                    launch_service_provider: { name: 'NASA' },
                    pad: { location: { name: 'Kennedy Space Center, FL' } },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Artemis_1_launch_SLS_liftoff_closeup.jpg/800px-Artemis_1_launch_SLS_liftoff_closeup.jpg'
                }
            ]
        });
    }
});

app.get('/api/launches/previous', async (req, res) => {
    try {
        const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/previous/?limit=10');
        res.json(response.data);
    } catch (error) {
        console.warn('Previous launches throttled, using simulation');
        res.json({
            results: [
                {
                    id: 'p-sim-1',
                    name: '(SIMULATION) Chandrayaan-3',
                    status: { name: 'Success' },
                    net: '2023-07-14T09:05:00Z',
                    mission: { description: 'ISRO\'s third lunar exploration mission.', type: 'Lunar' },
                    launch_service_provider: { name: 'ISRO' },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Chandrayaan-3_Launch.jpg/800px-Chandrayaan-3_Launch.jpg'
                }
            ]
        });
    }
});

app.get('/api/space-events', async (req, res) => {
    try {
        const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/event/upcoming/?limit=5');
        res.json(response.data);
    } catch (error) {
        res.json({ results: [] });
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

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Explicit error handling for the server
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`ERROR: Port ${PORT} is already in use by another process.`);
        process.exit(1);
    } else {
        console.error('Server Error:', error);
    }
});

// Global Error Handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('FATAL ERROR (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL ERROR (Unhandled Rejection):', reason);
});
