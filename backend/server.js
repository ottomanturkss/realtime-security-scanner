const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Configure CORS for Express
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false // Allow cross-origin frames
}));

// Store scan results
const scanResults = {};

// Function to scan a URL for XSS, HSTS, and CSP vulnerabilities
async function scanUrl(url, socket) {
  socket.emit('scanStatus', { status: 'scanning', url });
  console.log(`Starting scan for URL: ${url}`);
  
  try {
    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      throw new Error('Invalid URL format');
    }
    
    const result = {
      url,
      timestamp: new Date().toISOString(),
      xss: { vulnerable: false, details: [] },
      hsts: { present: false, details: {} },
      csp: { present: false, details: {} },
      status: 'completed'
    };

    // Fetch the webpage
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        validateStatus: () => true,
        timeout: 20000, // 20 second timeout
        maxRedirects: 5
      });
      
      console.log(`Received response from ${url} with status: ${response.status}`);
      
      // Check if response is valid
      if (response.status >= 400) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error fetching URL: ${url}`, error.message);
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }

    // Check headers for HSTS
    const hstsHeader = response.headers['strict-transport-security'];
    if (hstsHeader) {
      result.hsts.present = true;
      result.hsts.details = {
        header: hstsHeader,
        maxAge: hstsHeader.includes('max-age=') ? 
          parseInt(hstsHeader.match(/max-age=(\d+)/)?.[1] || '0') : 'Not specified',
        includeSubDomains: hstsHeader.includes('includeSubDomains'),
        preload: hstsHeader.includes('preload')
      };
    }

    // Check headers for CSP
    const cspHeader = response.headers['content-security-policy'];
    if (cspHeader) {
      result.csp.present = true;
      result.csp.details = {
        header: cspHeader,
        policies: cspHeader.split(';').map(policy => policy.trim())
      };
    }

    // Check if response has HTML content
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html')) {
      console.log(`URL ${url} is not an HTML page: ${contentType}`);
      result.xss.details.push({
        element: 'document',
        id: 'root',
        reason: `Not an HTML page. Content-Type: ${contentType}`
      });
    } else {
      try {
        // Load HTML content for XSS scanning
        const $ = cheerio.load(response.data);
        
        // Check for potential XSS vulnerabilities in input fields
        $('input').each((i, el) => {
          const type = $(el).attr('type');
          if (!type || type === 'text' || type === 'search' || type === 'url' || type === 'tel' || type === 'email') {
            if (!$(el).attr('sanitized') && !$(el).attr('xss-protection')) {
              result.xss.vulnerable = true;
              result.xss.details.push({
                element: 'input',
                id: $(el).attr('id') || 'unknown',
                reason: 'Input field without proper sanitization attributes'
              });
            }
          }
        });
        
        // Check for inline JavaScript events
        const inlineEventAttributes = [
          'onclick', 'onmouseover', 'onload', 'onerror', 'onkeyup', 'onkeydown'
        ];
        
        $('*').each((i, el) => {
          for (const event of inlineEventAttributes) {
            if ($(el).attr(event)) {
              result.xss.vulnerable = true;
              result.xss.details.push({
                element: el.name,
                id: $(el).attr('id') || 'unknown',
                reason: `Inline event handler (${event}) detected`
              });
              break;
            }
          }
        });
      } catch (error) {
        console.error(`Error parsing HTML for ${url}:`, error.message);
        result.xss.vulnerable = true;
        result.xss.details.push({
          element: 'document',
          id: 'parser',
          reason: `Error parsing HTML: ${error.message}`
        });
      }
    }

    // Save and return results
    scanResults[url] = result;
    socket.emit('scanResult', result);
    console.log(`Scan completed for ${url}`);
    return result;
  } catch (error) {
    console.error('Scan error:', error.message);
    const errorResult = {
      url,
      timestamp: new Date().toISOString(),
      error: error.message,
      status: 'failed'
    };
    socket.emit('scanResult', errorResult);
    return errorResult;
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('scanRequest', async (data) => {
    console.log('Scan request received:', data);
    const { url } = data;
    if (!url) {
      socket.emit('error', { message: 'URL is required' });
      return;
    }
    
    await scanUrl(url, socket);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API endpoints
app.get('/api/results', (req, res) => {
  res.json(Object.values(scanResults));
});

app.get('/api/results/:url', (req, res) => {
  const url = decodeURIComponent(req.params.url);
  if (scanResults[url]) {
    res.json(scanResults[url]);
  } else {
    res.status(404).json({ error: 'Scan result not found' });
  }
});

app.post('/api/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    // Create a fake socket to maintain compatibility with the socket-based scanning
    const fakeSocket = {
      emit: () => {}
    };
    
    const result = await scanUrl(url, fakeSocket);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a test endpoint to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 