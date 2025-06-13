// Fitbit API Integration
const CLIENT_ID = '23QFH8'; // Replace with your Fitbit Client ID
const CLIENT_SECRET = 'c266df03fa484a5560405cf1a8019ec5'; // Replace with your Fitbit Client Secret
const REDIRECT_URI = 'http://localhost:3000/callback'; // Update with your callback URL

// Fitbit API endpoints
const FITBIT_API_BASE = 'https://api.fitbit.com/1/user/-/';
const AUTH_URL = 'https://www.fitbit.com/oauth2/authorize';
const TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

// Scopes for the data we want to access
const SCOPES = [
    'activity',
    'heartrate',
    'sleep',
    'profile',
    'weight',
    'nutrition'
].join(' ');

// Function to initiate Fitbit OAuth flow
function initiateFitbitAuth() {
    const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = authUrl;
}

// Function to exchange authorization code for access token
async function getAccessToken(code) {
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        })
    });
    return await response.json();
}

// Function to refresh access token
async function refreshAccessToken(refreshToken) {
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });
    return await response.json();
}

// Function to fetch daily activity data
async function getDailyActivity(accessToken) {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${FITBIT_API_BASE}activities/date/${today}.json`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return await response.json();
}

// Function to fetch heart rate data
async function getHeartRate(accessToken) {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${FITBIT_API_BASE}activities/heart/date/${today}/1d.json`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return await response.json();
}

// Function to fetch sleep data
async function getSleepData(accessToken) {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${FITBIT_API_BASE}sleep/date/${today}.json`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return await response.json();
}

// Function to fetch weight data
async function getWeightData(accessToken) {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${FITBIT_API_BASE}body/log/weight/date/${today}.json`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return await response.json();
}

// Export functions for use in other files
export {
    initiateFitbitAuth,
    getAccessToken,
    refreshAccessToken,
    getDailyActivity,
    getHeartRate,
    getSleepData,
    getWeightData
}; 