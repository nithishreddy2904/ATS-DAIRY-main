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
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  VerifiedUser,
} from '@mui/icons-material';

import qualityControlService from '../services/qualityControlService';
import useSocket from '../hooks/useSocket';
import ViewQualityControlModal from './ViewQualityControlModal';
import EditQualityControlModal from './EditQualityControlModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const ORANGE = "#f57c00";

const QualityControlTable = () => {
  const theme = useTheme();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await qualityControlService.getAllRecords();
      let recordsData = [];
      if (response && response.data) {
        recordsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        recordsData = response;
      }
      setRecords(recordsData);
      setFilteredRecords(recordsData);
    } catch (err) {
      console.error('Error loading records:', err);
      setError(`Failed to load quality control records: ${err.message}`);
      setRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = records.filter(r =>
        Object.values(r).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchText, records]);

  useEffect(() => {
    if (!socket) return;

    socket.on('qualityControl:created', payload => {
      setRecords(prev => [payload.data, ...prev]);
    });
    socket.on('qualityControl:updated', payload => {
      setRecords(prev =>
        prev.map(r => (r.id === payload.data.id ? payload.data : r))
      );
    });
    socket.on('qualityControl:deleted', payload => {
      setRecords(prev => prev.filter(r => r.id !== payload.data.id));
    });

    return () => {
      socket.off('qualityControl:created');
      socket.off('qualityControl:updated');
      socket.off('qualityControl:deleted');
    };
  }, [socket]);

  const handleView = record => {
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  const handleEdit = record => {
    setSelectedRecord(record);
    setEditModalOpen(true);
  };

  const handleDelete = record => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedRecord => {
    try {
      await qualityControlService.updateRecord(updatedRecord.id, updatedRecord);
      await loadRecords();
      setEditModalOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error('Error updating record:', err);
      alert('Error updating record: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await qualityControlService.deleteRecord(selectedRecord.id);
      await loadRecords();
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Error deleting record: ' + err.message);
    }
  };

  const columns = [
    { field: 'batch_id', headerName: 'Batch ID', width: 130 },
    { field: 'unit_id', headerName: 'Unit ID', width: 130 },
    { field: 'test_date', headerName: 'Test Date', width: 140,
      renderCell: params => params.value ? new Date(params.value).toLocaleDateString('en-IN') : ''
    },
    { field: 'fat', headerName: 'Fat (%)', width: 100 },
    { field: 'protein', headerName: 'Protein (%)', width: 120 },
    { field: 'moisture', headerName: 'Moisture (%)', width: 130 },
    { field: 'ph', headerName: 'pH', width: 90 },
    {
      field: 'result', headerName: 'Result', width: 120,
      renderCell: params => {
        const color =
          params.value === 'Pass'
            ? 'success'
            : params.value === 'Fail'
            ? 'error'
            : 'warning';
        return <Chip label={params.value} color={color} size="small" />;
      }
    },
    { field: 'inspector', headerName: 'Inspector', width: 180 },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 150,
      getActions: params => [
        <GridActionsCellItem icon={<Visibility color="primary" />} label="View" onClick={() => handleView(params.row)} />,
        <GridActionsCellItem icon={<Edit color="warning" />} label="Edit" onClick={() => handleEdit(params.row)} />,
        <GridActionsCellItem icon={<Delete color="error" />} label="Delete" onClick={() => handleDelete(params.row)} />
      ]
    }
  ];

  // StatCard component with orange accent
  const StatsCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        bgcolor: alpha(ORANGE, 0.08),
        borderRadius: 2,
        boxShadow: 0,
        minWidth: 160,   
        width: 180,      
        height: 100,
        display: 'flex',
        alignItems: 'center',
        p: 1,
      }}
    >
      <Avatar sx={{ bgcolor: ORANGE, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: ORANGE }}>{value}</Typography>
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

  return (
    <Box p={2}>
      {/* Orange header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <VerifiedUser sx={{ color: ORANGE, fontSize: 32, mr: 1 }} />
        <Typography variant="h5" sx={{ color: ORANGE, fontWeight: 600 }}>
          Quality Control Records
        </Typography>
      </Box>

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Total Records"
            value={records.length}
            icon={<VerifiedUser />}
            color={ORANGE}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Passed"
            value={records.filter(r => r.result === 'Pass').length}
            icon={<VerifiedUser />}
            color={ORANGE}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Failed"
            value={records.filter(r => r.result === 'Fail').length}
            icon={<VerifiedUser />}
            color={ORANGE}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
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
          <IconButton onClick={loadRecords}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredRecords}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
        />
      </Paper>

      <ViewQualityControlModal
        open={viewModalOpen}
        record={selectedRecord}
        onClose={() => setViewModalOpen(false)}
      />
      <EditQualityControlModal
        open={editModalOpen}
        record={selectedRecord}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedRecord}
        itemType="qualityControl"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default QualityControlTable;
