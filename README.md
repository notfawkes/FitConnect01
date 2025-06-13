# FitConnect

A modern fitness tracking application that helps users manage their fitness journey.

## Features

- User authentication with Google Sheets integration
- Modern, responsive UI design
- Dashboard with activity tracking
- Progress monitoring
- Social login options

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: Google Sheets API
- Authentication: Custom authentication with Google Sheets

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd FitConnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Cloud Project:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Sheets API
   - Create credentials (Service Account)
   - Download the credentials JSON file
   - Rename it to `credentials.json` and place it in the project root

4. Create Google Sheet:
   - Create a new Google Sheet
   - Share it with the service account email from credentials.json
   - Copy the Sheet ID from the URL
   - Update `SPREADSHEET_ID` in `server.js` with your Sheet ID

5. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
FitConnect/
├── server.js           # Backend server
├── package.json        # Project dependencies
├── credentials.json    # Google Cloud credentials (gitignored)
├── .gitignore         # Git ignore file
├── Login.html         # Login page
├── Signup.html        # Signup page
├── dashboard.html     # User dashboard
└── LandingPage.html   # Landing page
```

## Security Notes

- Never commit `credentials.json` to version control
- Keep your Google Cloud credentials secure
- Regularly rotate credentials if exposed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.