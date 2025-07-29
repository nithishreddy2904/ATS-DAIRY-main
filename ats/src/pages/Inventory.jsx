import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Badge, Alert, LinearProgress
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CategoryIcon from '@mui/icons-material/Category';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext'; // Corrected path
// For charts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

// Validation regex patterns
const ITEM_CODE_REGEX = /^[A-Z]{3}[0-9]{4}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;

const CATEGORIES = ['Raw Milk', 'Processed Products', 'Packaging Materials', 'Chemicals & Additives', 'Equipment Parts', 'Office Supplies'];
const UNITS = ['Liters', 'Kilograms', 'Units', 'Boxes', 'Bottles', 'Packets'];
const SUPPLIERS = ['Dairy Farm Co.', 'Packaging Solutions Ltd.', 'Chemical Supply Inc.', 'Equipment Parts Co.', 'Office Depot'];
const LOCATIONS = ['Warehouse A', 'Warehouse B', 'Cold Storage', 'Processing Floor', 'Office Storage'];
const ITEM_STATUS = ['In Stock', 'Low Stock', 'Out of Stock', 'Expired', 'Reserved'];

const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

const Inventory = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Get shared data from context
const {
  // Existing inventory 
  inventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  // New backend-connected inventory
  inventoryRecords,
  inventoryLoading,
  addInventoryRecordToDB,
  updateInventoryRecordInDB,
  deleteInventoryRecordFromDB,
} = useAppContext();

  // Use backend data if available, otherwise use local data
// Replace the existing data source selection
const activeInventoryItems = Array.isArray(inventoryRecords) 
  ? inventoryRecords 
  : Array.isArray(inventoryItems) ? inventoryItems : [];
const isUsingBackendData = Array.isArray(inventoryRecords) ;


  // Inventory state
  const [form, setForm] = useState({ 
    code: '', name: '', category: '', quantity: '', unit: '', minStock: '', 
    maxStock: '', supplier: '', location: '', status: 'In Stock', lastUpdated: '' 
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({ 
    code: '', name: '', category: '', quantity: '', unit: '', minStock: '', 
    maxStock: '', supplier: '', location: '', status: 'In Stock', lastUpdated: '' 
  });

  // Validation errors
  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [minStockError, setMinStockError] = useState('');
  const [maxStockError, setMaxStockError] = useState('');

  // Form handlers with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'code') {
      if (!ITEM_CODE_REGEX.test(value)) setCodeError('Format: ABC1234 (3 letters + 4 digits)');
      else setCodeError('');
    }
    if (name === 'name') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'quantity') {
      if (!NUMERIC_REGEX.test(value)) setQuantityError('Only numbers allowed');
      else setQuantityError('');
    }
    if (name === 'minStock') {
      if (!NUMERIC_REGEX.test(value)) setMinStockError('Only numbers allowed');
      else setMinStockError('');
    }
    if (name === 'maxStock') {
      if (!NUMERIC_REGEX.test(value)) setMaxStockError('Only numbers allowed');
      else setMaxStockError('');
    }
    setForm({ ...form, [name]: value });
  };

  const handleAdd = async (e) => {
  e.preventDefault();
  if (form.code && form.name && form.category && form.quantity && form.unit &&
      !codeError && !nameError && !quantityError && !minStockError && !maxStockError) {
    
    const newItem = { ...form, lastUpdated: new Date().toISOString().split('T')[0] };
    
    try {
      if (isUsingBackendData) {
        await addInventoryRecordToDB(newItem);
      } else {
        addInventoryItem(newItem);
      }
      setForm({ 
        code: '', name: '', category: '', quantity: '', unit: '', minStock: '', 
        maxStock: '', supplier: '', location: '', status: 'In Stock', lastUpdated: '' 
      });
    } catch (error) {
      alert('Error adding inventory item: ' + (error?.message || 'Unknown error'));
    }
  }
};

