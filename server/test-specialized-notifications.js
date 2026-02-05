const axios = require('axios');

const API_URL = 'http://localhost:5002/api/notifications';

async function sendSpecializedNotifications() {
    try {
        console.log('🚀 Sending Specialized Notifications Test...');

        // 1. URGENT Desktop Notification
        console.log('\n🚨 Triggering Urgent Desktop Notification...');
        await axios.post(`${API_URL}/send`, {
            type: 'urgent',
            category: 'solar',
            title: 'URGENT: X-Class Solar Flare detected',
            message: 'A massive X-Class solar flare has just erupted. Potential radio blackouts in progress. Immediate shielding protocols recommended.',
            link: '/solar-vision'
        });

        // 2. PLANNING Email Notification
        console.log('\n📅 Triggering Planning Email Notification...');
        await axios.post(`${API_URL}/send`, {
            type: 'info',
            category: 'mission',
            title: 'Monthly Mission Planning: February 2026',
            message: 'Welcome to your February planning briefing. We have several key launch windows and celestial alignments approaching.',
            contentType: 'planning',
            extraData: {
                calendar: [
                    { date: 'Feb 12', event: 'Lunar Gateway Orbit Adjustment' },
                    { date: 'Feb 18', event: 'Perseid Meteor Shower Peak' },
                    { date: 'Feb 24', event: 'Artemis IV Pre-launch Briefing' }
                ],
                summary: 'February focuses on lunar orbital stabilization and preparing for the upcoming deep-space relay deployment.'
            }
        });

        // 3. EDUCATIONAL Email Notification
        console.log('\n🎓 Triggering Educational Academy Briefing...');
        await axios.post(`${API_URL}/send`, {
            type: 'info',
            category: 'general',
            title: 'Academy Briefing: The Physics of Nebula Formation',
            message: 'In this briefing, we explore how giant molecular clouds collapse to form the nurseries of stars.',
            contentType: 'educational',
            extraData: {
                detailedContent: 'Nebulae are often the birthplaces of stars. They consist of gas, chemical elements, and dust. When gravity causes a section of the nebula to collapse, it heats up and eventually forms a protostar.',
                funFact: 'The Pillars of Creation in the Eagle Nebula are actually composed of cool molecular hydrogen and dust that are being eroded by the light of nearby stars.'
            }
        });

        console.log('\n✅ Samples sent! Check your browser and email (if configured).');
    } catch (error) {
        if (error.response) {
            console.error(`❌ Server Error (${error.response.status}):`, error.response.data);
        } else if (error.request) {
            console.error('❌ Connection Error: No response received from server. Is the server running on port 5002?');
        } else {
            console.error('❌ Request Error:', error.message);
        }
    }
}

sendSpecializedNotifications();
