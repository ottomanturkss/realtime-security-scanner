import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Box, Alert, AlertTitle, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import Scanner from '../components/Scanner';
import ResultCard from '../components/ResultCard';
import { initSocket, getSocket } from '../utils/socket';
import { requestScan } from '../utils/api';

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    let socket;
    try {
      socket = initSocket();
      
      // Set up socket event listeners
      socket.on('connect', () => {
        console.log('Socket connected in Dashboard');
        setSocketConnected(true);
        setError(null);
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected in Dashboard');
        setSocketConnected(false);
      });
      
      socket.on('scanStatus', (data) => {
        console.log('Scan status:', data);
        if (data.status === 'scanning') {
          setIsScanning(true);
        }
      });
      
      socket.on('scanResult', (result) => {
        console.log('Scan result received:', result);
        setCurrentScan(result);
        setIsScanning(false);
      });
      
      socket.on('error', (errorData) => {
        console.error('Socket error:', errorData);
        setError(errorData.message || 'An error occurred');
        setIsScanning(false);
      });
      
      // Check connection status after 3 seconds
      const timer = setTimeout(() => {
        if (!socketConnected && !socket.connected) {
          console.warn('Socket not connected after timeout');
        }
      }, 3000);
      
      // Clean up socket listeners on unmount
      return () => {
        clearTimeout(timer);
        socket.off('connect');
        socket.off('disconnect');
        socket.off('scanStatus');
        socket.off('scanResult');
        socket.off('error');
      };
    } catch (err) {
      console.error('Socket initialization error:', err);
      setError('Failed to initialize real-time connection: ' + err.message);
      return () => {};
    }
  }, []);
  
  // Try to reconnect socket
  const handleReconnect = () => {
    try {
      const socket = getSocket();
      if (socket && !socket.connected) {
        socket.connect();
      }
      setError(null);
    } catch (err) {
      setError('Failed to reconnect: ' + err.message);
    }
  };
  
  // Handle starting a new scan
  const handleScan = (url) => {
    setIsScanning(true);
    setError(null);
    setCurrentScan(null);
    
    if (socketConnected) {
      try {
        // Use WebSocket for real-time updates
        const socket = getSocket();
        socket.emit('scanRequest', { url });
      } catch (err) {
        console.error('Socket emit error:', err);
        fallbackToHttpScan(url);
      }
    } else {
      fallbackToHttpScan(url);
    }
  };
  
  // Fallback to HTTP API for scanning
  const fallbackToHttpScan = (url) => {
    requestScan(url)
      .then((result) => {
        console.log('HTTP scan result:', result);
        setCurrentScan(result);
        setIsScanning(false);
      })
      .catch((err) => {
        console.error('HTTP scan error:', err);
        setError(err.message || 'Failed to scan the URL');
        setIsScanning(false);
      });
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          Security Scanner Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Scan websites for XSS vulnerabilities, HSTS configuration, and Content Security Policy (CSP).
        </Typography>
        
        {!socketConnected && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleReconnect}
                startIcon={<RefreshIcon />}
              >
                Reconnect
              </Button>
            }
          >
            <AlertTitle>WebSocket Disconnected</AlertTitle>
            Real-time updates are unavailable. Falling back to HTTP requests.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Grid>
      
      <Grid item xs={12} md={5}>
        <Scanner onScan={handleScan} isScanning={isScanning} />
      </Grid>
      
      <Grid item xs={12} md={7}>
        {currentScan ? (
          <ResultCard result={currentScan} />
        ) : (
          <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                No Scan Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter a URL in the scanner to begin testing.
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard; 