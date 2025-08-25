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
  Announcement as AnnouncementIcon,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  TrendingUp,
  Schedule,
  CheckCircle,
  Error as ErrorIcon,
  PriorityHigh,
  Publish,
  Drafts,
  Archive,
} from '@mui/icons-material';

import announcementService from '../services/announcementService';
import useSocket from '../hooks/useSocket';
import ViewAnnouncementModal from './ViewAnnouncementModal';
import EditAnnouncementModal from './EditAnnouncementModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const GREEN = '#4caf50';

const fmtDateTime = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : '';

const getStatusColor = (status) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Draft': return 'warning';
    case 'Archived': return 'default';
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

const getStatusIcon = (status) => {
  switch (status) {
    case 'Published': return <Publish fontSize="small" />;
    case 'Draft': return <Drafts fontSize="small" />;
    case 'Archived': return <Archive fontSize="small" />;
    default: return <AnnouncementIcon fontSize="small" />;
  }
};

const AnnouncementHistoryTable = () => {
  const theme = useTheme();

  const [announcements, setAnnouncements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load announcements from API
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await announcementService.getAllAnnouncements();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setAnnouncements(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load announcements:', e);
      setError(`Failed to load announcements: ${e.message}`);
      setAnnouncements([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Filter announcements based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(announcements);
      return;
    }

    const lower = searchText.toLowerCase();
    setFiltered(announcements.filter(announcement =>
      Object.values(announcement).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, announcements]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('announcement:created', (payload) => setAnnouncements(prev => [payload.data, ...prev]));
    socket.on('announcement:updated', (payload) =>
      setAnnouncements(prev => prev.map(item => (item.id === payload.data.id ? payload.data : item))));
    socket.on('announcement:deleted', (payload) =>
      setAnnouncements(prev => prev.filter(item => item.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (announcementData) => {
    try {
      if (announcements.some(a => a.id === announcementData.id)) {
        await announcementService.updateAnnouncement(announcementData.id, announcementData);
      } else {
        await announcementService.createAnnouncement(announcementData);
      }
      await loadAnnouncements();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await announcementService.deleteAnnouncement(selectedAnnouncement.id);
      await loadAnnouncements();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Define columns
  const columns = [
  {
    field: 'id',
    headerName: 'Announcement ID',
    width: 140,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 140,
    renderCell: (params) => (
      <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
        <Typography fontWeight="medium" noWrap>
          {params.value}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap fontSize="0.75rem">
          {params.row.content && params.row.content.substring(0, 50)}...
        </Typography>
      </Box>
    ),
  },
  {
    field: 'target_audience',
    headerName: 'Audience',
    width: 130,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip
          size="small"
          label={params.value}
          color="primary"
          variant="outlined"
        />
      </Box>
    ),
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 100,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip
          size="small"
          label={params.value}
          color={getPriorityColor(params.value)}
          icon={params.value === 'High' ? <PriorityHigh fontSize="small" /> : undefined}
        />
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip
          size="small"
          label={params.value}
          color={getStatusColor(params.value)}
          icon={getStatusIcon(params.value)}
        />
      </Box>
    ),
  },
  {
    field: 'views',
    headerName: 'Views',
    width: 80,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" gap={0.5} height="100%">
        <TrendingUp fontSize="small" color="action" />
        <Typography variant="body2" fontWeight="600">
          {params.value || 0}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'publish_date',
    headerName: 'Date',
    width: 170,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body2">{fmtDateTime(params.value)}</Typography>
      </Box>
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 140,
    getActions: (params) => [
      <GridActionsCellItem
        key="view"
        icon={<Visibility color="primary" />}
        label="View"
        onClick={() => { setSelectedAnnouncement(params.row); setViewOpen(true); }}
      />,
      <GridActionsCellItem
        key="edit"
        icon={<Edit color="warning" />}
        label="Edit"
        onClick={() => { setSelectedAnnouncement(params.row); setEditOpen(true); }}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Delete color="error" />}
        label="Delete"
        onClick={() => { setSelectedAnnouncement(params.row); setDeleteOpen(true); }}
      />,
    ],
  },
];


  // Statistics
  const totalAnnouncements = announcements.length;
  const publishedAnnouncements = announcements.filter(a => a.status === 'Published').length;
  const draftAnnouncements = announcements.filter(a => a.status === 'Draft').length;
  const archivedAnnouncements = announcements.filter(a => a.status === 'Archived').length;
  const totalViews = announcements.reduce((sum, a) => sum + (a.views || 0), 0);

  const StatCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        p: 1,
        borderRadius: 2,
        boxShadow: 0,
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(color, 0.08),
        maxWidth: 160,
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
        <AnnouncementIcon sx={{ fontSize: 32, color: GREEN, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: GREEN }}>
          Announcement History
        </Typography>
      </Box>

      {/* Alerts */}
      {(draftAnnouncements > 0) && (
        <Alert severity="info" icon={<Schedule />} sx={{ mb: 2 }}>
          {draftAnnouncements > 0 && (
            <>
              {draftAnnouncements} announcement(s) are in draft status.
            </>
          )}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={2} mb={2} width={1000} display={'flex'} justifyContent="flex-start">
        <Grid item xs={12} sm={2.4} width={160} >
          <StatCard title="Announcements" value={totalAnnouncements} icon={<AnnouncementIcon />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={2.4} width={165}>
          <StatCard title="Published" value={publishedAnnouncements} icon={<Publish />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={2.4} width={165}>
          <StatCard title="Drafts" value={draftAnnouncements} icon={<Drafts />} color={GREEN} alert={draftAnnouncements > 0} />
        </Grid>
        <Grid item xs={12} sm={2.4} width={165}>
          <StatCard title="Archived" value={archivedAnnouncements} icon={<Archive />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={2.4} width={165}>
          <StatCard title="Total Views" value={totalViews} icon={<TrendingUp />} color={GREEN} />
        </Grid>
      </Grid>

      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search announcements…"
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
          <IconButton onClick={loadAnnouncements}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Announcements Data Grid */}
      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'publish_date', sort: 'desc' }],
            },
          }}
          getRowClassName={(params) => {
            if (params.row.status === 'Draft') return 'row-draft';
            if (params.row.status === 'Archived') return 'row-archived';
            return '';
          }}
          sx={{
            '& .row-draft': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
            '& .row-archived': { backgroundColor: alpha(theme.palette.grey[500], 0.1) },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewAnnouncementModal
        open={viewOpen}
        announcement={selectedAnnouncement}
        onClose={() => setViewOpen(false)}
      />
      <EditAnnouncementModal
        open={editOpen}
        announcement={selectedAnnouncement}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedAnnouncement}
        itemType="announcement"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default AnnouncementHistoryTable;
