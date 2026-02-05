import React, { useState } from 'react';
import { X, Settings, CheckCheck, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import NotificationSettings from './NotificationSettings';
import './NotificationPanel.css';

const NotificationPanel = ({
    notifications,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
    onRefresh
}) => {
    const [activeTab, setActiveTab] = useState('all');
    const [showSettings, setShowSettings] = useState(false);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'urgent':
                return <AlertCircle className="notification-icon urgent" size={20} />;
            case 'warning':
                return <AlertTriangle className="notification-icon warning" size={20} />;
            default:
                return <Info className="notification-icon info" size={20} />;
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffMs = now - notificationTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const filteredNotifications = activeTab === 'urgent'
        ? notifications.filter(n => n.type === 'urgent')
        : notifications;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (showSettings) {
        return (
            <NotificationSettings
                onClose={() => setShowSettings(false)}
                onBack={() => setShowSettings(false)}
            />
        );
    }

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>Notifications</h3>
                <div className="notification-header-actions">
                    <button
                        className="icon-button"
                        onClick={() => setShowSettings(true)}
                        title="Settings"
                    >
                        <Settings size={18} />
                    </button>
                    <button
                        className="icon-button"
                        onClick={onClose}
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="notification-tabs">
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All ({notifications.length})
                </button>
                <button
                    className={`tab ${activeTab === 'urgent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('urgent')}
                >
                    Urgent ({notifications.filter(n => n.type === 'urgent').length})
                </button>
            </div>

            {unreadCount > 0 && (
                <div className="notification-actions">
                    <button
                        className="mark-all-read-btn"
                        onClick={onMarkAllAsRead}
                    >
                        <CheckCheck size={16} />
                        Mark all as read
                    </button>
                </div>
            )}

            <div className="notification-list">
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <Info size={48} className="empty-icon" />
                        <p>No notifications yet</p>
                        <span className="empty-subtitle">
                            {activeTab === 'urgent'
                                ? "You'll be notified of urgent space events here"
                                : "Stay tuned for updates about space events"}
                        </span>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                            onClick={() => {
                                if (!notification.is_read) {
                                    onMarkAsRead([notification.id]);
                                }
                                if (notification.link) {
                                    window.location.href = notification.link;
                                }
                            }}
                        >
                            <div className="notification-icon-wrapper">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-title">
                                    {notification.title}
                                    {!notification.is_read && <span className="unread-dot"></span>}
                                </div>
                                <div className="notification-message">
                                    {notification.message}
                                </div>
                                <div className="notification-meta">
                                    <span className="notification-category">{notification.category}</span>
                                    <span className="notification-time">{getTimeAgo(notification.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
