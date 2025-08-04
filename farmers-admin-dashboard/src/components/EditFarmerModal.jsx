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

const EditFarmerModal = ({ open, farmer, onSave, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (farmer) {
      setFormData(farmer);
    }
  }, [farmer]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!farmer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Farmer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Farmer ID"
              value={formData.id || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={formData.name || ''}
              onChange={handleChange('name')}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              value={formData.phone || ''}
              onChange={handleChange('phone')}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={formData.email || ''}
              onChange={handleChange('email')}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={formData.address || ''}
              onChange={handleChange('address')}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cattle Count"
              value={formData.cattle_count || ''}
              onChange={handleChange('cattle_count')}
              fullWidth
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bank Account"
              value={formData.bank_account || ''}
              onChange={handleChange('bank_account')}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="IFSC Code"
              value={formData.ifsc_code || ''}
              onChange={handleChange('ifsc_code')}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || ''}
                label="Status"
                onChange={handleChange('status')}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Join Date"
              value={formData.join_date || ''}
              onChange={handleChange('join_date')}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFarmerModal;
