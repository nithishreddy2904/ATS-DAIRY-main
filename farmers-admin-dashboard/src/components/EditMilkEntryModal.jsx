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
  Typography,
  Divider
} from '@mui/material';
import { LocalDrink } from '@mui/icons-material';

const EditMilkEntryModal = ({ open, milkEntry, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    farmer_id: '',
    farmer_name: '',
    date: '',
    quantity: '',
    shift: 'Morning',
    quality: 'A',
    fat_content: '',
    snf_content: '',
    temperature: '',
    ph_level: '',
    collection_center: '',
    collected_by: '',
    vehicle_number: '',
    remarks: '',
    payment_amount: '',
    payment_status: 'Pending'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (milkEntry) {
      setFormData({
        farmer_id: milkEntry.farmer_id || '',
        farmer_name: milkEntry.farmer_name || '',
        date: milkEntry.date ? milkEntry.date.split('T')[0] : '',
        quantity: milkEntry.quantity || '',
        shift: milkEntry.shift || 'Morning',
        quality: milkEntry.quality || 'A',
        fat_content: milkEntry.fat_content || '',
        snf_content: milkEntry.snf_content || '',
        temperature: milkEntry.temperature || '',
        ph_level: milkEntry.ph_level || '',
        collection_center: milkEntry.collection_center || '',
        collected_by: milkEntry.collected_by || '',
        vehicle_number: milkEntry.vehicle_number || '',
        remarks: milkEntry.remarks || '',
        payment_amount: milkEntry.payment_amount || '',
        payment_status: milkEntry.payment_status || 'Pending'
      });
      setErrors({});
    }
  }, [milkEntry]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmer_id) newErrors.farmer_id = 'Farmer ID is required';
    if (!formData.farmer_name) newErrors.farmer_name = 'Farmer name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    
    if (formData.fat_content && (parseFloat(formData.fat_content) < 0 || parseFloat(formData.fat_content) > 10)) {
      newErrors.fat_content = 'Fat content must be between 0-10%';
    }
    
    if (formData.snf_content && (parseFloat(formData.snf_content) < 0 || parseFloat(formData.snf_content) > 15)) {
      newErrors.snf_content = 'SNF content must be between 0-15%';
    }
    
    if (formData.temperature && (parseFloat(formData.temperature) < 0 || parseFloat(formData.temperature) > 50)) {
      newErrors.temperature = 'Temperature must be between 0-50°C';
    }
    
    if (formData.ph_level && (parseFloat(formData.ph_level) < 6 || parseFloat(formData.ph_level) > 8)) {
      newErrors.ph_level = 'pH level must be between 6-8';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const updatedMilkEntry = {
      ...milkEntry,
      ...formData
    };
    
    onSave(updatedMilkEntry);
  };

  if (!milkEntry) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalDrink />
          <Typography variant="h6" fontWeight="bold">
            Edit Milk Entry - #{milkEntry.id}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Farmer ID"
              value={formData.farmer_id}
              onChange={handleChange('farmer_id')}
              error={!!errors.farmer_id}
              helperText={errors.farmer_id}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Farmer Name"
              value={formData.farmer_name}
              onChange={handleChange('farmer_name')}
              error={!!errors.farmer_name}
              helperText={errors.farmer_name}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quantity (Liters)"
              type="number"
              value={formData.quantity}
              onChange={handleChange('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity}
              inputProps={{ min: 0, step: 0.1 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Shift</InputLabel>
              <Select
                value={formData.shift}
                onChange={handleChange('shift')}
                label="Shift"
              >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Quality Grade</InputLabel>
              <Select
                value={formData.quality}
                onChange={handleChange('quality')}
                label="Quality Grade"
              >
                <MenuItem value="A+">A+ (Excellent)</MenuItem>
                <MenuItem value="A">A (Good)</MenuItem>
                <MenuItem value="B">B (Average)</MenuItem>
                <MenuItem value="C">C (Below Average)</MenuItem>
                <MenuItem value="D">D (Poor)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Quality Parameters */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Quality Parameters
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fat Content (%)"
              type="number"
              value={formData.fat_content}
              onChange={handleChange('fat_content')}
              error={!!errors.fat_content}
              helperText={errors.fat_content}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SNF Content (%)"
              type="number"
              value={formData.snf_content}
              onChange={handleChange('snf_content')}
              error={!!errors.snf_content}
              helperText={errors.snf_content}
              inputProps={{ min: 0, max: 15, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Temperature (°C)"
              type="number"
              value={formData.temperature}
              onChange={handleChange('temperature')}
              error={!!errors.temperature}
              helperText={errors.temperature}
              inputProps={{ min: 0, max: 50, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="pH Level"
              type="number"
              value={formData.ph_level}
              onChange={handleChange('ph_level')}
              error={!!errors.ph_level}
              helperText={errors.ph_level}
              inputProps={{ min: 6, max: 8, step: 0.1 }}
            />
          </Grid>

          {/* Collection Details */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Collection Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Collection Center"
              value={formData.collection_center}
              onChange={handleChange('collection_center')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Collected By"
              value={formData.collected_by}
              onChange={handleChange('collected_by')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle Number"
              value={formData.vehicle_number}
              onChange={handleChange('vehicle_number')}
            />
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Payment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Payment Amount (₹)"
              type="number"
              value={formData.payment_amount}
              onChange={handleChange('payment_amount')}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={formData.payment_status}
                onChange={handleChange('payment_status')}
                label="Payment Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={3}
              value={formData.remarks}
              onChange={handleChange('remarks')}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMilkEntryModal;
