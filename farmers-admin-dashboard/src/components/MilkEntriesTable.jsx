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
  LocalDrink,
  Person,
  Refresh,
  Thermostat,
  Science
} from '@mui/icons-material';
import milkEntryService from '../services/milkEntryService';
import useSocket from '../hooks/useSocket';
import ViewMilkEntryModal from './ViewMilkEntryModal';
import EditMilkEntryModal from './EditMilkEntryModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const MilkEntriesTable = () => {
  const theme = useTheme();

  const [milkEntries, setMilkEntries] = useState([]);
  const [filteredMilkEntries, setFilteredMilkEntries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState('');

  const [selectedMilkEntry, setSelectedMilkEntry] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  // Load milk entries data
  const loadMilkEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await milkEntryService.getAllMilkEntries();

      let milkEntriesData = [];

      if (response && response.data) {
        milkEntriesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        milkEntriesData = response;
      }

      setMilkEntries(milkEntriesData);
      setFilteredMilkEntries(milkEntriesData);
    } catch (error) {
      setError(`Failed to load milk entries: ${error.message}`);
      setMilkEntries([]);
      setFilteredMilkEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilkEntries();
  }, []);

  // Search functionality - filter all columns by search text
  useEffect(() => {
    if (searchText) {
      const lower = searchText.toLowerCase();

      const filtered = milkEntries.filter((entry) =>
        Object.values(entry).some(
          (value) =>
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(lower)
        )
      );

      setFilteredMilkEntries(filtered);
    } else {
      setFilteredMilkEntries(milkEntries);
    }
  }, [searchText, milkEntries]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('milkEntry:created', (payload) => {
      setMilkEntries((prev) => [payload.data, ...prev]);
    });

    socket.on('milkEntry:updated', (payload) => {
      setMilkEntries((prev) =>
        prev.map((entry) => (entry.id === payload.data.id ? payload.data : entry))
      );
    });

    socket.on('milkEntry:deleted', (payload) => {
      setMilkEntries((prev) => prev.filter((entry) => entry.id !== payload.data.id));
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('milkEntry:created');
      socket.off('milkEntry:updated');
      socket.off('milkEntry:deleted');
    };
  }, [socket]);

  // Handlers for modal dialogs
  const handleView = (milkEntry) => {
    setSelectedMilkEntry(milkEntry);
    setViewModalOpen(true);
  };

  const handleEdit = (milkEntry) => {
    setSelectedMilkEntry(milkEntry);
    setEditModalOpen(true);
  };

  const handleDelete = (milkEntry) => {
    setSelectedMilkEntry(milkEntry);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedMilkEntry) => {
    try {
      await milkEntryService.updateMilkEntry(updatedMilkEntry.id, updatedMilkEntry);
      await loadMilkEntries();
      setEditModalOpen(false);
      setSelectedMilkEntry(null);
    } catch (error) {
      alert('Error updating milk entry: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await milkEntryService.deleteMilkEntry(selectedMilkEntry.id);
      await loadMilkEntries();
      setDeleteDialogOpen(false);
      setSelectedMilkEntry(null);
    } catch (error) {
      alert('Error deleting milk entry: ' + error.message);
    }
  };

  // Color helpers
  const getQualityColor = (quality) => {
    const colors = {
      'A+': theme.palette.success.main,
      A: theme.palette.success.light,
      B: theme.palette.warning.main,
      C: theme.palette.error.main,
      D: theme.palette.error.dark
    };
    return colors[quality] || theme.palette.grey[500];
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      Paid: 'success',
      Pending: 'warning',
      Partial: 'info'
    };
    return colors[status] || 'default';
  };

  // Columns definition - style & align as FarmersTable but with blue theming
  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'Entry ID',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Chip
    //       label={params.value}
    //       size="small"
    //       sx={{
    //         bgcolor: alpha(theme.palette.info.main, 0.15),
    //         color: theme.palette.info.main,
    //         fontWeight: 'bold'
    //       }}
    //     />
    //   )
    // },
    {
      field: 'farmer_id',
      headerName: 'Farmer ID',
      width: 120,
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        {params.value}
      </span>
    ),
    },
    {
      field: 'farmer_name',
      headerName: 'Farmer Name',
      width: 150,
     renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        {params.value}
      </span>
    ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
        {params.value ? new Date(params.value).toLocaleDateString('en-IN') : ''}
      </span>
    ),
    },
    {
      field: 'shift',
      headerName: 'Shift',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {params.value || '-'}
      </span>
    ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity (L)',
      width: 120,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {parseFloat(params.value || 0).toFixed(1)} L
      </span>
    ),
    },
    {
      field: 'quality',
      headerName: 'Quality',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
    <span style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Chip
        label={params.value || 'N/A'}
        size="small"
        sx={{
          bgcolor: alpha(getQualityColor(params.value), 0.15),
          color: getQualityColor(params.value),
          fontWeight: 600,
          fontSize: 14
        }}
      />
    </span>
  )
    },
    {
      field: 'fat_content',
      headerName: 'Fat %',
      width: 90,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {params.value ? `${parseFloat(params.value).toFixed(1)}%` : 'N/A'}
      </span>
    ),
    },
    {
      field: 'temperature',
      headerName: 'Temp (°C)',
      width: 100,
      align: 'right',
      headerAlign: 'right',
       renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {params.value ? `${parseFloat(params.value).toFixed(1)}°C` : 'N/A'}
      </span>
    ),
    },
    {
      field: 'payment_amount',
      headerName: 'Payment',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
      <span style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {params.value ? `₹${parseFloat(params.value).toFixed(0)}` : 'N/A'}
      </span>
    ),
    },
    {
      field: 'payment_status',
      headerName: 'Status',
      width: 100,
      align: 'center',
      headerAlign: 'center',
     renderCell: (params) => (
    <span style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Chip
        label={params.value || 'N/A'}
        color={getPaymentStatusColor(params.value)}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: 14
        }}
      />
    </span>
  ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={
            <Tooltip title="View">
              <Visibility color="info" />
            </Tooltip>
          }
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <Edit color="warning" />
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete">
              <Delete color="error" />
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDelete(params.row)}
        />
      ]
    }
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        sx={{ bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 2 }}
      >
        <CircularProgress color="info" size={60} />
      </Box>
    );
  }

  const StatsCard = ({ title, value, icon, color }) => (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 8px rgba(25,118,210,0.15)'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.15), color: color }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Stats calculations
  const totalEntries = milkEntries.length;
  const totalQuantity = milkEntries.reduce(
    (sum, entry) => sum + parseFloat(entry.quantity || 0),
    0
  );
  const avgFatContent =
    milkEntries.length > 0
      ? (
          milkEntries.reduce((sum, entry) => sum + parseFloat(entry.fat_content || 0), 0) /
          milkEntries.length
        ).toFixed(1)
      : 0;
  const totalPayments = milkEntries.reduce(
    (sum, entry) => sum + parseFloat(entry.payment_amount || 0),
    0
  );

  return (
    <Box>
      {/* Header Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={0.5}
        sx={{
          background:
            'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Milk Entries Management
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Monitor and manage milk collection records with quality parameters.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Entries"
            value={totalEntries}
            icon={<LocalDrink />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Quantity (L)"
            value={totalQuantity.toFixed(1)}
            icon={<Science />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Average Fat %"
            value={avgFatContent}
            icon={<Thermostat />}
            color={theme.palette.info.dark}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 3,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: alpha(theme.palette.info.main, 0.1)
              }
            }}
            onClick={loadMilkEntries}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.info.main
              }}
            >
              <Refresh />
              <Typography fontWeight="bold">Refresh Data</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        size="small"
        fullWidth
        placeholder="Search Milk Entries"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="info" />
            </InputAdornment>
          )
        }}
        sx={{
          maxWidth: 400,
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.8)
          }
        }}
      />

      {/* Data Grid */}
      <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredMilkEntries}
          columns={columns}
          loading={loading}
          density="comfortable"
          autoHeight
          rowsPerPageOptions={[10, 25, 50]}
          components={{ Toolbar: GridToolbar }}
          sx={{
            border: 'none',
            fontSize: 14,
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              py: 1.2,
              px: 1.5
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha(theme.palette.info.main, 0.1),
              borderBottom: `2px solid ${alpha(theme.palette.divider, 0.15)}`,
              fontWeight: 700,
              fontSize: '0.9rem'
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(theme.palette.info.main, 0.1)
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`
            }
          }}
        />
      </Paper>

      {/* Modals */}
      {selectedMilkEntry && (
        <ViewMilkEntryModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          milkEntry={selectedMilkEntry}
        />
      )}
      {selectedMilkEntry && (
        <EditMilkEntryModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          milkEntry={selectedMilkEntry}
          onSave={handleEditSave}
        />
      )}
      {selectedMilkEntry && (
       <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedMilkEntry}
        itemType="milk_entry"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
      )}
    </Box>
  );
};

export default MilkEntriesTable;
