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
  Rating,
} from '@mui/material';
import {
  Agriculture,
  Reply,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Feedback,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
  PriorityHigh,
  Assignment,
} from '@mui/icons-material';

import farmerFeedbackService from '../services/farmerFeedbackService';
import useSocket from '../hooks/useSocket';
import ViewFarmerFeedbackModal from './ViewFarmerFeedbackModal';
import EditFarmerFeedbackModal from './EditFarmerFeedbackModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const GREEN = '#4caf50';

const fmtDate = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }) : '';

const getFeedbackTypeColor = (type) => {
  switch (type) {
    case 'Compliment': return 'success';
    case 'Suggestion': return 'info';
    case 'Complaint': return 'warning';
    case 'Quality Issue': return 'error';
    case 'Service Request': return 'primary';
    default: return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Open': return 'info';
    case 'In Review': return 'warning';
    case 'Resolved': return 'success';
    case 'Closed': return 'default';
    default: return 'default';
  }
};

const FarmerFeedbackTable = () => {
  const theme = useTheme();

  const [feedback, setFeedback] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load farmer feedback from API
  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await farmerFeedbackService.getAllFeedback();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setFeedback(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load farmer feedback:', e);
      setError(`Failed to load farmer feedback: ${e.message}`);
      setFeedback([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  // Filter feedback based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(feedback);
      return;
    }
    const lower = searchText.toLowerCase();
    setFiltered(feedback.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, feedback]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('farmerFeedback:created', (payload) => setFeedback(prev => [payload.data, ...prev]));
    socket.on('farmerFeedback:updated', (payload) =>
      setFeedback(prev => prev.map(item => (item.id === payload.data.id ? payload.data : item))));
    socket.on('farmerFeedback:deleted', (payload) =>
      setFeedback(prev => prev.filter(item => item.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (feedbackData) => {
    try {
      if (feedback.some(f => f.id === feedbackData.id)) {
        await farmerFeedbackService.updateFeedback(feedbackData.id, feedbackData);
      } else {
        await farmerFeedbackService.createFeedback(feedbackData);
      }
      await loadFeedback();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await farmerFeedbackService.deleteFeedback(selectedFeedback.id);
      await loadFeedback();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Define columns
const columns = [
  {
    field: 'id',
    headerName: 'Feedback ID',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'farmer_name',
    headerName: 'Farmer',
    width: 150,
    renderCell: (params) => (
      <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
        <Typography fontWeight="medium">{params.value}</Typography>
        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
          ID: {params.row.farmer_id}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'feedback_type',
    headerName: 'Type',
    width: 140,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip size="small" label={params.value} color={getFeedbackTypeColor(params.value)} />
      </Box>
    ),
  },
  {
    field: 'rating',
    headerName: 'Rating',
    width: 150,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Rating value={params.value} readOnly size="small" />
        <Typography variant="body2" sx={{ ml: 1 }}>({params.value})</Typography>
      </Box>
    ),
  },
  {
    field: 'message',
    headerName: 'Message',
    flex: 1,
    minWidth: 140,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body2" noWrap>{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 100,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip size="small" label={params.value} color={getPriorityColor(params.value)} />
      </Box>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body2">{fmtDate(params.value)}</Typography>
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip size="small" label={params.value} color={getStatusColor(params.value)} />
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
        onClick={() => { setSelectedFeedback(params.row); setViewOpen(true); }}
      />,
      <GridActionsCellItem
        key="edit"
        icon={<Edit color="warning" />}
        label="Edit"
        onClick={() => { setSelectedFeedback(params.row); setEditOpen(true); }}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Delete color="error" />}
        label="Delete"
        onClick={() => { setSelectedFeedback(params.row); setDeleteOpen(true); }}
      />,
    ],
  },
];



  // Statistics
  const totalFeedback = feedback.length;
  const openFeedback = feedback.filter(f => f.status === 'Open').length;
  const resolvedFeedback = feedback.filter(f => f.status === 'Resolved').length;
  const highPriority = feedback.filter(f => f.priority === 'High').length;
  const avgRating = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;

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
        <Agriculture sx={{ fontSize: 32, color: GREEN, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: GREEN }}>
          Farmer Feedback
        </Typography>
      </Box>

      {/* Alerts */}
      {(openFeedback > 0 || highPriority > 0) && (
        <Stack spacing={1} mb={2}>
          {highPriority > 0 && (
            <Alert severity="error" icon={<PriorityHigh />}>
              {highPriority} high priority feedback(s) require immediate attention.
            </Alert>
          )}
          {openFeedback > 0 && (
            <Alert severity="warning" icon={<Schedule />}>
              {openFeedback} feedback(s) are still open.
            </Alert>
          )}
        </Stack>
      )}

      {/* Stats */}
      <Grid container spacing={2} mb={2} width={900} display={'flex'} justifyContent="flex-start">
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Total Feedback" value={totalFeedback} icon={<Feedback />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Avg Rating" value={avgRating.toFixed(1)} icon={<Assignment />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Open" value={openFeedback} icon={<Schedule />} color={GREEN} alert={openFeedback > 0} />
        </Grid>
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Resolved" value={resolvedFeedback} icon={<CheckCircle />} color={GREEN} />
        </Grid>
      </Grid>

      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search farmer feedback…"
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
          <IconButton onClick={loadFeedback}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Farmer Feedback Data Grid */}
      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
          }}
          getRowClassName={(params) => {
            if (params.row.priority === 'High') return 'row-high-priority';
            if (params.row.status === 'Open') return 'row-open';
            return '';
          }}
          sx={{
            '& .row-high-priority': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
            '& .row-open': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewFarmerFeedbackModal
        open={viewOpen}
        feedback={selectedFeedback}
        onClose={() => setViewOpen(false)}
      />
      <EditFarmerFeedbackModal
        open={editOpen}
        feedback={selectedFeedback}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedFeedback}
        itemType="farmerFeedback"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default FarmerFeedbackTable;
