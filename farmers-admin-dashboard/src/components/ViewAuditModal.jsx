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
} from '@mui/material';
import { 
  Assessment, 
  CalendarToday,
  AttachMoney,
  Person,
  Business,
  CheckCircle,
  Error,
  Warning,
  Schedule,
  PlayArrow,
} from '@mui/icons-material';

const ViewAuditModal = ({ open, audit, onClose }) => {
  if (!audit) return null;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const isOverdue = (scheduledDate, status) => {
    if (status === 'Completed' || status === 'Cancelled') return false;
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    return scheduled < today;
  };

  const getStatusColor = (status, scheduledDate) => {
    const overdue = isOverdue(scheduledDate, status);
    if (overdue && status === 'Scheduled') return 'error';
    
    switch (status) {
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'In Progress': return 'info';
      case 'Scheduled': case 'Rescheduled': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status, scheduledDate) => {
    const overdue = isOverdue(scheduledDate, status);
    if (overdue && status === 'Scheduled') return <Error />;
    
    switch (status) {
      case 'Completed': return <CheckCircle />;
      case 'Cancelled': return <Error />;
      case 'In Progress': return <PlayArrow />;
      case 'Scheduled': case 'Rescheduled': return <Schedule />;
      default: return <Assessment />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const overdue = isOverdue(audit.scheduled_date, audit.status);
  const displayStatus = overdue && audit.status === 'Scheduled' ? 'Overdue' : audit.status;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48 }}>
            <Assessment />
          </Avatar>
          <Box>
            <Typography variant="h6">{audit.audit_type}</Typography>
            <Typography variant="body2" color="text.secondary">
              Audit ID: {audit.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {overdue && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This audit is overdue! Please reschedule or update status.
          </Alert>
        )}

        {audit.status === 'In Progress' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This audit is currently in progress.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Audit Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Audit Type"
              value={audit.audit_type}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Auditor"
              value={audit.auditor}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          {audit.audit_firm && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Audit Firm"
                value={audit.audit_firm}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={displayStatus}
                color={getStatusColor(audit.status, audit.scheduled_date)}
                variant="outlined"
                icon={getStatusIcon(audit.status, audit.scheduled_date)}
                size="medium"
              />
            </Box>
          </Grid>

          {audit.score && audit.score > 0 && (
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Audit Score
                </Typography>
                <Chip 
                  label={`${audit.score}%`}
                  sx={{ 
                    bgcolor: `${getScoreColor(audit.score)}20`,
                    color: getScoreColor(audit.score),
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                  size="medium"
                />
              </Box>
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
              label="Scheduled Date"
              value={formatDateTime(audit.scheduled_date)}
              fullWidth
              InputProps={{ 
                readOnly: true,
                style: { color: overdue ? '#d32f2f' : 'inherit' }
              }}
              variant="outlined"
            />
          </Grid>

          {audit.completed_date && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Completed Date"
                value={formatDateTime(audit.completed_date)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {audit.follow_up_date && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Follow-up Date"
                value={formatDateTime(audit.follow_up_date)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {audit.duration && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration"
                value={`${audit.duration} days`}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {/* Scope and Criteria */}
          {(audit.audit_scope || audit.audit_criteria) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Scope & Criteria
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {audit.audit_scope && (
                <Grid item xs={12}>
                  <TextField
                    label="Audit Scope"
                    value={audit.audit_scope}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {audit.audit_criteria && (
                <Grid item xs={12}>
                  <TextField
                    label="Audit Criteria"
                    value={audit.audit_criteria}
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

          {/* Findings and Actions */}
          {(audit.findings || audit.corrective_actions || audit.non_conformities || audit.recommendations) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Findings & Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {audit.findings && (
                <Grid item xs={12}>
                  <TextField
                    label="Findings"
                    value={audit.findings}
                    fullWidth
                    multiline
                    rows={3}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {audit.corrective_actions && (
                <Grid item xs={12}>
                  <TextField
                    label="Corrective Actions"
                    value={audit.corrective_actions}
                    fullWidth
                    multiline
                    rows={3}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {audit.non_conformities && (
                <Grid item xs={12}>
                  <TextField
                    label="Non-Conformities"
                    value={audit.non_conformities}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {audit.recommendations && (
                <Grid item xs={12}>
                  <TextField
                    label="Recommendations"
                    value={audit.recommendations}
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

          {/* Additional Information */}
          {(audit.cost || audit.report_path) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {audit.cost && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cost"
                    value={`₹${Number(audit.cost).toLocaleString()}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {audit.report_path && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Report Path"
                    value={audit.report_path}
                    fullWidth
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

export default ViewAuditModal;
