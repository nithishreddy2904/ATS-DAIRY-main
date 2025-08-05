import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Alert
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RouteIcon from '@mui/icons-material/Route';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import  { useMemo } from 'react';

const VEHICLE_TYPES = ['Truck', 'Van', 'Bike', 'Refrigerated Truck'];
const FUEL_TYPES = ['Diesel', 'Petrol', 'Electric', 'CNG'];
const VEHICLE_STATUS = ['Available', 'in_transit', 'Maintenance', 'Out of Service'];
const ROUTES = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
const DELIVERY_STATUS = [ 'in_transit', 'Delivered', 'Pending', 'Cancelled'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
const DRIVER_NAME_REGEX = /^[A-Za-z\s]+$/;
const CAPACITY_REGEX = /^[0-9]+$/;
const getStatusColor = (status) => {
  const colorMap = {
    'Delivered': '#4caf50',
    'in_transit': '#2196f3', 
    'Pending': '#ffc107',
    'Cancelled': '#f44336'
  };
  return colorMap[status] || '#9e9e9e';
};

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


const Logistics = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    fleetManagement,
    addFleetRecord,
    updateFleetRecord,
    deleteFleetRecord,
    loading,
    error,
    deliveries,
    deliveriesLoading,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    loadDeliveriesFromDatabase
  } = useAppContext();

  const safeStatusData = DELIVERY_STATUS.map(status => {
  const count = Array.isArray(deliveries) ? 
    deliveries.filter(d => d.status === status).length : 0;
  return {
    name: status,
    value: count,
    color: getStatusColor(status)
  };
});

