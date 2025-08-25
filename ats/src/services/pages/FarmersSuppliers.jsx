import  { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
 MenuItem, Avatar, Stack, CircularProgress
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../../context/AppContext';

// Enhanced validation regex patterns
const FARMER_ID_REGEX = /^FARM[0-9]{4}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BANK_ACCOUNT_REGEX = /^[0-9]{9,18}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const CATTLE_COUNT_REGEX = /^[1-9]\d*$/;
const SUPPLIER_ID_REGEX = /^SUP[0-9]{3}$/;
const COMPANY_NAME_REGEX = /^[A-Za-z0-9\s&.-]+$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s,.-]+$/;

const FARMER_STATUS = ['Active', 'Inactive', 'Suspended'];
const SUPPLIER_TYPES = ['Feed Supplier', 'Equipment Supplier', 'Packaging Supplier', 'Chemical Supplier', 'Testing Services', 'Logistics'];
const SUPPLIER_STATUS = ['Active', 'Inactive', 'Pending Approval'];

const FarmersSuppliers = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // DEBUG CODE - ADD THIS SECTION
  const context = useAppContext();
  
  
  
  // Check if addFarmer exists
  if (!context.addFarmer) {
    console.error('❌ addFarmer is missing from context!');
  } else {
    console.log('✅ addFarmer found in context');
  }
  // END DEBUG CODE

  // Get shared data from context - INCLUDING loading and error states
  const { 
    farmers, 
    addFarmer, 
    updateFarmer, 
    deleteFarmer,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    loading,
    error
  } = useAppContext();

  // Debug: Log farmers data
  console.log('FarmersSuppliers - farmers data:', farmers);
  console.log('FarmersSuppliers - loading:', loading);
  console.log('FarmersSuppliers - error:', error);

  // Farmers state - ADDED joinDate field
  const [farmerForm, setFarmerForm] = useState({
    id: '', name: '', phone: '', email: '', address: '', cattleCount: '', 
    bankAccount: '', ifscCode: '', status: 'Active', joinDate: ''
  });
  const [editFarmerIdx, setEditFarmerIdx] = useState(null);
  const [editFarmerForm, setEditFarmerForm] = useState({
    id: '', name: '', phone: '', email: '', address: '', cattleCount: '', 
    bankAccount: '', ifscCode: '', status: 'Active', joinDate: ''
  });

  // Suppliers state - ADDED joinDate field
  const [supplierForm, setSupplierForm] = useState({
    id: '', companyName: '', contactPerson: '', phone: '', email: '', 
    address: '', supplierType: '', status: 'Active', joinDate: ''
  });
  const [editSupplierIdx, setEditSupplierIdx] = useState(null);
  const [editSupplierForm, setEditSupplierForm] = useState({
    id: '', companyName: '', contactPerson: '', phone: '', email: '', 
    address: '', supplierType: '', status: 'Active', joinDate: ''
  });

  // Enhanced validation errors for farmers
  const [farmerIdError, setFarmerIdError] = useState('');
  const [farmerNameError, setFarmerNameError] = useState('');
  const [farmerPhoneError, setFarmerPhoneError] = useState('');
  const [farmerEmailError, setFarmerEmailError] = useState('');
  const [farmerAddressError, setFarmerAddressError] = useState('');
  const [cattleCountError, setCattleCountError] = useState('');
  const [bankAccountError, setBankAccountError] = useState('');
  const [ifscError, setIfscError] = useState('');

  // Enhanced validation errors for suppliers
  const [supplierIdError, setSupplierIdError] = useState('');
  const [supplierCompanyError, setSupplierCompanyError] = useState('');
  const [supplierContactError, setSupplierContactError] = useState('');
  const [supplierPhoneError, setSupplierPhoneError] = useState('');
  const [supplierEmailError, setSupplierEmailError] = useState('');
  const [supplierAddressError, setSupplierAddressError] = useState('');

  // Tab styling function
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#2196f3' : 'transparent',
        color: isSelected ? '#fff' : '#2196f3',
        border: '2px solid #2196f3',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#1976d2' : '#e3f2fd' }
      },
      {
        borderRadius: '8px 8px 0 0',
        backgroundColor: isSelected ? '#4caf50' : '#f5f5f5',
        color: isSelected ? '#fff' : '#4caf50',
        border: '1px solid #4caf50',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 2px',
        '&:hover': { backgroundColor: isSelected ? '#388e3c' : '#e8f5e9' }
      }
    ];
    return styles[index] || {};
  };

  // Enhanced farmer handlers with comprehensive validation
  const handleFarmerChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      const upperValue = value.toUpperCase();
      if (!FARMER_ID_REGEX.test(upperValue) && upperValue !== '') {
        setFarmerIdError('Format: FARM0000 (FARM followed by 4 digits)');
      } else {
        setFarmerIdError('');
      }
      setFarmerForm({ ...farmerForm, [name]: upperValue });
    } else if (name === 'name') {
      if (!NAME_REGEX.test(value) && value !== '') {
        setFarmerNameError('Only alphabets and spaces are allowed');
      } else if (value.length > 50) {
        setFarmerNameError('Name should not exceed 50 characters');
      } else {
        setFarmerNameError('');
      }
      setFarmerForm({ ...farmerForm, [name]: value });
    } else if (name === 'phone') {
      if (!PHONE_REGEX.test(value) && value !== '') {
        setFarmerPhoneError('Enter valid 10-digit mobile number starting with 6-9');
      } else {
        setFarmerPhoneError('');
      }
      setFarmerForm({ ...farmerForm, [name]: value });
    } else if (name === 'email') {
      if (!EMAIL_REGEX.test(value) && value !== '') {
        setFarmerEmailError('Enter valid email address');
      } else {
        setFarmerEmailError('');
      }
      setFarmerForm({ ...farmerForm, [name]: value });
    } else if (name === 'address') {
      if (!ADDRESS_REGEX.test(value) && value !== '') {
        setFarmerAddressError('Address contains invalid characters');
      } else if (value.length > 200) {
        setFarmerAddressError('Address should not exceed 200 characters');
      } else {
        setFarmerAddressError('');
      }
      setFarmerForm({ ...farmerForm, [name]: value });
    } else if (name === 'cattleCount') {
      if (!CATTLE_COUNT_REGEX.test(value) && value !== '') {
        setCattleCountError('Enter valid positive number');
      } else if (parseInt(value) > 1000) {
        setCattleCountError('Cattle count cannot exceed 1000');
      } else {
        setCattleCountError('');
      }
      setFarmerForm({ ...farmerForm, [name]: value });
    } else if (name === 'bankAccount') {
      if (!BANK_ACCOUNT_REGEX.test(value) && value !== '') {
        setBankAccountError('Bank account should be 9-18 digits only');
      } else {
        setBankAccountError('');
      }
      setFarmerForm({ ...farmerForm, [name]: value });
    } else if (name === 'ifscCode') {
      const upperValue = value.toUpperCase();
      if (!IFSC_REGEX.test(upperValue) && upperValue !== '') {
        setIfscError('Invalid IFSC format (e.g., SBIN0001234)');
      } else {
        setIfscError('');
      }
      setFarmerForm({ ...farmerForm, [name]: upperValue });
    } else {
      setFarmerForm({ ...farmerForm, [name]: value });
    }
  };

  const handleAddFarmer = async (e) => {
    e.preventDefault();
    
    // Check if farmer ID already exists
    const existingFarmer = farmers.find(f => f.id === farmerForm.id);
    if (existingFarmer) {
      setFarmerIdError('Farmer ID already exists');
      return;
    }

    // Check if phone number already exists
    const existingPhone = farmers.find(f => f.phone === farmerForm.phone);
    if (existingPhone) {
      setFarmerPhoneError('Phone number already registered');
      return;
    }

    // Check if email already exists
    const existingEmail = farmers.find(f => f.email === farmerForm.email);
    if (existingEmail) {
      setFarmerEmailError('Email already registered');
      return;
    }

    if (farmerForm.id && farmerForm.name && farmerForm.phone && farmerForm.email && 
        farmerForm.address && farmerForm.cattleCount && farmerForm.bankAccount && farmerForm.ifscCode &&
        farmerForm.joinDate && !farmerIdError && !farmerNameError && !farmerPhoneError && !farmerEmailError && 
        !farmerAddressError && !cattleCountError && !bankAccountError && !ifscError) {
      
      try {
        await addFarmer({ ...farmerForm });
        setFarmerForm({ id: '', name: '', phone: '', email: '', address: '', cattleCount: '', bankAccount: '', ifscCode: '', status: 'Active', joinDate: '' });
        console.log('Farmer added successfully');
      } catch (error) {
        console.error('Error adding farmer:', error);
        alert('Error adding farmer: ' + error.message);
      }
    }
  };

  // Enhanced supplier handlers with comprehensive validation
  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      const upperValue = value.toUpperCase();
      if (!SUPPLIER_ID_REGEX.test(upperValue) && upperValue !== '') {
        setSupplierIdError('Format: SUP001 (SUP followed by 3 digits)');
      } else {
        setSupplierIdError('');
      }
      setSupplierForm({ ...supplierForm, [name]: upperValue });
    } else if (name === 'companyName') {
      if (!COMPANY_NAME_REGEX.test(value) && value !== '') {
        setSupplierCompanyError('Company name contains invalid characters');
      } else if (value.length > 100) {
        setSupplierCompanyError('Company name should not exceed 100 characters');
      } else {
        setSupplierCompanyError('');
      }
      setSupplierForm({ ...supplierForm, [name]: value });
    } else if (name === 'contactPerson') {
      if (!NAME_REGEX.test(value) && value !== '') {
        setSupplierContactError('Only alphabets and spaces are allowed');
      } else if (value.length > 50) {
        setSupplierContactError('Name should not exceed 50 characters');
      } else {
        setSupplierContactError('');
      }
      setSupplierForm({ ...supplierForm, [name]: value });
    } else if (name === 'phone') {
      if (!PHONE_REGEX.test(value) && value !== '') {
        setSupplierPhoneError('Enter valid 10-digit mobile number starting with 6-9');
      } else {
        setSupplierPhoneError('');
      }
      setSupplierForm({ ...supplierForm, [name]: value });
    } else if (name === 'email') {
      if (!EMAIL_REGEX.test(value) && value !== '') {
        setSupplierEmailError('Enter valid email address');
      } else {
        setSupplierEmailError('');
      }
      setSupplierForm({ ...supplierForm, [name]: value });
    } else if (name === 'address') {
      if (!ADDRESS_REGEX.test(value) && value !== '') {
        setSupplierAddressError('Address contains invalid characters');
      } else if (value.length > 200) {
        setSupplierAddressError('Address should not exceed 200 characters');
      } else {
        setSupplierAddressError('');
      }
      setSupplierForm({ ...supplierForm, [name]: value });
    } else {
      setSupplierForm({ ...supplierForm, [name]: value });
    }
  };

  const handleAddSupplier = (e) => {
    e.preventDefault();
    
    // Check if supplier ID already exists
    const existingSupplier = suppliers.find(s => s.id === supplierForm.id);
    if (existingSupplier) {
      setSupplierIdError('Supplier ID already exists');
      return;
    }

    // Check if company name already exists
    const existingCompany = suppliers.find(s => s.companyName.toLowerCase() === supplierForm.companyName.toLowerCase());
    if (existingCompany) {
      setSupplierCompanyError('Company name already registered');
      return;
    }

    // Check if phone number already exists
    const existingPhone = suppliers.find(s => s.phone === supplierForm.phone);
    if (existingPhone) {
      setSupplierPhoneError('Phone number already registered');
      return;
    }

    // Check if email already exists
    const existingEmail = suppliers.find(s => s.email === supplierForm.email);
    if (existingEmail) {
      setSupplierEmailError('Email already registered');
      return;
    }

    if (supplierForm.id && supplierForm.companyName && supplierForm.contactPerson && supplierForm.phone && 
        supplierForm.email && supplierForm.address && supplierForm.supplierType && supplierForm.joinDate &&
        !supplierIdError && !supplierCompanyError && !supplierContactError && !supplierPhoneError && 
        !supplierEmailError && !supplierAddressError) {
      addSupplier({ ...supplierForm });
      setSupplierForm({ id: '', companyName: '', contactPerson: '', phone: '', email: '', address: '', supplierType: '', status: 'Active', joinDate: '' });
      // Clear all errors
      setSupplierIdError(''); setSupplierCompanyError(''); setSupplierContactError(''); setSupplierPhoneError(''); 
      setSupplierEmailError(''); setSupplierAddressError('');
    }
  };

  // Calculate statistics from shared data
  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter(f => f.status === 'Active').length;
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;

  const tabLabels = [
    { label: 'Farmers', icon: <PeopleIcon /> },
    { label: 'Suppliers', icon: <LocalShippingIcon /> }
  ];

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading farmers data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: `linear-gradient(135deg, ${
          ['#2196f3', '#4caf50'][tab]
        } 0%, ${
          ['#21cbf3', '#8bc34a'][tab]
        } 100%)`,
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 80, height: 80 }}>
            {tabLabels[tab].icon}
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              {tabLabels[tab].label} Management
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Manage your network of farmers and suppliers with join date tracking for dashboard analytics
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with uniform padding for equal left and right margins */}
      <Box sx={{ px: 3 }}>
        {/* Statistics Cards with uniform spacing */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              width:'200px',
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} width={250} height={100}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <PeopleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalFarmers}</Typography>
                  <Typography variant="body1">Total Farmers</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {activeFarmers} active
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={100}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <LocalShippingIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalSuppliers}</Typography>
                  <Typography variant="body1">Total Suppliers</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {activeSuppliers} active
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={100}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Typography variant="h4" fontWeight="bold">🐄</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {farmers.reduce((sum, f) => sum + parseInt(f.cattleCount || '0'), 0)}
                  </Typography>
                  <Typography variant="body1">Total Cattle</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Across all farms
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={100}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Typography variant="h4" fontWeight="bold">📈</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">98%</Typography>
                  <Typography variant="body1">Network Health</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Overall status
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Custom Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {tabLabels.map((tabObj, idx) => (
            <Button
              key={tabObj.label}
              onClick={() => setTab(idx)}
              sx={getTabStyle(idx, tab === idx)}
              startIcon={tabObj.icon}
            >
              {tabObj.label}
            </Button>
          ))}
        </Box>

        {/* Farmers Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark 
                ? 'linear-gradient(135deg, rgba(227,242,253,0.1) 0%, rgba(187,222,251,0.05) 100%)' 
                : 'linear-gradient(135deg, #f8fbff 0%, #f0f8ff 100%)' // Very light blue background
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>👨‍🌾</Avatar>
                <Typography variant="h5" fontWeight="bold">Farmer Registration</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Join date is used for dashboard network growth analytics
                </Typography>
              </Stack>
              <form onSubmit={handleAddFarmer}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="id" value={farmerForm.id}
                      onChange={handleFarmerChange} required
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: FARM0001"}
                      placeholder="FARM0001"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Full Name" name="name" value={farmerForm.name}
                      onChange={handleFarmerChange} required
                      error={!!farmerNameError}
                      helperText={farmerNameError || "Only alphabets and spaces allowed"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Phone Number" name="phone" value={farmerForm.phone}
                      onChange={handleFarmerChange} required
                      error={!!farmerPhoneError}
                      helperText={farmerPhoneError || "10-digit mobile number starting with 6-9"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Email Address" name="email" value={farmerForm.email}
                      onChange={handleFarmerChange} required
                      error={!!farmerEmailError}
                      helperText={farmerEmailError || "Valid email address"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Address" name="address" value={farmerForm.address}
                      onChange={handleFarmerChange} required
                      error={!!farmerAddressError}
                      helperText={farmerAddressError || "Complete address (max 200 characters)"}
                      multiline rows={1}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Cattle Count" name="cattleCount" value={farmerForm.cattleCount}
                      onChange={handleFarmerChange} required
                      error={!!cattleCountError}
                      helperText={cattleCountError || "Positive number (max 1000)"}
                      type="number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Bank Account" name="bankAccount" value={farmerForm.bankAccount}
                      onChange={handleFarmerChange} required
                      error={!!bankAccountError}
                      helperText={bankAccountError || "9-18 digits only"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="IFSC Code" name="ifscCode" value={farmerForm.ifscCode}
                      onChange={handleFarmerChange} required
                      error={!!ifscError}
                      helperText={ifscError || "e.g., SBIN0001234"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  {/* ADDED: Join Date Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Join Date" name="joinDate" value={farmerForm.joinDate}
                      onChange={handleFarmerChange} required
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      helperText="Date when farmer joined (used in dashboard analytics)"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={farmerForm.status}
                      onChange={handleFarmerChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {FARMER_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)',
                        }
                      }}
                      disabled={!!farmerIdError || !!farmerNameError || !!farmerPhoneError || !!farmerEmailError || 
                               !!farmerAddressError || !!cattleCountError || !!bankAccountError || !!ifscError}
                    >
                      Register Farmer (Saves to Database)
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

          </>
        )}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3, 
              background: isDark 
                ? 'linear-gradient(135deg, rgba(232,245,232,0.1) 0%, rgba(200,230,201,0.05) 100%)' 
                : 'linear-gradient(135deg, #f8fff8 0%, #f0fff0 100%)' // Very light blue background for suppliers too
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>🏭</Avatar>
                <Typography variant="h5" fontWeight="bold">Supplier Registration</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Join date is used for dashboard network growth analytics
                </Typography>
              </Stack>
              <form onSubmit={handleAddSupplier}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Supplier ID" name="id" value={supplierForm.id}
                      onChange={handleSupplierChange} required
                      error={!!supplierIdError}
                      helperText={supplierIdError || "Format: SUP001"}
                      placeholder="SUP001"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Company Name" name="companyName" value={supplierForm.companyName}
                      onChange={handleSupplierChange} required
                      error={!!supplierCompanyError}
                      helperText={supplierCompanyError || "Company/Business name (max 100 characters)"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Contact Person" name="contactPerson" value={supplierForm.contactPerson}
                      onChange={handleSupplierChange} required
                      error={!!supplierContactError}
                      helperText={supplierContactError || "Only alphabets and spaces allowed"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Phone Number" name="phone" value={supplierForm.phone}
                      onChange={handleSupplierChange} required
                      error={!!supplierPhoneError}
                      helperText={supplierPhoneError || "10-digit mobile number starting with 6-9"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Email Address" name="email" value={supplierForm.email}
                      onChange={handleSupplierChange} required
                      error={!!supplierEmailError}
                      helperText={supplierEmailError || "Valid email address"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Supplier Type" name="supplierType" value={supplierForm.supplierType}
                      onChange={handleSupplierChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {SUPPLIER_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Address" name="address" value={supplierForm.address}
                      onChange={handleSupplierChange} required
                      error={!!supplierAddressError}
                      helperText={supplierAddressError || "Complete address (max 200 characters)"}
                      multiline rows={1}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  {/* ADDED: Join Date Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Join Date" name="joinDate" value={supplierForm.joinDate}
                      onChange={handleSupplierChange} required
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      helperText="Date when supplier joined (used in dashboard analytics)"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={supplierForm.status}
                      onChange={handleSupplierChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {SUPPLIER_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #388e3c 30%, #689f38 90%)',
                        }
                      }}
                      disabled={!!supplierIdError || !!supplierCompanyError || !!supplierContactError || !!supplierPhoneError || 
                               !!supplierEmailError || !!supplierAddressError}
                    >
                      Register Supplier
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};



export default FarmersSuppliers;
