const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1ZSDzg6-52ajNghwFhPAyW1IK-qWbdoDwcALTWorKE7o';

// Helper function to ensure sheet exists
async function ensureSheetExists() {
    try {
        // Try to get the sheet
        await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A1',
        });
    } catch (error) {
        if (error.code === 400) {
            // If sheet doesn't exist, create it
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: 'Sheet1',
                                gridProperties: {
                                    rowCount: 1000,
                                    columnCount: 26
                                }
                            }
                        }
                    }]
                }
            });

            // Add headers
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A1:D1',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [['First Name', 'Last Name', 'Email', 'Password']]
                }
            });
        }
    }
}

// Initialize sheet
ensureSheetExists().catch(console.error);

// Routes
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:D',
        });

        const users = response.data.values || [];
        const userExists = users.some(user => user[2] === email);

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Add new user
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:D',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[firstName, lastName, email, password]],
            },
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get users from sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:D',
        });

        const users = response.data.values || [];
        // Skip header row
        const user = users.slice(1).find(user => user[2] === email && user[3] === password);

        if (user) {
            res.json({ 
                message: 'Login successful',
                user: {
                    firstName: user[0],
                    lastName: user[1],
                    email: user[2]
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
