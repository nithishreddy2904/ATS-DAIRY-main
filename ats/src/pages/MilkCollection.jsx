import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, CircularProgress, Alert, FormControl, InputLabel, Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import OpacityIcon from '@mui/icons-material/Opacity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ScienceIcon from '@mui/icons-material/Science';
import PaymentIcon from '@mui/icons-material/Payment';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';

const MilkCollection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const { 
    milkEntries, 
    farmers,
    addMilkEntry, 
    updateMilkEntry, 
    deleteMilkEntry,
    loading,
    error
  } = useAppContext();

  // Form state
  const [entryForm, setEntryForm] = useState({
    farmerId: '', farmerName: '', date: '', quantity: '', shift: 'Morning', 
    quality: 'A', fatContent: '', snfContent: '', temperature: '', phLevel: '',
    collectionCenter: '', collectedBy: '', vehicleNumber: '', remarks: '',
    paymentAmount: '', paymentStatus: 'Pending'
  });

  // Edit state
  const [editEntryIdx, setEditEntryIdx] = useState(null);
  const [editEntryForm, setEditEntryForm] = useState({
    farmerId: '', farmerName: '', date: '', quantity: '', shift: 'Morning', 
    quality: 'A', fatContent: '', snfContent: '', temperature: '', phLevel: '',
    collectionCenter: '', collectedBy: '', vehicleNumber: '', remarks: '',
    paymentAmount: '', paymentStatus: 'Pending'
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};
    
    if (!formData.farmerId) newErrors.farmerId = 'Farmer ID is required';
    if (!formData.farmerName) newErrors.farmerName = 'Farmer name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    if (formData.fatContent && (parseFloat(formData.fatContent) < 0 || parseFloat(formData.fatContent) > 10)) {
      newErrors.fatContent = 'Fat content must be between 0-10%';
    }
    if (formData.snfContent && (parseFloat(formData.snfContent) < 0 || parseFloat(formData.snfContent) > 15)) {
      newErrors.snfContent = 'SNF content must be between 0-15%';
    }
    if (formData.temperature && (parseFloat(formData.temperature) < 0 || parseFloat(formData.temperature) > 50)) {
      newErrors.temperature = 'Temperature must be between 0-50°C';
    }
    if (formData.phLevel && (parseFloat(formData.phLevel) < 6 || parseFloat(formData.phLevel) > 8)) {
      newErrors.phLevel = 'pH level must be between 6-8';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEntryForm({ ...entryForm, [name]: value });
    
    // Auto-fill farmer name when farmer ID is selected
    if (name === 'farmerId') {
      const selectedFarmer = farmers.find(f => f.id === value);
      if (selectedFarmer) {
        setEntryForm(prev => ({ ...prev, farmerId: value, farmerName: selectedFarmer.name }));
      }
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditEntryForm({ ...editEntryForm, [name]: value });
    
    // Auto-fill farmer name when farmer ID is selected
    if (name === 'farmerId') {
      const selectedFarmer = farmers.find(f => f.id === value);
      if (selectedFarmer) {
        setEditEntryForm(prev => ({ ...prev, farmerId: value, farmerName: selectedFarmer.name }));
      }
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    
    if (!validateForm(entryForm)) return;
    
    try {
      await addMilkEntry({ ...entryForm });
      setEntryForm({
        farmerId: '', farmerName: '', date: '', quantity: '', shift: 'Morning', 
        quality: 'A', fatContent: '', snfContent: '', temperature: '', phLevel: '',
        collectionCenter: '', collectedBy: '', vehicleNumber: '', remarks: '',
        paymentAmount: '', paymentStatus: 'Pending'
      });
      setErrors({});
    } catch (error) {
      alert('Error adding milk entry: ' + error.message);
    }
  };

  const handleEditEntry = (idx) => {
    setEditEntryIdx(idx);
    setEditEntryForm(milkEntries[idx]);
    setErrors({});
  };

  const handleSaveEditEntry = async () => {
    if (!validateForm(editEntryForm)) return;
    
    try {
      await updateMilkEntry(editEntryIdx, editEntryForm);
      setEditEntryIdx(null);
    } catch (error) {
      alert('Error updating milk entry: ' + error.message);
    }
  };

  const handleDeleteEntry = async (idx) => {
    if (window.confirm('Are you sure you want to delete this milk entry?')) {
      try {
        await deleteMilkEntry(idx);
      } catch (error) {
        alert('Error deleting milk entry: ' + error.message);
      }
    }
  };

  // Calculate statistics
  const totalQuantity = milkEntries.reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
  const todayEntries = milkEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]).length;
  const avgQuality = milkEntries.length > 0 ? 
    milkEntries.filter(e => e.quality === 'A+' || e.quality === 'A').length / milkEntries.length * 100 : 0;
  const totalPayment = milkEntries.reduce((sum, entry) => sum + parseFloat(entry.paymentAmount || 0), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading milk collection data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
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
            <OpacityIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              Milk Collection Management
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Track daily milk collection, quality parameters, and payment records
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 1, }}>
        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb:4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={80}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 46, height: 56 }}>
                  <OpacityIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box >
                  <Typography variant="h4" fontWeight="bold" >{totalQuantity.toFixed(1)}L</Typography>
                  <Typography variant="body1">Total Collected</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All time
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
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={80}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ScienceIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{avgQuality.toFixed(1)}%</Typography>
                  <Typography variant="body1">Quality Grade A+/A</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Average quality
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
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={80}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ThermostatIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{todayEntries}</Typography>
                  <Typography variant="body1">Today's Collections</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {new Date().toLocaleDateString()}
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
              <Stack direction="row" alignItems="center" spacing={2} width={210} height={80}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 46, height: 56 }}>
                  <PaymentIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">₹{totalPayment.toLocaleString()}</Typography>
                  <Typography variant="body1">Total Payments</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All transactions
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Milk Entry Form - CHANGED TO VERY LIGHT BLUE BACKGROUND */}
        <Paper elevation={6} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          background: isDark 
            ? 'linear-gradient(135deg, rgba(248,251,255,0.1) 0%, rgba(240,248,255,0.05) 100%)' 
            : 'linear-gradient(135deg, #f8fbff 0%, #f0f8ff 100%)' // Very light blue background
        }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>
              <AddIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">Record Milk Collection</Typography>
          </Stack>
          <form onSubmit={handleAddEntry}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.farmerId}>
                  <InputLabel>Farmer</InputLabel>
                  <Select
                    name="farmerId"
                    value={entryForm.farmerId}
                    onChange={handleFormChange}
                    required
                    sx={{
                      width: '100px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f8fbff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#f0f8ff',
                        }
                      }
                    }}
                  >
                    {farmers.map(farmer => (
                      <MenuItem key={farmer.id} value={farmer.id}>
                        {farmer.id} - {farmer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Date" name="date" type="date" value={entryForm.date}
                  onChange={handleFormChange} required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Quantity (Liters)" name="quantity" type="number" value={entryForm.quantity}
                  onChange={handleFormChange} required
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Shift</InputLabel>
                  <Select 
                    label="shift" name="shift" 
                    value={entryForm.shift} 
                    onChange={handleFormChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f8fbff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#f0f8ff',
                        }
                      }
                    }}
                  >
                    <MenuItem value="Morning">Morning</MenuItem>
                    <MenuItem value="Evening">Evening</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Quality Grade</InputLabel>
                  <Select 
                    label="quality grade" name="quality" 
                    value={entryForm.quality} 
                    onChange={handleFormChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f8fbff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#f0f8ff',
                        }
                      }
                    }}
                  >
                    <MenuItem value="A+">A+ (Excellent)</MenuItem>
                    <MenuItem value="A">A (Good)</MenuItem>
                    <MenuItem value="B">B (Average)</MenuItem>
                    <MenuItem value="C">C (Below Average)</MenuItem>
                    <MenuItem value="D">D (Poor)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Quality Parameters */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="Fat Content (%)" name="fatContent" type="number" value={entryForm.fatContent}
                  onChange={handleFormChange}
                  error={!!errors.fatContent}
                  helperText={errors.fatContent}
                  inputProps={{ step: 0.1, min: 0, max: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="SNF Content (%)" name="snfContent" type="number" value={entryForm.snfContent}
                  onChange={handleFormChange}
                  error={!!errors.snfContent}
                  helperText={errors.snfContent}
                  inputProps={{ step: 0.1, min: 0, max: 15 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="Temperature (°C)" name="temperature" type="number" value={entryForm.temperature}
                  onChange={handleFormChange}
                  error={!!errors.temperature}
                  helperText={errors.temperature}
                  inputProps={{ step: 0.1, min: 0, max: 50 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="pH Level" name="phLevel" type="number" value={entryForm.phLevel}
                  onChange={handleFormChange}
                  error={!!errors.phLevel}
                  helperText={errors.phLevel}
                  inputProps={{ step: 0.1, min: 6, max: 8 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>

              {/* Collection Details */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Collection Center" name="collectionCenter" value={entryForm.collectionCenter}
                  onChange={handleFormChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Collected By" name="collectedBy" value={entryForm.collectedBy}
                  onChange={handleFormChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Vehicle Number" name="vehicleNumber" value={entryForm.vehicleNumber}
                  onChange={handleFormChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>

              {/* Payment Details */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Payment Amount (₹)" name="paymentAmount" type="number" value={entryForm.paymentAmount}
                  onChange={handleFormChange}
                  inputProps={{ step: 0.01, min: 0 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select 
                    label="paymentStatus" name="paymentStatus" 
                    value={entryForm.paymentStatus} 
                    onChange={handleFormChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f8fbff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#f0f8ff',
                        }
                      }
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Partial">Partial</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth label="Remarks" name="remarks" value={entryForm.remarks}
                  onChange={handleFormChange}
                  multiline rows={1}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f0f8ff',
                      }
                    }
                  }}
                />
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
                >
                  Record Collection (Saves to Database)
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Milk Entries Table */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#2196f3', mr: 2, width: 32, height: 32 }}>📋</Avatar>
          Milk Collection Records ({milkEntries.length} total)
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.2)' : '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Shift</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Quality</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Fat %</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milkEntries.map((entry, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(33,150,243,0.05)' } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entry.shift}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography fontWeight="bold">{entry.farmerName}</Typography>
                      <Typography variant="caption" color="text.secondary">{entry.farmerId}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary.main">{entry.quantity}L</Typography>
                    {entry.temperature && (
                      <Typography variant="caption" color="text.secondary">
                        {entry.temperature}°C
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.shift} 
                      color={entry.shift === 'Morning' ? 'warning' : 'info'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.quality} 
                      color={
                        entry.quality === 'A+' ? 'success' : 
                        entry.quality === 'A' ? 'primary' : 
                        entry.quality === 'B' ? 'warning' : 'error'
                      } 
                      size="small" 
                    />
                    {entry.fatContent && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Fat: {entry.fatContent}%
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.fatContent && (
                      <Typography variant="body2">{entry.fatContent}%</Typography>
                    )}
                    {entry.snfContent && (
                      <Typography variant="caption" color="text.secondary">
                        SNF: {entry.snfContent}%
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.paymentAmount && (
                      <Typography fontWeight="bold">₹{entry.paymentAmount}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.paymentStatus} 
                      color={
                        entry.paymentStatus === 'Paid' ? 'success' : 
                        entry.paymentStatus === 'Partial' ? 'warning' : 'error'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditEntry(idx)} sx={{ borderRadius: 2 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteEntry(idx)} sx={{ borderRadius: 2 }}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {milkEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🥛</Avatar>
                      <Typography variant="h6" color="text.secondary">No milk collection records</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add your first milk collection record using the form above
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Milk Entry Dialog */}
        <Dialog open={editEntryIdx !== null} onClose={() => setEditEntryIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>✏️</Avatar>Edit Milk Collection Record
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.farmerId}>
                  <InputLabel>Farmer</InputLabel>
                  <Select
                    name="farmerId"
                    value={editEntryForm.farmerId}
                    onChange={handleEditFormChange}
                    required
                  >
                    {farmers.map(farmer => (
                      <MenuItem key={farmer.id} value={farmer.id}>
                        {farmer.id} - {farmer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Date" name="date" type="date" value={editEntryForm.date}
                  onChange={handleEditFormChange} required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Quantity (Liters)" name="quantity" type="number" value={editEntryForm.quantity}
                  onChange={handleEditFormChange} required
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Shift</InputLabel>
                  <Select name="shift" value={editEntryForm.shift} onChange={handleEditFormChange}>
                    <MenuItem value="Morning">Morning</MenuItem>
                    <MenuItem value="Evening">Evening</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Quality Grade</InputLabel>
                  <Select name="quality" value={editEntryForm.quality} onChange={handleEditFormChange}>
                    <MenuItem value="A+">A+ (Excellent)</MenuItem>
                    <MenuItem value="A">A (Good)</MenuItem>
                    <MenuItem value="B">B (Average)</MenuItem>
                    <MenuItem value="C">C (Below Average)</MenuItem>
                    <MenuItem value="D">D (Poor)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="Fat Content (%)" name="fatContent" type="number" value={editEntryForm.fatContent}
                  onChange={handleEditFormChange}
                  error={!!errors.fatContent}
                  helperText={errors.fatContent}
                  inputProps={{ step: 0.1, min: 0, max: 10 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="SNF Content (%)" name="snfContent" type="number" value={editEntryForm.snfContent}
                  onChange={handleEditFormChange}
                  error={!!errors.snfContent}
                  helperText={errors.snfContent}
                  inputProps={{ step: 0.1, min: 0, max: 15 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="Temperature (°C)" name="temperature" type="number" value={editEntryForm.temperature}
                  onChange={handleEditFormChange}
                  error={!!errors.temperature}
                  helperText={errors.temperature}
                  inputProps={{ step: 0.1, min: 0, max: 50 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth label="pH Level" name="phLevel" type="number" value={editEntryForm.phLevel}
                  onChange={handleEditFormChange}
                  error={!!errors.phLevel}
                  helperText={errors.phLevel}
                  inputProps={{ step: 0.1, min: 6, max: 8 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Collection Center" name="collectionCenter" value={editEntryForm.collectionCenter}
                  onChange={handleEditFormChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Collected By" name="collectedBy" value={editEntryForm.collectedBy}
                  onChange={handleEditFormChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Vehicle Number" name="vehicleNumber" value={editEntryForm.vehicleNumber}
                  onChange={handleEditFormChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Payment Amount (₹)" name="paymentAmount" type="number" value={editEntryForm.paymentAmount}
                  onChange={handleEditFormChange}
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select name="paymentStatus" value={editEntryForm.paymentStatus} onChange={handleEditFormChange}>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Partial">Partial</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Remarks" name="remarks" value={editEntryForm.remarks}
                  onChange={handleEditFormChange}
                  multiline rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditEntryIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button 
              onClick={handleSaveEditEntry} 
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={Object.keys(errors).length > 0}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MilkCollection;
