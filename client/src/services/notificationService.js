// Notification Service - Handles browser push notifications
class NotificationService {
    constructor() {
        this.permission = Notification.permission;
        this.subscription = null;
    }

    // Check if browser supports notifications
    isSupported() {
        return 'Notification' in window && 'serviceWorker' in navigator;
    }

    // Request permission for browser notifications
    async requestPermission() {
        if (!this.isSupported()) {
            throw new Error('Browser notifications are not supported');
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Show a browser notification
    showNotification(title, options = {}) {
        // Always check current permission status
        const currentPermission = Notification.permission;

        console.log('🔔 showNotification called:', { title, currentPermission });

        if (currentPermission !== 'granted') {
            console.warn('❌ Notification permission not granted. Current:', currentPermission);
            return null;
        }

        const defaultOptions = {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
            tag: 'spacescope-urgent-' + Date.now(),
            requireInteraction: true, // Urgent alerts stay until user interacts
            silent: false,
            renotify: true,
            ...options
        };

        // If it's a planning or educational notification, we might want to prioritize email
        // but since this is the BROWSER notification service, we design it for high impact
        if (title.toUpperCase().includes('URGENT') || options.priority === 'high') {
            defaultOptions.body = '🚨 CRITICAL ALERT: ' + (options.body || '');
        }

        try {
            // Always use direct Notification API for reliability
            console.log('🚀 Creating notification with options:', defaultOptions);
            const notification = new Notification(title, defaultOptions);

            notification.onclick = function (event) {
                console.log('🖱️ Notification clicked');
                event.preventDefault();
                window.focus();
                notification.close();
            };

            notification.onerror = function (error) {
                console.error('❌ Notification error:', error);
            };

            notification.onshow = function () {
                console.log('✅ Notification shown successfully!');
            };

            console.log('✅ Notification created:', notification);
            return notification;
        } catch (error) {
            console.error('❌ Error creating notification:', error);
            return null;
        }
    }

    // Subscribe to push notifications (for future web push implementation)
    async subscribeToPush() {
        // For now, just store that user wants push notifications
        // In production, you'd generate VAPID keys and subscribe properly
        console.log('📡 Subscribing to push notifications...');

        this.subscription = {
            endpoint: 'browser-notification',
            enabled: true,
            timestamp: Date.now()
        };

        console.log('✅ Push subscription created:', this.subscription);
        return this.subscription;
    }

    // Unsubscribe from push notifications
    async unsubscribe() {
        this.subscription = null;
        return true;
    }

    // Get current permission status
    getPermissionStatus() {
        // Always return the current permission from the browser
        this.permission = Notification.permission;
        return this.permission;
    }
}

export default new NotificationService();
