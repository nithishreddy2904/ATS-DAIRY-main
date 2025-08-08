import React, { useState, useEffect } from 'react';

import {
  DataGrid,
  GridToolbar,
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
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Button,
} from '@mui/material';

import {
  Visibility,
  Edit,
  Delete,
  Search,
  Factory,
  Refresh,
} from '@mui/icons-material';

import processingUnitService from '../services/processingUnitService';
import useSocket from '../hooks/useSocket';

import ViewProcessingUnitModal from './ViewProcessingUnitModal';
import EditProcessingUnitModal from './EditProcessingUnitModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// StatsCard component identical to FarmersTable.jsx
const StatsCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      bgcolor: alpha(color, 0.1),
      color: color,
      minWidth: 200,
      boxShadow: 1,
    }}
  >
    <Box>{icon}</Box>
    <Box>
      <Typography variant="h6" fontWeight="bold" component="div">
        {value}
      </Typography>
      <Typography variant="body2" component="div">
        {title}
      </Typography>
    </Box>
  </Card>
);

const ProcessingUnitsTable = () => {
  const theme = useTheme();

  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Use same socket URL as your farmers table
  const socket = useSocket('http://localhost:5000');

  // Load processing units data
  const loadUnits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await processingUnitService.getAllUnits();

      let data = [];
      if (response && response.data) {
        data = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        data = response;
      }

      setUnits(data);
      setFilteredUnits(data);
    } catch (err) {
      setError(`Failed to load processing units: ${err.message}`);
      setUnits([]);
      setFilteredUnits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search filter effect (debounce can be added if needed)
  useEffect(() => {
    if (searchText.trim()) {
      const filtered = units.filter((unit) =>
        Object.values(unit).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredUnits(filtered);
    } else {
      setFilteredUnits(units);
    }
  }, [searchText, units]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected for processing units');
    });

    socket.on('processing-unit:created', (payload) => {
      setUnits((prev) => [payload.data, ...prev]);
    });

    socket.on('processing-unit:updated', (payload) => {
      setUnits((prev) =>
        prev.map((unit) =>
          unit.id === payload.data.id ? payload.data : unit
        )
      );
    });

    socket.on('processing-unit:deleted', (payload) => {
      setUnits((prev) => prev.filter((unit) => unit.id !== payload.data.id));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected for processing units');
    });

    return () => {
      socket.off('connect');
      socket.off('processing-unit:created');
      socket.off('processing-unit:updated');
      socket.off('processing-unit:deleted');
      socket.off('disconnect');
    };
  }, [socket]);

  // Handlers for modal open/close and CRUD actions
  const handleView = (unit) => {
    setSelectedUnit(unit);
    setViewModalOpen(true);
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setEditModalOpen(true);
  };

  const handleDelete = (unit) => {
    setSelectedUnit(unit);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedUnit) => {
    try {
      await processingUnitService.updateUnit(updatedUnit.id, updatedUnit);
      await loadUnits();
      setEditModalOpen(false);
      setSelectedUnit(null);
    } catch (err) {
      alert('Error updating processing unit: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await processingUnitService.deleteUnit(selectedUnit.id);
      await loadUnits();
      setDeleteDialogOpen(false);
      setSelectedUnit(null);
    } catch (err) {
      alert('Error deleting processing unit: ' + err.message);
    }
  };

 const columns = [
  {
    field: 'unit_id',
    headerName: 'Unit ID',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography sx={{ fontWeight: 'bold' }}>{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 180,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32 }}>
          {params.value?.charAt(0).toUpperCase() || 'P'}
        </Avatar>
        <Tooltip title={params.value}>
          <Typography noWrap>{params.value}</Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 160,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip label={params.value} color="primary" size="small" />
      </Box>
    ),
  },
  {
    field: 'manager',
    headerName: 'Manager',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Tooltip title={params.value}>
          <Typography noWrap>{params.value}</Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    field: 'capacity',
    headerName: 'Capacity (L)',
    width: 140,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography>{params.value ? `${params.value} L` : 'N/A'}</Typography>
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      let color = 'default';
      if (params.value === 'Active') color = 'success';
      else if (params.value === 'Maintenance') color = 'warning';
      else if (params.value === 'Inactive') color = 'error';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
          <Chip label={params.value} color={color} size="small" />
        </Box>
      );
    },
  },
  {
    field: 'contact',
    headerName: 'Contact',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Tooltip title={params.value}>
          <Typography noWrap>{params.value || 'N/A'}</Typography>
        </Tooltip>
      </Box>
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
      />,
    ],
  },
];


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Typography
        variant="h5"
        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Factory fontSize="large" color="primary" />
        Processing Units Management
      </Typography>

      {/* Statistics Cards - exactly like FarmersTable */}
      <Stack spacing={2} direction="row" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <StatsCard
          title="Total Units"
          value={units.length}
          icon={<Factory color="primary" fontSize="large" />}
          color={theme.palette.primary.main}
        />
        <StatsCard
          title="Active Units"
          value={units.filter((u) => u.status === 'Active').length}
          icon={<Factory color="success" fontSize="large" />}
          color={theme.palette.success.main}
        />
        <StatsCard
          title="Under Maintenance"
          value={units.filter((u) => u.status === 'Maintenance').length}
          icon={<Factory color="warning" fontSize="large" />}
          color={theme.palette.warning.main}
        />
        <StatsCard
          title="Total Capacity (L)"
          value={units.reduce((acc, u) => acc + (u.capacity || 0), 0)}
          icon={<Factory color="info" fontSize="large" />}
          color={theme.palette.info.main}
        />
      </Stack>

      {/* Search bar & Refresh */}
      <Stack
        spacing={2}
        direction="row"
        sx={{ mb: 2 }}
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          variant="outlined"
          size="small"
          label="Search Processing Units"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by any field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            sx: {
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              borderRadius: 2,
            },
          }}
          sx={{ maxWidth: 400 }}
          fullWidth
        />
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadUnits}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Refresh Data
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Data Grid */}
      <Paper sx={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={filteredUnits}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
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
            },
          }}
        />
      </Paper>

      {/* Modals */}
      {selectedUnit && (
        <>
          <ViewProcessingUnitModal
            open={viewModalOpen}
            processingUnit={selectedUnit}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedUnit(null);
            }}
          />
          <EditProcessingUnitModal
            open={editModalOpen}
            processingUnit={selectedUnit}
            onSave={handleEditSave}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedUnit(null);
            }}
          />
          <DeleteConfirmDialog
            open={deleteDialogOpen}
            item={selectedUnit}
            itemType="processingUnit"
            onConfirm={handleDeleteConfirm}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedUnit(null);
            }}
          />
        </>
      )}
    </>
  );
};

export default ProcessingUnitsTable;