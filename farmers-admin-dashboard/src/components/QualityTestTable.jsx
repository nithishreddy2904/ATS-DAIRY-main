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
  Science,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Assignment,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
  VerifiedUser,
} from '@mui/icons-material';

import qualityTestService from '../services/qualityTestService';
import useSocket from '../hooks/useSocket';
import ViewQualityTestModal from './ViewQualityTestModal';
import EditQualityTestModal from './EditQualityTestModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const GREEN = '#4caf50';

const fmtDate = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }) : '';

const getGradeColor = (grade) => {
  switch (grade) {
    case 'A+': return 'success';
    case 'A': return 'success';
    case 'B': return 'info';
    case 'C': return 'warning';
    case 'D': return 'error';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'info';
    case 'Pending': return 'warning';
    case 'Failed': return 'error';
    default: return 'default';
  }
};

const QualityTestTable = () => {
  const theme = useTheme();

  const [tests, setTests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedTest, setSelectedTest] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load quality tests from API
  const loadTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await qualityTestService.getAllTests();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setTests(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load quality tests:', e);
      setError(`Failed to load quality tests: ${e.message}`);
      setTests([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  // Filter tests based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(tests);
      return;
    }
    const lower = searchText.toLowerCase();
    setFiltered(tests.filter(test =>
      Object.values(test).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, tests]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('qualityTest:created', (payload) => setTests(prev => [payload.data, ...prev]));
    socket.on('qualityTest:updated', (payload) =>
      setTests(prev => prev.map(test => (test.id === payload.data.id ? payload.data : test))));
    socket.on('qualityTest:deleted', (payload) =>
      setTests(prev => prev.filter(test => test.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (test) => {
    try {
      if (tests.some(t => t.id === test.id)) {
        await qualityTestService.updateTest(test.id, test);
      } else {
        await qualityTestService.createTest(test);
      }
      await loadTests();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await qualityTestService.deleteTest(selectedTest.id);
      await loadTests();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Define columns
  const columns = [
  {
    field: 'id',
    headerName: 'Test ID',
    width: 100,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'batch_id',
    headerName: 'Batch ID',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography fontWeight="medium">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'sample_id',
    headerName: 'Sample ID',
    width: 140,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'farmer_id',
    headerName: 'Farmer',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'test_date',
    headerName: 'Test Date',
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{fmtDate(params.value)}</Typography>
      </Box>
    ),
  },
  {
    field: 'test_type',
    headerName: 'Type',
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip size="small" label={params.value} />
      </Box>
    ),
  },
  {
    field: 'overall_grade',
    headerName: 'Grade',
    width: 100,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          size="small" 
          label={params.value} 
          color={getGradeColor(params.value)}
        />
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          size="small" 
          label={params.value} 
          color={getStatusColor(params.value)}
        />
      </Box>
    ),
  },
  {
    field: 'tested_by',
    headerName: 'Tested By',
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 130,
    getActions: (params) => [
      <GridActionsCellItem
        key="view"
        icon={<Visibility color="primary" />}
        label="View"
        onClick={() => { setSelectedTest(params.row); setViewOpen(true); }}
      />,
      <GridActionsCellItem
        key="edit"
        icon={<Edit color="warning" />}
        label="Edit"
        onClick={() => { setSelectedTest(params.row); setEditOpen(true); }}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Delete color="error" />}
        label="Delete"
        onClick={() => { setSelectedTest(params.row); setDeleteOpen(true); }}
      />,
    ],
  },
];


  // Statistics
  const totalTests = tests.length;
  const completedTests = tests.filter(t => t.status === 'Completed').length;
  const pendingTests = tests.filter(t => t.status === 'Pending').length;
  const failedTests = tests.filter(t => t.status === 'Failed').length;

  const StatCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        p: 1,
        borderRadius: 2,
        boxShadow: 0,
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(color, 0.08),
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <Avatar sx={{ bgcolor: alert ? theme.palette.error.main : color, mr: 1, color: '#fff' }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: alert ? theme.palette.error.main : color }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
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
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Science sx={{ fontSize: 32, color: GREEN, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: GREEN }}>
          Quality Test Records
        </Typography>
      </Box>

      {/* Alerts */}
      {(pendingTests > 0 || failedTests > 0) && (
        <Stack spacing={1} mb={2}>
          {failedTests > 0 && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {failedTests} test(s) have failed.
            </Alert>
          )}
          {pendingTests > 0 && (
            <Alert severity="warning" icon={<Schedule />}>
              {pendingTests} test(s) are pending completion.
            </Alert>
          )}
        </Stack>
      )}

      {/* Stats */}
      <Grid container spacing={2} mb={2} width={640} display={'flex'} justifyContent="flex-start">
        <Grid item xs={12} sm={4} width={160}>
          <StatCard title="Total Tests" value={totalTests} icon={<Assignment />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={4} width={160}>
          <StatCard title="Completed" value={completedTests} icon={<CheckCircle />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={4} width={160}>
          <StatCard title="Pending" value={pendingTests} icon={<Schedule />} color={GREEN} alert={pendingTests > 0} />
        </Grid>
      </Grid>

      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search quality tests…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ minWidth: 240, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Refresh">
          <IconButton onClick={loadTests}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Quality Tests Data Grid */}
      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'test_date', sort: 'desc' }],
            },
          }}
          getRowClassName={(params) => {
            if (params.row.status === 'Failed') return 'row-failed';
            if (params.row.status === 'Pending') return 'row-pending';
            return '';
          }}
          sx={{
            '& .row-failed': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
            '& .row-pending': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewQualityTestModal
        open={viewOpen}
        qualityTest={selectedTest}
        onClose={() => setViewOpen(false)}
      />
      <EditQualityTestModal
        open={editOpen}
        qualityTest={selectedTest}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedTest}
        itemType="qualityTest"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default QualityTestTable;
