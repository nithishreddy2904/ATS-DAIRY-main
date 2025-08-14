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
} from '@mui/material';
import { 
  Payment, 
  AccountBalance, 
  CreditCard,
  Person,
  CalendarToday,
  AttachMoney 
} from '@mui/icons-material';

const ViewPaymentModal = ({ open, payment, onClose }) => {
  if (!payment) return null;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const getPaymentModeIcon = (mode) => {
    switch (mode) {
      case 'Bank Transfer': return <AccountBalance />;
      case 'Cash': return <Payment />;
      case 'Check': return <Payment />;
      case 'UPI': return <CreditCard />;
      case 'Digital Wallet': return <CreditCard />;
      default: return <Payment />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Failed': return 'error';
      case 'Processing': return 'info';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#8e24aa', width: 48, height: 48 }}>
            <Payment />
          </Avatar>
          <Box>
            <Typography variant="h6">Payment Details</Typography>
            <Typography variant="body2" color="text.secondary">
              Transaction ID: {payment.transaction_id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Payment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Farmer ID"
              value={payment.farmer_id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              value={`₹${Number(payment.amount || 0).toLocaleString()}`}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Payment Date"
              value={formatDateTime(payment.payment_date)}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Mode
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#8e24aa', width: 32, height: 32 }}>
                  {getPaymentModeIcon(payment.payment_mode)}
                </Avatar>
                <Typography variant="body1" fontWeight="medium">
                  {payment.payment_mode}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Transaction ID"
              value={payment.transaction_id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Status
              </Typography>
              <Chip 
                label={payment.status}
                color={getStatusColor(payment.status)}
                variant="outlined"
                size="medium"
              />
            </Box>
          </Grid>

          {payment.remarks && (
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                value={payment.remarks}
                fullWidth
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {/* System Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              System Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Recorded Date"
              value={payment.created_at ? formatDateTime(payment.created_at) : ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Updated"
              value={payment.updated_at ? formatDateTime(payment.updated_at) : ''}
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

export default ViewPaymentModal;
