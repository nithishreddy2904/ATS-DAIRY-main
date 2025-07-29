import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FactoryIcon from '@mui/icons-material/Factory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import InventoryIcon from '@mui/icons-material/Inventory';
import QualityIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
// For charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

// Validation regex patterns
const UNIT_ID_REGEX = /^[A-Z]{2}[0-9]{4}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;
const PHONE_REGEX = /^[0-9]{10}$/;

const UNIT_TYPES = ['Pasteurization', 'Packaging', 'Cheese Production', 'Butter Production', 'Powder Production'];
const UNIT_STATUS = ['Active', 'Maintenance', 'Inactive'];
const PRODUCT_TYPES = ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream', 'Powder'];
const BATCH_STATUS = ['In Progress', 'Completed', 'Quality Check', 'Approved', 'Rejected'];
const QUALITY_RESULTS = ['Pass', 'Fail', 'Pending'];
const MAINTENANCE_TYPES = ['Preventive', 'Corrective', 'Emergency', 'Scheduled'];
const MAINTENANCE_STATUS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  // Handle both ISO string and MySQL datetime formats
  const date = new Date(timestamp);
  
  // Format as: Jun 09, 2025
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour12: false
  }).split(',')[0]; // Remove time part, only show date
};


const ProcessingUnits = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // MODIFIED: Get shared data from context for Dashboard linking
  const {
  processingUnits,
  addProcessingUnit,
  updateProcessingUnit,
  deleteProcessingUnit,
  loadProcessingUnitsFromDatabase,
  productionBatches,
  setProductionBatches,
  qualityControlRecords,
  qualityControlLoading,
  addQualityControlRecord,
  updateQualityControlRecord,
  deleteQualityControlRecord,
  // Replace maintenanceRecordsData with backend-connected data
  maintenanceRecords,
  maintenanceLoading,
  addMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  calculateProcessingEfficiency,
  addProductionBatch,
  updateProductionBatch,
  deleteProductionBatch,
} = useAppContext();


  useEffect(() => {
    loadProcessingUnitsFromDatabase();
  }, []);

  // Processing Units State
  const [unitForm, setUnitForm] = useState({
    id: '', name: '', location: '', manager: '', phone: '', capacity: '', status: 'Active', type: ''
  });
  const [editUnitIdx, setEditUnitIdx] = useState(null);
  const [editUnitForm, setEditUnitForm] = useState({
    id: '', name: '', location: '', manager: '', phone: '', capacity: '', status: 'Active', type: ''
  });

  // Production Batches State
  const [batchForm, setBatchForm] = useState({
  batchId: '', unit: '', product: '', quantity: '', date: '', status: 'In Progress', quality: ''
  });

  const [editBatchIdx, setEditBatchIdx] = useState(null);
  const [editBatchForm, setEditBatchForm] = useState({
    batchId: '', unit: '', product: '', quantity: '', date: '', status: 'In Progress', quality: ''
  });

  // Quality Checks State
  const [qualityForm, setQualityForm] = useState({
    batchId: '', unitId: '', testDate: '', parameters: { fat: '', protein: '', moisture: '', ph: '' }, result: 'Pending', inspector: ''
  });
  const [editQualityIdx, setEditQualityIdx] = useState(null);
  const [editQualityForm, setEditQualityForm] = useState({
    batchId: '', unitId: '', testDate: '', parameters: { fat: '', protein: '', moisture: '', ph: '' }, result: 'Pending', inspector: ''
  });

  // Maintenance Records State
  const [maintenanceForm, setMaintenanceForm] = useState({
    unitId: '', date: '', type: 'Preventive', description: '', cost: '', technician: '', status: 'Scheduled'
  });
  const [editMaintenanceIdx, setEditMaintenanceIdx] = useState(null);
  const [editMaintenanceForm, setEditMaintenanceForm] = useState({
    unitId: '', date: '', type: 'Preventive', description: '', cost: '', technician: '', status: 'Scheduled'
  });

  // Validation Errors
  const [unitIdError, setUnitIdError] = useState('');
  const [nameError, setNameError] = useState('');
  const [managerError, setManagerError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [costError, setCostError] = useState('');
  const [inspectorError, setInspectorError] = useState('');
  const [technicianError, setTechnicianError] = useState('');

  // Tab styling function
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#1976d2' : 'transparent',
        color: isSelected ? '#fff' : '#1976d2',
        border: '2px solid #1976d2',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '160px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#1565c0' : '#e3f2fd' }
      },
      {
        borderRadius: '8px 8px 0 0',
        backgroundColor: isSelected ? '#388e3c' : '#f5f5f5',
        color: isSelected ? '#fff' : '#388e3c',
        border: '1px solid #388e3c',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        minWidth: '150px',
        margin: '0 2px',
        '&:hover': { backgroundColor: isSelected ? '#2e7d32' : '#e8f5e9' }
      },
      {
        borderRadius: '12px',
        backgroundColor: isSelected ? '#f57c00' : 'transparent',
        color: isSelected ? '#fff' : '#f57c00',
        border: '2px dashed #f57c00',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 6px',
        '&:hover': { backgroundColor: isSelected ? '#ef6c00' : '#fff3e0' }
      },
      {
        borderRadius: '20px 20px 20px 4px',
        backgroundColor: isSelected ? '#7b1fa2' : '#fff',
        color: isSelected ? '#fff' : '#7b1fa2',
        border: '2px solid #7b1fa2',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#6a1b9a' : '#f3e5f5' }
      }
    ];
    return styles[index] || {};
  };

  // MODIFIED: Unit handlers with validation - now using shared data
  const handleUnitChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id') {
      if (!UNIT_ID_REGEX.test(value)) setUnitIdError('Format: PU0001 (2 letters + 4 digits)');
      else setUnitIdError('');
    }
    if (name === 'name' || name === 'location') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'manager') {
      if (!NAME_REGEX.test(value)) setManagerError('Only alphabets and spaces allowed');
      else setManagerError('');
    }
    if (name === 'phone') {
      if (!PHONE_REGEX.test(value)) setPhoneError('Must be 10 digits');
      else setPhoneError('');
    }
    if (name === 'capacity') {
      if (!NUMERIC_REGEX.test(value)) setCapacityError('Only numbers allowed');
      else setCapacityError('');
    }
    setUnitForm({ ...unitForm, [name]: value });
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    try {
      await addProcessingUnit(unitForm);
      // Wait for the reload to finish before resetting the form
      await loadProcessingUnitsFromDatabase();
      setUnitForm({ id: '', name: '', location: '', manager: '', phone: '', capacity: '', status: 'Active', type: '' });
    } catch (error) {
      alert('Error: ' + (error?.response?.data?.message || error?.message || JSON.stringify(error)));
    }
  };

  const handleDeleteUnit = (idx) => {
  const confirmed = window.confirm('Are you sure you want to delete this unit? This action cannot be undone.');
  if (!confirmed) return;
  deleteProcessingUnit(idx);
};

  const handleEditUnit = (idx) => {
    setEditUnitIdx(idx);
    setEditUnitForm(processingUnits[idx]);
    setUnitIdError(''); setNameError(''); setManagerError(''); setPhoneError(''); setCapacityError('');
  };

  const handleEditUnitChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id') {
      if (!UNIT_ID_REGEX.test(value)) setUnitIdError('Format: PU0001 (2 letters + 4 digits)');
      else setUnitIdError('');
    }
    if (name === 'name' || name === 'location') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'manager') {
      if (!NAME_REGEX.test(value)) setManagerError('Only alphabets and spaces allowed');
      else setManagerError('');
    }
    if (name === 'phone') {
      if (!PHONE_REGEX.test(value)) setPhoneError('Must be 10 digits');
      else setPhoneError('');
    }
    if (name === 'capacity') {
      if (!NUMERIC_REGEX.test(value)) setCapacityError('Only numbers allowed');
      else setCapacityError('');
    }
    setEditUnitForm({ ...editUnitForm, [name]: value });
  };

  const handleSaveEditUnit = () => {
    if (editUnitIdx !== null && !unitIdError && !nameError && !managerError && !phoneError && !capacityError) {
      updateProcessingUnit(editUnitIdx, editUnitForm);
      setEditUnitIdx(null);
    }
  };

  // MODIFIED: Batch handlers - now using shared data
 const handleBatchChange = (e) => {
  const { name, value } = e.target;
  if (name === 'quantity') {
    if (!NUMERIC_REGEX.test(value)) setQuantityError('Only numbers allowed');
    else setQuantityError('');
  }
  setBatchForm({ ...batchForm, [name]: value });
};

