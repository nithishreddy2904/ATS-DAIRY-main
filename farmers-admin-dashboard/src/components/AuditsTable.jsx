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
  Assessment,
  Schedule,
  CheckCircle,
  PlayArrow,
  Cancel,
  Update,
} from '@mui/icons-material';

import auditService from '../services/auditService';
import useSocket from '../hooks/useSocket';
import ViewAuditModal from './ViewAuditModal';
import EditAuditModal from './EditAuditModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const ORANGE = "#ff9800"; // Same as Compliance page audits tab

const AuditsTable = () => {
  const theme = useTheme();
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedAudit, setSelectedAudit] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadAudits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await auditService.getAllAudits();
      let auditsData = [];
      if (response && response.data) {
        auditsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        auditsData = response;
      }
      setAudits(auditsData);
      setFilteredAudits(auditsData);
    } catch (err) {
      console.error('Error loading audits:', err);
      setError(`Failed to load audits: ${err.message}`);
      setAudits([]);
      setFilteredAudits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = audits.filter(audit =>
        Object.values(audit).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredAudits(filtered);
    } else {
      setFilteredAudits(audits);
    }
  }, [searchText, audits]);

  useEffect(() => {
    if (!socket) return;

    socket.on('audit:created', payload => {
      setAudits(prev => [payload.data, ...prev]);
    });
    socket.on('audit:updated', payload => {
      setAudits(prev =>
        prev.map(audit => (audit.id === payload.data.id ? payload.data : audit))
      );
    });
    socket.on('audit:deleted', payload => {
      setAudits(prev => prev.filter(audit => audit.id !== payload.data.id));
    });

    return () => {
      socket.off('audit:created');
      socket.off('audit:updated');
      socket.off('audit:deleted');
    };
  }, [socket]);

  const handleView = audit => {
    setSelectedAudit(audit);
    setViewModalOpen(true);
  };

  const handleEdit = audit => {
    setSelectedAudit(audit);
    setEditModalOpen(true);
  };

  const handleDelete = audit => {
    setSelectedAudit(audit);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedAudit => {
    try {
      if (updatedAudit.id && audits.find(a => a.id === updatedAudit.id)) {
        await auditService.updateAudit(updatedAudit.id, updatedAudit);
      } else {
        await auditService.createAudit(updatedAudit);
      }
      await loadAudits();
      setEditModalOpen(false);
      setSelectedAudit(null);
    } catch (err) {
      console.error('Error saving audit:', err);
      alert('Error saving audit: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await auditService.deleteAudit(selectedAudit.id);
      await loadAudits();
      setDeleteDialogOpen(false);
      setSelectedAudit(null);
    } catch (err) {
      console.error('Error deleting audit:', err);
      alert('Error deleting audit: ' + err.message);
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

  const isOverdue = (scheduledDate, status) => {
    if (status === 'Completed' || status === 'Cancelled') return false;
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    return scheduled < today;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle />;
      case 'In Progress': return <PlayArrow />;
      case 'Scheduled': return <Schedule />;
      case 'Cancelled': return <Cancel />;
      case 'Rescheduled': return <Update />;
      default: return <Assessment />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const columns = [
  { 
    field: 'id', 
    headerName: 'Audit ID', 
    width: 100,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'audit_type', 
    headerName: 'Audit Type', 
    width: 180,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            bgcolor: alpha(ORANGE, 0.1),
            color: ORANGE,
            fontWeight: 'medium'
          }}
        />
      </Box>
    )
  },
  { 
    field: 'auditor', 
    headerName: 'Auditor', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'audit_firm', 
    headerName: 'Audit Firm', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        <Typography variant="body2">
          {params.value || 'N/A'}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'scheduled_date', 
    headerName: 'Scheduled Date', 
    width: 140,
    renderCell: params => {
      const overdue = isOverdue(params.value, params.row.status);
      return (
        <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
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
    field: 'duration', 
    headerName: 'Duration', 
    width: 100,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        <Typography variant="body2">
          {params.value ? `${params.value} days` : 'N/A'}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 130,
    renderCell: params => {
      const overdue = isOverdue(params.row.scheduled_date, params.value);
      let color = 'default';
      let displayStatus = params.value;

      if (overdue && params.value === 'Scheduled') {
        color = 'error';
        displayStatus = 'Overdue';
      } else {
        color = 
          params.value === 'Completed'   ? 'success' :
          params.value === 'Cancelled'   ? 'error' :
          params.value === 'In Progress' ? 'info' : 'warning';
      }

      return (
        <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
          <Chip 
            label={displayStatus} 
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
    field: 'score', 
    headerName: 'Score', 
    width: 100,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        {!params.value || params.value === 0 ? (
          <Typography variant="body2">N/A</Typography>
        ) : (
          <Chip 
            label={`${params.value}%`}
            size="small"
            sx={{ 
              bgcolor: alpha(getScoreColor(params.value), 0.1),
              color: getScoreColor(params.value),
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>
    )
  },
  { 
    field: 'cost', 
    headerName: 'Cost', 
    width: 120,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems:'center', height:'100%' }}>
        <Typography variant="body2" fontWeight="medium" color="success.main">
          {params.value ? `₹${Number(params.value).toLocaleString()}` : 'N/A'}
        </Typography>
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


  // StatCard component with orange accent
  const StatsCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(ORANGE, 0.08),
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
      <Avatar sx={{ bgcolor: alert ? theme.palette.error.main : ORANGE, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: alert ? theme.palette.error.main : ORANGE }}>
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
  const totalAudits = audits.length;
  const completedAudits = audits.filter(a => a.status === 'Completed').length;
  const scheduledAudits = audits.filter(a => a.status === 'Scheduled').length;
  const overdueAudits = audits.filter(a => isOverdue(a.scheduled_date, a.status)).length;
  const inProgressAudits = audits.filter(a => a.status === 'In Progress').length;

  // Calculate average score
  const scoredAudits = audits.filter(a => a.score && a.score > 0);
  const averageScore = scoredAudits.length > 0 
    ? (scoredAudits.reduce((sum, a) => sum + Number(a.score), 0) / scoredAudits.length).toFixed(1)
    : 0;

  return (
    <Box p={2}>
      {/* Orange header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Assessment sx={{ color: ORANGE, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: ORANGE, fontWeight: 600 }}>
          Audit Records
        </Typography>
      </Box>

      {/* Audit alerts */}
      {(overdueAudits > 0 || inProgressAudits > 0) && (
        <>
          {overdueAudits > 0 && (
            <Alert 
              severity="error" 
              sx={{ mb: 1 }}
              icon={<Schedule />}
            >
              <Typography variant="body2">
                {overdueAudits} audit(s) are overdue and require immediate attention.
              </Typography>
            </Alert>
          )}
          {inProgressAudits > 0 && (
            <Alert 
              severity="info" 
              sx={{ mb: 2 }}
              icon={<PlayArrow />}
            >
              <Typography variant="body2">
                {inProgressAudits} audit(s) are currently in progress.
              </Typography>
            </Alert>
          )}
        </>
      )}

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Audits"
            value={totalAudits}
            icon={<Assessment />}
            color={ORANGE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Completed"
            value={completedAudits}
            icon={<CheckCircle />}
            color={ORANGE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Scheduled"
            value={scheduledAudits}
            icon={<Schedule />}
            color={ORANGE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Avg Score"
            value={averageScore > 0 ? `${averageScore}%` : 'N/A'}
            icon={<Assessment />}
            color={ORANGE}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search audits..."
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
            <IconButton onClick={loadAudits}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredAudits}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'scheduled_date', sort: 'asc' }],
            },
          }}
          getRowClassName={(params) => {
            if (isOverdue(params.row.scheduled_date, params.row.status)) {
              return 'row-overdue';
            }
            if (params.row.status === 'In Progress') {
              return 'row-in-progress';
            }
            return '';
          }}
          sx={{
            '& .row-overdue': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
            '& .row-in-progress': {
              backgroundColor: alpha(theme.palette.info.main, 0.1),
            },
          }}
        />
      </Paper>

      <ViewAuditModal
        open={viewModalOpen}
        audit={selectedAudit}
        onClose={() => setViewModalOpen(false)}
      />
      <EditAuditModal
        open={editModalOpen}
        audit={selectedAudit}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedAudit}
        itemType="audit"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default AuditsTable;
