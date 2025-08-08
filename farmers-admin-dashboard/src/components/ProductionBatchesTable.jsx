import React, { useState, useEffect } from 'react';

import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from '@mui/x-data-grid';

import {
  Box,
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
} from '@mui/material';

import {
  Visibility,
  Edit,
  Delete,
  Search,
  Factory,
  ProductionQuantityLimits,
  Refresh,
} from '@mui/icons-material';

import productionBatchService from '../services/productionBatchService';
import useSocket from '../hooks/useSocket';

import ViewProductionBatchModal from './ViewProductionBatchModal';
import EditProductionBatchModal from './EditProductionBatchModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// Use a deep green for module highlight throughout
const BATCH_GREEN = '#388e3c';
const BATCH_GREEN_LIGHT = 'rgba(56,142,60,0.10)';

const ProductionBatchesTable = () => {
  const theme = useTheme();

  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  // Data loading and socket - unchanged from original
  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productionBatchService.getAllProductionBatches();
      let batchesData = [];
      if (response && response.data) {
        batchesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        batchesData = response;
      }
      setBatches(batchesData);
      setFilteredBatches(batchesData);
    } catch (error) {
      setError(`Failed to load production batches: ${error.message}`);
      setBatches([]);
      setFilteredBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredBatches(batches);
    } else {
      const lowerSearch = searchText.toLowerCase();
      setFilteredBatches(
        batches.filter(batch =>
          Object.values(batch).some(
            value =>
              value &&
              value.toString().toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
  }, [searchText, batches]);

  useEffect(() => {
    if (!socket) return;
    const onCreated = payload => setBatches(prev => [payload.data, ...prev]);
    const onUpdated = payload => setBatches(prev =>
      prev.map(batch => (batch.id === payload.data.id ? payload.data : batch))
    );
    const onDeleted = payload => setBatches(prev =>
      prev.filter(batch => batch.id !== payload.data.id)
    );
    socket.on('productionBatch:created', onCreated);
    socket.on('productionBatch:updated', onUpdated);
    socket.on('productionBatch:deleted', onDeleted);

    return () => {
      socket.off('productionBatch:created', onCreated);
      socket.off('productionBatch:updated', onUpdated);
      socket.off('productionBatch:deleted', onDeleted);
    };
  }, [socket]);

  const handleView = batch => {
    setSelectedBatch(batch);
    setViewModalOpen(true);
  };
  const handleEdit = batch => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };
  const handleDelete = batch => {
    setSelectedBatch(batch);
    setDeleteDialogOpen(true);
  };
  const handleEditSave = async updateBatch => {
    await productionBatchService.updateBatch(updateBatch.id, updateBatch);
    await loadBatches();
    setEditModalOpen(false);
    setSelectedBatch(null);
  };
  const handleDeleteConfirm = async () => {
    await productionBatchService.deleteBatch(selectedBatch.id);
    await loadBatches();
    setDeleteDialogOpen(false);
    setSelectedBatch(null);
  };

  // Greener status color mapping
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      case 'quality check': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const formatDate = dateStr => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN');
    } catch {
      return dateStr;
    }
  };

  // Flat single row style using Box for all fields
  const columns = [
    {
      field: 'batchId',
      headerName: 'Batch ID',
      width: 100,
      renderCell: params => (
        <Box
          sx={{
            borderRadius: 1,
            px: 2,
            py: 0.5,
            minWidth: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: BATCH_GREEN,
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'unit',
      headerName: 'Unit',
      width: 140,
      renderCell: params => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.5,
          borderRadius: 1,
          fontWeight: 500,
          minWidth: 80
        }}>
          <Factory fontSize="small" sx={{ color: BATCH_GREEN, mr: 1 }} />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'product',
      headerName: 'Product',
      width: 130,
      renderCell: params => (
        <Box sx={{
          borderRadius: 1,
          px: 2,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
          color: BATCH_GREEN,
          minWidth: 80
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity(Kg/L)',
      width: 110,
      renderCell: params => (
        <Box sx={{
          borderRadius: 1,
          px: 2,
          py: 0.5,
          minWidth: 60,
          color: BATCH_GREEN,
          fontWeight: 500,
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'date',
      headerName: 'Production Date',
      width: 128,
      renderCell: params => (
        <Box sx={{
          borderRadius: 1,
          px: 2,
          py: 0.5,
          minWidth: 110,
        }}>
          {formatDate(params.value)}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: params => (
        <Chip size="small" label={params.value || 'Unknown'} color={getStatusColor(params.value)} sx={{
          bgcolor: (params.value && params.value.toLowerCase() === 'completed') ? alpha(BATCH_GREEN, 0.18) : undefined,
          color: (params.value && params.value.toLowerCase() === 'completed') ? BATCH_GREEN : undefined,
          fontWeight: 600,
        }} />
      )
    },
    {
      field: 'quality',
      headerName: 'Quality',
      width: 100,
      renderCell: params => (
        <Box sx={{
          borderRadius: 1,
          px: 2,
          py: 0.5,
          minWidth: 60,
        }}>
          {params.value || '-'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          color="primary"
          onClick={() => handleView(params.row)} />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          color="warning"
          onClick={() => handleEdit(params.row)} />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          color="error"
          onClick={() => handleDelete(params.row)} />,
      ],
    }
  ];

  // UI - unchanged except for green theming
  if (loading) {
    return (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={50} sx={{ color: BATCH_GREEN }} />
        <Typography variant="h6" sx={{ ml: 2, color: BATCH_GREEN }}>
          Loading production batches...
        </Typography>
      </Box>
    );
  }

  const totalQuantity = batches.reduce((sum, b) => sum + (parseFloat(b.quantity) || 0), 0);
  const completedCount = batches.filter(b => (b.status ?? '').toLowerCase() === 'completed').length;
  const inProgressCount = batches.filter(b => (b.status ?? '').toLowerCase() === 'in progress').length;

  const StatsCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: "100%", borderLeft: `6px solid ${color}`, borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar sx={{ bgcolor: alpha(color, 0.15), color }}>{icon}</Avatar>
        <Box>
          <Typography variant="h4" color={color} fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: BATCH_GREEN, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Factory sx={{ color: BATCH_GREEN }} />
        Production Batches Management
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={3}>
        <StatsCard title="Total Batches" value={batches.length} icon={<ProductionQuantityLimits />} color={BATCH_GREEN} />
        <StatsCard title="Completed" value={completedCount} icon={<Factory />} color={theme.palette.success.main} />
        <StatsCard title="In Progress" value={inProgressCount} icon={<Factory />} color={theme.palette.warning.main} />
        <StatsCard title="Total Quantity (Kg/L)" value={totalQuantity.toFixed(1)} icon={<ProductionQuantityLimits />} color={theme.palette.info.main} />
      </Stack>

      <Stack direction="row"  alignItems="center" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search production batches..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: BATCH_GREEN }} /></InputAdornment> }}
          sx={{
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              color: BATCH_GREEN,
              borderColor: alpha(BATCH_GREEN, 0.2),
            }
          }}
        />
        <Tooltip title="Refresh">
          <IconButton onClick={loadBatches} sx={{ color: BATCH_GREEN }}>
            <Refresh />
            <Typography variant="body2" color="text.secondary">
              Refresh Data
            </Typography>
          </IconButton>
        </Tooltip>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 600, border: `2px solid ${BATCH_GREEN_LIGHT}`, borderRadius: 2 }}>
        <DataGrid
          rows={filteredBatches}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          getRowId={row => row.id}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': { borderColor: alpha(BATCH_GREEN, 0.10) },
            '& .MuiDataGrid-columnHeaders': { bgcolor: BATCH_GREEN_LIGHT },
            '& .MuiDataGrid-row:hover': { bgcolor: alpha(BATCH_GREEN, 0.07) },
            '& .MuiDataGrid-footerContainer': { borderColor: alpha(BATCH_GREEN, 0.20) },
          }}
        />
      </Paper>

      <ViewProductionBatchModal open={viewModalOpen} batch={selectedBatch} onClose={() => setViewModalOpen(false)} />
      <EditProductionBatchModal open={editModalOpen} batch={selectedBatch} onSave={handleEditSave} onClose={() => setEditModalOpen(false)} />
      <DeleteConfirmDialog open={deleteDialogOpen} item={selectedBatch} itemType="productionBatch" onConfirm={handleDeleteConfirm} onClose={() => setDeleteDialogOpen(false)} />
    </Box>
  );
};

export default ProductionBatchesTable;
