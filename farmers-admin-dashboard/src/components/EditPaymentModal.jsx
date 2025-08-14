import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
  Divider,
} from '@mui/material';

// Constants from original Payments page
const PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Check', 'UPI', 'Digital Wallet'];
const PAYMENT_STATUS = ['Completed', 'Pending', 'Failed', 'Processing'];

// Validation patterns (same as original)
const FARMER_ID_REGEX = /^[A-Za-z]+[0-9]{4}$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;

const EditPaymentModal = ({ open, payment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    farmer_id: '',
    payment_date: '',
    amount: '',
    payment_mode: 'Bank Transfer',
    remarks: '',
    status: 'Completed',
    transaction_id: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payment) {
      setFormData({ 
        ...payment,
        payment_date: payment.payment_date ? payment.payment_date.slice(0, 10) : '',
        amount: payment.amount?.toString() || ''
      });
    } else {
      setFormData({
        farmer_id: '',
        payment_date: new Date().toISOString().slice(0, 10),
        amount: '',
        payment_mode: 'Bank Transfer',
        remarks: '',
        status: 'Completed',
        transaction_id: `TXN${Date.now()}`
      });
    }
    setErrors({});
  }, [payment, open]);

  const handleChange = field => e => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time validation
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'farmer_id':
        if (!value.trim()) {
          error = 'Farmer ID is required';
        } else if (!FARMER_ID_REGEX.test(value)) {
          error = 'ID must start with letters and end with 4 digits';
        }
        break;
      case 'amount':
        if (!value.trim()) {
          error = 'Amount is required';
        } else if (!NUMERIC_REGEX.test(value)) {
          error = 'Only numbers allowed';
        } else if (Number(value) <= 0) {
          error = 'Amount must be greater than 0';
        }
        break;
      case 'payment_date':
        if (!value.trim()) {
          error = 'Payment date is required';
        }
        break;
      case 'payment_mode':
        if (!value.trim()) {
          error = 'Payment mode is required';
        }
        break;
      case 'transaction_id':
        if (!value.trim()) {
          error = 'Transaction ID is required';
        }
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    const requiredFields = [
      'farmer_id', 'payment_date', 'amount', 'payment_mode', 'transaction_id'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid) {
      // Convert amount back to number
      const saveData = {
        ...formData,
        amount: Number(formData.amount)
      };
      onSave(saveData);
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {payment ? 'Edit Payment Record' : 'Add New Payment'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Payment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Payment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Farmer ID" 
              value={formData.farmer_id} 
              onChange={handleChange('farmer_id')} 
              fullWidth 
              required
              placeholder="ABC1234"
              error={!!errors.farmer_id}
              helperText={errors.farmer_id}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Amount (₹)" 
              value={formData.amount} 
              onChange={handleChange('amount')} 
              fullWidth 
              type="number"
              required
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Payment Date"
              type="date"
              value={formData.payment_date}
              onChange={handleChange('payment_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.payment_date}
              helperText={errors.payment_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.payment_mode}>
              <InputLabel>Payment Mode</InputLabel>
              <Select 
                value={formData.payment_mode} 
                onChange={handleChange('payment_mode')}
                label="Payment Mode"
              >
                {PAYMENT_MODES.map(mode => (
                  <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                ))}
              </Select>
              {errors.payment_mode && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.payment_mode}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Transaction ID" 
              value={formData.transaction_id} 
              onChange={handleChange('transaction_id')} 
              fullWidth 
              required
              error={!!errors.transaction_id}
              helperText={errors.transaction_id}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select 
                value={formData.status} 
                onChange={handleChange('status')}
                label="Status"
              >
                {PAYMENT_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Remarks (Optional)" 
              value={formData.remarks} 
              onChange={handleChange('remarks')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Any additional notes about this payment..."
            />
          </Grid>
        </Grid>

        {hasErrors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the validation errors above.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={hasErrors}>
          {payment ? 'Save Changes' : 'Add Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPaymentModal;
