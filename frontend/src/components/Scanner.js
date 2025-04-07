import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
  AlertTitle,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { isValidUrl } from '../utils/validators';

const Scanner = ({ onScan, isScanning }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  const handleClearUrl = () => {
    setUrl('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!url.trim()) {
      setError('URL is required');
      return;
    }
    
    // Add http:// if not present
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'https://' + url;
    }
    
    if (!isValidUrl(processedUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Submit for scanning
    onScan(processedUrl);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Security Scanner
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter a URL to scan for XSS vulnerabilities, HSTS configuration, and Content Security Policy.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Enter website URL"
          variant="outlined"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          disabled={isScanning}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: url && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearUrl} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isScanning}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          {isScanning ? 'Scanning...' : 'Scan Now'}
        </Button>
      </Box>
      
      {isScanning && (
        <Box sx={{ width: '100%', mt: 3 }}>
          <LinearProgress />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Scanning in progress...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Scanner; 