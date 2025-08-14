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
  Alert
} from '@mui/material';

// Validation regex patterns (same as SalesRetailers)
const AMOUNT_REGEX = /^\d+$/;

const EditSaleModal = ({ open, sale, retailers, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    date: '',
    retailer: '',
    amount: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sale) {
      setFormData({ 
        ...sale,
        date: sale.date ? sale.date.slice(0, 10) : '',
        amount: sale.amount ? sale.amount.toString() : ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 10), // Default to today
        retailer: '',
        amount: ''
      });
    }
    setErrors({});
  }, [sale, open]);

  const handleChange = field => e => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    if (field === 'amount') {
      if (!AMOUNT_REGEX.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, amount: 'Only numbers allowed' }));
      } else {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };

  const handleSave = () => {
    // Final validation
    const newErrors = {};
    
    if (!formData.date.trim()) {
      newErrors.date = 'Sale date is required';
    }

    if (!formData.retailer.trim()) {
      newErrors.retailer = 'Retailer selection is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (!AMOUNT_REGEX.test(formData.amount)) {
      newErrors.amount = 'Only numbers allowed';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        amount: Number(formData.amount)
      });
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{sale ? 'Edit Sale Record' : 'Add New Sale'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sale Date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.date}
              helperText={errors.date}
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
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.retailer}>
              <InputLabel>Retailer</InputLabel>
              <Select 
                value={formData.retailer} 
                onChange={handleChange('retailer')}
                label="Retailer"
              >
                {retailers.map(retailer => (
                  <MenuItem key={retailer.id} value={retailer.name}>
                    {retailer.name} - {retailer.location}
                  </MenuItem>
                ))}
              </Select>
              {errors.retailer && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.retailer}
                </Alert>
              )}
            </FormControl>
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
          {sale ? 'Save Changes' : 'Add Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSaleModal;
