import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { formatDate } from '../utils/validators';

const ResultCard = ({ result }) => {
  if (!result || result.status === 'failed') {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Scan Failed
        </Typography>
        <Typography variant="body1">
          {result?.error || 'An unknown error occurred during the scan.'}
        </Typography>
      </Paper>
    );
  }

  // Helper function to render vulnerability status
  const VulnerabilityStatus = ({ isVulnerable, component }) => {
    if (component === 'xss') {
      return isVulnerable ? (
        <Chip
          icon={<CancelIcon />}
          label="Vulnerable"
          color="error"
          variant="outlined"
        />
      ) : (
        <Chip
          icon={<CheckCircleIcon />}
          label="Secure"
          color="success"
          variant="outlined"
        />
      );
    } else {
      return result[component].present ? (
        <Chip
          icon={<CheckCircleIcon />}
          label="Implemented"
          color="success"
          variant="outlined"
        />
      ) : (
        <Chip
          icon={<WarningIcon />}
          label="Not Implemented"
          color="warning"
          variant="outlined"
        />
      );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Scan Results
        </Typography>
        <Chip
          icon={<SecurityIcon />}
          label={formatDate(result.timestamp)}
          variant="outlined"
          size="small"
        />
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>
        <Link href={result.url} target="_blank" rel="noopener noreferrer">
          {result.url}
        </Link>
      </Typography>
      
      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {/* XSS Vulnerabilities */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="xss-content"
            id="xss-header"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant="subtitle1">XSS Vulnerabilities</Typography>
              <VulnerabilityStatus isVulnerable={result.xss.vulnerable} component="xss" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {result.xss.details.length > 0 ? (
              <List dense>
                {result.xss.details.map((detail, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${detail.element} (ID: ${detail.id})`}
                      secondary={detail.reason}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No XSS vulnerabilities were detected.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* HSTS Configuration */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="hsts-content"
            id="hsts-header"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant="subtitle1">HSTS Configuration</Typography>
              <VulnerabilityStatus component="hsts" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {result.hsts.present ? (
              <Box>
                <Typography variant="body2">
                  <strong>Header:</strong> {result.hsts.details.header}
                </Typography>
                <Typography variant="body2">
                  <strong>Max Age:</strong> {result.hsts.details.maxAge} seconds
                </Typography>
                <Typography variant="body2">
                  <strong>Include Subdomains:</strong> {result.hsts.details.includeSubDomains ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Preload:</strong> {result.hsts.details.preload ? 'Yes' : 'No'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                HTTP Strict Transport Security (HSTS) is not implemented.
                HSTS forces browsers to use HTTPS, preventing protocol downgrade attacks.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* CSP Configuration */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="csp-content"
            id="csp-header"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant="subtitle1">Content Security Policy</Typography>
              <VulnerabilityStatus component="csp" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {result.csp.present ? (
              <Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Header:</strong> {result.csp.details.header}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Policies:</Typography>
                <List dense>
                  {result.csp.details.policies.map((policy, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={policy} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Content Security Policy (CSP) is not implemented.
                CSP helps prevent XSS attacks by specifying which dynamic resources are allowed to load.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Paper>
  );
};

export default ResultCard; 