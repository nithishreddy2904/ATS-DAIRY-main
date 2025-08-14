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
const BILL_STATUS = ['Paid', 'Unpaid', 'Overdue', 'Partially Paid'];
const BILL_CATEGORIES = ['Milk Purchase', 'Equipment', 'Maintenance', 'Transport', 'Utilities', 'Other'];

// Validation patterns (same as original)
const FARMER_ID_REGEX = /^[A-Za-z]+[0-9]{4}$/;
const BILL_ID_REGEX = /^[A-Z]{3}[0-9]{4}$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;

const EditBillModal = ({ open, bill, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    bill_id: '',
    farmer_id: '',
    bill_date: '',
    due_date: '',
    amount: '',
    description: '',
    status: 'Unpaid',
    category: 'Milk Purchase'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bill) {
      setFormData({ 
        ...bill,
        bill_date: bill.bill_date ? bill.bill_date.slice(0, 10) : '',
        due_date: bill.due_date ? bill.due_date.slice(0, 10) : '',
        amount: bill.amount?.toString() || ''
      });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const dueDate = nextMonth.toISOString().slice(0, 10);
      
      setFormData({
        bill_id: '',
        farmer_id: '',
        bill_date: today,
        due_date: dueDate,
        amount: '',
        description: '',
        status: 'Unpaid',
        category: 'Milk Purchase'
      });
    }
    setErrors({});
  }, [bill, open]);

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
      case 'bill_id':
        if (!value.trim()) {
          error = 'Bill ID is required';
        } else if (!BILL_ID_REGEX.test(value)) {
          error = 'Format: BIL0001 (3 letters + 4 digits)';
        }
        break;
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
      case 'bill_date':
        if (!value.trim()) {
          error = 'Bill date is required';
        }
        break;
      case 'due_date':
        if (!value.trim()) {
          error = 'Due date is required';
        } else if (formData.bill_date && new Date(value) < new Date(formData.bill_date)) {
          error = 'Due date cannot be before bill date';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
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
    // Required field validations
    const requiredFields = [
      'bill_id', 'farmer_id', 'bill_date', 'due_date', 'amount', 'description'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    // Check if due date is after bill date
    if (formData.bill_date && formData.due_date) {
      if (new Date(formData.due_date) < new Date(formData.bill_date)) {
        setErrors(prev => ({ ...prev, due_date: 'Due date cannot be before bill date' }));
      }
    }

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {bill ? 'Edit Bill' : 'Add New Bill'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Bill Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Bill Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Bill ID" 
              value={formData.bill_id} 
              onChange={handleChange('bill_id')} 
              fullWidth 
              required
              placeholder="BIL0001"
              error={!!errors.bill_id}
              helperText={errors.bill_id}
            />
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
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select 
                value={formData.category} 
                onChange={handleChange('category')}
                label="Category"
              >
                {BILL_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Description" 
              value={formData.description} 
              onChange={handleChange('description')} 
              fullWidth 
              required
              multiline
              rows={2}
              placeholder="Enter bill description or invoice details..."
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          {/* Date Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Date Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Bill Date"
              type="date"
              value={formData.bill_date}
              onChange={handleChange('bill_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.bill_date}
              helperText={errors.bill_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={handleChange('due_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.due_date}
              helperText={errors.due_date}
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
                {BILL_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
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
          {bill ? 'Save Changes' : 'Add Bill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBillModal;
