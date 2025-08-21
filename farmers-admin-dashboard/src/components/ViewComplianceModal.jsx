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
  VerifiedUser, 
  Assignment,
  CalendarToday,
  Person,
  Business,
  Warning,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';

const ViewComplianceModal = ({ open, record, onClose }) => {
  if (!record) return null;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'Compliant') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant': return 'success';
      case 'Non-Compliant': case 'Expired': return 'error';
      case 'Under Review': return 'info';
      case 'Pending': return 'warning';
      case 'Renewed': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Medium': return '#1976d2';
      case 'Low': return '#388e3c';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Compliant': case 'Renewed': return <CheckCircle />;
      case 'Non-Compliant': case 'Expired': return <Error />;
      case 'Under Review': return <Schedule />;
      case 'Pending': return <Warning />;
      default: return <Assignment />;
    }
  };

  const overdue = isOverdue(record.due_date, record.status);

  // Calculate completion percentage based on status and dates
  const getCompletionPercentage = () => {
    if (record.status === 'Compliant') return 100;
    if (record.status === 'Non-Compliant' || record.status === 'Expired') return 0;
    if (record.completed_date) return 80;
    if (record.status === 'Under Review') return 60;
    if (record.status === 'Pending') return 20;
    return 10;
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>
            <VerifiedUser />
          </Avatar>
          <Box>
            <Typography variant="h6">{record.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Record ID: {record.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {overdue && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This compliance record is overdue! Immediate action required.
          </Alert>
        )}

        {record.priority === 'Critical' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Critical priority item - requires urgent attention.
          </Alert>
        )}

        {/* Completion Progress */}
        <Box mb={3}>
          <Typography variant="body2" gutterBottom>
            Completion Progress: {completionPercentage}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: alpha('#e0e0e0', 0.5),
              '& .MuiLinearProgress-bar': {
                backgroundColor: completionPercentage >= 80 ? '#4caf50' : 
                               completionPercentage >= 60 ? '#ff9800' : '#f44336'
              }
            }} 
          />
        </Box>
        
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Compliance Type"
              value={record.type}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              value={record.title}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={record.description || ''}
              fullWidth
              multiline
              rows={2}
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Priority
              </Typography>
              <Chip 
                label={record.priority}
                sx={{ 
                  bgcolor: alpha(getPriorityColor(record.priority), 0.1),
                  color: getPriorityColor(record.priority),
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={record.status}
                color={getStatusColor(record.status)}
                variant="outlined"
                icon={getStatusIcon(record.status)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Risk Level
              </Typography>
              <Chip 
                label={record.risk_level}
                sx={{ 
                  bgcolor: alpha(getPriorityColor(record.risk_level), 0.1),
                  color: getPriorityColor(record.risk_level),
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Grid>

          {/* Assignment Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Assignment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Assigned To"
              value={record.assigned_to}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Responsible Department"
              value={record.responsible_department}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          {record.compliance_officer && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Compliance Officer"
                value={record.compliance_officer}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {record.regulatory_body && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Regulatory Body"
                value={record.regulatory_body}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

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
              label="Due Date"
              value={formatDateTime(record.due_date)}
              fullWidth
              InputProps={{ 
                readOnly: true,
                style: { color: overdue ? '#d32f2f' : 'inherit' }
              }}
              variant="outlined"
            />
          </Grid>

          {record.completed_date && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Completed Date"
                value={formatDateTime(record.completed_date)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {record.renewal_date && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Renewal Date"
                value={formatDateTime(record.renewal_date)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {/* Additional Information */}
          {(record.license_number || record.cost || record.validity_period || record.business_impact) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {record.license_number && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="License Number"
                    value={record.license_number}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {record.cost && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cost"
                    value={`₹${Number(record.cost).toLocaleString()}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {record.validity_period && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Validity Period"
                    value={record.validity_period}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {record.business_impact && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Business Impact"
                    value={record.business_impact}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}
            </>
          )}

          {record.remarks && (
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                value={record.remarks}
                fullWidth
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewComplianceModal;
