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
  Receipt, 
  CalendarToday,
  AttachMoney,
  Person,
  Category,
  Description,
  Warning,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';

const ViewBillModal = ({ open, bill, onClose }) => {
  if (!bill) return null;

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
    if (status === 'Paid') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getStatusColor = (status, dueDate) => {
    const overdue = isOverdue(dueDate, status);
    if (overdue && status === 'Unpaid') return 'error';
    
    switch (status) {
      case 'Paid': return 'success';
      case 'Overdue': return 'error';
      case 'Partially Paid': return 'warning';
      case 'Unpaid': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status, dueDate) => {
    const overdue = isOverdue(dueDate, status);
    if (overdue && status === 'Unpaid') return <Error />;
    
    switch (status) {
      case 'Paid': return <CheckCircle />;
      case 'Overdue': return <Error />;
      case 'Partially Paid': return <Warning />;
      case 'Unpaid': return <Schedule />;
      default: return <Receipt />;
    }
  };

  const overdue = isOverdue(bill.due_date, bill.status);
  const displayStatus = overdue && bill.status === 'Unpaid' ? 'Overdue' : bill.status;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#8e24aa', width: 48, height: 48 }}>
            <Receipt />
          </Avatar>
          <Box>
            <Typography variant="h6">Bill Details</Typography>
            <Typography variant="body2" color="text.secondary">
              Bill ID: {bill.bill_id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {overdue && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This bill is overdue! Please process payment immediately.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Bill Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
              Bill Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bill ID"
              value={bill.bill_id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Farmer ID"
              value={bill.farmer_id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              value={`₹${Number(bill.amount || 0).toLocaleString()}`}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category
              </Typography>
              <Chip 
                label={bill.category}
                sx={{ 
                  bgcolor: 'rgba(142, 36, 170, 0.1)',
                  color: '#8e24aa',
                  fontWeight: 'medium'
                }}
                icon={<Category />}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={bill.description || ''}
              fullWidth
              multiline
              rows={2}
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
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
              label="Bill Date"
              value={formatDateTime(bill.bill_date)}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              value={formatDateTime(bill.due_date)}
              fullWidth
              InputProps={{ 
                readOnly: true,
                style: { color: overdue ? '#d32f2f' : 'inherit' }
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Status
              </Typography>
              <Chip 
                label={displayStatus}
                color={getStatusColor(bill.status, bill.due_date)}
                variant="outlined"
                size="medium"
                icon={getStatusIcon(bill.status, bill.due_date)}
              />
            </Box>
          </Grid>

          {/* System Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              System Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Created Date"
              value={bill.created_at ? formatDateTime(bill.created_at) : ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Updated"
              value={bill.updated_at ? formatDateTime(bill.updated_at) : ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewBillModal;
