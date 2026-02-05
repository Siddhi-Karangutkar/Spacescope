-- Sample notifications for testing
-- Run this after the server has created the tables

-- Urgent space alerts
INSERT INTO notifications (type, category, title, message, link, is_read) VALUES
('urgent', 'solar', '🌟 Major Solar Flare Detected!', 'X-class solar flare detected at 14:23 UTC. Potential radio blackouts expected in the next 2-4 hours.', '/dashboard', false),
('urgent', 'asteroid', '⚠️ Asteroid 2024 XR Approaching', 'Near-Earth asteroid will pass at 0.8 lunar distances on Feb 5, 2026. No threat to Earth.', '/dashboard', false),
('warning', 'weather', '🌪️ Geomagnetic Storm Warning', 'G2-class geomagnetic storm expected. Aurora may be visible at mid-latitudes tonight.', '/dashboard', false);

-- Informational notifications
INSERT INTO notifications (type, category, title, message, link, is_read) VALUES
('info', 'mission', '🚀 SpaceX Starship Launch Success', 'Starship successfully reached orbit and deployed 60 Starlink satellites.', '/dashboard', false),
('info', 'satellite', '🛰️ New Satellite Data Available', 'Latest Earth observation data from Sentinel-2 is now available for analysis.', '/dashboard', true),
('info', 'general', '📚 New Learning Module Added', 'Check out our new module on Exoplanet Detection Methods in the Career Path section.', '/career-path', true);

-- Sample email subscription
INSERT INTO email_subscriptions (email, preferences, is_active, unsubscribe_token) VALUES
('test@example.com', '{"solar": true, "asteroid": true, "satellite": false, "weather": true, "mission": true}', true, 'sample-unsubscribe-token-123')
ON CONFLICT (email) DO NOTHING;