const handleDelete = async (idx) => {
  const confirmed = window.confirm('Are you sure you want to delete this inventory item?');
  if (!confirmed) return;
  
  try {
    if (isUsingBackendData && activeInventoryItems[idx]?.id) {
      await deleteInventoryRecordFromDB(activeInventoryItems[idx].id);
    } else {
      deleteInventoryItem(idx);
    }
  } catch (error) {
    alert('Error deleting inventory item: ' + (error?.message || 'Unknown error'));
  }
};

const handleSaveEdit = async () => {
  if (editIdx !== null && !codeError && !nameError && !quantityError && !minStockError && !maxStockError) {
    try {
      if (isUsingBackendData && activeInventoryItems[editIdx]?.id) {
        await updateInventoryRecordInDB(activeInventoryItems[editIdx].id, editForm);
      } else {
        updateInventoryItem(editIdx, editForm);
      }
      setEditIdx(null);
    } catch (error) {
      alert('Error updating inventory item: ' + (error?.message || 'Unknown error'));
    }
  }
};


  const handleEdit = (idx) => {
  setEditIdx(idx);
  setEditForm(activeInventoryItems[idx]); // ✅ Fixed - uses current data source
  setCodeError(''); 
  setNameError(''); 
  setQuantityError(''); 
  setMinStockError(''); 
  setMaxStockError('');
};


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'code') {
      if (!ITEM_CODE_REGEX.test(value)) setCodeError('Format: ABC1234 (3 letters + 4 digits)');
      else setCodeError('');
    }
    if (name === 'name') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'quantity') {
      if (!NUMERIC_REGEX.test(value)) setQuantityError('Only numbers allowed');
      else setQuantityError('');
    }
    if (name === 'minStock') {
      if (!NUMERIC_REGEX.test(value)) setMinStockError('Only numbers allowed');
      else setMinStockError('');
    }
    if (name === 'maxStock') {
      if (!NUMERIC_REGEX.test(value)) setMaxStockError('Only numbers allowed');
      else setMaxStockError('');
    }
    setEditForm({ ...editForm, [name]: value });
  };

  // Calculate statistics using active data source
const totalItems = activeInventoryItems.length;
const lowStockItems = activeInventoryItems.filter(item => parseFloat(item.quantity) <= parseFloat(item.minStock)).length;
const outOfStockItems = activeInventoryItems.filter(item => parseFloat(item.quantity) === 0).length;
const totalValue = activeInventoryItems.reduce((sum, item) => sum + parseFloat(item.quantity || '0'), 0);

 // Chart data using active inventory
const pieData = CATEGORIES.map(cat => ({
  name: cat.replace(' & ', '\n& '),
  value: activeInventoryItems.filter(i => i.category === cat).length,
  fullName: cat
})).filter(item => item.value > 0);

