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
  LocalShipping,
  DirectionsCar,
  Refresh
} from '@mui/icons-material';
import fleetService from '../services/fleetService';
import useSocket from '../hooks/useSocket';
import ViewFleetModal from './ViewFleetModal';
import EditFleetModal from './EditFleetModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const FleetTable = () => {
  const theme = useTheme();
  const [fleetRecords, setFleetRecords] = useState([]);
  const [filteredFleetRecords, setFilteredFleetRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  // Load fleet records data
  const loadFleetRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading fleet records...');
      const response = await fleetService.getAllFleet();
      console.log('Fleet records loaded:', response);
      
      // Handle different response formats
      let fleetData = [];
      if (response && response.data) {
        fleetData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        fleetData = response;
      }
      
      setFleetRecords(fleetData);
      setFilteredFleetRecords(fleetData);
      console.log('Fleet records set to state:', fleetData);
    } catch (error) {
      console.error('Error loading fleet records:', error);
      setError(`Failed to load fleet records: ${error.message}`);
      setFleetRecords([]);
      setFilteredFleetRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleetRecords();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchText) {
      const filtered = fleetRecords.filter(fleet =>
        Object.values(fleet).some(value =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
      setFilteredFleetRecords(filtered);
    } else {
      setFilteredFleetRecords(fleetRecords);
    }
  }, [searchText, fleetRecords]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('fleet:created', (payload) => {
      console.log('New fleet record created:', payload);
      setFleetRecords(prev => [payload.data, ...prev]);
    });

    socket.on('fleet:updated', (payload) => {
      console.log('Fleet record updated:', payload);
      setFleetRecords(prev =>
        prev.map(fleet =>
          fleet.id === payload.data.id ? payload.data : fleet
        )
      );
    });

    socket.on('fleet:deleted', (payload) => {
      console.log('Fleet record deleted:', payload);
      setFleetRecords(prev =>
        prev.filter(fleet => fleet.id !== payload.data.id)
      );
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('fleet:created');
      socket.off('fleet:updated');
      socket.off('fleet:deleted');
    };
  }, [socket]);

  const handleView = (fleet) => {
    setSelectedFleet(fleet);
    setViewModalOpen(true);
  };

  const handleEdit = (fleet) => {
    setSelectedFleet(fleet);
    setEditModalOpen(true);
  };

  const handleDelete = (fleet) => {
    console.log('Delete clicked:', fleet);
    setSelectedFleet(fleet);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedFleet) => {
    try {
      await fleetService.updateFleet(updatedFleet.id, updatedFleet);
      await loadFleetRecords();
      setEditModalOpen(false);
      setSelectedFleet(null);
    } catch (error) {
      console.error('Error updating fleet record:', error);
      alert('Error updating fleet record: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('🗑️ Deleting fleet record:', selectedFleet);
      await fleetService.deleteFleet(selectedFleet.id);
      await loadFleetRecords();
      setDeleteDialogOpen(false);
      setSelectedFleet(null);
      console.log('✅ Fleet record deleted and UI refreshed successfully');
    } catch (error) {
      console.error('❌ Error deleting fleet record:', error);
      alert('Error deleting fleet record: ' + error.message);
    }
  };

  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'Fleet ID',
    //   width: 120,
    //   renderCell: (params) => (
    //     <Avatar
    //       sx={{
    //         bgcolor: alpha('#9c27b0', 0.15),
    //         color: '#9c27b0',
    //         width: 32,
    //         height: 32,
    //         fontWeight: 'bold'
    //       }}
    //     >
    //       {params.value?.toString().charAt(0)}
    //     </Avatar>
    //   ),
    // },
    {
      field: 'vehicle_number',
      headerName: 'Vehicle Number',
      width: 140,
       renderCell: (params) => (
        <span
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            whiteSpace: 'nowrap',
            fontWeight: 600,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: 'vehicle_type',
      headerName: 'Vehicle Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          icon={<DirectionsCar />}
          sx={{
            bgcolor: alpha('#9c27b0', 0.1),
            color: '#9c27b0',
            fontWeight: 'bold'
          }}
          size="small"
        />
      ),
    },
    {
      field: 'driver_name',
      headerName: 'Driver Name',
      width: 150,
      renderCell: (params) => (
        <span style={{ height: '100%', display: 'flex', fontSize: 17, alignItems: 'flex-end' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'driver_phone',
      headerName: 'Driver Phone',
      width: 130,
      renderCell: (params) => (
        <span style={{ height: '100%', display: 'flex', fontSize: 17, alignItems: 'flex-end' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'capacity',
      headerName: 'Capacity (L)',
      width: 120,
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <span style={{ height: '100%', display: 'flex', fontSize: 17, alignItems: 'flex-end' }}>
          {params.value}L
        </span>
      ),
    },
    {
      field: 'fuel_type',
      headerName: 'Fuel Type',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            bgcolor: alpha('#9c27b0', 0.08),
            color: '#9c27b0'
          }}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            bgcolor:
              params.value === 'Available'
                ? alpha('#9c27b0', 0.12)
                : theme.palette.grey[100],
            color:
              params.value === 'Available'
                ? '#9c27b0'
                : theme.palette.text.primary,
            fontWeight: 'bold'
          }}
          size="small"
        />
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 140,
      renderCell: (params) => (
        <span style={{ height: '100%', display: 'flex', fontSize: 17, alignItems: 'flex-end' }}>
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          color="primary"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          color="warning"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          color="error"
          onClick={() => handleDelete(params.row)}
        />
      ],
    },
  ];

  if (loading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress sx={{ color: '#9c27b0' }} />
        <Typography variant="body2" mt={2} color="text.secondary">
          Loading fleet records...
        </Typography>
      </Stack>
    );
  }

  const StatsCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        minWidth: 180
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: 'transparent',
              color: color,
              width: 44,
              height: 44
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: color
              }}
            >
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
    <Box sx={{ mt: 1 }}>
      {/* Header Section */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <LocalShipping sx={{ color: '#9c27b0', fontSize: 36 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
          Fleet Management
        </Typography>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item>
          <StatsCard
            title="Total Fleet"
            value={fleetRecords.length}
            icon={<LocalShipping />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item>
          <StatsCard
            title="Available"
            value={fleetRecords.filter(f => f.status === 'Available').length}
            icon={<DirectionsCar />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item>
          <StatsCard
            title="Total Capacity"
            value={`${fleetRecords.reduce((sum, f) => sum + (parseInt(f.capacity) || 0), 0)}L`}
            icon={<LocalShipping />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadFleetRecords}>
                <Refresh sx={{ color: '#9c27b0' }} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 'medium' }}>
              Refresh Data
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        placeholder="Search fleet …"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#9c27b0' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          maxWidth: 500,
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.8)
          }
        }}
      />

      {/* Data Grid */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: 'background.paper',
          pt: 2,
          px: 1,
          mb: 7
        }}
      >
        <DataGrid
          autoHeight
          rows={filteredFleetRecords}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: alpha(theme.palette.divider, 0.08),
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha('#9c27b0', 0.02),
              borderColor: alpha(theme.palette.divider, 0.12),
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha('#9c27b0', 0.04),
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: alpha(theme.palette.divider, 0.12),
            },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewFleetModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        fleet={selectedFleet}
      />
      <EditFleetModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fleet={selectedFleet}
        onSave={handleEditSave}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedFleet}
        itemType="fleet"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default FleetTable;
