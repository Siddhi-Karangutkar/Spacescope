// Script to insert sample notifications into the database
// Run this with: node seed-notifications.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'spacescope',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function seedNotifications() {
    try {
        console.log('🌟 Seeding sample notifications...\n');

        // Check if notifications already exist
        const checkResult = await pool.query('SELECT COUNT(*) FROM notifications');
        const existingCount = parseInt(checkResult.rows[0].count);

        console.log(`📊 Current notifications in database: ${existingCount}`);

        // Insert sample notifications
        const notifications = [
            {
                type: 'urgent',
                category: 'solar',
                title: '🌟 Major Solar Flare Detected!',
                message: 'X-class solar flare detected at 14:23 UTC. Potential radio blackouts expected in the next 2-4 hours.',
                link: '/dashboard',
                is_read: false
            },
            {
                type: 'urgent',
                category: 'asteroid',
                title: '⚠️ Asteroid 2024 XR Approaching',
                message: 'Near-Earth asteroid will pass at 0.8 lunar distances on Feb 5, 2026. No threat to Earth.',
                link: '/dashboard',
                is_read: false
            },
            {
                type: 'warning',
                category: 'weather',
                title: '🌪️ Geomagnetic Storm Warning',
                message: 'G2-class geomagnetic storm expected. Aurora may be visible at mid-latitudes tonight.',
                link: '/dashboard',
                is_read: false
            },
            {
                type: 'info',
                category: 'mission',
                title: '🚀 SpaceX Starship Launch Success',
                message: 'Starship successfully reached orbit and deployed 60 Starlink satellites.',
                link: '/dashboard',
                is_read: false
            },
            {
                type: 'info',
                category: 'satellite',
                title: '🛰️ New Satellite Data Available',
                message: 'Latest Earth observation data from Sentinel-2 is now available for analysis.',
                link: '/dashboard',
                is_read: true
            },
            {
                type: 'info',
                category: 'general',
                title: '📚 New Learning Module Added',
                message: 'Check out our new module on Exoplanet Detection Methods in the Career Path section.',
                link: '/career-path',
                is_read: true
            }
        ];

        let insertedCount = 0;

        for (const notification of notifications) {
            try {
                await pool.query(
                    `INSERT INTO notifications (type, category, title, message, link, is_read) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [notification.type, notification.category, notification.title,
                    notification.message, notification.link, notification.is_read]
                );
                insertedCount++;
                console.log(`✅ Added: ${notification.title}`);
            } catch (err) {
                // Ignore duplicate errors, continue with others
                if (err.code !== '23505') { // Not a unique violation
                    console.log(`⚠️  Skipped: ${notification.title}`);
                }
            }
        }

        // Insert sample email subscription
        try {
            await pool.query(
                `INSERT INTO email_subscriptions (email, preferences, is_active, unsubscribe_token) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (email) DO NOTHING`,
                [
                    'test@example.com',
                    JSON.stringify({
                        solar: true,
                        asteroid: true,
                        satellite: false,
                        weather: true,
                        mission: true
                    }),
                    true,
                    'sample-unsubscribe-token-123'
                ]
            );
            console.log('\n✅ Added sample email subscription');
        } catch (err) {
            console.log('⚠️  Email subscription already exists');
        }

        // Get final count
        const finalResult = await pool.query('SELECT COUNT(*) FROM notifications');
        const finalCount = parseInt(finalResult.rows[0].count);

        console.log('\n📊 Summary:');
        console.log(`   - Notifications added: ${insertedCount}`);
        console.log(`   - Total notifications: ${finalCount}`);
        console.log(`   - Unread notifications: ${notifications.filter(n => !n.is_read).length}`);

        console.log('\n🎉 Sample notifications seeded successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Start the client: cd ../client && npm start');
        console.log('   2. Look for the bell icon in the navbar');
        console.log('   3. You should see a badge with the unread count');
        console.log('   4. Click the bell to view notifications');

    } catch (error) {
        console.error('❌ Error seeding notifications:', error.message);
        console.error('\n💡 Make sure:');
        console.error('   1. PostgreSQL is running');
        console.error('   2. Database "spacescope" exists');
        console.error('   3. Server has been started at least once (to create tables)');
    } finally {
        await pool.end();
    }
}

// Run the seeding
seedNotifications();