const handleAddBatch = async (e) => {
  e.preventDefault();
  if (batchForm.batchId && batchForm.unit && batchForm.product && 
      batchForm.quantity && batchForm.date && !quantityError) {
    try {
      // Map form data correctly
      const batchData = {
        batchId: batchForm.batchId,
        unit: batchForm.unit,        // This should be unit_id
        product: batchForm.product,
        quantity: parseFloat(batchForm.quantity),
        date: batchForm.date,
        status: batchForm.status,
        quality: batchForm.quality || ''
      };
      
      await addProductionBatch(batchData);
      setBatchForm({ 
        batchId: '', unit: '', product: '', quantity: '', 
        date: '', status: 'In Progress', quality: '' 
      });
    } catch (error) {
      alert('Error adding batch: ' + (error?.message || 'Unknown error'));
    }
  } else {
    alert('Please fill all required fields.');
  }
};



  const handleDeleteBatch = async (idx) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      await deleteProductionBatch(idx);
    }
  };

  const handleEditBatch = (idx) => {
    setEditBatchIdx(idx);
    setEditBatchForm(productionBatches[idx]);
    setQuantityError('');
  };

  const handleEditBatchChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      if (!NUMERIC_REGEX.test(value)) setQuantityError('Only numbers allowed');
      else setQuantityError('');
    }
    setEditBatchForm({ ...editBatchForm, [name]: value });
  };

  const handleSaveEditBatch = async () => {
    if (editBatchIdx !== null && !quantityError) {
      await updateProductionBatch(editBatchIdx, editBatchForm);
      setEditBatchIdx(null);
    }
  };

  // Quality Control handlers - now using backend data