// Create single data source for both chart and legend
const hasValidDeliveries = Array.isArray(deliveries) && deliveries.length > 0;
const nonZeroStatusData = safeStatusData.filter(item => item.value > 0);

  // Fleet State
  const [vehicleForm, setVehicleForm] = useState({
    id: '',
    vehicleNumber: '',
    vehicleType: '',
    driverName: '',
    driverPhone: '',
    capacity: '',
    status: 'Available',
    fuelType: 'Diesel',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    location: ''
  });
  const [editVehicleIdx, setEditVehicleIdx] = useState(null);
  const [editVehicleForm, setEditVehicleForm] = useState({ ...vehicleForm });
  const [vehicleNumberError, setVehicleNumberError] = useState('');
  const [driverNameError, setDriverNameError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [fleetFormError, setFleetFormError] = useState('');

  // Deliveries State (backend-connected)
  const [deliveryForm, setDeliveryForm] = useState({
    delivery_date: '',
    vehicle_id: '',
    driver_name: '',
    destination: '',
    status: 'pending', 
    priority: 'Medium',
    estimatedTime: '',
    distance: ''
  });
  const [deliveryFormError, setDeliveryFormError] = useState('');
  const [editDeliveryId, setEditDeliveryId] = useState(null);
  const [editDeliveryForm, setEditDeliveryForm] = useState({ ...deliveryForm });

  useEffect(() => {
    loadDeliveriesFromDatabase();
    // eslint-disable-next-line
  }, []);

  // Fleet Handlers
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleNumber') {
      const upperValue = value.toUpperCase();
      if (!VEHICLE_NUMBER_REGEX.test(upperValue) && upperValue !== '') {
        setVehicleNumberError('Format: XX00XX0000 (2 letters, 2 numbers, 2 letters, 4 numbers)');
      } else {
        setVehicleNumberError('');
      }
      setVehicleForm({ ...vehicleForm, [name]: upperValue });
    } else if (name === 'driverName') {
      if (!DRIVER_NAME_REGEX.test(value) && value !== '') {
        setDriverNameError('Only alphabets and spaces allowed');
      } else {
        setDriverNameError('');
      }
      setVehicleForm({ ...vehicleForm, [name]: value });
    } else if (name === 'capacity') {
      if (!CAPACITY_REGEX.test(value) && value !== '') {
        setCapacityError('Only numbers allowed');
      } else {
        setCapacityError('');
      }
      setVehicleForm({ ...vehicleForm, [name]: value });
    } else {
      setVehicleForm({ ...vehicleForm, [name]: value });
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setFleetFormError('');
    if (
      vehicleForm.vehicleNumber &&
      vehicleForm.vehicleType &&
      vehicleForm.driverName &&
      vehicleForm.driverPhone &&
      vehicleForm.capacity &&
      !vehicleNumberError && !driverNameError && !capacityError
    ) {
      const newId = 'FLEET' + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      try {
        await addFleetRecord({ ...vehicleForm, id: newId });
        setVehicleForm({
          id: '',
          vehicleNumber: '',
          vehicleType: '',
          driverName: '',
          driverPhone: '',
          capacity: '',
          status: 'Available',
          fuelType: 'Diesel',
          lastMaintenanceDate: '',
          nextMaintenanceDate: '',
          location: ''
        });
      } catch (err) {
        setFleetFormError(
          typeof err === 'string'
            ? err
            : err?.message
              ? err.message
              : JSON.stringify(err)
        );
      }
    } else {
      setFleetFormError('Please fill all fields correctly.');
    }
  };

  const handleEditVehicle = (idx) => {
    setEditVehicleIdx(idx);
    setEditVehicleForm(fleetManagement[idx]);
    setVehicleNumberError('');
    setDriverNameError('');
    setCapacityError('');
  };

  const handleEditVehicleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleNumber') {
      const upperValue = value.toUpperCase();
      if (!VEHICLE_NUMBER_REGEX.test(upperValue) && upperValue !== '') {
        setVehicleNumberError('Format: XX00XX0000 (2 letters, 2 numbers, 2 letters, 4 numbers)');
      } else {
        setVehicleNumberError('');
      }
      setEditVehicleForm({ ...editVehicleForm, [name]: upperValue });
    } else if (name === 'driverName') {
      if (!DRIVER_NAME_REGEX.test(value) && value !== '') {
        setDriverNameError('Only alphabets and spaces allowed');
      } else {
        setDriverNameError('');
      }
      setEditVehicleForm({ ...editVehicleForm, [name]: value });
    } else if (name === 'capacity') {
      if (!CAPACITY_REGEX.test(value) && value !== '') {
        setCapacityError('Only numbers allowed');
      } else {
        setCapacityError('');
      }
      setEditVehicleForm({ ...editVehicleForm, [name]: value });
    } else {
      setEditVehicleForm({ ...editVehicleForm, [name]: value });
    }
  };

  const handleSaveEditVehicle = async () => {
    setFleetFormError('');
    if (
      editVehicleIdx !== null &&
      !vehicleNumberError && !driverNameError && !capacityError &&
      editVehicleForm.vehicleNumber && editVehicleForm.vehicleType && editVehicleForm.driverName && editVehicleForm.driverPhone && editVehicleForm.capacity
    ) {
      try {
        await updateFleetRecord(editVehicleIdx, editVehicleForm);
        setEditVehicleIdx(null);
      } catch (err) {
        setFleetFormError(
          typeof err === 'string'
            ? err
            : err?.message
              ? err.message
              : JSON.stringify(err)
        );
      }
    } else {
      setFleetFormError('Please fill all fields correctly.');
    }
  };

  const handleDeleteVehicle = async (idx) => {
    if (window.confirm('Delete this fleet record?')) {
      try {
        await deleteFleetRecord(idx);
      } catch (err) {
        setFleetFormError(
          typeof err === 'string'
            ? err
            : err?.message
              ? err.message
              : JSON.stringify(err)
        );
      }
    }
  };

  // Deliveries Handlers (backend-connected)
  const handleDeliveryChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value });
  };

  const handleAddDelivery = async (e) => {
    e.preventDefault();
    setDeliveryFormError('');
    if (
      deliveryForm.delivery_date &&
      deliveryForm.vehicle_id &&
      deliveryForm.driver_name &&
      deliveryForm.destination
    ) {
      try {
        await addDelivery(deliveryForm);
        setDeliveryForm({
          delivery_date: '',
          vehicle_id: '',
          driver_name: '',
          destination: '',
          status: 'pending',
          priority: 'Medium',
          estimatedTime: '',
          distance: ''
        });
      } catch (err) {
        setDeliveryFormError(
          typeof err === 'string'
            ? err
            : err?.message
              ? err.message
              : JSON.stringify(err)
        );
      }
    } else {
      setDeliveryFormError('Please fill all required fields.');
    }
  };

  const handleEditDelivery = (delivery) => {
    setEditDeliveryId(delivery.id);
    setEditDeliveryForm({ ...delivery });
  };

  const handleEditDeliveryChange = (e) => {
    setEditDeliveryForm({ ...editDeliveryForm, [e.target.name]: e.target.value });
  };

  const handleSaveEditDelivery = async () => {
    if (editDeliveryId !== null) {
      try {
        await updateDelivery(editDeliveryId, editDeliveryForm);
        setEditDeliveryId(null);
      } catch (err) {
        setDeliveryFormError(
          typeof err === 'string'
            ? err
            : err?.message
              ? err.message
              : JSON.stringify(err)
        );
      }
    }
  };

  const handleDeleteDelivery = async (id) => {
    if (window.confirm('Delete this delivery?')) {
      try {
        await deleteDelivery(id);
      } catch (err) {
        setDeliveryFormError(
          typeof err === 'string'
            ? err
            : err?.message
              ? err.message
              : JSON.stringify(err)
        );
      }
    }
  };

  // Statistics
  const totalVehicles = fleetManagement.length;
  const availableVehicles = fleetManagement.filter(v => v.status === 'Available').length;
  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit').length;
  const completedDeliveries = deliveries.filter(d => d.status === 'Delivered').length;

  // Chart data
  const routeData = ROUTES.map(route => ({
    route: route.replace(' Zone', ''),
    deliveries: deliveries.filter(d => d.destination === route).length
  }));
 const statusData = DELIVERY_STATUS.map(status => {
  const count = Array.isArray(deliveries) ? 
    deliveries.filter(d => d.status === status).length : 0;
  return {
    name: status,
    value: count,
    color: getStatusColor(status)
  };
});
const hasDeliveries = Array.isArray(deliveries) && deliveries.length > 0;

