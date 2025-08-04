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
  Box,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import {
  LocalDrink,
  Person,
  CalendarToday,
  AccessTime,
  Star,
  Thermostat,
  Science,
  Payment,
  LocalShipping
} from '@mui/icons-material';

const ViewMilkEntryModal = ({ open, milkEntry, onClose }) => {
  if (!milkEntry) return null;

  const getQualityColor = (quality) => {
    const colors = {
      'A+': '#4caf50',
      'A': '#8bc34a', 
      'B': '#ff9800',
      'C': '#ff5722',
      'D': '#f44336'
    };
    return colors[quality] || '#9e9e9e';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Paid': 'success',
      'Pending': 'warning', 
      'Partial': 'info'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoRow = ({ icon, label, value, color = 'text.primary' }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      <Avatar sx={{ bgcolor: 'grey.100', color: 'grey.600', width: 32, height: 32 }}>
        {icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium" color={color}>
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalDrink />
          <Typography variant="h6" fontWeight="bold">
            Milk Entry Details - #{milkEntry.id}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Farmer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Person />}
              label="Farmer ID"
              value={milkEntry.farmer_id}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Person />}
              label="Farmer Name"
              value={milkEntry.farmer_name}
            />
          </Grid>

          {/* Collection Details */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              <LocalDrink sx={{ mr: 1, verticalAlign: 'middle' }} />
              Collection Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<CalendarToday />}
              label="Collection Date"
              value={formatDate(milkEntry.date)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<AccessTime />}
              label="Shift"
              value={
                <Chip
                  label={milkEntry.shift}
                  size="small"
                  color={milkEntry.shift === 'Morning' ? 'info' : 'warning'}
                  variant="filled"
                />
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<LocalDrink />}
              label="Quantity"
              value={`${parseFloat(milkEntry.quantity || 0).toFixed(1)} Liters`}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Star />}
              label="Quality Grade"
              value={
                <Chip
                  label={milkEntry.quality}
                  size="small"
                  sx={{
                    bgcolor: getQualityColor(milkEntry.quality),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              }
            />
          </Grid>

          {/* Quality Parameters */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quality Parameters
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Science />}
              label="Fat Content"
              value={milkEntry.fat_content ? `${parseFloat(milkEntry.fat_content).toFixed(1)}%` : 'Not tested'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Science />}
              label="SNF Content"
              value={milkEntry.snf_content ? `${parseFloat(milkEntry.snf_content).toFixed(1)}%` : 'Not tested'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Thermostat />}
              label="Temperature"
              value={milkEntry.temperature ? `${parseFloat(milkEntry.temperature).toFixed(1)}°C` : 'Not recorded'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Science />}
              label="pH Level"
              value={milkEntry.ph_level ? parseFloat(milkEntry.ph_level).toFixed(1) : 'Not tested'}
            />
          </Grid>

          {/* Collection & Logistics */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
              Collection & Logistics
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<LocalShipping />}
              label="Collection Center"
              value={milkEntry.collection_center || 'Not specified'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Person />}
              label="Collected By"
              value={milkEntry.collected_by || 'Not specified'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<LocalShipping />}
              label="Vehicle Number"
              value={milkEntry.vehicle_number || 'Not specified'}
            />
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Payment />}
              label="Payment Amount"
              value={milkEntry.payment_amount ? `₹${parseFloat(milkEntry.payment_amount).toFixed(2)}` : 'Not specified'}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<Payment />}
              label="Payment Status"
              value={
                <Chip
                  label={milkEntry.payment_status}
                  size="small"
                  color={getPaymentStatusColor(milkEntry.payment_status)}
                  variant="filled"
                />
              }
            />
          </Grid>

          {/* Remarks */}
          {milkEntry.remarks && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Additional Notes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={milkEntry.remarks}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: 'grey.50'
                    }
                  }}
                />
              </Grid>
            </>
          )}

          {/* Timestamps */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Record Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<CalendarToday />}
              label="Created At"
              value={milkEntry.created_at ? new Date(milkEntry.created_at).toLocaleString('en-IN') : 'N/A'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              icon={<CalendarToday />}
              label="Last Updated"
              value={milkEntry.updated_at ? new Date(milkEntry.updated_at).toLocaleString('en-IN') : 'N/A'}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewMilkEntryModal;
