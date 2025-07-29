import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';

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
  
  console.log('🔍 Context object:', context);
  console.log('🔍 addFarmer function:', context.addFarmer);
  console.log('🔍 Type of addFarmer:', typeof context.addFarmer);
  console.log('🔍 Available context methods:', Object.keys(context));
  
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

  
    const handleDeleteFarmer = async (idx) => {
  // Show a confirmation dialog before deleting
  const confirmDelete = window.confirm('Are you sure you want to delete this farmer? This action cannot be undone.');
  if (!confirmDelete) {
    // User clicked "Cancel"
    return;
  }
  try {
    await deleteFarmer(idx);
    console.log('Farmer deleted successfully');
  } catch (error) {
    console.error('Error deleting farmer:', error);
    alert('Error deleting farmer: ' + error.message);
  }
};

  const handleEditFarmer = (idx) => {
    setEditFarmerIdx(idx);
    setEditFarmerForm(farmers[idx]);
    // Clear all errors
    setFarmerIdError(''); setFarmerNameError(''); setFarmerPhoneError(''); setFarmerEmailError(''); 
    setFarmerAddressError(''); setCattleCountError(''); setBankAccountError(''); setIfscError('');
  };

  const handleEditFarmerChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      const upperValue = value.toUpperCase();
      if (!FARMER_ID_REGEX.test(upperValue) && upperValue !== '') {
        setFarmerIdError('Format: FARM0000 (FARM followed by 4 digits)');
      } else {
        setFarmerIdError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: upperValue });
    } else if (name === 'name') {
      if (!NAME_REGEX.test(value) && value !== '') {
        setFarmerNameError('Only alphabets and spaces are allowed');
      } else if (value.length > 50) {
        setFarmerNameError('Name should not exceed 50 characters');
      } else {
        setFarmerNameError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    } else if (name === 'phone') {
      if (!PHONE_REGEX.test(value) && value !== '') {
        setFarmerPhoneError('Enter valid 10-digit mobile number starting with 6-9');
      } else {
        setFarmerPhoneError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    } else if (name === 'email') {
      if (!EMAIL_REGEX.test(value) && value !== '') {
        setFarmerEmailError('Enter valid email address');
      } else {
        setFarmerEmailError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    } else if (name === 'address') {
      if (!ADDRESS_REGEX.test(value) && value !== '') {
        setFarmerAddressError('Address contains invalid characters');
      } else if (value.length > 200) {
        setFarmerAddressError('Address should not exceed 200 characters');
      } else {
        setFarmerAddressError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    } else if (name === 'cattleCount') {
      if (!CATTLE_COUNT_REGEX.test(value) && value !== '') {
        setCattleCountError('Enter valid positive number');
      } else if (parseInt(value) > 1000) {
        setCattleCountError('Cattle count cannot exceed 1000');
      } else {
        setCattleCountError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    } else if (name === 'bankAccount') {
      if (!BANK_ACCOUNT_REGEX.test(value) && value !== '') {
        setBankAccountError('Bank account should be 9-18 digits only');
      } else {
        setBankAccountError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    } else if (name === 'ifscCode') {
      const upperValue = value.toUpperCase();
      if (!IFSC_REGEX.test(upperValue) && upperValue !== '') {
        setIfscError('Invalid IFSC format (e.g., SBIN0001234)');
      } else {
        setIfscError('');
      }
      setEditFarmerForm({ ...editFarmerForm, [name]: upperValue });
    } else {
      setEditFarmerForm({ ...editFarmerForm, [name]: value });
    }
  };

  const handleSaveEditFarmer = async () => {
    if (editFarmerIdx !== null && !farmerIdError && !farmerNameError && !farmerPhoneError && 
        !farmerEmailError && !farmerAddressError && !cattleCountError && !bankAccountError && !ifscError) {
      try {
        await updateFarmer(editFarmerIdx, editFarmerForm);
        setEditFarmerIdx(null);
        console.log('Farmer updated successfully');
      } catch (error) {
        console.error('Error updating farmer:', error);
        alert('Error updating farmer: ' + error.message);
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

  const handleDeleteSupplier = async (idx) => {
  const confirmed = window.confirm('Are you sure you want to delete this supplier? This action cannot be undone.');
  if (!confirmed) return;
  try {
    await deleteSupplier(idx);
    console.log('Supplier deleted successfully');
  } catch (error) {
    console.error('Error deleting supplier:', error);
    alert('Error deleting supplier: ' + (error.message || 'Unknown error'));
  }
};


  // ADDED: Edit supplier handlers
  const handleEditSupplier = (idx) => {
    setEditSupplierIdx(idx);
    setEditSupplierForm(suppliers[idx]);
    // Clear all errors
    setSupplierIdError(''); setSupplierCompanyError(''); setSupplierContactError(''); 
    setSupplierPhoneError(''); setSupplierEmailError(''); setSupplierAddressError('');
  };

  const handleEditSupplierChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      const upperValue = value.toUpperCase();
      if (!SUPPLIER_ID_REGEX.test(upperValue) && upperValue !== '') {
        setSupplierIdError('Format: SUP001 (SUP followed by 3 digits)');
      } else {
        setSupplierIdError('');
      }
      setEditSupplierForm({ ...editSupplierForm, [name]: upperValue });
    } else if (name === 'companyName') {
      if (!COMPANY_NAME_REGEX.test(value) && value !== '') {
        setSupplierCompanyError('Company name contains invalid characters');
      } else if (value.length > 100) {
        setSupplierCompanyError('Company name should not exceed 100 characters');
      } else {
        setSupplierCompanyError('');
      }
      setEditSupplierForm({ ...editSupplierForm, [name]: value });
    } else if (name === 'contactPerson') {
      if (!NAME_REGEX.test(value) && value !== '') {
        setSupplierContactError('Only alphabets and spaces are allowed');
      } else if (value.length > 50) {
        setSupplierContactError('Name should not exceed 50 characters');
      } else {
        setSupplierContactError('');
      }
      setEditSupplierForm({ ...editSupplierForm, [name]: value });
    } else if (name === 'phone') {
      if (!PHONE_REGEX.test(value) && value !== '') {
        setSupplierPhoneError('Enter valid 10-digit mobile number starting with 6-9');
      } else {
        setSupplierPhoneError('');
      }
      setEditSupplierForm({ ...editSupplierForm, [name]: value });
    } else if (name === 'email') {
      if (!EMAIL_REGEX.test(value) && value !== '') {
        setSupplierEmailError('Enter valid email address');
      } else {
        setSupplierEmailError('');
      }
      setEditSupplierForm({ ...editSupplierForm, [name]: value });
    } else if (name === 'address') {
      if (!ADDRESS_REGEX.test(value) && value !== '') {
        setSupplierAddressError('Address contains invalid characters');
      } else if (value.length > 200) {
        setSupplierAddressError('Address should not exceed 200 characters');
      } else {
        setSupplierAddressError('');
      }
      setEditSupplierForm({ ...editSupplierForm, [name]: value });
    } else {
      setEditSupplierForm({ ...editSupplierForm, [name]: value });
    }
  };

  const handleSaveEditSupplier = () => {
    if (editSupplierIdx !== null && !supplierIdError && !supplierCompanyError && !supplierContactError && 
        !supplierPhoneError && !supplierEmailError && !supplierAddressError) {
      updateSupplier(editSupplierIdx, editSupplierForm);
      setEditSupplierIdx(null);
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

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#2196f3', mr: 2, width: 32, height: 32 }}>👥</Avatar>
              Registered Farmers ({farmers.length} total)
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.2)' : '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Cattle Count</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Join Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {farmers.map((farmer, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(33,150,243,0.05)' } }}>
                      <TableCell><Chip label={farmer.id} color="primary" variant="outlined" /></TableCell>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{farmer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{farmer.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2">{farmer.phone}</Typography>
                          <Typography variant="caption" color="text.secondary">{farmer.address}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell><Typography fontWeight="bold" color="primary.main">{farmer.cattleCount}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {farmer.joinDate ? new Date(farmer.joinDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={farmer.status} 
                          color={farmer.status === 'Active' ? 'success' : 
                                 farmer.status === 'Inactive' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditFarmer(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteFarmer(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {farmers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>👨‍🌾</Avatar>
                          <Typography variant="h6" color="text.secondary">No farmers registered</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {loading ? 'Loading farmers...' : 'Add your first farmer using the form above'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Suppliers Tab */}
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

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>🏢</Avatar>
              Registered Suppliers
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Supplier ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Contact Person</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Contact Info</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Join Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.map((supplier, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell><Chip label={supplier.id} color="success" variant="outlined" /></TableCell>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{supplier.companyName}</Typography>
                          <Typography variant="caption" color="text.secondary">{supplier.address}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2">{supplier.phone}</Typography>
                          <Typography variant="caption" color="text.secondary">{supplier.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell><Chip label={supplier.supplierType} size="small" color="info" /></TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {supplier.joinDate ? new Date(supplier.joinDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={supplier.status} 
                          color={supplier.status === 'Active' ? 'success' : 
                                 supplier.status === 'Pending Approval' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditSupplier(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteSupplier(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {suppliers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🏭</Avatar>
                          <Typography variant="h6" color="text.secondary">No suppliers registered</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Edit Farmer Dialog */}
        <Dialog open={editFarmerIdx !== null} onClose={() => setEditFarmerIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>✏️</Avatar>Edit Farmer
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Farmer ID" 
                  name="id" 
                  value={editFarmerForm.id} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!farmerIdError}
                  helperText={farmerIdError || "Format: FARM0001"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  name="name" 
                  value={editFarmerForm.name} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!farmerNameError}
                  helperText={farmerNameError || "Only alphabets and spaces allowed"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Phone" 
                  name="phone" 
                  value={editFarmerForm.phone} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!farmerPhoneError}
                  helperText={farmerPhoneError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  name="email" 
                  value={editFarmerForm.email} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!farmerEmailError}
                  helperText={farmerEmailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Address" 
                  name="address" 
                  value={editFarmerForm.address} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!farmerAddressError}
                  helperText={farmerAddressError}
                  multiline 
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  fullWidth 
                  label="Cattle Count" 
                  name="cattleCount" 
                  value={editFarmerForm.cattleCount} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!cattleCountError}
                  helperText={cattleCountError}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  fullWidth 
                  label="Bank Account" 
                  name="bankAccount" 
                  value={editFarmerForm.bankAccount} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!bankAccountError}
                  helperText={bankAccountError}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  fullWidth 
                  label="IFSC Code" 
                  name="ifscCode" 
                  value={editFarmerForm.ifscCode} 
                  onChange={handleEditFarmerChange} 
                  required 
                  error={!!ifscError}
                  helperText={ifscError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Join Date" 
                  name="joinDate" 
                  value={editFarmerForm.joinDate} 
                  onChange={handleEditFarmerChange} 
                  required 
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  helperText="Date when farmer joined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Status" 
                  name="status" 
                  value={editFarmerForm.status}
                  onChange={handleEditFarmerChange} 
                  required 
                  select
                >
                  {FARMER_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditFarmerIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button 
              onClick={handleSaveEditFarmer} 
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={!!farmerIdError || !!farmerNameError || !!farmerPhoneError || !!farmerEmailError ||
                       !!farmerAddressError || !!cattleCountError || !!bankAccountError || !!ifscError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Supplier Dialog */}
        <Dialog open={editSupplierIdx !== null} onClose={() => setEditSupplierIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e8', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>✏️</Avatar>Edit Supplier
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Supplier ID" 
                  name="id" 
                  value={editSupplierForm.id} 
                  onChange={handleEditSupplierChange} 
                  required 
                  error={!!supplierIdError}
                  helperText={supplierIdError || "Format: SUP001"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Company Name" 
                  name="companyName" 
                  value={editSupplierForm.companyName} 
                  onChange={handleEditSupplierChange} 
                  required 
                  error={!!supplierCompanyError}
                  helperText={supplierCompanyError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Contact Person" 
                  name="contactPerson" 
                  value={editSupplierForm.contactPerson} 
                  onChange={handleEditSupplierChange} 
                  required 
                  error={!!supplierContactError}
                  helperText={supplierContactError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Phone" 
                  name="phone" 
                  value={editSupplierForm.phone} 
                  onChange={handleEditSupplierChange} 
                  required 
                  error={!!supplierPhoneError}
                  helperText={supplierPhoneError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  name="email" 
                  value={editSupplierForm.email} 
                  onChange={handleEditSupplierChange} 
                  required 
                  error={!!supplierEmailError}
                  helperText={supplierEmailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Address" 
                  name="address" 
                  value={editSupplierForm.address} 
                  onChange={handleEditSupplierChange} 
                  required 
                  error={!!supplierAddressError}
                  helperText={supplierAddressError}
                  multiline 
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Supplier Type" 
                  name="supplierType" 
                  value={editSupplierForm.supplierType} 
                  onChange={handleEditSupplierChange} 
                  required 
                  select
                >
                  {SUPPLIER_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Join Date" 
                  name="joinDate" 
                  value={editSupplierForm.joinDate} 
                  onChange={handleEditSupplierChange} 
                  required 
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  helperText="Date when supplier joined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Status" 
                  name="status" 
                  value={editSupplierForm.status} 
                  onChange={handleEditSupplierChange} 
                  required 
                  select
                >
                  {SUPPLIER_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditSupplierIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button 
              onClick={handleSaveEditSupplier} 
              variant="contained" 
              sx={{ borderRadius: 2 }}
              disabled={!!supplierIdError || !!supplierCompanyError || !!supplierContactError || 
                       !!supplierPhoneError || !!supplierEmailError || !!supplierAddressError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

FarmersSuppliers.propTypes = {
  // Add any prop types if needed
};

export default FarmersSuppliers;
