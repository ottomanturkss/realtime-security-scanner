import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 second timeout
  withCredentials: true
});

// Add a request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    }
    return Promise.reject(error);
  }
);

// Test the API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

/**
 * Get all scan results
 * @returns {Promise} - Promise resolving to scan results
 */
export const getScanResults = async () => {
  try {
    const response = await api.get('/results');
    return response.data;
  } catch (error) {
    console.error('Error fetching scan results:', error);
    throw error;
  }
};

/**
 * Get a specific scan result by URL
 * @param {string} url - The URL that was scanned
 * @returns {Promise} - Promise resolving to a specific scan result
 */
export const getScanResult = async (url) => {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await api.get(`/results/${encodedUrl}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scan result for ${url}:`, error);
    throw error;
  }
};

/**
 * Request a new scan via HTTP (alternative to WebSocket)
 * @param {string} url - The URL to scan
 * @returns {Promise} - Promise resolving to scan result
 */
export const requestScan = async (url) => {
  try {
    // Scan can take a while, so increase the timeout for this request
    const response = await api.post('/scan', { url }, { timeout: 60000 });
    return response.data;
  } catch (error) {
    console.error(`Error requesting scan for ${url}:`, error);
    throw error;
  }
}; 