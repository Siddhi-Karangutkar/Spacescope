// Test Notification Utility
// Run this in the browser console to test notifications

// Test 1: Check if browser supports notifications
console.log('=== NOTIFICATION SYSTEM TEST ===\n');

console.log('1. Browser Support:');
console.log('   Notifications supported:', 'Notification' in window);
console.log('   Service Worker supported:', 'serviceWorker' in navigator);
console.log('   Current permission:', Notification.permission);

// Test 2: Request permission and show test notification
async function testBrowserNotification() {
    console.log('\n2. Testing Browser Notification:');

    if (!('Notification' in window)) {
        console.error('   ❌ Browser does not support notifications');
        return;
    }

    if (Notification.permission === 'granted') {
        console.log('   ✅ Permission already granted');
        showTestNotification();
    } else if (Notification.permission !== 'denied') {
        console.log('   ⏳ Requesting permission...');
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('   ✅ Permission granted!');
            showTestNotification();
        } else {
            console.error('   ❌ Permission denied');
        }
    } else {
        console.error('   ❌ Permission previously denied. Reset in browser settings.');
    }
}

function showTestNotification() {
    const notification = new Notification('🚀 Test Notification', {
        body: 'If you see this, browser notifications are working!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: false
    });

    notification.onclick = function () {
        console.log('   ✅ Notification clicked!');
        window.focus();
        notification.close();
    };

    console.log('   ✅ Test notification sent!');
}

// Test 3: Check API connectivity
async function testAPIConnection() {
    console.log('\n3. Testing API Connection:');

    try {
        const response = await fetch('/api/notifications?limit=5');

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ API connected successfully');
            console.log('   📊 Notifications found:', data.notifications.length);
            console.log('   📬 Unread count:', data.unreadCount);

            if (data.notifications.length > 0) {
                console.log('\n   Sample notification:');
                console.log('   -', data.notifications[0].title);
            }
        } else {
            console.error('   ❌ API error:', response.status);
        }
    } catch (error) {
        console.error('   ❌ Failed to connect to API:', error.message);
    }
}

// Test 4: Create a test notification via API
async function createTestNotification() {
    console.log('\n4. Creating Test Notification via API:');

    try {
        const response = await fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'info',
                category: 'general',
                title: '🧪 Test Notification',
                message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
                link: '/dashboard'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Test notification created!');
            console.log('   📝 ID:', data.notification.id);
            console.log('   💡 Refresh the page to see it in the notification bell');
        } else {
            console.error('   ❌ Failed to create notification:', response.status);
        }
    } catch (error) {
        console.error('   ❌ Error:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('=== RUNNING ALL TESTS ===\n');
    await testBrowserNotification();
    await testAPIConnection();
    await createTestNotification();
    console.log('\n=== TESTS COMPLETE ===');
    console.log('\n💡 TIP: Open the notification bell in the navbar to see your notifications!');
}

// Export functions for manual testing
window.notificationTests = {
    runAll: runAllTests,
    testBrowser: testBrowserNotification,
    testAPI: testAPIConnection,
    createTest: createTestNotification
};

console.log('\n📝 Available commands:');
console.log('   notificationTests.runAll()        - Run all tests');
console.log('   notificationTests.testBrowser()   - Test browser notifications');
console.log('   notificationTests.testAPI()       - Test API connection');
console.log('   notificationTests.createTest()    - Create a test notification');
console.log('\n💡 Run: notificationTests.runAll()');