const stockLevelData = activeInventoryItems.map(item => ({
  name: item.name.substring(0, 10) + (item.name.length > 10 ? '...' : ''),
  current: parseFloat(item.quantity),
  min: parseFloat(item.minStock),
  max: parseFloat(item.maxStock)
}));


  const getStockStatus = (item) => {
    const quantity = parseFloat(item.quantity);
    const minStock = parseFloat(item.minStock);
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'Out of Stock': return 'error';
      case 'Low Stock': return 'warning';
      case 'In Stock': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 0,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
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
            <InventoryIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              Smart Inventory Management
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Real-time stock monitoring and optimization
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 3 }}>
        {/* Stock Alerts */}
        {(lowStockItems > 0 || outOfStockItems > 0) && (
          <Box sx={{ mb: 3, mt: 2 }}>
            {outOfStockItems > 0 && (
              <Alert severity="error" sx={{ mb: 1, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WarningIcon />
                  <Typography fontWeight="bold">
                    {outOfStockItems} item(s) are out of stock and need immediate restocking
                  </Typography>
                </Stack>
              </Alert>
            )}
            {lowStockItems > 0 && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WarningIcon />
                  <Typography fontWeight="bold">
                    {lowStockItems} item(s) are running low on stock
                  </Typography>
                </Stack>
              </Alert>
            )}
          </Box>
        )}

        {/* Enhanced Analytics Cards */}
        <Grid container spacing={2} sx={{ mb: 4, mt: 3 }}>
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
              <Stack direction="row" alignItems="center" width={205} spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <InventoryIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalItems}</Typography>
                  <Typography variant="body1">Total Items</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Across {CATEGORIES.length} categories
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
              <Stack direction="row" alignItems="center" width={205} spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalValue.toFixed(0)}</Typography>
                  <Typography variant="body1">Total Quantity</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Units in stock
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
              <Stack direction="row" alignItems="center" width={205} spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <WarningIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{lowStockItems}</Typography>
                  <Typography variant="body1">Low Stock</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Need attention
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #f44336 0%, #ff7043 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" width={205} spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingDownIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{outOfStockItems}</Typography>
                  <Typography variant="body1">Out of Stock</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Immediate action
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Charts Section with increased spacing and horizontal length */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          {/* Inventory Distribution Chart */}
          <Box sx={{ flex: '1' }}>
            <Card  sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4], height: 400 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ mr: 2, color: '#1976d2' }} />
                Inventory Distribution by Category
              </Typography>
              <Box sx={{ width: '96%', height: 300 }}>
                <ResponsiveContainer width="100%" height="96%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={1}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>

          {/* Stock Level Analysis Chart with increased horizontal length */}
          <Box sx={{ flex: '2' }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4], height: 400 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 2, color: '#4caf50' }} />
                Stock Level Analysis
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockLevelData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke={isDark ? '#aaa' : '#666'} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#333' : 'white', 
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        borderRadius: 8
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="current" fill="#2196f3" name="Current Stock" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="min" fill="#ff9800" name="Min Stock" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="max" fill="#4caf50" name="Max Stock" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Enhanced Add Inventory Form */}
        <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(248, 250, 252, 0.1) 0%, rgba(205, 226, 248, 0.05) 100%)' : 'linear-gradient(135deg, #f6f6f7ff 0%, #f2f8fdff 100%)' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>📦</Avatar>
            <Typography variant="h5" fontWeight="bold">Add Inventory Item</Typography>
          </Stack>
          <form onSubmit={handleAdd}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Item Code" name="code" value={form.code}
                  onChange={handleChange} required
                  error={!!codeError}
                  helperText={codeError || "Format: ABC1234"}
                  placeholder="ABC1234"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Item Name" name="name" value={form.name}
                  onChange={handleChange} required
                  error={!!nameError}
                  helperText={nameError}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Category" name="category" value={form.category}
                  onChange={handleChange} required select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 },width: '120px' }}
                >
                  {CATEGORIES.map((cat, idx) => (
                    <MenuItem value={cat} key={idx}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Current Quantity" name="quantity" value={form.quantity}
                  onChange={handleChange} required
                  error={!!quantityError}
                  helperText={quantityError}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Unit" name="unit" value={form.unit}
                  onChange={handleChange} required select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 },width: '80px' }}
                >
                  {UNITS.map((unit, idx) => (
                    <MenuItem value={unit} key={idx}>{unit}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Minimum Stock Level" name="minStock" value={form.minStock}
                  onChange={handleChange} required
                  error={!!minStockError}
                  helperText={minStockError}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Maximum Stock Level" name="maxStock" value={form.maxStock}
                  onChange={handleChange} required
                  error={!!maxStockError}
                  helperText={maxStockError}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Supplier" name="supplier" value={form.supplier}
                  onChange={handleChange} required select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 },width: '110px' }}
                >
                  {SUPPLIERS.map((supplier, idx) => (
                    <MenuItem value={supplier} key={idx}>{supplier}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Storage Location" name="location" value={form.location}
                  onChange={handleChange} required select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: '170px' } }
                >
                  {LOCATIONS.map((location, idx) => (
                    <MenuItem value={location} key={idx}>{location}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Status" name="status" value={form.status}
                  onChange={handleChange} required select
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {ITEM_STATUS.map((status, idx) => (
                    <MenuItem value={status} key={idx}>{status}</MenuItem>
                  ))}
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
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                    }
                  }}
                  disabled={!!codeError || !!nameError || !!quantityError || !!minStockError || !!maxStockError}
                >
                  Add to Inventory
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Enhanced Inventory Table */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 32, height: 32 }}>📋</Avatar>
          Inventory Records
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.2)' : '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Item Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Stock Level</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {inventoryLoading ? (
    <TableRow>
      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
        <Typography>Loading inventory...</Typography>
      </TableCell>
    </TableRow>
  ) : activeInventoryItems.length === 0 ? (
    <TableRow>
      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>📦</Avatar>
          <Typography variant="h6" color="text.secondary">No inventory items found</Typography>
          <Typography variant="body2" color="text.disabled">
            Start by adding your first inventory item
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  ) : (
    activeInventoryItems.map((item, idx) => {
      const stockStatus = getStockStatus(item);
      const stockPercentage = (parseFloat(item.quantity) / parseFloat(item.maxStock)) * 100;
      return (
        <TableRow key={item.id || idx} hover>
          <TableCell>
            <Chip label={item.code} color="primary" variant="outlined" />
          </TableCell>
          <TableCell>
            <Typography fontWeight="bold">{item.name}</Typography>
          </TableCell>
          <TableCell>{item.category}</TableCell>
          <TableCell>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {item.quantity} {item.unit}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Min: {item.minStock} / Max: {item.maxStock}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(stockPercentage, 100)} 
                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                color={stockPercentage <= 30 ? 'error' : stockPercentage <= 70 ? 'warning' : 'success'}
              />
            </Box>
          </TableCell>
          <TableCell>{item.unit}</TableCell>
          <TableCell>{item.location}</TableCell>
          <TableCell>
            <Chip 
              label={stockStatus} 
              color={getStockColor(stockStatus)} 
              size="small" 
            />
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" onClick={() => handleEdit(idx)} sx={{ borderRadius: 2 }}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(idx)} sx={{ borderRadius: 2 }}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      );
    })
  )}