const handleQualityChange = (e) => {
  const { name, value } = e.target;
  if (name === 'inspector') {
    if (!NAME_REGEX.test(value)) setInspectorError('Only alphabets and spaces allowed');
    else setInspectorError('');
  }
  if (name.startsWith('parameters.')) {
    const paramName = name.split('.')[1];
    if (!NUMERIC_REGEX.test(value)) return;
    setQualityForm({ ...qualityForm, parameters: { ...qualityForm.parameters, [paramName]: value } });
  } else {
    setQualityForm({ ...qualityForm, [name]: value });
  }
};

const handleAddQuality = async (e) => {
  e.preventDefault();
  if (qualityForm.batchId && qualityForm.unitId && qualityForm.testDate &&
      qualityForm.inspector && !inspectorError) {
    try {
      await addQualityControlRecord(qualityForm);
      setQualityForm({ 
        batchId: '', unitId: '', testDate: '', 
        parameters: { fat: '', protein: '', moisture: '', ph: '' }, 
        result: 'Pending', inspector: '' 
      });
    } catch (error) {
      alert('Error adding quality record: ' + (error?.message || 'Unknown error'));
    }
  } else {
    alert('Please fill all required fields.');
  }
};

const handleDeleteQuality = async (record) => {
  const confirmed = window.confirm('Are you sure you want to delete this quality control record?');
  if (!confirmed) return;
  try {
    await deleteQualityControlRecord(record.id);
  } catch (error) {
    alert('Error deleting quality record: ' + (error?.message || 'Unknown error'));
  }
};

const handleEditQuality = (record) => {
  setEditQualityIdx(record.id);
  setEditQualityForm({
    batchId: record.batch_id,
    unitId: record.unit_id,
    testDate: record.test_date,
    parameters: {
      fat: record.fat || '',
      protein: record.protein || '',
      moisture: record.moisture || '',
      ph: record.ph || ''
    },
    result: record.result,
    inspector: record.inspector
  });
  setInspectorError('');
};

const handleEditQualityChange = (e) => {
  const { name, value } = e.target;
  if (name === 'inspector') {
    if (!NAME_REGEX.test(value)) setInspectorError('Only alphabets and spaces allowed');
    else setInspectorError('');
  }
  if (name.startsWith('parameters.')) {
    const paramName = name.split('.')[1];
    if (!NUMERIC_REGEX.test(value)) return;
    setEditQualityForm({ ...editQualityForm, parameters: { ...editQualityForm.parameters, [paramName]: value } });
  } else {
    setEditQualityForm({ ...editQualityForm, [name]: value });
  }
};

const handleSaveEditQuality = async () => {
  if (editQualityIdx !== null && !inspectorError) {
    try {
      await updateQualityControlRecord(editQualityIdx, editQualityForm);
      setEditQualityIdx(null);
    } catch (error) {
      alert('Error updating quality record: ' + (error?.message || 'Unknown error'));
    }
  }
};

  // Maintenance handlers - now using backend data
const handleMaintenanceChange = (e) => {
  const { name, value } = e.target;
  if (name === 'cost') {
    if (!NUMERIC_REGEX.test(value)) setCostError('Only numbers allowed');
    else setCostError('');
  }
  if (name === 'technician') {
    if (!NAME_REGEX.test(value)) setTechnicianError('Only alphabets and spaces allowed');
    else setTechnicianError('');
  }
  setMaintenanceForm({ ...maintenanceForm, [name]: value });
};

