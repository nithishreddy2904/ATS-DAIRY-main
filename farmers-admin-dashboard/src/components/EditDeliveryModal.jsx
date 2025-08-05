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

const DELIVERY_STATUS = ['in_transit', 'Delivered', 'Pending', 'Cancelled'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const ROUTES = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];

const EditDeliveryModal = ({ open, delivery, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    delivery_date: '',
    vehicle_id: '',
    vehicle_number: '',
    driver_name: '',
    destination: '',
    status: 'Pending',
    priority: 'Medium',
    estimatedTime: '',
    distance: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (delivery) {
      const formattedDate = delivery.delivery_date 
        ? new Date(delivery.delivery_date).toISOString().split('T')[0]
        : '';
      
      setFormData({
        ...delivery,
        delivery_date: formattedDate,
        priority: delivery.priority || 'Medium',
        estimatedTime: delivery.estimatedTime || '',
        distance: delivery.distance || '',
        notes: delivery.notes || ''
      });
      setErrors({});
    }
  }, [delivery]);

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

    if (!formData.delivery_date) {
      newErrors.delivery_date = 'Delivery date is required';
    }
    if (!formData.driver_name) {
      newErrors.driver_name = 'Driver name is required';
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  if (!delivery) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Edit color="warning" />
        Edit Delivery
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
              label="Delivery ID"
              value={`#${formData.id}`}
              fullWidth
              disabled
              helperText="Delivery ID cannot be changed"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Delivery Date"
              type="date"
              value={formData.delivery_date}
              onChange={handleChange('delivery_date')}
              error={!!errors.delivery_date}
              helperText={errors.delivery_date}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vehicle Number"
              value={formData.vehicle_number || 'N/A'}
              fullWidth
              disabled
              helperText="Vehicle assignment managed separately"
            />
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
            <FormControl fullWidth required error={!!errors.destination}>
              <InputLabel>Destination</InputLabel>
              <Select
                value={formData.destination}
                onChange={handleChange('destination')}
                label="Destination"
              >
                {ROUTES.map(route => (
                  <MenuItem key={route} value={route}>
                    {route}
                  </MenuItem>
                ))}
              </Select>
              {errors.destination && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.destination}
                </Typography>
              )}
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
                {DELIVERY_STATUS.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Priority"
              >
                {PRIORITY_LEVELS.map(priority => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Estimated Time"
              value={formData.estimatedTime}
              onChange={handleChange('estimatedTime')}
              fullWidth
              placeholder="e.g., 2 hours"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Distance"
              value={formData.distance}
              onChange={handleChange('distance')}
              fullWidth
              placeholder="e.g., 50 km"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleChange('notes')}
              fullWidth
              multiline
              rows={3}
              placeholder="Additional delivery notes..."
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

export default EditDeliveryModal;