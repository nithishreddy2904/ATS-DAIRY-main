import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Chip,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const ViewFleetModal = ({ open, fleet, onClose }) => {
  if (!fleet) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalShipping color="primary" />
        Fleet Record Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fleet ID"
              value={fleet.id || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vehicle Number"
              value={fleet.vehicle_number || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vehicle Type"
              value={fleet.vehicle_type || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Driver Name"
              value={fleet.driver_name || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Driver Phone"
              value={fleet.driver_phone || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Capacity (Liters)"
              value={fleet.capacity || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fuel Type"
              value={fleet.fuel_type || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip
                label={fleet.status || 'N/A'}
                color={
                  fleet.status === 'Available'
                    ? 'success'
                    : fleet.status === 'In Use'
                    ? 'warning'
                    : fleet.status === 'Under Maintenance'
                    ? 'info'
                    : 'error'
                }
                size="medium"
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              value={fleet.location || 'N/A'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Maintenance Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Maintenance Date"
              value={formatDate(fleet.last_maintenance_date)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Next Maintenance Date"
              value={formatDate(fleet.next_maintenance_date)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewFleetModal;