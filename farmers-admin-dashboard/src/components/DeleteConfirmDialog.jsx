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
  LocalDrink as MilkIcon,
  LocalShipping as FleetIcon,
  Assignment as DeliveryIcon,
  Factory as FactoryIcon,
  VerifiedUser as VerifiedUserIcon,
  Build ,Store ,AttachMoney,Inventory2,
  Person,Payment,Receipt    
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
        case 'fleet':  
      return {
        name: `${item.vehicle_number || 'Unknown Vehicle'} - ${item.driver_name || 'Unknown Driver'}`,
        id: item.id,
        icon: <FleetIcon />,
        title: 'Delete Fleet Record'
      };
      case 'delivery':
  return {
    name: `${item.destination || 'Unknown Destination'} - ${item.driver_name || 'Unknown Driver'}`,
    id: `#${item.id}`,
    icon: <DeliveryIcon />,
    title: 'Delete Delivery'
  };
  case 'processingUnit':
  return {
    name: item.name || 'Unknown Unit',
    id: item.unit_id || item.id,
    icon: <FactoryIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Processing Unit',
  };
  case "productionBatch":
  return {
    name: `${item.batchId || "Unknown Batch"} - ${item.product || "Unknown Product"}`,
    id: item.id,
    icon: <FactoryIcon />,
    title: "Delete Production Batch",
  };
   case 'qualityControl':
  return {
    name: `${item.batch_id || 'Unknown Batch'} - ${item.inspector || 'Unknown Inspector'}`,
    id: item.id,
    icon: <VerifiedUserIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Quality Control Record',
  };
  case 'maintenance':
  return {
    name: `${item.unit_id || 'Unknown Unit'} - ${item.type || 'Unknown Type'}`,
    id: item.id,
    icon: <Build color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Maintenance Record',
  };
  case 'retailer':
  return {
    name: `${item.name || 'Unknown Retailer'} - ${item.location || 'Unknown Location'}`,
    id: item.id,
    icon: <Store color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Retailer',
  };
  case 'sale':
  return {
    name: `${item.retailer || 'Unknown Retailer'} - ₹${Number(item.amount || 0).toLocaleString()}`,
    id: item.id,
    icon: <AttachMoney color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Sale Record',
  };
  case 'inventory':
  return {
    name: `${item.item_name || 'Unknown Item'} (${item.item_code || 'No Code'})`,
    id: item.id,
    icon: <Inventory2 color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Inventory Item',
  };
  case 'employee':
  return {
    name: `${item.name || 'Unknown Employee'} (${item.employee_id || item.id || 'No ID'})`,
    id: item.id,
    icon: <Person color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Employee',
  };
  case 'payment':
  return {
    name: `${item.farmer_id || 'Unknown Farmer'} - ₹${Number(item.amount || 0).toLocaleString()}`,
    id: item.id,
    icon: <Payment color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Payment Record',
  };
  case 'bill':
  return {
    name: `${item.bill_id || 'Unknown Bill'} - ${item.farmer_id || 'Unknown Farmer'}`,
    id: item.id,
    icon: <Receipt color="primary" sx={{ fontSize: 40 }} />,
    title: 'Delete Bill',
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
