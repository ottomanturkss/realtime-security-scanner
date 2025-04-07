# Real-Time Web Security Scanner Dashboard

A web dashboard for scanning websites for XSS vulnerabilities, HSTS configuration, and Content Security Policy (CSP) in real-time.

[![CI/CD](https://github.com/yourusername/web-security-scanner/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/web-security-scanner/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/yourusername/web-security-scanner/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/web-security-scanner/actions/workflows/deploy.yml)

## Support the Project

If you find this project useful, consider supporting its development:

- **Bitcoin (BTC)**: `bc1qj224dp8zcpvh0mc5qvwlu53u7vhsl3qef9yz2c`
- **Ethereum (ETH)**: `0xCcEd5136D711238c4d8089285BcB6BE282a46315`
- **Polkadot (DOT)**: `15ZgdnmYPsdYk5Z2oatj58Rxop8ZJV4qboLVvviv1bqCBUFG`
- **Tron (TRX)**: `TGf4Kgvx9rmj9vqjWajEQEevGcEGwWWrvF`
- **Solana (SOL)**: `3wLYGco5ybKob6LeaN2XT1nfdzFr4N9egFqmiXueueWU`
- **BNB Chain (BNB)**: `0xCcEd5136D711238c4d8089285BcB6BE282a46315`
- **Ripple (XRP)**: `rDM7BrvfoKKiwQSgV7qGCConA137AyzmRC`

## Live Demo

Check out the live demo at: [https://yourusername.github.io/web-security-scanner/](https://yourusername.github.io/web-security-scanner/)

## Features

- **XSS Vulnerability Scanning**: Detect potential Cross-Site Scripting vulnerabilities
- **HSTS Configuration Check**: Verify HTTP Strict Transport Security implementation
- **CSP Analysis**: Examine Content Security Policy headers
- **Real-Time Results**: Get scan results in real-time via WebSocket
- **History Tracking**: View and analyze past scan results

## Project Structure

```
/
├── backend/               # Express backend
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
│
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   ├── webpack.config.js  # Webpack configuration
│   └── package.json       # Frontend dependencies
│
├── .github/               # GitHub Actions workflows
│   ├── workflows/         # CI/CD configuration
│   │   ├── ci.yml        # Continuous Integration
│   │   └── deploy.yml    # GitHub Pages deployment
│
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
└── README.md             # Project documentation
```

## Technologies Used

- **Backend**:
  - Node.js
  - Express
  - Socket.IO (real-time communication)
  - Cheerio (HTML parsing for vulnerability detection)
  - Axios (HTTP client)

- **Frontend**:
  - React
  - Material-UI (UI components)
  - Socket.IO Client (real-time updates)
  - React Router (navigation)
  - Webpack (bundling)

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm (v6 or newer)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-security-scanner.git
   cd web-security-scanner
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Important:** You need to run both the backend and frontend separately.

1. Start the backend server (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

### GitHub Pages

The frontend is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. Builds the frontend application
2. Deploys the built files to the `gh-pages` branch
3. Makes the application available at `https://ottomanturkss.github.io/web-security-scanner/`

### Custom Domain

To use a custom domain:

1. Create a `CNAME` file in the `frontend/public` directory with your domain
2. Update DNS settings to point to GitHub Pages
3. Enable HTTPS in your repository settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Backend Issues

1. **"Missing script: dev" error**:
   - Check if you're in the correct directory (should be in the "backend" folder)
   - Make sure you've installed dependencies with `npm install`
   - Check if package.json includes the dev script

2. **Port conflicts**:
   - If port 5000 is already in use, modify the PORT variable in server.js
   - You'll also need to update the proxy settings in frontend/webpack.config.js

3. **CORS errors**:
   - Backend should already be configured for CORS
   - Check the browser console for specific errors
   - Verify that the frontend is connecting to the correct backend URL

### Frontend Issues

1. **Webpack configuration errors**:
   - Make sure all dependencies are installed with `npm install`
   - Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`
   - Check webpack.config.js for syntax errors

2. **Connection to backend fails**:
   - Ensure backend server is running
   - Check if frontend proxy settings in webpack.config.js match backend URL
   - Look for errors in browser console and backend terminal

3. **Socket.io connection issues**:
   - The app will automatically fall back to HTTP requests if socket fails
   - Check browser console for connection errors
   - Verify that firewall isn't blocking WebSocket connections

### Common Solutions

1. **Restart both servers**: Sometimes simply restarting both servers resolves issues
2. **Clear browser cache**: Try hard-refreshing the browser (Ctrl+F5 or Cmd+Shift+R)
3. **Check console logs**: Both browser console and terminal logs contain helpful information
4. **Update dependencies**: If issues persist, try updating packages to latest versions

## Usage

1. Enter a URL in the scanner input field
2. Click "Scan Now" to start the security scan
3. View real-time results as they are processed
4. Check the Scan History page to view past scan results

## Security Considerations

This scanner is designed for educational purposes and security research. When using this tool:

- Only scan websites you own or have permission to scan
- Be aware that frequent scanning may trigger rate limits or security alerts
- The scanner provides basic checks and may not identify all security issues

## Future Enhancements

- Add more detailed vulnerability scanning
- Implement user authentication
- Add PDF report generation
- Support for custom scanning rules
- Integration with security APIs for deeper analysis

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
