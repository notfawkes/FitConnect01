const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Fitbit API credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Store tokens (in production, use a proper database)
let tokens = {};

// OAuth callback endpoint
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        const response = await axios.post('https://api.fitbit.com/oauth2/token', 
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                }
            }
        );

        tokens = response.data;
        res.redirect('/dashboard.html');
    } catch (error) {
        console.error('Error getting access token:', error);
        res.status(500).send('Error during authentication');
    }
});

// Proxy endpoint for Fitbit API calls
app.get('/api/fitbit/*', async (req, res) => {
    if (!tokens.access_token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const fitbitPath = req.path.replace('/api/fitbit', '');
        const response = await axios.get(`https://api.fitbit.com/1/user/-${fitbitPath}`, {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response?.status === 401) {
            // Token expired, try to refresh
            try {
                const refreshResponse = await axios.post('https://api.fitbit.com/oauth2/token',
                    new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: tokens.refresh_token
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                        }
                    }
                );
                tokens = refreshResponse.data;
                
                // Retry the original request
                const retryResponse = await axios.get(`https://api.fitbit.com/1/user/-${req.path.replace('/api/fitbit', '')}`, {
                    headers: {
                        'Authorization': `Bearer ${tokens.access_token}`
                    }
                });
                res.json(retryResponse.data);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                res.status(401).json({ error: 'Authentication failed' });
            }
        } else {
            console.error('Error fetching Fitbit data:', error);
            res.status(500).json({ error: 'Error fetching data from Fitbit' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
