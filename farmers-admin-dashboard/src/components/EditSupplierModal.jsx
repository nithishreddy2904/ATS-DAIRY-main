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
  Box,
  Avatar,
  Typography,
  Alert
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

const SUPPLIER_TYPES = [
  'Feed Supplier',
  'Equipment Supplier', 
  'Packaging Supplier',
  'Chemical Supplier',
  'Testing Services',
  'Logistics',
  'Other'
];

const SUPPLIER_STATUS = ['Active', 'Inactive', 'Pending Approval'];

const EditSupplierModal = ({ open, supplier, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    supplierType: '',
    status: 'Active',
    joinDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      console.log('EditSupplierModal - received supplier:', supplier);
      setFormData({
        id: supplier.id || '',
        companyName: supplier.companyName || '',
        contactPerson: supplier.contactPerson || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        supplierType: supplier.supplierType || '',
        status: supplier.status || 'Active',
        joinDate: supplier.joinDate || ''
      });
      setError('');
      setValidationErrors({});
    }
  }, [supplier]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Enter valid 10-digit mobile number starting with 6-9';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter valid email address';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier type is required';
    }
    
    if (!formData.joinDate) {
      errors.joinDate = 'Join date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('EditSupplierModal - saving supplier:', formData);
      
      if (onSave && typeof onSave === 'function') {
        await onSave(formData);
        console.log('Supplier updated successfully');
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      setError('Failed to update supplier: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while saving
    
    setError('');
    setValidationErrors({});
    
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Edit Supplier</Typography>
            <Typography variant="body2" color="textSecondary">
              Update supplier information
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier ID"
              value={formData.id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange('companyName')}
              fullWidth
              required
              variant="outlined"
              size="small"
              error={!!validationErrors.companyName}
              helperText={validationErrors.companyName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange('contactPerson')}
              fullWidth
              required
              variant="outlined"
              size="small"
              error={!!validationErrors.contactPerson}
              helperText={validationErrors.contactPerson}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
              required
              variant="outlined"
              size="small"
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
              required
              type="email"
              variant="outlined"
              size="small"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              fullWidth
              multiline
              rows={2}
              required
              variant="outlined"
              size="small"
              error={!!validationErrors.address}
              helperText={validationErrors.address}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required variant="outlined" size="small" error={!!validationErrors.supplierType}>
              <InputLabel>Supplier Type</InputLabel>
              <Select
                value={formData.supplierType}
                label="Supplier Type"
                onChange={handleChange('supplierType')}
              >
                {SUPPLIER_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.supplierType && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {validationErrors.supplierType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required variant="outlined" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleChange('status')}
              >
                {SUPPLIER_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Join Date"
              value={formData.joinDate}
              onChange={handleChange('joinDate')}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              required
              error={!!validationErrors.joinDate}
              helperText={validationErrors.joinDate}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="secondary" 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSupplierModal;
