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
} from '@mui/material';

const UNIT_STATUS = ['Active', 'Maintenance', 'Inactive'];
const UNIT_TYPES = ['Pasteurization', 'Packaging', 'Cheese Production', 'Butter Production', 'Powder Production'];

const EditProcessingUnitModal = ({ open, processingUnit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    unit_id: '',
    name: '',
    location: '',
    capacity: '',
    manager: '',
    contact: '',
    status: 'Active',
    type: '',
  });

  useEffect(() => {
    if (processingUnit) {
      setFormData(processingUnit);
    }
  }, [processingUnit]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!processingUnit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Processing Unit</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Unit ID"
              value={formData.unit_id}
              onChange={handleChange('unit_id')}
              fullWidth
              required
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              value={formData.location}
              onChange={handleChange('location')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Manager"
              value={formData.manager}
              onChange={handleChange('manager')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact"
              value={formData.contact}
              onChange={handleChange('contact')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Capacity (L)"
              type="number"
              value={formData.capacity}
              onChange={handleChange('capacity')}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleChange('status')}
              >
                {UNIT_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={handleChange('type')}
              >
                {UNIT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProcessingUnitModal;