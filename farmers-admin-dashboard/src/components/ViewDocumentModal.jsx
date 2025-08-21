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
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Description,
  InsertDriveFile,
  CalendarToday,
  Person,
  FolderOpen,
  Warning,
  CheckCircle,
  Schedule,
  Error,
  CloudUpload,
  Verified,
  Assignment,
} from '@mui/icons-material';

const ViewDocumentModal = ({ open, document, onClose }) => {
  if (!document) return null;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const isExpired = (doc) => {
    if (!doc.expiry_date) return false;
    const today = new Date();
    const expiry = new Date(doc.expiry_date);
    return expiry < today;
  };

  const isExpiringSoon = (doc) => {
    if (!doc.expiry_date) return false;
    const today = new Date();
    const expiry = new Date(doc.expiry_date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'error';
      case 'Under Review': return 'warning';
      default: return 'default';
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'License': return '#9c27b0';
      case 'Certificate': return '#2196f3';
      case 'Report': return '#ff9800';
      case 'Policy': return '#4caf50';
      case 'Procedure': return '#f44336';
      case 'Record': return '#795548';
      case 'Manual': return '#607d8b';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle />;
      case 'Expired': return <Error />;
      case 'Under Review': return <Schedule />;
      default: return <Warning />;
    }
  };

  const expired = isExpired(document);
  const expiringSoon = isExpiringSoon(document);

  // Calculate document health percentage
  const getDocumentHealth = () => {
    if (expired) return 0;
    if (expiringSoon) return 40;
    if (document.status === 'Under Review') return 60;
    if (document.status === 'Active') return 100;
    return 50;
  };

  const healthPercentage = getDocumentHealth();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#9c27b0' }}>
            <Description />
          </Avatar>
          <Box>
            <Typography variant="h6">{document.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Document ID: {document.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        {/* Alerts */}
        {expired && (
          <Alert 
            severity="error" 
            icon={<Error />} 
            sx={{ mb: 2, borderRadius: 2 }}
          >
            This document has expired! Please update or renew immediately.
          </Alert>
        )}

        {expiringSoon && !expired && (
          <Alert 
            severity="warning" 
            icon={<Warning />} 
            sx={{ mb: 2, borderRadius: 2 }}
          >
            This document will expire within 30 days. Consider renewal soon.
          </Alert>
        )}

        {document.type === 'License' && (
          <Alert 
            severity="info" 
            icon={<Verified />} 
            sx={{ mb: 2, borderRadius: 2 }}
          >
            Critical license document - ensure compliance requirements are met.
          </Alert>
        )}

        {/* Document Health Progress */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Document Health: {healthPercentage}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={healthPercentage}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: healthPercentage >= 80 ? '#4caf50' :
                                healthPercentage >= 60 ? '#ff9800' : '#f44336'
              }
            }} 
          />
        </Box>

        <Grid container spacing={3}>
          {/* Basic Document Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InsertDriveFile sx={{ mr: 1, color: '#9c27b0' }} />
              Document Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Document Type"
              value={document.type}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              value={document.category}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Status"
                value={document.status}
                fullWidth
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
              <Chip 
                icon={getStatusIcon(document.status)}
                label={document.status}
                color={getStatusColor(document.status)}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Version"
              value={document.version || 'N/A'}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* File Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FolderOpen sx={{ mr: 1, color: '#9c27b0' }} />
              File Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="File Size"
              value={document.size || 'N/A'}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="File Path"
              value={document.file_path || 'N/A'}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* People Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1, color: '#9c27b0' }} />
              People & Approval
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Uploaded By"
              value={document.uploaded_by}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {document.reviewed_by && (
            <Grid item xs={12} sm={4}>
              <TextField
                label="Reviewed By"
                value={document.reviewed_by}
                fullWidth
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          {document.approved_by && (
            <Grid item xs={12} sm={4}>
              <TextField
                label="Approved By"
                value={document.approved_by}
                fullWidth
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          {/* Date Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1, color: '#9c27b0' }} />
              Date Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Upload Date"
              value={formatDateTime(document.upload_date)}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {document.expiry_date && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label="Expiry Date"
                  value={formatDateTime(document.expiry_date)}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
                {expired && <Error color="error" />}
                {expiringSoon && !expired && <Warning color="warning" />}
                {!expired && !expiringSoon && <CheckCircle color="success" />}
              </Box>
            </Grid>
          )}

          {/* Description */}
          {document.description && (
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={document.description}
                fullWidth
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDocumentModal;
