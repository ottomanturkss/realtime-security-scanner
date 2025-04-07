import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { getScanResults } from '../utils/api';
import { formatDate } from '../utils/validators';
import ResultCard from '../components/ResultCard';

const ScanHistory = () => {
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchScanResults();
  }, []);

  const fetchScanResults = async () => {
    try {
      setLoading(true);
      const results = await getScanResults();
      setScanResults(results);
      setError(null);
    } catch (err) {
      setError('Failed to load scan history: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Scan History
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {selectedResult && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Detailed Results
          </Typography>
          <ResultCard result={selectedResult} />
        </Box>
      )}
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>XSS</TableCell>
              <TableCell>HSTS</TableCell>
              <TableCell>CSP</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scanResults.length > 0 ? (
              scanResults.map((result) => (
                <TableRow key={result.timestamp}>
                  <TableCell>
                    <Link href={result.url} target="_blank" rel="noopener noreferrer" sx={{ maxWidth: 250, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.url}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(result.timestamp)}</TableCell>
                  <TableCell>
                    {result.xss?.vulnerable ? (
                      <Chip
                        icon={<CancelIcon />}
                        label="Vulnerable"
                        size="small"
                        color="error"
                      />
                    ) : (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Secure"
                        size="small"
                        color="success"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {result.hsts?.present ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Yes"
                        size="small"
                        color="success"
                      />
                    ) : (
                      <Chip
                        icon={<WarningIcon />}
                        label="No"
                        size="small"
                        color="warning"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {result.csp?.present ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Yes"
                        size="small"
                        color="success"
                      />
                    ) : (
                      <Chip
                        icon={<WarningIcon />}
                        label="No"
                        size="small"
                        color="warning"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewResult(result)}
                      aria-label="view details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" py={3}>
                    No scan history available. Run a scan on the Dashboard.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScanHistory; 