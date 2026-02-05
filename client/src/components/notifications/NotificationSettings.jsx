import React, { useState, useEffect } from 'react';
import { X, Bell, Mail, Check, ArrowLeft } from 'lucide-react';
import notificationService from '../../services/notificationService';
import './NotificationSettings.css';

const NotificationSettings = ({ onClose, onBack }) => {
    const [browserEnabled, setBrowserEnabled] = useState(false);
    const [browserPermission, setBrowserPermission] = useState('default');
    const [email, setEmail] = useState('');
    const [emailSubscribed, setEmailSubscribed] = useState(false);
    const [preferences, setPreferences] = useState({
        solar: true,
        asteroid: true,
        satellite: true,
        weather: true,
        mission: true
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Function to check and update notification status
    const checkNotificationStatus = () => {
        if (notificationService.isSupported()) {
            const permission = notificationService.getPermissionStatus();
            setBrowserPermission(permission);

            // Check if user manually disabled notifications
            const userDisabled = localStorage.getItem('notifications_disabled') === 'true';

            // Enable if permission is granted AND user hasn't disabled it
            const shouldEnable = permission === 'granted' && !userDisabled;
            setBrowserEnabled(shouldEnable);

            console.log('🔄 Notification status check:', {
                permission,
                userDisabled,
                shouldEnable
            });
        }
    };

    useEffect(() => {
        // Initial check
        checkNotificationStatus();

        // Check if email is already subscribed (from localStorage for now)
        const savedEmail = localStorage.getItem('notification_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setEmailSubscribed(true);
        }

        const savedPreferences = localStorage.getItem('notification_preferences');
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
    }, []);

    const handleEnableBrowserNotifications = async () => {
        console.log('🔔 Attempting to enable browser notifications...');

        if (!notificationService.isSupported()) {
            console.error('❌ Browser notifications not supported');
            setMessage({
                text: 'Browser notifications are not supported on this device',
                type: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            console.log('📋 Current permission:', Notification.permission);
            const granted = await notificationService.requestPermission();
            console.log('✅ Permission granted:', granted);

            if (granted) {
                // Remove disabled flag from localStorage
                localStorage.removeItem('notifications_disabled');
                console.log('💾 Removed disabled flag from localStorage');

                // Update state immediately
                setBrowserEnabled(true);
                setBrowserPermission('granted');

                // Subscribe to push notifications
                await notificationService.subscribeToPush();
                console.log('📡 Subscribed to push notifications');

                // Show test notification
                console.log('🚀 Showing test notification...');
                notificationService.showNotification('Notifications Enabled! 🚀', {
                    body: 'You\'ll now receive urgent space alerts',
                    icon: '/favicon.ico',
                    requireInteraction: false
                });

                setMessage({
                    text: 'Browser notifications enabled successfully!',
                    type: 'success'
                });

                console.log('✅ All done! Check for desktop notification.');
            } else {
                console.error('❌ Permission denied by user');
                setMessage({
                    text: 'Permission denied. Please enable in browser settings.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('❌ Error enabling notifications:', error);
            setMessage({
                text: 'Failed to enable notifications: ' + error.message,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDisableBrowserNotifications = async () => {
        await notificationService.unsubscribe();

        // Set disabled flag in localStorage
        localStorage.setItem('notifications_disabled', 'true');
        console.log('💾 Set disabled flag in localStorage');

        // Update state immediately
        setBrowserEnabled(false);

        setMessage({
            text: 'Browser notifications disabled',
            type: 'success'
        });
    };

    const handleEmailSubscribe = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setMessage({
                text: 'Please enter a valid email address',
                type: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/notifications/subscribe-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, preferences })
            });

            if (response.ok) {
                localStorage.setItem('notification_email', email);
                localStorage.setItem('notification_preferences', JSON.stringify(preferences));
                setEmailSubscribed(true);
                setMessage({
                    text: 'Successfully subscribed to email updates!',
                    type: 'success'
                });
            } else {
                const data = await response.json();
                setMessage({
                    text: data.error || 'Failed to subscribe',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error subscribing to email:', error);
            setMessage({
                text: 'Failed to subscribe. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribeEmail = async () => {
        setLoading(true);
        try {
            // In a real app, you'd call an API to unsubscribe
            localStorage.removeItem('notification_email');
            localStorage.removeItem('notification_preferences');
            setEmail('');
            setEmailSubscribed(false);
            setMessage({
                text: 'Unsubscribed from email updates',
                type: 'success'
            });
        } catch (error) {
            console.error('Error unsubscribing:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceChange = (key) => {
        const newPreferences = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPreferences);
        localStorage.setItem('notification_preferences', JSON.stringify(newPreferences));
    };

    return (
        <div className="notification-settings">
            <div className="settings-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                </button>
                <h3>Notification Settings</h3>
                <button className="close-button" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="settings-content">
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.type === 'success' && <Check size={16} />}
                        {message.text}
                    </div>
                )}

                {/* Browser Notifications Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <Bell size={20} />
                        <div>
                            <h4>Urgent, Real-Time Alerts</h4>
                            <p>Immediate attention needed. Activity happening right now in the cosmos sent directly to your desktop.</p>
                        </div>
                    </div>

                    {browserEnabled ? (
                        <div className="enabled-state">
                            <div className="status-badge success">
                                <Check size={16} />
                                Active Terminal
                            </div>
                            <button
                                className="secondary-button"
                                onClick={handleDisableBrowserNotifications}
                                disabled={loading}
                            >
                                Deactivate
                            </button>
                        </div>
                    ) : (
                        <button
                            className="primary-button"
                            onClick={handleEnableBrowserNotifications}
                            disabled={loading || !notificationService.isSupported()}
                        >
                            {loading ? 'Initializing...' : 'Authorize Terminal Alerts'}
                        </button>
                    )}

                    {!notificationService.isSupported() && (
                        <p className="warning-text">
                            Browser alerts are not supported on this device
                        </p>
                    )}
                </div>

                {/* Email Notifications Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <Mail size={20} />
                        <div>
                            <h4>Planning & Detailed Content</h4>
                            <p>Future calendars, deep summaries, and educational Academy briefings for your archive.</p>
                        </div>
                    </div>

                    {emailSubscribed ? (
                        <div className="email-subscribed">
                            <div className="subscribed-email">
                                <Check size={16} className="check-icon" />
                                <span>{email}</span>
                            </div>
                            <button
                                className="secondary-button"
                                onClick={handleUnsubscribeEmail}
                                disabled={loading}
                            >
                                Unsubscribe
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailSubscribe} className="email-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="email-input"
                                required
                            />
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                            >
                                {loading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Notification Preferences */}
                <div className="settings-section">
                    <h4 className="preferences-title">Notification Topics</h4>
                    <div className="preferences-list">
                        {Object.entries({
                            solar: 'Solar Activity & Flares',
                            asteroid: 'Asteroid Approaches',
                            satellite: 'Satellite Events',
                            weather: 'Space Weather',
                            mission: 'Mission Updates'
                        }).map(([key, label]) => (
                            <label key={key} className="preference-item">
                                <input
                                    type="checkbox"
                                    checked={preferences[key]}
                                    onChange={() => handlePreferenceChange(key)}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
