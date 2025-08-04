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
  Avatar,
  Typography,
  Divider
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const ViewSupplierModal = ({ open, supplier, onClose }) => {
  if (!supplier) return null;

  const InfoField = ({ label, value, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Supplier Details</Typography>
            <Typography variant="body2" color="textSecondary">
              {supplier.companyName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <InfoField
              label="Supplier ID"
              value={supplier.id}
              icon={<BusinessIcon color="primary" />}
            />
            <InfoField
              label="Company Name"
              value={supplier.companyName}
              icon={<BusinessIcon color="primary" />}
            />
            <InfoField
              label="Supplier Type"
              value={
                <Chip
                  label={supplier.supplierType}
                  color="primary"
                  size="small"
                />
              }
              icon={<CategoryIcon color="primary" />}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <InfoField
              label="Contact Person"
              value={supplier.contactPerson}
              icon={<PersonIcon color="secondary" />}
            />
            <InfoField
              label="Phone"
              value={supplier.phone}
              icon={<PhoneIcon color="secondary" />}
            />
            <InfoField
              label="Email"
              value={supplier.email}
              icon={<EmailIcon color="secondary" />}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <InfoField
              label="Address"
              value={supplier.address}
              icon={<LocationIcon color="info" />}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoField
              label="Status"
              value={
                <Chip
                  label={supplier.status}
                  color={
                    supplier.status === 'Active' ? 'success' :
                    supplier.status === 'Inactive' ? 'default' : 'warning'
                  }
                  size="small"
                />
              }
              icon={<CategoryIcon color="info" />}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoField
              label="Join Date"
              value={supplier.joinDate ? new Date(supplier.joinDate).toLocaleDateString() : 'N/A'}
              icon={<CategoryIcon color="info" />}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSupplierModal;