const chartDisplayData = useMemo(() => {
  if (!Array.isArray(deliveries)) return [{ name: 'No Data', value: 1, color: '#e0e0e0' }];

  const counts = DELIVERY_STATUS.map((status) => {
    // Normalize backend statuses like "in_transit" to match display names like "In Transit"
    const backendStatus = status.toLowerCase().replace(/ /g, '_');
    const count = deliveries.filter(d => d.status?.toLowerCase() === backendStatus).length;
    return { name: status, value: count, color: getStatusColor(status) };
  });

  const nonZeroData = counts.filter(c => c.value > 0);

  return nonZeroData.length > 0
    ? nonZeroData
    : [{ name: 'No Data Available', value: 1, color: '#e0e0e0' }];
}, [deliveries]);


// Add fallback data if no deliveries exist
const chartData = statusData.length > 0 ? statusData : [
  { name: 'No Data', value: 1, color: '#e0e0e0' }
];


  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      {/* Page Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          py: { xs: 6, md: 8 }, // Taller header
          px: { xs: 2, md: 3 },
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          minHeight: 160,
          height: { xs: 100, md: 150 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              width: 72,
              height: 72,
              mr: 2,
              boxShadow: 0
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 44, color: '#fff' }} />
          </Avatar>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: '#fff',
              letterSpacing: 2,
              textAlign: 'center'
            }}
          >
            Logistics Dashboard
          </Typography>
        </Box>
      </Paper>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{
            p: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#e3f2fd', // Bright blue
            color: '#1976d2',
            boxShadow: 3,
            minHeight: 110,
            width: '230px'
          }}>
            <Avatar sx={{ bgcolor: '#1976d2', color: '#fff', width: 48, height: 48 }}>
              <TrendingUpIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600 }}>Total Vehicles</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#1976d2' }}>{totalVehicles}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{
            p: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#e8f5e9', // Bright green
            color: '#388e3c',
            boxShadow: 3,
            minHeight: 110
          }}>
            <Avatar sx={{ bgcolor: '#43a047', color: '#fff', width: 48, height: 48 }}>
              <SpeedIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#388e3c', fontWeight: 600 }}>Available Vehicles</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#388e3c' }}>{availableVehicles}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{
            p: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#fff8e1', // Bright orange/yellow
            color: '#f57c00',
            boxShadow: 3,
            minHeight: 110
          }}>
            <Avatar sx={{ bgcolor: '#ff9800', color: '#fff', width: 48, height: 48 }}>
              <RouteIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#f57c00', fontWeight: 600 }}>Active Deliveries</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#f57c00' }}>{activeDeliveries}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{
            p: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#f3e5f5', // Bright purple
            color: '#8e24aa',
            boxShadow: 3,
            minHeight: 110
          }}>
            <Avatar sx={{ bgcolor: '#8e24aa', color: '#fff', width: 48, height: 48 }}>
              <LocalShippingIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#8e24aa', fontWeight: 600 }}>Completed Deliveries</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#8e24aa' }}>{completedDeliveries}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {/* Charts */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Box sx={{ flex: '2' }}>
          <Paper elevation={4} sx={{
            p: 3,
            borderRadius: 3,
            height: 350,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <RouteIcon sx={{ mr: 2, color: '#1976d2' }} />
              Deliveries by Zone
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routeData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <XAxis dataKey="route" stroke={isDark ? '#aaa' : '#666'} />
                  <YAxis allowDecimals={false} stroke={isDark ? '#aaa' : '#666'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#333' : 'white',
                      border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                      borderRadius: 8
                    }}
                  />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: '1' }}>
  <Paper elevation={4} sx={{
    p: 3,
    borderRadius: 3,
    height: 350,
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
      <SpeedIcon sx={{ mr: 2, color: '#4caf50' }} />
      Delivery Status
    </Typography>
    
    {/* Proper loading state handling */}
    {deliveriesLoading ? (
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 200 
      }}>
        <Typography color="text.secondary">Loading delivery data...</Typography>
      </Box>
    ) : (
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDisplayData}  // ← Use consistent data source
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartDisplayData.map((entry, index) => (  // ← Same data source
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        {/* Consistent legend using same data source */}
        <Stack spacing={1} sx={{ mt: 2 }}>
          {hasValidDeliveries ? (
            chartDisplayData.map((item, idx) => (  // ← Same data source
              <Stack key={idx} direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1 }} />
                  <Typography variant="body2">{item.name}</Typography>
                </Stack>
                <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
              </Stack>
            ))
          ) : (
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No delivery data available
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    )}
  </Paper>
</Box>


      </Box>

      {/* Fleet Entry Form */}
      <Paper elevation={6} sx={{
        p: 4, mb: 4, borderRadius: 3,
        background: isDark
          ? 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 100%)'
          : 'linear-gradient(135deg, #f8fbff 0%, #f0f8ff 100%)'
      }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>🚛</Avatar>
          <Typography variant="h5" fontWeight="bold">Fleet Registration</Typography>
        </Stack>
        {fleetFormError && <Alert severity="error" sx={{ mb: 2 }}>{fleetFormError}</Alert>}
        <form onSubmit={handleAddVehicle}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                name="vehicleNumber"
                value={vehicleForm.vehicleNumber}
                onChange={handleVehicleChange}
                required
                error={!!vehicleNumberError}
                helperText={vehicleNumberError || "Format: AP09CD1234"}
                placeholder="AP09CD1234"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Type"
                name="vehicleType"
                value={vehicleForm.vehicleType}
                onChange={handleVehicleChange}
                required
                select
                sx={{ width: '140px', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {VEHICLE_TYPES.map((type, idx) => (
                  <MenuItem value={type} key={idx}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driver Name"
                name="driverName"
                value={vehicleForm.driverName}
                onChange={handleVehicleChange}
                required
                error={!!driverNameError}
                helperText={driverNameError || "Only alphabets and spaces"}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driver Phone"
                name="driverPhone"
                value={vehicleForm.driverPhone}
                onChange={handleVehicleChange}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity (Liters)"
                name="capacity"
                value={vehicleForm.capacity}
                onChange={handleVehicleChange}
                required
                error={!!capacityError}
                helperText={capacityError || "Numbers only"}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fuel Type"
                name="fuelType"
                value={vehicleForm.fuelType}
                onChange={handleVehicleChange}
                required
                select
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {FUEL_TYPES.map((fuel, idx) => (
                  <MenuItem value={fuel} key={idx}>{fuel}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={vehicleForm.status}
                onChange={handleVehicleChange}
                required
                select
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {VEHICLE_STATUS.map((status, idx) => (
                  <MenuItem value={status} key={idx}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={vehicleForm.location}
                onChange={handleVehicleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Maintenance"
                name="lastMaintenanceDate"
                value={vehicleForm.lastMaintenanceDate}
                onChange={handleVehicleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next Maintenance"
                name="nextMaintenanceDate"
                value={vehicleForm.nextMaintenanceDate}
                onChange={handleVehicleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                  }
                }}
                disabled={!!vehicleNumberError || !!driverNameError || !!capacityError}
              >
                Register Vehicle
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Fleet Management Table */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 32, height: 32 }}>🚗</Avatar>
        Fleet Management
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8], mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.2)' : '#e3f2fd' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Vehicle Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Driver</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Driver Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Capacity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Fuel Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fleetManagement.map((vehicle, idx) => (
              <TableRow key={vehicle.id || idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(25,118,210,0.05)' } }}>
                <TableCell><Chip label={vehicle.vehicleNumber} color="primary" variant="outlined" /></TableCell>
                <TableCell><Chip label={vehicle.vehicleType} size="small" color="info" /></TableCell>
                <TableCell>{vehicle.driverName}</TableCell>
                <TableCell>{vehicle.driverPhone}</TableCell>
                <TableCell><Typography fontWeight="bold" color="primary.main">{vehicle.capacity}L</Typography></TableCell>
                <TableCell><Chip label={vehicle.fuelType} size="small" /></TableCell>
                <TableCell>
                  <Chip
                    label={vehicle.status}
                    color={vehicle.status === 'Available' ? 'success' :
                      vehicle.status === 'in_transit' ? 'info' :
                      vehicle.status === 'Maintenance' ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleEditVehicle(idx)} sx={{ borderRadius: 2 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteVehicle(idx)} sx={{ borderRadius: 2 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {fleetManagement.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🚛</Avatar>
                    <Typography variant="h6" color="text.secondary">No vehicles registered</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Vehicle Dialog */}
      <Dialog open={editVehicleIdx !== null} onClose={() => setEditVehicleIdx(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>✏️</Avatar>Edit Vehicle
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                name="vehicleNumber"
                value={editVehicleForm.vehicleNumber || ''}
                onChange={handleEditVehicleChange}
                required
                error={!!vehicleNumberError}
                helperText={vehicleNumberError || "Format: AP09CD1234"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Type"
                name="vehicleType"
                value={editVehicleForm.vehicleType || ''}
                onChange={handleEditVehicleChange}
                required
                select
              >
                {VEHICLE_TYPES.map((type, idx) => (
                  <MenuItem value={type} key={idx}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driver Name"
                name="driverName"
                value={editVehicleForm.driverName || ''}
                onChange={handleEditVehicleChange}
                required
                error={!!driverNameError}
                helperText={driverNameError || "Only alphabets and spaces"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driver Phone"
                name="driverPhone"
                value={editVehicleForm.driverPhone || ''}
                onChange={handleEditVehicleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity (L)"
                name="capacity"
                value={editVehicleForm.capacity || ''}
                onChange={handleEditVehicleChange}
                required
                error={!!capacityError}
                helperText={capacityError || "Numbers only"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fuel Type"
                name="fuelType"
                value={editVehicleForm.fuelType || ''}
                onChange={handleEditVehicleChange}
                required
                select
              >
                {FUEL_TYPES.map((fuel, idx) => (
                  <MenuItem value={fuel} key={idx}>{fuel}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={editVehicleForm.status || ''}
                onChange={handleEditVehicleChange}
                required
                select
              >
                {VEHICLE_STATUS.map((status, idx) => (
                  <MenuItem value={status} key={idx}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={editVehicleForm.location || ''}
                onChange={handleEditVehicleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Maintenance"
                name="lastMaintenanceDate"
                value={editVehicleForm.lastMaintenanceDate || ''}
                onChange={handleEditVehicleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next Maintenance"
                name="nextMaintenanceDate"
                value={editVehicleForm.nextMaintenanceDate || ''}
                onChange={handleEditVehicleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          {fleetFormError && <Alert severity="error" sx={{ mt: 2 }}>{fleetFormError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditVehicleIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            onClick={handleSaveEditVehicle}
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={!!vehicleNumberError || !!driverNameError || !!capacityError}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delivery Entry Form */}
      <Paper elevation={6} sx={{
        p: 4, mb: 4, borderRadius: 3,
        background: isDark
          ? 'linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(76,175,80,0.02) 100%)'
          : 'linear-gradient(135deg, #f0fff4 0%, #e8f5e9 100%)'
      }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>🚚</Avatar>
          <Typography variant="h5" fontWeight="bold">Add Delivery</Typography>
        </Stack>
        {deliveryFormError && <Alert severity="error" sx={{ mb: 2 }}>{deliveryFormError}</Alert>}
        <form onSubmit={handleAddDelivery}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date"
                name="delivery_date"
                value={deliveryForm.delivery_date}
                onChange={handleDeliveryChange}
                required
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
              sx={{width: '110px'}}
                fullWidth
                label="Vehicle"
                name="vehicle_id"
                value={deliveryForm.vehicle_id}
                onChange={handleDeliveryChange}
                required
                select
              >
                {fleetManagement.map((v, idx) => (
                  <MenuItem value={v.id} key={idx}>{v.vehicleNumber}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Driver Name"
                name="driver_name"
                value={deliveryForm.driver_name}
                onChange={handleDeliveryChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
              sx={{width: '130px'}}
                fullWidth
                label="Destination"
                name="destination"
                value={deliveryForm.destination}
                onChange={handleDeliveryChange}
                required
                select
              >
                {ROUTES.map((route, idx) => (
                  <MenuItem value={route} key={idx}>{route}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={deliveryForm.status}
                onChange={handleDeliveryChange}
                required
                select
              >
                {DELIVERY_STATUS.map((status, idx) => (
                  <MenuItem value={status} key={idx}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                value={deliveryForm.priority}
                onChange={handleDeliveryChange}
                required
                select
              >
                {PRIORITY_LEVELS.map((priority, idx) => (
                  <MenuItem value={priority} key={idx}>{priority}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Est. Time"
                name="estimatedTime"
                value={deliveryForm.estimatedTime}
                onChange={handleDeliveryChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Distance"
                name="distance"
                value={deliveryForm.distance}
                onChange={handleDeliveryChange}
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
                  background: 'linear-gradient(45deg, #43a047 30%, #a5d6a7 90%)',
                  boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)',
                  }
                }}
              >
                Add Delivery
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Delivery Management Table */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, mt: 6, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>🚚</Avatar>
        Deliveries
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8], mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Est. Time</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveriesLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🚚</Avatar>
                    <Typography variant="h6" color="text.secondary">No deliveries</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((delivery, idx) => (
                <TableRow key={delivery.id}>
                  <TableCell>{formatDateTime(delivery.delivery_date)}</TableCell>
                  <TableCell>
                    {delivery.vehicle_id
                      ? (fleetManagement.find(f => f.id === delivery.vehicle_id)?.vehicleNumber || 'N/A')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{delivery.driver_name}</TableCell>
                  <TableCell>{delivery.destination}</TableCell>
                  <TableCell>
                    <Chip
                      label={delivery.status}
                      color={
                        delivery.status === 'Delivered' ? 'success' :
                        delivery.status === 'in_transit' ? 'info' :
                        delivery.status === 'Pending' ? 'warning' :
                        delivery.status === 'Cancelled' ? 'error' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{delivery.priority || ''}</TableCell>
                  <TableCell>{delivery.estimatedTime || ''}</TableCell>
                  <TableCell>{delivery.distance || ''}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditDelivery(delivery)} sx={{ borderRadius: 2 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteDelivery(delivery.id)} sx={{ borderRadius: 2 }}>
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

      {/* Edit Delivery Dialog */}
      <Dialog open={editDeliveryId !== null} onClose={() => setEditDeliveryId(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Delivery</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                name="delivery_date"
                value={editDeliveryForm.delivery_date || ''}
                onChange={handleEditDeliveryChange}
                required
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle"
                name="vehicle_id"
                value={editDeliveryForm.vehicle_id || ''}
                onChange={handleEditDeliveryChange}
                required
                select
              >
                {fleetManagement.map((v, idx) => (
                  <MenuItem value={v.id} key={idx}>{v.vehicleNumber}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driver Name"
                name="driver_name"
                value={editDeliveryForm.driver_name || ''}
                onChange={handleEditDeliveryChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Destination"
                name="destination"
                value={editDeliveryForm.destination || ''}
                onChange={handleEditDeliveryChange}
                required
                select
              >
                {ROUTES.map((route, idx) => (
                  <MenuItem value={route} key={idx}>{route}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={editDeliveryForm.status || ''}
                onChange={handleEditDeliveryChange}
                required
                select
              >
                {DELIVERY_STATUS.map((status, idx) => (
                  <MenuItem value={status} key={idx}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                value={editDeliveryForm.priority || ''}
                onChange={handleEditDeliveryChange}
                required
                select
              >
                {PRIORITY_LEVELS.map((priority, idx) => (
                  <MenuItem value={priority} key={idx}>{priority}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Est. Time"
                name="estimatedTime"
                value={editDeliveryForm.estimatedTime || ''}
                onChange={handleEditDeliveryChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Distance"
                name="distance"
                value={editDeliveryForm.distance || ''}
                onChange={handleEditDeliveryChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDeliveryId(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            onClick={handleSaveEditDelivery}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Logistics;

