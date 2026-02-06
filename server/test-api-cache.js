const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

async function testCache() {
    console.log('--- Starting Cache Verification Test ---');

    try {
        // 1. Initial request (should be live)
        console.log('\n[Test 1] Initial request to /api/solar-flares...');
        const res1 = await axios.get(`${BASE_URL}/solar-flares`);
        console.log('Status:', res1.data._api_status);

        const firstTimestamp = res1.data._api_status.timestamp;

        // 2. Immediate second request (should be proactive cache)
        console.log('\n[Test 2] Immediate second request (expected: proactive cache)...');
        const res2 = await axios.get(`${BASE_URL}/solar-flares`);
        console.log('Status:', res2.data._api_status);

        if (res2.data._api_status.proactive && res2.data._api_status.timestamp === firstTimestamp) {
            console.log('✅ Proactive cache working correctly!');
        } else {
            console.error('❌ Proactive cache failed or timestamp mismatch.');
        }

        // 3. Test CME endpoint
        console.log('\n[Test 3] Request to /api/cme...');
        const res3 = await axios.get(`${BASE_URL}/cme`);
        console.log('Status:', res3.data._api_status);

        console.log('\n--- Cache Verification Test Completed ---');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
        console.log('\nTIP: Make sure the server is running on port 5002 before running this test.');
    }
}

testCache();
