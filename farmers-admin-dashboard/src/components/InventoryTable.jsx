import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Inventory2,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';

import inventoryService from '../services/inventoryService';
import useSocket from '../hooks/useSocket';
import ViewInventoryModal from './ViewInventoryModal';
import EditInventoryModal from './EditInventoryModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const BLUE = "#2196f3"; // Same as Inventory page

const InventoryTable = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryService.getAllRecords();
      let inventoryData = [];
      if (response && response.data) {
        inventoryData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        inventoryData = response;
      }
      setInventory(inventoryData);
      setFilteredInventory(inventoryData);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(`Failed to load inventory: ${err.message}`);
      setInventory([]);
      setFilteredInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = inventory.filter(item =>
        Object.values(item).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  }, [searchText, inventory]);

  useEffect(() => {
    if (!socket) return;

    socket.on('inventory:created', payload => {
      setInventory(prev => [payload.data, ...prev]);
    });
    socket.on('inventory:updated', payload => {
      setInventory(prev =>
        prev.map(item => (item.id === payload.data.id ? payload.data : item))
      );
    });
    socket.on('inventory:deleted', payload => {
      setInventory(prev => prev.filter(item => item.id !== payload.data.id));
    });

    return () => {
      socket.off('inventory:created');
      socket.off('inventory:updated');
      socket.off('inventory:deleted');
    };
  }, [socket]);

  const handleView = item => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleEdit = item => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = item => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedItem => {
    try {
      if (updatedItem.id) {
        await inventoryService.updateRecord(updatedItem.id, updatedItem);
      } else {
        await inventoryService.createRecord(updatedItem);
      }
      await loadInventory();
      setEditModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error saving inventory item:', err);
      alert('Error saving inventory item: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await inventoryService.deleteRecord(selectedItem.id);
      await loadInventory();
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      alert('Error deleting inventory item: ' + err.message);
    }
  };

  // Stock status helper functions
  const getStockStatus = (item) => {
    const current = Number(item.current_stock_level || 0);
    const min = Number(item.minimum_stock_level || 0);
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
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

  const getStockIcon = (status) => {
    switch (status) {
      case 'Out of Stock': return <Error />;
      case 'Low Stock': return <Warning />;
      case 'In Stock': return <CheckCircle />;
      default: return <Inventory2 />;
    }
  };

  const columns = [
  { 
    field: 'item_code', 
    headerName: 'Item Code', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'item_name', 
    headerName: 'Item Name', 
    width: 200,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Avatar sx={{ bgcolor: BLUE, mr: 1, width: 32, height: 32 }}>
          {params.value?.charAt(0)}
        </Avatar>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'category', 
    headerName: 'Category', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    )
  },
  { 
    field: 'current_stock_level', 
    headerName: 'Current Stock', 
    width: 140,
    renderCell: params => {
      const current = Number(params.value || 0);
      const min = Number(params.row.minimum_stock_level || 0);
      const max = Number(params.row.maximum_stock_level || 100);
      const percentage = max > 0 ? (current / max) * 100 : 0;
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%' }}>
          <Typography variant="body2" fontWeight="medium">
            {current} {params.row.unit}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(percentage, 100)} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.grey[300], 0.5),
              '& .MuiLinearProgress-bar': {
                backgroundColor: percentage <= (min/max)*100 ? theme.palette.error.main : 
                  percentage <= 50 ? theme.palette.warning.main : 
                  theme.palette.success.main
              }
            }} 
          />
        </Box>
      );
    }
  },
  { 
    field: 'unit', 
    headerName: 'Unit', 
    width: 80,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    )
  },
  { 
    field: 'location', 
    headerName: 'Location', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    )
  },
  {
    field: 'status', 
    headerName: 'Stock Status', 
    width: 130,
    renderCell: params => {
      const status = getStockStatus(params.row);
      const color = getStockColor(status);
      const icon = getStockIcon(status);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={status} 
            color={color} 
            size="small" 
            icon={icon}
            variant="outlined"
          />
        </Box>
      );
    }
  },
  { 
    field: 'last_updated', 
    headerName: 'Last Updated', 
    width: 140,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString('en-IN') : ''}
        </Typography>
      </Box>
    )
  },
  {
    field: 'actions', 
    type: 'actions', 
    headerName: 'Actions', 
    width: 150,
    getActions: params => [
      <GridActionsCellItem icon={<Visibility color="primary" />} label="View" onClick={() => handleView(params.row)} />,
      <GridActionsCellItem icon={<Edit color="warning" />} label="Edit" onClick={() => handleEdit(params.row)} />,
      <GridActionsCellItem icon={<Delete color="error" />} label="Delete" onClick={() => handleDelete(params.row)} />
    ]
  }
];


  // StatCard component with blue accent
  const StatsCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(BLUE, 0.08),
        borderRadius: 2,
        boxShadow: 0,
        minWidth: 160,
        width: 180,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        p: 1,
        border: alert ? `1px solid ${theme.palette.error.main}` : 'none'
      }}
    >
      <Avatar sx={{ bgcolor: alert ? theme.palette.error.main : BLUE, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: alert ? theme.palette.error.main : BLUE }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 300 }}>
        <CircularProgress />
      </Stack>
    );
  }

  // Calculate stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => getStockStatus(item) === 'Low Stock').length;
  const outOfStockItems = inventory.filter(item => getStockStatus(item) === 'Out of Stock').length;
  const totalValue = inventory.reduce((sum, item) => sum + Number(item.current_stock_level || 0), 0);

  return (
    <Box p={2}>
      {/* Blue header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Inventory2 sx={{ color: BLUE, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: BLUE, fontWeight: 600 }}>
          Inventory Records
        </Typography>
      </Box>

      {/* Stock alerts */}
      {(lowStockItems > 0 || outOfStockItems > 0) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          icon={<Warning />}
        >
          <Typography variant="body2">
            {outOfStockItems > 0 && `${outOfStockItems} item(s) out of stock. `}
            {lowStockItems > 0 && `${lowStockItems} item(s) running low.`}
            {' '}Immediate attention required.
          </Typography>
        </Alert>
      )}

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Items"
            value={totalItems}
            icon={<Inventory2 />}
            color={BLUE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Stock"
            value={`${totalValue.toFixed(0)}`}
            icon={<Inventory2 />}
            color={BLUE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Low Stock"
            value={lowStockItems}
            icon={<Warning />}
            alert={lowStockItems > 0}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Out of Stock"
            value={outOfStockItems}
            icon={<Error />}
            alert={outOfStockItems > 0}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search inventory..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{
            maxWidth: 400,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            minWidth: 240,
          }}
        />
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadInventory}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredInventory}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'item_name', sort: 'asc' }],
            },
          }}
          getRowClassName={(params) => {
            const status = getStockStatus(params.row);
            return status === 'Out of Stock' ? 'row-out-of-stock' : 
                   status === 'Low Stock' ? 'row-low-stock' : '';
          }}
          sx={{
            '& .row-out-of-stock': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
            '& .row-low-stock': {
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
            },
          }}
        />
      </Paper>

      <ViewInventoryModal
        open={viewModalOpen}
        item={selectedItem}
        onClose={() => setViewModalOpen(false)}
      />
      <EditInventoryModal
        open={editModalOpen}
        item={selectedItem}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedItem}
        itemType="inventory"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default InventoryTable;