const handleAddMaintenance = async (e) => {
  e.preventDefault();
  if (maintenanceForm.unitId && maintenanceForm.date && maintenanceForm.description &&
      maintenanceForm.cost && maintenanceForm.technician && !costError && !technicianError) {
    try {
      await addMaintenanceRecord(maintenanceForm);
      setMaintenanceForm({ 
        unitId: '', date: '', type: 'Preventive', description: '', 
        cost: '', technician: '', status: 'Scheduled' 
      });
    } catch (error) {
      alert('Error adding maintenance record: ' + (error?.message || 'Unknown error'));
    }
  } else {
    alert('Please fill all required fields.');
  }
};

const handleDeleteMaintenance = async (record) => {
  const confirmed = window.confirm('Are you sure you want to delete this maintenance record?');
  if (!confirmed) return;
  try {
    await deleteMaintenanceRecord(record.id);
  } catch (error) {
    alert('Error deleting maintenance record: ' + (error?.message || 'Unknown error'));
  }
};

const handleEditMaintenance = (record) => {
  setEditMaintenanceIdx(record.id);
  setEditMaintenanceForm({
    unitId: record.unit_id,
    date: record.date,
    type: record.type,
    description: record.description,
    cost: record.cost.toString(),
    technician: record.technician,
    status: record.status
  });
  setCostError('');
  setTechnicianError('');
};

const handleEditMaintenanceChange = (e) => {
  const { name, value } = e.target;
  if (name === 'cost') {
    if (!NUMERIC_REGEX.test(value)) setCostError('Only numbers allowed');
    else setCostError('');
  }
  if (name === 'technician') {
    if (!NAME_REGEX.test(value)) setTechnicianError('Only alphabets and spaces allowed');
    else setTechnicianError('');
  }
  setEditMaintenanceForm({ ...editMaintenanceForm, [name]: value });
};

