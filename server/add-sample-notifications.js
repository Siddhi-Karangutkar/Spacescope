// Quick script to add sample notifications via API
// Run this with: node add-sample-notifications.js

const http = require('http');

const notifications = [
    {
        type: 'urgent',
        category: 'solar',
        title: '🌟 Major Solar Flare Detected!',
        message: 'X-class solar flare detected at 14:23 UTC. Potential radio blackouts expected in the next 2-4 hours.',
        link: '/dashboard'
    },
    {
        type: 'urgent',
        category: 'asteroid',
        title: '⚠️ Asteroid 2024 XR Approaching',
        message: 'Near-Earth asteroid will pass at 0.8 lunar distances on Feb 5, 2026. No threat to Earth.',
        link: '/dashboard'
    },
    {
        type: 'warning',
        category: 'weather',
        title: '🌪️ Geomagnetic Storm Warning',
        message: 'G2-class geomagnetic storm expected. Aurora may be visible at mid-latitudes tonight.',
        link: '/dashboard'
    },
    {
        type: 'info',
        category: 'mission',
        title: '🚀 SpaceX Starship Launch Success',
        message: 'Starship successfully reached orbit and deployed 60 Starlink satellites.',
        link: '/dashboard'
    },
    {
        type: 'info',
        category: 'satellite',
        title: '🛰️ New Satellite Data Available',
        message: 'Latest Earth observation data from Sentinel-2 is now available for analysis.',
        link: '/dashboard'
    },
    {
        type: 'info',
        category: 'general',
        title: '📚 New Learning Module Added',
        message: 'Check out our new module on Exoplanet Detection Methods in the Career Path section.',
        link: '/career-path'
    }
];

async function addNotification(notification) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(notification);

        const options = {
            hostname: 'localhost',
            port: 5002,
            path: '/api/notifications/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(responseData));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function addAllNotifications() {
    console.log('🌟 Adding sample notifications via API...\n');

    let successCount = 0;
    let failCount = 0;

    for (const notification of notifications) {
        try {
            await addNotification(notification);
            console.log(`✅ Added: ${notification.title}`);
            successCount++;
        } catch (error) {
            console.log(`❌ Failed: ${notification.title}`);
            console.log(`   Error: ${error.message}`);
            failCount++;
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully added: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);

    if (successCount > 0) {
        console.log('\n🎉 Sample notifications added successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Open your browser to http://localhost:3000');
        console.log('   2. Look for the bell icon (🔔) in the navbar');
        console.log('   3. You should see a red badge with the number of notifications');
        console.log('   4. Click the bell to view your notifications!');
    } else {
        console.log('\n⚠️  No notifications were added.');
        console.log('💡 Make sure the server is running on port 5002');
    }
}

addAllNotifications().catch(error => {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure the server is running: cd server && npm start');
    console.log('   2. Check that the server is on port 5002');
    console.log('   3. Verify the database tables were created');
});
