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
  VerifiedUser,
  Warning,
  CheckCircle,
  Schedule,
  Error,
  Assignment,
} from '@mui/icons-material';

import complianceService from '../services/complianceService';
import useSocket from '../hooks/useSocket';
import ViewComplianceModal from './ViewComplianceModal';
import EditComplianceModal from './EditComplianceModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const BLUE = "#2196f3"; // Same as Compliance page

const ComplianceTable = () => {
  const theme = useTheme();
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadComplianceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await complianceService.getAllRecords();
      let recordsData = [];
      if (response && response.data) {
        recordsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        recordsData = response;
      }
      setComplianceRecords(recordsData);
      setFilteredRecords(recordsData);
    } catch (err) {
      console.error('Error loading compliance records:', err);
      setError(`Failed to load compliance records: ${err.message}`);
      setComplianceRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplianceRecords();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = complianceRecords.filter(record =>
        Object.values(record).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(complianceRecords);
    }
  }, [searchText, complianceRecords]);

  useEffect(() => {
    if (!socket) return;

    socket.on('compliance:created', payload => {
      setComplianceRecords(prev => [payload.data, ...prev]);
    });
    socket.on('compliance:updated', payload => {
      setComplianceRecords(prev =>
        prev.map(record => (record.id === payload.data.id ? payload.data : record))
      );
    });
    socket.on('compliance:deleted', payload => {
      setComplianceRecords(prev => prev.filter(record => record.id !== payload.data.id));
    });

    return () => {
      socket.off('compliance:created');
      socket.off('compliance:updated');
      socket.off('compliance:deleted');
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
      if (updatedRecord.id && complianceRecords.find(r => r.id === updatedRecord.id)) {
        await complianceService.updateRecord(updatedRecord.id, updatedRecord);
      } else {
        await complianceService.createRecord(updatedRecord);
      }
      await loadComplianceRecords();
      setEditModalOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error('Error saving compliance record:', err);
      alert('Error saving compliance record: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await complianceService.deleteRecord(selectedRecord.id);
      await loadComplianceRecords();
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error('Error deleting compliance record:', err);
      alert('Error deleting compliance record: ' + err.message);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'Compliant') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Compliant': return <CheckCircle />;
      case 'Non-Compliant': return <Error />;
      case 'Under Review': return <Schedule />;
      case 'Pending': return <Warning />;
      case 'Expired': return <Error />;
      case 'Renewed': return <CheckCircle />;
      default: return <Assignment />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Medium': return '#1976d2';
      case 'Low': return '#388e3c';
      default: return '#757575';
    }
  };

  const columns = [
  { 
    field: 'id', 
    headerName: 'Record ID', 
    width: 120,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'type', 
    headerName: 'Compliance Type', 
    width: 180,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            bgcolor: alpha(BLUE, 0.1),
            color: BLUE,
            fontWeight: 'medium'
          }}
        />
      </Box>
    )
  },
  { 
    field: 'title', 
    headerName: 'Title', 
    width: 200,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'responsible_department', 
    headerName: 'Department', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'priority', 
    headerName: 'Priority', 
    width: 100,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            bgcolor: alpha(getPriorityColor(params.value), 0.1),
            color: getPriorityColor(params.value),
            fontWeight: 'bold'
          }}
        />
      </Box>
    )
  },
  { 
    field: 'due_date', 
    headerName: 'Due Date', 
    width: 130,
    renderCell: params => {
      const overdue = isOverdue(params.value, params.row.status);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography 
            variant="body2" 
            color={overdue ? 'error.main' : 'text.primary'}
            fontWeight={overdue ? 'bold' : 'normal'}
          >
            {formatDateTime(params.value)}
          </Typography>
        </Box>
      );
    }
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 140,
    renderCell: params => {
      const color =
        params.value === 'Compliant' ? 'success' :
        (params.value === 'Non-Compliant' || params.value === 'Expired') ? 'error' :
        params.value === 'Under Review' ? 'info' : 'warning';

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={params.value} 
            color={color} 
            size="small"
            variant="outlined"
            icon={getStatusIcon(params.value)}
          />
        </Box>
      );
    }
  },
  { 
    field: 'assigned_to', 
    headerName: 'Assigned To', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'risk_level', 
    headerName: 'Risk Level', 
    width: 120,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            bgcolor: alpha(getPriorityColor(params.value), 0.1),
            color: getPriorityColor(params.value),
            fontWeight: 'medium'
          }}
        />
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
  const totalRecords = complianceRecords.length;
  const compliantRecords = complianceRecords.filter(r => r.status === 'Compliant').length;
  const pendingRecords = complianceRecords.filter(r => r.status === 'Pending').length;
  const overdueRecords = complianceRecords.filter(r => isOverdue(r.due_date, r.status)).length;
  const criticalRecords = complianceRecords.filter(r => r.priority === 'Critical').length;


  return (
    <Box p={2}>
      {/* Blue header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <VerifiedUser sx={{ color: BLUE, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: BLUE, fontWeight: 600 }}>
          Compliance Records
        </Typography>
      </Box>

       

      {/* Compliance alerts */}
      {(overdueRecords > 0 || criticalRecords > 0) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          icon={<Warning />}
        >
          <Typography variant="body2">
            {overdueRecords > 0 && `${overdueRecords} record(s) are overdue. `}
            {criticalRecords > 0 && `${criticalRecords} critical priority item(s) require attention.`}
          </Typography>
        </Alert>
      )}

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Records"
            value={totalRecords}
            icon={<Assignment />}
            color={BLUE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Compliant"
            value={compliantRecords}
            icon={<CheckCircle />}
            color={BLUE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Pending"
            value={pendingRecords}
            icon={<Schedule />}
            color={BLUE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Overdue"
            value={overdueRecords}
            icon={<Error />}
            alert={overdueRecords > 0}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search compliance records..."
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
            <IconButton onClick={loadComplianceRecords}>
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
          initialState={{
            sorting: {
              sortModel: [{ field: 'due_date', sort: 'asc' }],
            },
          }}
          getRowClassName={(params) => {
            if (isOverdue(params.row.due_date, params.row.status)) {
              return 'row-overdue';
            }
            if (params.row.priority === 'Critical') {
              return 'row-critical';
            }
            return '';
          }}
          sx={{
            '& .row-overdue': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
            '& .row-critical': {
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
            },
          }}
        />
      </Paper>

      <ViewComplianceModal
        open={viewModalOpen}
        record={selectedRecord}
        onClose={() => setViewModalOpen(false)}
      />
      <EditComplianceModal
        open={editModalOpen}
        record={selectedRecord}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedRecord}
        itemType="compliance"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default ComplianceTable;
