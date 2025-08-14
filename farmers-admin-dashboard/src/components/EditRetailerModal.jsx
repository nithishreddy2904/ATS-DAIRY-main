import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Alert
} from '@mui/material';

// Validation regex patterns (same as SalesRetailers)
const NAME_REGEX = /^[A-Za-z\s]+$/;
const LOCATION_REGEX = /^[A-Za-z\s]+$/;
const CONTACT_REGEX = /^\d{10}$/;

const EditRetailerModal = ({ open, retailer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    total_sales: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (retailer) {
      setFormData({ 
        ...retailer,
        total_sales: retailer.total_sales || 0
      });
    } else {
      setFormData({
        name: '',
        location: '',
        contact: '',
        total_sales: 0
      });
    }
    setErrors({});
  }, [retailer, open]);

  const handleChange = field => e => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    if (field === 'name') {
      if (!NAME_REGEX.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, name: 'Only alphabets and spaces allowed' }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    }

    if (field === 'location') {
      if (!LOCATION_REGEX.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, location: 'Only alphabets and spaces allowed' }));
      } else {
        setErrors(prev => ({ ...prev, location: '' }));
      }
    }

    if (field === 'contact') {
      if (!/^\d{0,10}$/.test(value)) {
        setErrors(prev => ({ ...prev, contact: 'Only numbers, max 10 digits' }));
      } else if (value.length === 10 || value.length === 0) {
        setErrors(prev => ({ ...prev, contact: '' }));
      } else {
        setErrors(prev => ({ ...prev, contact: 'Contact must be 10 digits' }));
      }
    }
  };

  const handleSave = () => {
    // Final validation
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Retailer name is required';
    } else if (!NAME_REGEX.test(formData.name)) {
      newErrors.name = 'Only alphabets and spaces allowed';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (!LOCATION_REGEX.test(formData.location)) {
      newErrors.location = 'Only alphabets and spaces allowed';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!CONTACT_REGEX.test(formData.contact)) {
      newErrors.contact = 'Contact must be exactly 10 digits';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{retailer ? 'Edit Retailer' : 'Add New Retailer'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              label="Retailer Name" 
              value={formData.name} 
              onChange={handleChange('name')} 
              fullWidth 
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Location" 
              value={formData.location} 
              onChange={handleChange('location')} 
              fullWidth 
              required
              error={!!errors.location}
              helperText={errors.location}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Contact Number" 
              value={formData.contact} 
              onChange={handleChange('contact')} 
              fullWidth 
              required
              inputProps={{ maxLength: 10 }}
              error={!!errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          {retailer && (
            <Grid item xs={12}>
              <TextField 
                label="Total Sales (₹)" 
                value={`₹${Number(formData.total_sales || 0).toLocaleString()}`}
                fullWidth 
                InputProps={{ readOnly: true }}
                helperText="Total sales are calculated automatically from sales records"
              />
            </Grid>
          )}
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
          {retailer ? 'Save Changes' : 'Add Retailer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRetailerModal;
