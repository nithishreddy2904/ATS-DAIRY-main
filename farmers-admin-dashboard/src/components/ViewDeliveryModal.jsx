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

const ViewDeliveryModal = ({ open, delivery, onClose }) => {
  if (!delivery) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'in_transit':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalShipping color="primary" />
        Delivery Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Delivery ID"
              value={`#${delivery.id || ''}`}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Delivery Date"
              value={formatDate(delivery.delivery_date)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vehicle Number"
              value={delivery.vehicle_number || 'N/A'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Driver Name"
              value={delivery.driver_name || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Destination"
              value={delivery.destination || ''}
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
                label={delivery.status || 'N/A'}
                color={getStatusColor(delivery.status)}
                size="medium"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Priority
              </Typography>
              <Chip
                label={delivery.priority || 'Medium'}
                color={getPriorityColor(delivery.priority)}
                variant="outlined"
                size="medium"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Estimated Time"
              value={delivery.estimatedTime || 'N/A'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Distance"
              value={delivery.distance || 'N/A'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          
          {delivery.notes && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Additional Notes
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  value={delivery.notes || 'No notes available'}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </>
          )}
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

export default ViewDeliveryModal;