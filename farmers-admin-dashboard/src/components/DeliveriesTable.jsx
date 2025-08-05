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
  Assignment,
  LocalShipping,
  Refresh
} from '@mui/icons-material';
import deliveryService from '../services/deliveryService';
import useSocket from '../hooks/useSocket';
import ViewDeliveryModal from './ViewDeliveryModal';
import EditDeliveryModal from './EditDeliveryModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const DELIVERIES_COLOR = '#f44336'; // Material UI Red[500]

const DeliveriesTable = () => {
  const theme = useTheme();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  // Load deliveries data
  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await deliveryService.getAllDeliveries();
      let deliveriesData = [];
      if (response && response.data) {
        deliveriesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        deliveriesData = response;
      }
      setDeliveries(deliveriesData);
      setFilteredDeliveries(deliveriesData);
    } catch (error) {
      setError(`Failed to load deliveries: ${error.message}`);
      setDeliveries([]);
      setFilteredDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchText) {
      const filtered = deliveries.filter(delivery =>
        Object.values(delivery).some(value =>
          value &&
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredDeliveries(filtered);
    } else {
      setFilteredDeliveries(deliveries);
    }
  }, [searchText, deliveries]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('delivery:created', (payload) => {
      setDeliveries(prev => [payload.data, ...prev]);
    });
    socket.on('delivery:updated', (payload) => {
      setDeliveries(prev =>
        prev.map(delivery => delivery.id === payload.data.id ? payload.data : delivery)
      );
    });
    socket.on('delivery:deleted', (payload) => {
      setDeliveries(prev =>
        prev.filter(delivery => delivery.id !== payload.data.id)
      );
    });

    return () => {
      socket.off('delivery:created');
      socket.off('delivery:updated');
      socket.off('delivery:deleted');
    };
  }, [socket]);

  const handleView = (delivery) => {
    setSelectedDelivery(delivery);
    setViewModalOpen(true);
  };

  const handleEdit = (delivery) => {
    setSelectedDelivery(delivery);
    setEditModalOpen(true);
  };

  const handleDelete = (delivery) => {
    setSelectedDelivery(delivery);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedDelivery) => {
    try {
      await deliveryService.updateDelivery(updatedDelivery.id, updatedDelivery);
      await loadDeliveries();
      setEditModalOpen(false);
      setSelectedDelivery(null);
    } catch (error) {
      alert('Error updating delivery: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deliveryService.deleteDelivery(selectedDelivery.id);
      await loadDeliveries();
      setDeleteDialogOpen(false);
      setSelectedDelivery(null);
    } catch (error) {
      alert('Error deleting delivery: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  // --- Stat Card Component ---
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
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

  // --- DataGrid Columns ---
  const getStatusChip = (status) => {
    switch ((status ?? '').toLowerCase()) {
      case 'delivered':
        return <Chip label="delivered" sx={{color:'#fff', bgcolor:'#4caf50' }} size="small" />;
      case 'in_transit':
        return <Chip label="in transit" sx={{color:'#1976d2', bgcolor:'#e3f2fd' }} size="small" />;
      case 'pending':
        return <Chip label="pending" sx={{color:'#ff9800', bgcolor:'#fff3e0'}} size="small" />;
      case 'cancelled':
        return <Chip label="cancelled" sx={{color:'#fff', bgcolor:'#f44336' }} size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getPriorityChip = (priority) => {
    switch ((priority ?? '').toLowerCase()) {
      case 'high':
        return <Chip label="High" sx={{color:'#fff', bgcolor:'#f44336'}} size="small" />;
      case 'medium':
        return <Chip label="Medium" sx={{color:'#fff', bgcolor:'#ff9800'}} size="small" />;
      case 'low':
        return <Chip label="Low" sx={{color:'#fff', bgcolor:'#2196f3'}} size="small" />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Delivery ID',
      width: 100,
      renderCell: (params) => (
      <span style={{
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        fontWeight: 500,
        color: DELIVERIES_COLOR
      }}>
        #{params.value}
      </span>
    ),
    },
    {
      field: 'delivery_date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
        {formatDate(params.value)}
      </span>
    ),
    },
    {
      field: 'vehicle_number',
      headerName: 'Vehicle',
      width: 140,
     renderCell: (params) => (
      <span style={{
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        whiteSpace: 'nowrap'
      }}>
        <span style={{ fontWeight: 600 }}>{params.value}</span>
      </span>
    ),
    },
    {
      field: 'driver_name',
      headerName: 'Driver',
      width: 150,
      renderCell: (params) => (
    <span style={{
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%',
      fontSize: 14,
      fontWeight: 400
    }}>
      {params.value}
    </span>
  ),
    },
    {
      field: 'destination',
      headerName: 'Destination',
      width: 150,
      renderCell: (params) => (
    <span style={{
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%',
      fontSize: 17,
      fontWeight: 400
    }}>
      {params.value}
    </span>
  ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      headerAlign: 'center',
      alignItems: 'flex-end',
      align: 'center',
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => getPriorityChip(params.value)
    },
    {
      field: 'estimatedTime',
      headerName: 'Est. Time',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
    <span style={{
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      fontSize: 17,         
      fontWeight: 400,      
      width: '100%',
      justifyContent: 'center', 
    }}>
      {params.value || 'N/A'}
    </span>
  ),
    },
    {
      field: 'distance',
      headerName: 'Distance',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
    <span style={{
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      fontSize: 17,
      fontWeight: 400,
      width: '100%',
      justifyContent: 'center',
    }}>
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
    }
  ];

  if (loading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress sx={{ color: DELIVERIES_COLOR }} />
        <Typography variant="body2" mt={2} color="text.secondary">
          Loading deliveries...
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {/* Header Section */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Assignment sx={{ color: DELIVERIES_COLOR, fontSize: 36 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: DELIVERIES_COLOR }}>
          Deliveries Management
        </Typography>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item>
          <StatsCard
            title="Total Deliveries"
            value={deliveries.length}
            icon={<Assignment />}
            color={DELIVERIES_COLOR}
          />
        </Grid>
        <Grid item>
          <StatsCard
            title="In Transit"
            value={deliveries.filter(d => (d.status ?? '').toLowerCase() === 'in_transit').length}
            icon={<LocalShipping />}
            color={DELIVERIES_COLOR}
          />
        </Grid>
        <Grid item>
          <StatsCard
            title="Delivered"
            value={deliveries.filter(d => (d.status ?? '').toLowerCase() === 'delivered').length}
            icon={<Assignment />}
            color={DELIVERIES_COLOR}
          />
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadDeliveries}>
                <Refresh sx={{ color: DELIVERIES_COLOR }} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ color: DELIVERIES_COLOR, fontWeight: 500 }}>
              Refresh Data
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {/* Search Bar */}
      <TextField
        placeholder="Search deliveries…"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: DELIVERIES_COLOR }} />
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
          rows={filteredDeliveries}
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
              borderColor: alpha(theme.palette.divider, 0.08)
            },
            display: 'flex',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha(DELIVERIES_COLOR, 0.02),
              borderColor: alpha(theme.palette.divider, 0.12)
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(DELIVERIES_COLOR, 0.04),
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: alpha(theme.palette.divider, 0.12)
            }
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewDeliveryModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        delivery={selectedDelivery}
      />
      <EditDeliveryModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        delivery={selectedDelivery}
        onSave={handleEditSave}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete Delivery"
        content="Are you sure you want to delete this delivery record?"
      />
    </Box>
  );
};

export default DeliveriesTable;