</TableBody>

          </Table>
        </TableContainer>

        {/* Enhanced Edit Dialog */}
        <Dialog open={editIdx !== null} onClose={() => setEditIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: isDark ? 'rgba(25,118,210,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>✏️</Avatar>Edit Inventory Item
          </DialogTitle>
          <DialogContent  sx={{ pt: 6 }}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Item Code" name="code" value={editForm.code} 
                  onChange={handleEditChange} required
                  error={!!codeError}
                  helperText={codeError || "Format: ABC1234"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Item Name" name="name" value={editForm.name} 
                  onChange={handleEditChange} required
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Category" name="category" value={editForm.category} 
                  onChange={handleEditChange} required select
                >
                  {CATEGORIES.map((cat, idx) => (
                    <MenuItem value={cat} key={idx}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Current Quantity" name="quantity" value={editForm.quantity} 
                  onChange={handleEditChange} required
                  error={!!quantityError}
                  helperText={quantityError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Unit" name="unit" value={editForm.unit} 
                  onChange={handleEditChange} required select
                >
                  {UNITS.map((unit, idx) => (
                    <MenuItem value={unit} key={idx}>{unit}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Minimum Stock" name="minStock" value={editForm.minStock} 
                  onChange={handleEditChange} required
                  error={!!minStockError}
                  helperText={minStockError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Maximum Stock" name="maxStock" value={editForm.maxStock} 
                  onChange={handleEditChange} required
                  error={!!maxStockError}
                  helperText={maxStockError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Supplier" name="supplier" value={editForm.supplier} 
                  onChange={handleEditChange} required select
                >
                  {SUPPLIERS.map((supplier, idx) => (
                    <MenuItem value={supplier} key={idx}>{supplier}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Location" name="location" value={editForm.location} 
                  onChange={handleEditChange} required select
                >
                  {LOCATIONS.map((location, idx) => (
                    <MenuItem value={location} key={idx}>{location}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth label="Status" name="status" value={editForm.status} 
                  onChange={handleEditChange} required select
                >
                  {ITEM_STATUS.map((status, idx) => (
                    <MenuItem value={status} key={idx}>{status}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained" 
              sx={{ borderRadius: 2 }}
              disabled={!!codeError || !!nameError || !!quantityError || !!minStockError || !!maxStockError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Inventory;
