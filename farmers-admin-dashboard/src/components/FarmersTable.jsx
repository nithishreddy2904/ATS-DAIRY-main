import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem
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
  CardContent
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Agriculture,
  Person,
  Refresh
} from '@mui/icons-material';
import farmerService from '../services/farmerService';
import useSocket from '../hooks/useSocket';
import ViewFarmerModal from './ViewFarmerModal';
import EditFarmerModal from './EditFarmerModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const FarmersTable = () => {
  const theme = useTheme();
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const socket = useSocket('http://localhost:5000');

  // Load farmers data
  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading farmers...');
      const response = await farmerService.getAllFarmers();
      console.log('Farmers loaded:', response);

      // Handle different response formats
      let farmersData = [];
      if (response && response.data) {
        farmersData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        farmersData = response;
      }

      setFarmers(farmersData);
      setFilteredFarmers(farmersData);
      console.log('Farmers set to state:', farmersData);
    } catch (error) {
      console.error('Error loading farmers:', error);
      setError(`Failed to load farmers: ${error.message}`);
      setFarmers([]);
      setFilteredFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchText) {
      const filtered = farmers.filter(farmer =>
  Object.values(farmer).some(value =>
    value &&
    value
      .toString()
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )
);
      setFilteredFarmers(filtered);
    } else {
      setFilteredFarmers(farmers);
    }
  }, [searchText, farmers]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('farmer:created', (payload) => {
      console.log('New farmer created:', payload);
      setFarmers(prev => [payload.data, ...prev]);
    });

    socket.on('farmer:updated', (payload) => {
      console.log('Farmer updated:', payload);
      setFarmers(prev =>
        prev.map(farmer =>
          farmer.id === payload.data.id ? payload.data : farmer
        )
      );
    });

    socket.on('farmer:deleted', (payload) => {
      console.log('Farmer deleted:', payload);
      setFarmers(prev =>
        prev.filter(farmer => farmer.id !== payload.data.id)
      );
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('farmer:created');
      socket.off('farmer:updated');
      socket.off('farmer:deleted');
    };
  }, [socket]);

  const handleView = (farmer) => {
    setSelectedFarmer(farmer);
    setViewModalOpen(true);
  };

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setEditModalOpen(true);
  };

  const handleDelete = (farmer) => {
    console.log('Delete clicked:', farmer);
    setSelectedFarmer(farmer);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedFarmer) => {
    try {
      await farmerService.updateFarmer(updatedFarmer.id, updatedFarmer);
      await loadFarmers();
      setEditModalOpen(false);
      setSelectedFarmer(null);
    } catch (error) {
      console.error('Error updating farmer:', error);
      alert('Error updating farmer: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('🗑️ Deleting farmer:', selectedFarmer);
      await farmerService.deleteFarmer(selectedFarmer.id);
      await loadFarmers();
      setDeleteDialogOpen(false);
      setSelectedFarmer(null);
      console.log('✅ Farmer deleted and UI refreshed successfully');
    } catch (error) {
      console.error('❌ Error deleting farmer:', error);
      alert('Error deleting farmer: ' + error.message);
    }
  };

  const columns = [
  {
    field: 'id',
    headerName: 'Farmer ID',
    width: 120,
    renderCell: (params) => (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 600,
            height: 24,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: '0 8px'
          }}
        />
      </Box>
    )
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 180,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            fontSize: '0.875rem',
            lineHeight: 1
          }}
        >
          {params.value?.charAt(0)}
        </Avatar>
        <Typography variant="body2" fontWeight={500} sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value}
        </Typography>
      </Stack>
    )
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 140,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontFamily: 'monospace', display: 'flex', alignItems: 'center', height: '100%' }}>
        {params.value}
      </Typography>
    )
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 220,
    renderCell: (params) => (
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {params.value}
      </Typography>
    )
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value} arrow>
        <Typography
          variant="body2"
          noWrap
          sx={{
            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {params.value}
        </Typography>
      </Tooltip>
    )
  },
  {
    field: 'cattle_count',
    headerName: 'Cattle Count',
    width: 120,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.main,
            fontWeight: 600,
            minWidth: 50,
            height: 24,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: '0 8px'
          }}
        />
      </Box>
    )
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : 'error'}
          variant="filled"
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: 1.5,
            height: 24,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: '0 8px'
          }}
        />
      </Box>
    )
  },
  {
    field: 'join_date',
    headerName: 'Join Date',
    headerAlign: 'center',
    width: 130,
    align: 'center',
    renderCell: (params) => {
      if (!params.value) return null;
      const date = new Date(params.value);
      return (
        <Typography
          variant="body2"
          sx={{ fontFamily: 'monospace', display: 'flex', alignItems: 'center', height: '100%' }}
        >
          {date.toLocaleDateString('en-IN')}
        </Typography>
      );
    }
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 150,
    getActions: (params) => [
      <GridActionsCellItem
        icon={
          <Tooltip title="View Details">
            <Visibility />
          </Tooltip>
        }
        label="View"
        color="primary"
        onClick={() => handleView(params.row)}
      />,
      <GridActionsCellItem
        icon={
          <Tooltip title="Edit">
            <Edit />
          </Tooltip>
        }
        label="Edit"
        color="warning"
        onClick={() => handleEdit(params.row)}
      />,
      <GridActionsCellItem
        icon={
          <Tooltip title="Delete">
            <Delete />
          </Tooltip>
        }
        label="Delete"
        color="error"
        onClick={() => handleDelete(params.row)}
      />
    ]
  }
];


  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        spacing={2}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading farmers...
        </Typography>
      </Box>
    );
  }

  const StatsCard = ({ title, value, icon, color }) => (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 0 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Agriculture sx={{ color: 'success.main', fontSize: 32 }} />
          <Typography 
            variant="h4" 
            fontWeight={700}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Farmers Management
          </Typography>
        </Stack>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Farmers"
              value={farmers.length}
              icon={<Person />}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Farmers"
              value={farmers.filter(f => f.status === 'Active').length}
              icon={<Agriculture />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Showing Results"
              value={filteredFarmers.length}
              icon={<Search />}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tooltip title="Refresh Data">
                    <IconButton 
                      onClick={loadFarmers}
                      disabled={loading}
                      sx={{ 
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.warning.main, 0.2)
                        }
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    Refresh Data
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <IconButton color="inherit" size="small" onClick={loadFarmers}>
              <Refresh />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search farmers by name, email, phone, or address..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.8)
            }
          }}
        />
      </Box>

      {/* Data Grid */}
      <Paper 
        elevation={0}
        sx={{ 
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={filteredFarmers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
          getRowId={(row) => row.id}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: alpha(theme.palette.divider, 0.08),
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              borderColor: alpha(theme.palette.divider, 0.12),
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: alpha(theme.palette.divider, 0.12),
            }
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewFarmerModal
        open={viewModalOpen}
        farmer={selectedFarmer}
        onClose={() => setViewModalOpen(false)}
      />
      
      <EditFarmerModal
        open={editModalOpen}
        farmer={selectedFarmer}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedFarmer}
        itemType="farmer"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default FarmersTable;
