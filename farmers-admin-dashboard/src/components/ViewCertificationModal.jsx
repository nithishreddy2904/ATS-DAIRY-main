import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Chip,
  Typography,
  Box,
  Avatar,
  Divider,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { 
  Verified, 
  CalendarToday,
  AttachMoney,
  Business,
  Security,
  CheckCircle,
  Error,
  Warning,
  Schedule,
} from '@mui/icons-material';

const ViewCertificationModal = ({ open, certification, onClose }) => {
  if (!certification) return null;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const isExpiring = (expiryDate, status) => {
    if (status === 'Expired') return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const getStatusColor = (status, expiryDate) => {
    const expired = isExpired(expiryDate);
    const expiring = isExpiring(expiryDate, status);
    
    if (expired && status === 'Active') return 'error';
    if (expiring && status === 'Active') return 'warning';
    
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': case 'Cancelled': return 'error';
      case 'Under Process': return 'info';
      case 'Pending Renewal': case 'Suspended': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status, expiryDate) => {
    const expired = isExpired(expiryDate);
    const expiring = isExpiring(expiryDate, status);
    
    if (expired && status === 'Active') return <Error />;
    if (expiring && status === 'Active') return <Warning />;
    
    switch (status) {
      case 'Active': return <CheckCircle />;
      case 'Expired': case 'Cancelled': return <Error />;
      case 'Under Process': return <Schedule />;
      case 'Pending Renewal': case 'Suspended': return <Warning />;
      default: return <Verified />;
    }
  };

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiry = new Date(certification.expiry_date);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry;
  };

  const expired = isExpired(certification.expiry_date);
  const expiring = isExpiring(certification.expiry_date, certification.status);
  const daysUntilExpiry = getDaysUntilExpiry();
  const displayStatus = expired && certification.status === 'Active' ? 'Expired' : 
                      expiring && certification.status === 'Active' ? 'Expiring Soon' : 
                      certification.status;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>
            <Verified />
          </Avatar>
          <Box>
            <Typography variant="h6">{certification.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Certificate ID: {certification.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {expired && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This certification has expired! Immediate renewal required.
          </Alert>
        )}

        {expiring && !expired && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This certification expires in {daysUntilExpiry} days. Please plan for renewal.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <Verified sx={{ mr: 1, verticalAlign: 'middle' }} />
              Certification Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Certification Name"
              value={certification.name}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Issuing Authority"
              value={certification.issuing_authority}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Certificate Number"
              value={certification.certificate_number}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={displayStatus}
                color={getStatusColor(certification.status, certification.expiry_date)}
                variant="outlined"
                icon={getStatusIcon(certification.status, certification.expiry_date)}
                size="medium"
              />
            </Box>
          </Grid>

          {certification.accreditation_body && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Accreditation Body"
                value={certification.accreditation_body}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Renewal Required
              </Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={certification.renewal_required === true || certification.renewal_required === 1} 
                    disabled 
                  />
                }
                label={certification.renewal_required ? "Yes" : "No"}
              />
            </Box>
          </Grid>

          {/* Date Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
              Date Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Issue Date"
              value={formatDateTime(certification.issue_date)}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Expiry Date"
              value={formatDateTime(certification.expiry_date)}
              fullWidth
              InputProps={{ 
                readOnly: true,
                style: { color: expired ? '#d32f2f' : expiring ? '#f57c00' : 'inherit' }
              }}
              variant="outlined"
            />
          </Grid>

          {certification.surveillance_date && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Surveillance Date"
                value={formatDateTime(certification.surveillance_date)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {certification.validity_period && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Validity Period"
                value={certification.validity_period}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {/* Scope and Details */}
          {(certification.scope || certification.cost || certification.document_path) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Additional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {certification.scope && (
                <Grid item xs={12}>
                  <TextField
                    label="Scope"
                    value={certification.scope}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {certification.cost && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cost"
                    value={`₹${Number(certification.cost).toLocaleString()}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {certification.document_path && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Document Path"
                    value={certification.document_path}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}
            </>
          )}

          {/* Benefits and Requirements */}
          {(certification.benefits || certification.maintenance_requirements) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Benefits & Requirements
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {certification.benefits && (
                <Grid item xs={12}>
                  <TextField
                    label="Benefits"
                    value={certification.benefits}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {certification.maintenance_requirements && (
                <Grid item xs={12}>
                  <TextField
                    label="Maintenance Requirements"
                    value={certification.maintenance_requirements}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCertificationModal;
