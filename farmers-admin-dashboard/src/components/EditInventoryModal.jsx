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

// Constants from original Inventory page
const CATEGORIES = ['Raw Milk', 'Processed Products', 'Packaging Materials', 'Chemicals & Additives', 'Equipment Parts', 'Office Supplies'];
const UNITS = ['Liters', 'Kilograms', 'Units', 'Boxes', 'Bottles', 'Packets'];
const SUPPLIERS = ['Dairy Farm Co.', 'Packaging Solutions Ltd.', 'Chemical Supply Inc.', 'Equipment Parts Co.', 'Office Depot'];
const LOCATIONS = ['Warehouse A', 'Warehouse B', 'Cold Storage', 'Processing Floor', 'Office Storage'];
const ITEM_STATUS = ['In Stock', 'Low Stock', 'Out of Stock', 'Expired', 'Reserved'];

// Validation patterns from original
const ITEM_CODE_REGEX = /^[A-Z]{3}[0-9]{4}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;

const EditInventoryModal = ({ open, item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    item_code: '',
    item_name: '',
    category: '',
    current_stock_level: '',
    unit: '',
    minimum_stock_level: '',
    maximum_stock_level: '',
    location: '',
    supplier: '',
    status: 'In Stock',
    last_updated: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ 
        ...item,
        current_stock_level: item.current_stock_level?.toString() || '',
        minimum_stock_level: item.minimum_stock_level?.toString() || '',
        maximum_stock_level: item.maximum_stock_level?.toString() || '',
        last_updated: item.last_updated ? item.last_updated.slice(0, 10) : ''
      });
    } else {
      setFormData({
        item_code: '',
        item_name: '',
        category: '',
        current_stock_level: '',
        unit: '',
        minimum_stock_level: '',
        maximum_stock_level: '',
        location: '',
        supplier: '',
        status: 'In Stock',
        last_updated: new Date().toISOString().slice(0, 10)
      });
    }
    setErrors({});
  }, [item, open]);

  const handleChange = field => e => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    if (field === 'item_code') {
      if (!ITEM_CODE_REGEX.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, item_code: 'Format: ABC1234 (3 letters + 4 digits)' }));
      } else {
        setErrors(prev => ({ ...prev, item_code: '' }));
      }
    }

    if (field === 'item_name') {
      if (!NAME_REGEX.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, item_name: 'Only alphabets and spaces allowed' }));
      } else {
        setErrors(prev => ({ ...prev, item_name: '' }));
      }
    }

    if (['current_stock_level', 'minimum_stock_level', 'maximum_stock_level'].includes(field)) {
      if (!NUMERIC_REGEX.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, [field]: 'Only numbers allowed' }));
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleSave = () => {
    // Final validation
    const newErrors = {};
    
    if (!formData.item_code.trim()) {
      newErrors.item_code = 'Item code is required';
    } else if (!ITEM_CODE_REGEX.test(formData.item_code)) {
      newErrors.item_code = 'Format: ABC1234 (3 letters + 4 digits)';
    }

    if (!formData.item_name.trim()) {
      newErrors.item_name = 'Item name is required';
    } else if (!NAME_REGEX.test(formData.item_name)) {
      newErrors.item_name = 'Only alphabets and spaces allowed';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.current_stock_level.trim()) {
      newErrors.current_stock_level = 'Current stock level is required';
    } else if (!NUMERIC_REGEX.test(formData.current_stock_level)) {
      newErrors.current_stock_level = 'Only numbers allowed';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (formData.minimum_stock_level && !NUMERIC_REGEX.test(formData.minimum_stock_level)) {
      newErrors.minimum_stock_level = 'Only numbers allowed';
    }

    if (formData.maximum_stock_level && !NUMERIC_REGEX.test(formData.maximum_stock_level)) {
      newErrors.maximum_stock_level = 'Only numbers allowed';
    }

    // Logical validation
    if (formData.minimum_stock_level && formData.maximum_stock_level) {
      const min = Number(formData.minimum_stock_level);
      const max = Number(formData.maximum_stock_level);
      if (min >= max) {
        newErrors.maximum_stock_level = 'Maximum stock must be greater than minimum stock';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Convert numeric fields back to numbers
      const saveData = {
        ...formData,
        current_stock_level: Number(formData.current_stock_level),
        minimum_stock_level: Number(formData.minimum_stock_level || 0),
        maximum_stock_level: Number(formData.maximum_stock_level || 0)
      };
      onSave(saveData);
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Item Code" 
              value={formData.item_code} 
              onChange={handleChange('item_code')} 
              fullWidth 
              required
              placeholder="ABC1234"
              error={!!errors.item_code}
              helperText={errors.item_code}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Item Name" 
              value={formData.item_name} 
              onChange={handleChange('item_name')} 
              fullWidth 
              required
              error={!!errors.item_name}
              helperText={errors.item_name}
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
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.unit}>
              <InputLabel>Unit</InputLabel>
              <Select 
                value={formData.unit} 
                onChange={handleChange('unit')}
                label="Unit"
              >
                {UNITS.map(unit => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
              label="Current Stock Level" 
              value={formData.current_stock_level} 
              onChange={handleChange('current_stock_level')} 
              fullWidth 
              type="number"
              required
              error={!!errors.current_stock_level}
              helperText={errors.current_stock_level}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
              label="Minimum Stock Level" 
              value={formData.minimum_stock_level} 
              onChange={handleChange('minimum_stock_level')} 
              fullWidth 
              type="number"
              error={!!errors.minimum_stock_level}
              helperText={errors.minimum_stock_level}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
              label="Maximum Stock Level" 
              value={formData.maximum_stock_level} 
              onChange={handleChange('maximum_stock_level')} 
              fullWidth 
              type="number"
              error={!!errors.maximum_stock_level}
              helperText={errors.maximum_stock_level}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select 
                value={formData.location} 
                onChange={handleChange('location')}
                label="Location"
              >
                {LOCATIONS.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select 
                value={formData.supplier} 
                onChange={handleChange('supplier')}
                label="Supplier"
              >
                {SUPPLIERS.map(supplier => (
                  <MenuItem key={supplier} value={supplier}>{supplier}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select 
                value={formData.status} 
                onChange={handleChange('status')}
                label="Status"
              >
                {ITEM_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Updated"
              type="date"
              value={formData.last_updated}
              onChange={handleChange('last_updated')}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
          {item ? 'Save Changes' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInventoryModal;
