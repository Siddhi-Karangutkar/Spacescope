const nodemailer = require('nodemailer');
const pool = require('../db');
const templates = require('./emailTemplates');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = null;
        this.init();
    }

    init() {
        // Only initialize if environment variables are set
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            this.transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            console.log('📧 Email service initialized');
        } else {
            console.warn('⚠️ Email service not initialized: EMAIL_USER and EMAIL_PASSWORD missing in .env');
        }
    }

    async sendEmail(to, subject, html, unsubscribeToken = '') {
        if (!this.transporter) {
            console.warn('❌ Email not sent: Transporter not initialized');
            return null;
        }

        try {
            // Replace placeholders in templates
            const unsubscribeUrl = `http://localhost:3000/unsubscribe?token=${unsubscribeToken}`;
            const preferencesUrl = `http://localhost:3000/notifications/settings`;

            const finalHtml = html
                .replace(/{{unsubscribe_url}}/g, unsubscribeUrl)
                .replace(/{{preferences_url}}/g, preferencesUrl);

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"SpaceScope" <noreply@spacescope.com>',
                to,
                subject,
                html: finalHtml
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${to}: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`❌ Error sending email to ${to}:`, error);
            throw error;
        }
    }

    async sendWelcomeEmail(email, preferences, unsubscribeToken) {
        const html = templates.welcome({ preferences });
        return this.sendEmail(email, '🌌 Welcome to SpaceScope!', html, unsubscribeToken);
    }

    async sendPlanningEmail(subscriber, data) {
        if (!subscriber.is_active) return;
        const html = templates.planning(data);
        const subject = `📅 Planning Briefing: ${data.title}`;
        return this.sendEmail(subscriber.email, subject, html, subscriber.unsubscribe_token);
    }

    async sendEducationalEmail(subscriber, data) {
        if (!subscriber.is_active) return;
        const html = templates.educational(data);
        const subject = `🎓 Academy Briefing: ${data.title}`;
        return this.sendEmail(subscriber.email, subject, html, subscriber.unsubscribe_token);
    }

    async sendNotificationEmail(subscriber, notification) {
        // Check if subscriber is active and has preference for this category
        if (!subscriber.is_active) return;

        const prefs = subscriber.preferences || {};
        if (prefs[notification.category] === false) {
            console.log(`ℹ️ Skipping email for ${subscriber.email}: Preference for ${notification.category} disabled`);
            return;
        }

        const html = templates.notification(notification);
        const subject = `${notification.type === 'urgent' ? '🚨 URGENT: ' : ''}${notification.title}`;

        return this.sendEmail(subscriber.email, subject, html, subscriber.unsubscribe_token);
    }

    async broadcastNotification(notification, data = {}) {
        try {
            // Get all active subscribers
            const result = await pool.query(
                'SELECT email, preferences, unsubscribe_token, is_active FROM email_subscriptions WHERE is_active = TRUE'
            );

            const subscribers = result.rows;
            console.log(`📢 Broadcasting to ${subscribers.length} potential subscribers... (Template: ${notification.category === 'mission' ? 'Planning' : 'Notification'})`);

            const promises = subscribers.map(sub => {
                // If it's a mission/general update, use Planning/Educational templates
                if (notification.category === 'mission' || notification.contentType === 'planning') {
                    return this.sendPlanningEmail(sub, { ...notification, ...data });
                } else if (notification.contentType === 'educational') {
                    return this.sendEducationalEmail(sub, { ...notification, ...data });
                }
                return this.sendNotificationEmail(sub, notification);
            });

            const results = await Promise.allSettled(promises);

            const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
            console.log(`✅ Broadcast complete: ${successCount} emails sent successfully`);

            return successCount;
        } catch (error) {
            console.error('❌ Error broadcasting notification:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
