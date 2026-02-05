// Quick fix script - paste this in browser console to manually set the state
// This will help you test immediately while we fix the code

console.log('🔧 Manual Fix Script');
console.log('Current localStorage state:');
console.log('- notifications_disabled:', localStorage.getItem('notifications_disabled'));
console.log('- notifications_enabled:', localStorage.getItem('notifications_enabled'));
console.log('- Browser permission:', Notification.permission);

// Clear all notification localStorage
localStorage.removeItem('notifications_disabled');
localStorage.removeItem('notifications_enabled');

// If permission is granted, set it as enabled
if (Notification.permission === 'granted') {
    localStorage.setItem('notifications_enabled', 'true');
    console.log('✅ Set notifications as enabled');
} else {
    console.log('⚠️ Browser permission not granted yet');
}

console.log('\n💡 Now refresh the page (F5) and the notification state should be correct!');
