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
  LinearProgress,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ViewInventoryModal = ({ open, item, onClose }) => {
  const theme = useTheme();

  if (!item) return null;

  const current = Number(item.current_stock_level || 0);
  const min = Number(item.minimum_stock_level || 0);
  const max = Number(item.maximum_stock_level || 100);
  const percentage = max > 0 ? (current / max) * 100 : 0;

  const getStockStatus = () => {
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
    return 'In Stock';
  };

  const getStockColor = () => {
    const status = getStockStatus();
    switch (status) {
      case 'Out of Stock': return 'error';
      case 'Low Stock': return 'warning';
      case 'In Stock': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>View Inventory Item Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Code"
              value={item.item_code}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Name"
              value={item.item_name}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              value={item.category}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Unit"
              value={item.unit}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Current Stock"
              value={`${current} ${item.unit}`}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Minimum Stock"
              value={`${min} ${item.unit}`}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Maximum Stock"
              value={`${max} ${item.unit}`}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Stock Level Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(percentage, 100)} 
                sx={{ 
                  flexGrow: 1,
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: alpha(theme.palette.grey[300], 0.5),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: percentage <= (min/max)*100 ? theme.palette.error.main : 
                                     percentage <= 50 ? theme.palette.warning.main : 
                                     theme.palette.success.main
                  }
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                {percentage.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              value={item.location ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier"
              value={item.supplier ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>Stock Status</Typography>
            <Chip 
              label={getStockStatus()} 
              color={getStockColor()} 
              variant="outlined"
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Updated"
              value={item.last_updated ? new Date(item.last_updated).toLocaleDateString('en-IN') : ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInventoryModal;
