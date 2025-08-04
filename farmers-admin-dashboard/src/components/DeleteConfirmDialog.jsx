import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import {
  Warning as WarningIcon,
  Agriculture as FarmersIcon,
  Business as SuppliersIcon,
  LocalDrink as MilkIcon
} from '@mui/icons-material';

const DeleteConfirmDialog = ({ 
  open, 
  item, 
  itemType = "farmer", // Default to farmer for backward compatibility
  onConfirm, 
  onClose 
}) => {
  if (!item) return null;

  // Get the appropriate display properties based on item type
  const getItemInfo = () => {
    switch (itemType) {
      case 'supplier':
        return {
          name: item.companyName || 'Unknown Company',
          id: item.id,
          icon: <SuppliersIcon />,
          title: 'Delete Supplier'
        };
        case 'milkEntry':
        return {
          name: `${item.farmer_name || 'Unknown Farmer'} - ${item.quantity || 0}L`,
          id: `#${item.id}`,
          icon: <MilkIcon />,
          title: 'Delete Milk Entry'
        };
      case 'farmer':
      default:
        return {
          name: item.name || 'Unknown Farmer',
          id: item.id,
          icon: <FarmersIcon />,
          title: 'Delete Farmer'
        };
    }
  };

  const itemInfo = getItemInfo();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
            <WarningIcon />
          </Avatar>
          <Typography variant="h6" color="error">
            {itemInfo.title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
            {itemInfo.icon}
          </Avatar>
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete{' '}
              <strong>{itemInfo.name}</strong> (ID: {itemInfo.id})?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          startIcon={<WarningIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
