const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Get notifications for a user (or all if no user_id)
router.get('/', async (req, res) => {
    try {
        const { type, limit = 20, user_id } = req.query;

        let query = 'SELECT * FROM notifications WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (user_id) {
            query += ` AND (user_id = $${paramCount} OR user_id IS NULL)`;
            params.push(user_id);
            paramCount++;
        } else {
            query += ' AND user_id IS NULL';
        }

        if (type) {
            query += ` AND type = $${paramCount}`;
            params.push(type);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';
        query += ` LIMIT $${paramCount}`;
        params.push(parseInt(limit));

        const result = await pool.query(query, params);

        // Get unread count
        let unreadQuery = 'SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE';
        const unreadParams = [];

        if (user_id) {
            unreadQuery += ' AND (user_id = $1 OR user_id IS NULL)';
            unreadParams.push(user_id);
        } else {
            unreadQuery += ' AND user_id IS NULL';
        }

        const unreadResult = await pool.query(unreadQuery, unreadParams);
        const unreadCount = parseInt(unreadResult.rows[0].count);

        res.json({
            notifications: result.rows,
            unreadCount,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notifications as read
router.post('/mark-read', async (req, res) => {
    try {
        const { notificationIds } = req.body;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({ error: 'Invalid notification IDs' });
        }

        const query = `
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE id = ANY($1::int[])
            RETURNING id
        `;

        const result = await pool.query(query, [notificationIds]);

        res.json({
            success: true,
            updated: result.rows.length
        });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

// Subscribe to email notifications
router.post('/subscribe-email', async (req, res) => {
    try {
        const { email, preferences } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Generate unsubscribe token
        const unsubscribeToken = crypto.randomBytes(32).toString('hex');

        const query = `
            INSERT INTO email_subscriptions (email, preferences, unsubscribe_token)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) 
            DO UPDATE SET 
                preferences = $2,
                is_active = TRUE,
                unsubscribe_token = $3
            RETURNING id, email
        `;

        const result = await pool.query(query, [
            email,
            JSON.stringify(preferences || {}),
            unsubscribeToken
        ]);

        const subscription = result.rows[0];

        // Send welcome email (asynchronously)
        emailService.sendWelcomeEmail(email, preferences, unsubscribeToken)
            .catch(err => console.error('Failed to send welcome email:', err));

        res.json({
            success: true,
            subscription,
            message: 'Successfully subscribed to email notifications'
        });
    } catch (error) {
        console.error('Error subscribing to email:', error);
        res.status(500).json({ error: 'Failed to subscribe to email notifications' });
    }
});

// Unsubscribe from email notifications
router.post('/unsubscribe-email', async (req, res) => {
    try {
        const { email, token } = req.body;

        let query;
        let params;

        if (token) {
            query = 'UPDATE email_subscriptions SET is_active = FALSE WHERE unsubscribe_token = $1 RETURNING email';
            params = [token];
        } else if (email) {
            query = 'UPDATE email_subscriptions SET is_active = FALSE WHERE email = $1 RETURNING email';
            params = [email];
        } else {
            return res.status(400).json({ error: 'Email or token required' });
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({
            success: true,
            message: 'Successfully unsubscribed from email notifications'
        });
    } catch (error) {
        console.error('Error unsubscribing from email:', error);
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
});

// Create a new notification (admin/system only)
router.post('/send', async (req, res) => {
    try {
        const { type, category, title, message, link, user_id, contentType, extraData } = req.body;

        if (!type || !category || !title || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO notifications (user_id, type, category, title, message, link)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const result = await pool.query(query, [
            user_id || null,
            type,
            category,
            title,
            message,
            link || null
        ]);

        const notification = result.rows[0];
        // Add contentType to the notification object for the email service
        notification.contentType = contentType;

        // Emit for real-time browser alerts
        const io = req.app.get('io');
        if (io) {
            io.emit('new_notification', notification);
            console.log('📡 Notification emitted via socket:', notification.title);
        }

        // Broadcast email to all relevant subscribers (asynchronously)
        emailService.broadcastNotification(notification, extraData || {})
            .catch(err => console.error('Failed to broadcast email:', err));

        res.json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
});

// Test email endpoint
router.get('/test-email', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email query parameter required' });

        await emailService.sendEmail(
            email,
            '🧪 SpaceScope Test Email',
            '<p>This is a test email from <strong>SpaceScope</strong>. If you see this, your SMTP settings are configured correctly! 🚀</p>'
        );

        res.json({ success: true, message: `Test email sent to ${email}` });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ error: 'Failed to send test email. Check server logs for SMTP errors.' });
    }
});

// Subscribe to browser push notifications
router.post('/browser-subscribe', async (req, res) => {
    try {
        const { subscription, user_id } = req.body;

        // For now, just acknowledge the subscription
        // In production, you'd store the subscription details for web push
        res.json({
            success: true,
            message: 'Browser notifications enabled'
        });
    } catch (error) {
        console.error('Error subscribing to browser notifications:', error);
        res.status(500).json({ error: 'Failed to subscribe to browser notifications' });
    }
});

module.exports = router;