const handleSaveEditMaintenance = async () => {
  if (editMaintenanceIdx !== null && !costError && !technicianError) {
    try {
      await updateMaintenanceRecord(editMaintenanceIdx, editMaintenanceForm);
      setEditMaintenanceIdx(null);
    } catch (error) {
      alert('Error updating maintenance record: ' + (error?.message || 'Unknown error'));
    }
  }
};


  // MODIFIED: Calculate statistics using shared data
  const activeUnits = processingUnits.filter(u => u.status === 'Active').length;
  const totalCapacity = processingUnits.reduce((sum, u) => sum + parseFloat(u.capacity || '0'), 0);
  const completedBatches = productionBatches.filter(b => b.status === 'Completed').length;
  const passedQuality = qualityControlRecords.filter(q => q.result === 'Pass').length;

  // MODIFIED: Chart data using shared data
  const unitTypeData = UNIT_TYPES.map(type => ({
    type,
    count: processingUnits.filter(u => u.type === type).length
  }));

  const productionData = PRODUCT_TYPES.map(product => ({
    product,
    quantity: productionBatches.filter(b => b.product === product).reduce((sum, b) => sum + parseFloat(b.quantity || '0'), 0)
  }));

  const tabLabels = [
    { label: 'Processing Units', icon: <FactoryIcon /> },
    { label: 'Production Batches', icon: <PrecisionManufacturingIcon /> },
    { label: 'Quality Control', icon: <QualityIcon /> },
    { label: 'Maintenance', icon: <SpeedIcon /> }
  ];

  return (
    <Box  sx={{ bgcolor: 'background.default', minHeight: '200vh' }}>
      {/* MODIFIED: Dynamic Header */}
      <Box height={150} sx={{
        borderRadius: 0, p: 3, mb: 2,mt: 3,
        background: `linear-gradient(135deg, ${
          ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2'][tab]
        } 0%, ${
          ['#1565c0', '#2e7d32', '#ef6c00', '#6a1b9a'][tab]
        } 100%)`,
        color: '#fff', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}  sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
            {tabLabels[tab].icon}
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {tabLabels[tab].label}
            </Typography>
            {/* <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Processing Efficiency: {calculateProcessingEfficiency}% | Real-time calculation from processing data
            </Typography> */}
          </Box>
        </Stack>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={4} sx={{ px: 7, mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: 'white', borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} width={180} height={100}>
              <FactoryIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">{activeUnits}</Typography>
                <Typography variant="body2">Active Units</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)', color: 'white', borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} width={180} height={100}>
              <InventoryIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">{totalCapacity.toFixed(0)}L</Typography>
                <Typography variant="body2">Total Capacity</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)', color: 'white', borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} width={180} height={100}>
              <PrecisionManufacturingIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">{completedBatches}</Typography>
                <Typography variant="body2">Completed Batches</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)', color: 'white', borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} width={180} height={100}>
              <QualityIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">{passedQuality}</Typography>
                <Typography variant="body2">Quality Passed</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Custom Tabs */}
      <Box sx={{ px: 2, mb: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
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

      <Box sx={{ px: 2 }}>
        {/* Processing Units Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>🏭</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Processing Unit</Typography>
              </Stack>
              <form onSubmit={handleAddUnit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Unit ID" name="id" value={unitForm.id} onChange={handleUnitChange} required
                      error={!!unitIdError} helperText={unitIdError || "Format: PU0001"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Unit Name" name="name" value={unitForm.name} onChange={handleUnitChange} required
                      error={!!nameError} helperText={nameError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Location" name="location" value={unitForm.location} onChange={handleUnitChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Manager" name="manager" value={unitForm.manager} onChange={handleUnitChange} required
                      error={!!managerError} helperText={managerError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Phone" name="phone" value={unitForm.phone} onChange={handleUnitChange} required
                      error={!!phoneError} helperText={phoneError || "10 digits"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Capacity (L)" name="capacity" value={unitForm.capacity} onChange={handleUnitChange} required
                      error={!!capacityError} helperText={capacityError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Type" name="type" value={unitForm.type} onChange={handleUnitChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: '100px' }}>
                      {UNIT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Status" name="status" value={unitForm.status} onChange={handleUnitChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      {UNIT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                      disabled={!!unitIdError || !!nameError || !!managerError || !!phoneError || !!capacityError}>
                      Add Processing Unit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Processing Units
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.2)' : '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Unit ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Manager</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Capacity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processingUnits.map((unit, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(25,118,210,0.05)' } }}>
                      <TableCell><Chip label={unit.unit_id || unit.id} color="primary" variant="outlined" /></TableCell>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell><Chip label={unit.type} size="small" color="info" /></TableCell>
                      <TableCell>{unit.manager}</TableCell>
                      <TableCell><Typography fontWeight="bold" color="primary.main">{unit.capacity}L</Typography></TableCell>
                      <TableCell><Chip label={unit.status} color={unit.status === 'Active' ? 'success' : unit.status === 'Maintenance' ? 'warning' : 'error'} size="small" /></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditUnit(idx)} sx={{ borderRadius: 2 }}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDeleteUnit(idx)} sx={{ borderRadius: 2 }}><DeleteIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {processingUnits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🏭</Avatar>
                          <Typography variant="h6" color="text.secondary">No processing units registered</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Edit Unit Dialog */}
            <Dialog open={editUnitIdx !== null} onClose={() => setEditUnitIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>✏️</Avatar>Edit Processing Unit
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Unit ID" name="id" value={editUnitForm.id} onChange={handleEditUnitChange} required
                      error={!!unitIdError} helperText={unitIdError || "Format: PU0001"} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Unit Name" name="name" value={editUnitForm.name} onChange={handleEditUnitChange} required
                      error={!!nameError} helperText={nameError} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Location" name="location" value={editUnitForm.location} onChange={handleEditUnitChange} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Manager" name="manager" value={editUnitForm.manager} onChange={handleEditUnitChange} required
                      error={!!managerError} helperText={managerError} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Phone" name="phone" value={editUnitForm.phone} onChange={handleEditUnitChange} required
                      error={!!phoneError} helperText={phoneError || "10 digits"} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Capacity (L)" name="capacity" value={editUnitForm.capacity} onChange={handleEditUnitChange} required
                      error={!!capacityError} helperText={capacityError} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Type" name="type" value={editUnitForm.type} onChange={handleEditUnitChange} required>
                      {UNIT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Status" name="status" value={editUnitForm.status} onChange={handleEditUnitChange} required>
                      {UNIT_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditUnitIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                <Button onClick={handleSaveEditUnit} variant="contained" sx={{ borderRadius: 2 }}
                  disabled={!!unitIdError || !!nameError || !!managerError || !!phoneError || !!capacityError}>Save Changes</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Production Batches Tab */}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(56,142,60,0.1) 0%, rgba(56,142,60,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#388e3c', width: 48, height: 48 }}>⚙️</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Production Batch</Typography>
              </Stack>
              <form onSubmit={handleAddBatch}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Batch ID" name="batchId" value={batchForm.batchId} onChange={handleBatchChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width:'120px' }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField sx={{width:'160px'}} select fullWidth label="Processing Unit" name="unit" value={batchForm.unit} onChange={handleBatchChange} required>
                      {processingUnits.map(unit => <MenuItem key={unit.id} value={unit.unit_id}>{unit.name} ({unit.unit_id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Product" name="product" value={batchForm.product} onChange={handleBatchChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 },width:'120px' }}>
                      {PRODUCT_TYPES.map(product => <MenuItem key={product} value={product}>{product}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField  fullWidth label="Quantity (L/Kg)" name="quantity" value={batchForm.quantity} onChange={handleBatchChange} required
                      error={!!quantityError} helperText={quantityError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width:'160px' }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Date" name="date" value={batchForm.date} onChange={handleBatchChange} type="date"
                      InputLabelProps={{ shrink: true }} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Status" name="status" value={batchForm.status} onChange={handleBatchChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      {BATCH_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                      disabled={!!quantityError}>Add Production Batch</Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#388e3c', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Production Batches
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(56,142,60,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productionBatches.map((batch, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(56,142,60,0.05)' } }}>
                      <TableCell><Chip label={batch.batchId} color="success" variant="outlined" /></TableCell>
                      <TableCell>{batch.unitName ? `${batch.unitName} (${batch.unit})` : batch.unit}</TableCell>
                      <TableCell><Chip label={batch.product} size="small" color="info" /></TableCell>
                      <TableCell><Typography fontWeight="bold" color="success.main">{batch.quantity}</Typography></TableCell>
                      <TableCell>{formatDateTime(batch.date)}</TableCell>
                      <TableCell><Chip label={batch.status} color={batch.status === 'Completed' ? 'success' : batch.status === 'In Progress' ? 'warning' : 'info'} size="small" /></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleEditBatch(idx)} sx={{ borderRadius: 2 }}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDeleteBatch(idx)} sx={{ borderRadius: 2 }}><DeleteIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Edit Batch Dialog */}
            <Dialog open={editBatchIdx !== null} onClose={() => setEditBatchIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: isDark ? 'rgba(56,142,60,0.1)' : '#e8f5e8', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#388e3c', mr: 2 }}>✏️</Avatar>Edit Production Batch
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Batch ID" name="batchId" value={editBatchForm.batchId} onChange={handleEditBatchChange} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Processing Unit" name="unit" value={editBatchForm.unit} onChange={handleEditBatchChange} required>
                     {processingUnits.map(unit => <MenuItem key={unit.id} value={unit.unit_id}>{unit.name} ({unit.unit_id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Product" name="product" value={editBatchForm.product} onChange={handleEditBatchChange} required>
                      {PRODUCT_TYPES.map(product => <MenuItem key={product} value={product}>{product}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Quantity (L/Kg)" name="quantity" value={editBatchForm.quantity} onChange={handleEditBatchChange} required
                      error={!!quantityError} helperText={quantityError} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Date" name="date" value={editBatchForm.date} onChange={handleEditBatchChange} type="date"
                      InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Status" name="status" value={editBatchForm.status} onChange={handleEditBatchChange} required>
                      {BATCH_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditBatchIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                <Button onClick={handleSaveEditBatch} variant="contained" sx={{ borderRadius: 2 }} disabled={!!quantityError}>Save Changes</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Quality Control Tab */}
        {tab === 2 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(245,124,0,0.1) 0%, rgba(245,124,0,0.05) 100%)' : 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#f57c00', width: 48, height: 48 }}>🔬</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Quality Check</Typography>
              </Stack>
              <form onSubmit={handleAddQuality}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Batch ID" name="batchId" value={qualityForm.batchId} onChange={handleQualityChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width:'120px'}}>
                      {productionBatches.map(batch => <MenuItem key={batch.batchId} value={batch.batchId}>{batch.batchId} - {batch.product}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Unit ID" name="unitId" value={qualityForm.unitId} onChange={handleQualityChange} required
                      sx={{ '& .MuiOutlinedInputRoot': { borderRadius: 2 }, width:'100px' }}>
                      {processingUnits.map(unit => <MenuItem key={unit.id} value={unit.unit_id}>{unit.name} ({unit.unit_id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Test Date" name="testDate" value={qualityForm.testDate} onChange={handleQualityChange} type="date"
                      InputLabelProps={{ shrink: true }} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Inspector" name="inspector" value={qualityForm.inspector} onChange={handleQualityChange} required
                      error={!!inspectorError} helperText={inspectorError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Fat %" name="parameters.fat" value={qualityForm.parameters.fat} onChange={handleQualityChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Protein %" name="parameters.protein" value={qualityForm.parameters.protein} onChange={handleQualityChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Moisture %" name="parameters.moisture" value={qualityForm.parameters.moisture} onChange={handleQualityChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="pH" name="parameters.ph" value={qualityForm.parameters.ph} onChange={handleQualityChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Result" name="result" value={qualityForm.result} onChange={handleQualityChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      {QUALITY_RESULTS.map(result => <MenuItem key={result} value={result}>{result}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                      disabled={!!inspectorError}>Add Quality Check</Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#f57c00', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Quality Control Records
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(245,124,0,0.2)' : '#fff3e0' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Test Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Fat %</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Protein %</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Result</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Inspector</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                     {qualityControlLoading ? (
                  <TableRow>
                     <TableCell colSpan={7} align="center">
                       <Typography>Loading quality control records...</Typography>
                      </TableCell>
                  </TableRow>
                         ) : qualityControlRecords.length === 0 ? (
                  <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🔬</Avatar>
                    <Typography variant="h6" color="text.secondary">No quality control records found</Typography>
                    </Stack>
                  </TableCell>
                  </TableRow>
                     ) : (
                    qualityControlRecords.map((record) => (
      <TableRow key={record.id}>
        <TableCell><Chip label={record.batch_id} color="primary" variant="outlined" /></TableCell>
        <TableCell>{record.unit_id}</TableCell>
        <TableCell>{formatDateTime(record.test_date)}</TableCell>
        <TableCell>{record.fat}%</TableCell>
        <TableCell>{record.protein}%</TableCell>
        <TableCell>
          <Chip 
            label={record.result} 
            color={record.result === 'Pass' ? 'success' : record.result === 'Fail' ? 'error' : 'warning'} 
            size="small" 
          />
        </TableCell>
        <TableCell>{record.inspector}</TableCell>
        <TableCell>
              <Stack direction="row" spacing={1}>
                <IconButton color="primary" onClick={() => handleEditQuality(record)} sx={{ borderRadius: 2 }}>
                 <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteQuality(record)} sx={{ borderRadius: 2 }}>
                 <DeleteIcon />
                </IconButton>
              </Stack>  
        </TableCell>
                </TableRow>
                       ))
                  )}
             </TableBody>

              </Table>
            </TableContainer>

            {/* Edit Quality Dialog */}
            <Dialog open={editQualityIdx !== null} onClose={() => setEditQualityIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: isDark ? 'rgba(245,124,0,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#f57c00', mr: 2 }}>✏️</Avatar>Edit Quality Check
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Batch ID" name="batchId" value={editQualityForm.batchId} onChange={handleEditQualityChange} required>
                      {productionBatches.map(batch => <MenuItem key={batch.batchId} value={batch.batchId}>{batch.batchId} - {batch.product}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Unit ID" name="unitId" value={editQualityForm.unitId} onChange={handleEditQualityChange} required>
                      {processingUnits.map(unit => <MenuItem key={unit.id} value={unit.id}>{unit.name} ({unit.id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Test Date" name="testDate" value={editQualityForm.testDate} onChange={handleEditQualityChange} type="date"
                      InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Inspector" name="inspector" value={editQualityForm.inspector} onChange={handleEditQualityChange} required
                      error={!!inspectorError} helperText={inspectorError} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Fat %" name="parameters.fat" value={editQualityForm.parameters.fat} onChange={handleEditQualityChange} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Protein %" name="parameters.protein" value={editQualityForm.parameters.protein} onChange={handleEditQualityChange} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Moisture %" name="parameters.moisture" value={editQualityForm.parameters.moisture} onChange={handleEditQualityChange} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="pH" name="parameters.ph" value={editQualityForm.parameters.ph} onChange={handleEditQualityChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Result" name="result" value={editQualityForm.result} onChange={handleEditQualityChange} required>
                      {QUALITY_RESULTS.map(result => <MenuItem key={result} value={result}>{result}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditQualityIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                <Button onClick={handleSaveEditQuality} variant="contained" sx={{ borderRadius: 2 }} disabled={!!inspectorError}>Save Changes</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Maintenance Tab */}
        {tab === 3 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(123,31,162,0.1) 0%, rgba(123,31,162,0.05) 100%)' : 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#7b1fa2', width: 48, height: 48 }}>🔧</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Maintenance Record</Typography>
              </Stack>
              <form onSubmit={handleAddMaintenance}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Processing Unit" name="unitId" value={maintenanceForm.unitId} onChange={handleMaintenanceChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width:'160px' }}>
                      {processingUnits.map(unit => <MenuItem key={unit.id} value={unit.unit_id}>{unit.name} ({unit.unit_id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Date" name="date" value={maintenanceForm.date} onChange={handleMaintenanceChange} type="date"
                      InputLabelProps={{ shrink: true }} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Type" name="type" value={maintenanceForm.type} onChange={handleMaintenanceChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      {MAINTENANCE_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Cost (INR)" name="cost" value={maintenanceForm.cost} onChange={handleMaintenanceChange} required
                      error={!!costError} helperText={costError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Technician" name="technician" value={maintenanceForm.technician} onChange={handleMaintenanceChange} required
                      error={!!technicianError} helperText={technicianError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Status" name="status" value={maintenanceForm.status} onChange={handleMaintenanceChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      {MAINTENANCE_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Description" name="description" value={maintenanceForm.description} onChange={handleMaintenanceChange} required
                      multiline rows={1} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                      disabled={!!costError || !!technicianError}>Add Maintenance Record</Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#7b1fa2', mr: 2, width: 32, height: 32 }}>📊</Avatar>
              Maintenance Records
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(123,31,162,0.2)' : '#f3e5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Unit ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Cost</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Technician</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                               <TableBody>
  {maintenanceLoading ? (
    <TableRow>
      <TableCell colSpan={8} align="center">
        <Typography>Loading maintenance records...</Typography>
      </TableCell>
    </TableRow>
  ) : maintenanceRecords.length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🔧</Avatar>
          <Typography variant="h6" color="text.secondary">No maintenance records found</Typography>
        </Stack>
      </TableCell>
    </TableRow>
  ) : (
    maintenanceRecords.map((record) => (
      <TableRow key={record.id}>
        <TableCell>{record.unit_id}</TableCell>
        <TableCell>{formatDateTime(record.date)}</TableCell>
        <TableCell><Chip label={record.type} size="small" color="info" /></TableCell>
        <TableCell>{record.description}</TableCell>
        <TableCell><Typography fontWeight="bold" color="success.main">₹{record.cost}</Typography></TableCell>
        <TableCell>{record.technician}</TableCell>
        <TableCell>
          <Chip 
            label={record.status} 
            color={record.status === 'Completed' ? 'success' : record.status === 'In Progress' ? 'warning' : 'info'} 
            size="small" 
          />
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <IconButton color="primary" onClick={() => handleEditMaintenance(record)} sx={{ borderRadius: 2 }}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeleteMaintenance(record)} sx={{ borderRadius: 2 }}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

              </Table>
            </TableContainer>

            {/* Edit Maintenance Dialog */}
            <Dialog open={editMaintenanceIdx !== null} onClose={() => setEditMaintenanceIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: isDark ? 'rgba(123,31,162,0.1)' : '#f3e5f5', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#7b1fa2', mr: 2 }}>✏️</Avatar>Edit Maintenance Record
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Processing Unit" name="unitId" value={editMaintenanceForm.unitId} onChange={handleEditMaintenanceChange} required>
                      {processingUnits.map(unit => <MenuItem key={unit.id} value={unit.unit_id}>{unit.name} ({unit.unit_id})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Date" name="date" value={editMaintenanceForm.date} onChange={handleEditMaintenanceChange} type="date"
                      InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Cost (INR)" name="cost" value={editMaintenanceForm.cost} onChange={handleEditMaintenanceChange} required
                      error={!!costError} helperText={costError} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Technician" name="technician" value={editMaintenanceForm.technician} onChange={handleEditMaintenanceChange} required
                      error={!!technicianError} helperText={technicianError} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select fullWidth label="Status" name="status" value={editMaintenanceForm.status} onChange={handleEditMaintenanceChange} required>
                      {MAINTENANCE_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Description" name="description" value={editMaintenanceForm.description} onChange={handleEditMaintenanceChange} required
                      multiline rows={3} />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditMaintenanceIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                <Button onClick={handleSaveEditMaintenance} variant="contained" sx={{ borderRadius: 2 }} disabled={!!costError || !!technicianError}>Save Changes</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Charts Section */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: 300 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Unit Type Distribution</Typography>
              <ResponsiveContainer width="100%" height={220} width={485}>
                <PieChart>
                  <Pie
                    data={unitTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, count }) => `${type}: ${count}`}
                  >
                    {unitTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: 300 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Production by Product Type</Typography>
              <ResponsiveContainer width="100%" height={220} width={485}>
                <BarChart data={productionData}>
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProcessingUnits;
