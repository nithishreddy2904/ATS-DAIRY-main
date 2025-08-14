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
  MenuItem
} from '@mui/material';

const MAINTENANCE_TYPES = ['Preventive', 'Corrective', 'Emergency', 'Scheduled'];
const MAINTENANCE_STATUS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const EditMaintenanceModal = ({ open, record, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    unit_id: '',
    date: '',
    type: 'Preventive',
    description: '',
    cost: '',
    technician: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    if (record) {
      setFormData({ 
        ...record, 
        date: record.date ? record.date.slice(0, 10) : '',
        cost: record.cost ? record.cost.toString() : ''
      });
    } else {
      setFormData({
        unit_id: '',
        date: '',
        type: 'Preventive',
        description: '',
        cost: '',
        technician: '',
        status: 'Scheduled'
      });
    }
  }, [record]);

  const handleChange = field => e => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{record ? 'Edit Maintenance Record' : 'Add Maintenance Record'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Unit ID" 
              value={formData.unit_id} 
              onChange={handleChange('unit_id')} 
              fullWidth 
              required 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={formData.type} onChange={handleChange('type')}>
                {MAINTENANCE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} onChange={handleChange('status')}>
                {MAINTENANCE_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
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
              multiline
              rows={3}
              required 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Cost (₹)" 
              value={formData.cost} 
              onChange={handleChange('cost')} 
              fullWidth 
              type="number"
              required 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Technician" 
              value={formData.technician} 
              onChange={handleChange('technician')} 
              fullWidth 
              required 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {record ? 'Save Changes' : 'Add Record'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMaintenanceModal;
