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
  Typography
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const VEHICLE_TYPES = ['Truck', 'Van', 'Bike', 'Refrigerated Truck'];
const FUEL_TYPES = ['Diesel', 'Petrol', 'Electric', 'CNG'];
const VEHICLE_STATUS = ['Available', 'In Use', 'Under Maintenance', 'Out of Service'];

const EditFleetModal = ({ open, fleet, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    vehicle_number: '',
    vehicle_type: '',
    driver_name: '',
    driver_phone: '',
    capacity: '',
    status: 'Available',
    fuel_type: 'Diesel',
    last_maintenance_date: '',
    next_maintenance_date: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (fleet) {
      setFormData({
        ...fleet,
        last_maintenance_date: fleet.last_maintenance_date 
          ? fleet.last_maintenance_date.split('T')[0] 
          : '',
        next_maintenance_date: fleet.next_maintenance_date 
          ? fleet.next_maintenance_date.split('T')[0] 
          : ''
      });
      setErrors({});
    }
  }, [fleet]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.vehicle_number) {
      newErrors.vehicle_number = 'Vehicle number is required';
    }
    if (!formData.vehicle_type) {
      newErrors.vehicle_type = 'Vehicle type is required';
    }
    if (!formData.driver_name) {
      newErrors.driver_name = 'Driver name is required';
    }
    if (!formData.driver_phone) {
      newErrors.driver_phone = 'Driver phone is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.driver_phone)) {
      newErrors.driver_phone = 'Enter valid 10-digit phone number starting with 6-9';
    }
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
      const updatedFleet = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      onSave(updatedFleet);
    }
  };

  if (!fleet) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Edit color="warning" />
        Edit Fleet Record
      </DialogTitle>
      <DialogContent>
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please fix the validation errors below.
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fleet ID"
              value={formData.id}
              fullWidth
              disabled
              helperText="Fleet ID cannot be changed"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vehicle Number"
              value={formData.vehicle_number}
              onChange={handleChange('vehicle_number')}
              error={!!errors.vehicle_number}
              helperText={errors.vehicle_number}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.vehicle_type}>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={formData.vehicle_type}
                onChange={handleChange('vehicle_type')}
                label="Vehicle Type"
              >
                {VEHICLE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.vehicle_type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.vehicle_type}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Driver Name"
              value={formData.driver_name}
              onChange={handleChange('driver_name')}
              error={!!errors.driver_name}
              helperText={errors.driver_name}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Driver Phone"
              value={formData.driver_phone}
              onChange={handleChange('driver_phone')}
              error={!!errors.driver_phone}
              helperText={errors.driver_phone}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Capacity (Liters)"
              value={formData.capacity}
              onChange={handleChange('capacity')}
              error={!!errors.capacity}
              helperText={errors.capacity}
              fullWidth
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={formData.fuel_type}
                onChange={handleChange('fuel_type')}
                label="Fuel Type"
              >
                {FUEL_TYPES.map(fuel => (
                  <MenuItem key={fuel} value={fuel}>
                    {fuel}
                  </MenuItem>
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
                {VEHICLE_STATUS.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Maintenance Date"
              type="date"
              value={formData.last_maintenance_date}
              onChange={handleChange('last_maintenance_date')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Next Maintenance Date"
              type="date"
              value={formData.next_maintenance_date}
              onChange={handleChange('next_maintenance_date')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              value={formData.location}
              onChange={handleChange('location')}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSaveClick}
          sx={{ borderRadius: 2 }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFleetModal;