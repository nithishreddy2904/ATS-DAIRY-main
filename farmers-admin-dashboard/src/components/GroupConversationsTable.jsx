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
  Group as GroupIcon,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  People,
  Message,
  Send,
  Person,
  AccessTime,
} from '@mui/icons-material';

import groupMessageService from '../services/groupMessageService';
import useSocket from '../hooks/useSocket';
import ViewGroupMessageModal from './ViewGroupMessageModal';
import EditGroupMessageModal from './EditGroupMessageModal';
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

const GroupConversationsTable = () => {
  const theme = useTheme();

  const [groupMessages, setGroupMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedGroupMessage, setSelectedGroupMessage] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load group messages from API
  const loadGroupMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await groupMessageService.getAllGroupMessages();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setGroupMessages(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load group messages:', e);
      setError(`Failed to load group messages: ${e.message}`);
      setGroupMessages([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupMessages();
  }, []);

  // Filter group messages based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(groupMessages);
      return;
    }

    const lower = searchText.toLowerCase();
    setFiltered(groupMessages.filter(message =>
      Object.values(message).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, groupMessages]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('groupMessage:created', (payload) => setGroupMessages(prev => [payload.data, ...prev]));
    socket.on('groupMessage:updated', (payload) =>
      setGroupMessages(prev => prev.map(item => (item.id === payload.data.id ? payload.data : item))));
    socket.on('groupMessage:deleted', (payload) =>
      setGroupMessages(prev => prev.filter(item => item.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (messageData) => {
    try {
      if (groupMessages.some(m => m.id === messageData.id)) {
        await groupMessageService.updateGroupMessage(messageData.id, messageData);
      } else {
        await groupMessageService.createGroupMessage(messageData);
      }
      await loadGroupMessages();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await groupMessageService.deleteGroupMessage(selectedGroupMessage.id);
      await loadGroupMessages();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Define columns
  const columns = [
  {
    field: 'id',
    headerName: 'Message ID',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'group_name',
    headerName: 'Group Name',
    width: 160,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" gap={1} height="100%">
        <GroupIcon fontSize="small" color="primary" />
        <Typography fontWeight="medium">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'sender_name',
    headerName: 'Sender',
    width: 140,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" gap={1} height="100%">
        <Person fontSize="small" color="action" />
        <Typography>{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'message',
    headerName: 'Message',
    flex: 1,
    minWidth: 170,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%" sx={{ maxWidth: '100%' }}>
        <Typography
          noWrap
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'member_count',
    headerName: 'Members',
    width: 100,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Chip
          size="small"
          label={params.value || 0}
          color="primary"
          icon={<People fontSize="small" />}
        />
      </Box>
    ),
  },
  {
    field: 'timestamp',
    headerName: 'Time',
    width: 200,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" gap={1} height="100%">
        <AccessTime fontSize="small" color="action" />
        <Typography variant="body2">{fmtDateTime(params.value)}</Typography>
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
        key="view"
        icon={<Visibility color="primary" />}
        label="View"
        onClick={() => { setSelectedGroupMessage(params.row); setViewOpen(true); }}
      />,
      <GridActionsCellItem
        key="edit"
        icon={<Edit color="warning" />}
        label="Edit"
        onClick={() => { setSelectedGroupMessage(params.row); setEditOpen(true); }}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Delete color="error" />}
        label="Delete"
        onClick={() => { setSelectedGroupMessage(params.row); setDeleteOpen(true); }}
      />,
    ],
  },
];


  // Statistics
  const totalMessages = groupMessages.length;
  const uniqueGroups = [...new Set(groupMessages.map(m => m.group_name))].length;
  const recentMessages = groupMessages.filter(m => {
    const messageDate = new Date(m.timestamp);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return messageDate >= sevenDaysAgo;
  }).length;
  const totalMembers = groupMessages.reduce((sum, m) => sum + (m.member_count || 0), 0);

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
        <GroupIcon sx={{ fontSize: 32, color: GREEN, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: GREEN }}>
          Group Conversations
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={2} width={1700} display={'flex'} justifyContent="flex-start">
        <Grid item xs={12} sm={3}  width={170} >
          <StatCard title="Total Messages" value={totalMessages} icon={<Message />} color={GREEN}  />
        </Grid>
        <Grid item xs={12} sm={3} width={170}>
          <StatCard title="Active Groups" value={uniqueGroups} icon={<GroupIcon />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={3} width={170}>
          <StatCard title="Recent Messages" value={recentMessages} icon={<Send />} color={GREEN} />
        </Grid>
        <Grid item xs={12} sm={3} width={170}>
          <StatCard title="Total Members" value={totalMembers} icon={<People />} color={GREEN} />
        </Grid>
      </Grid>

      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search group messages…"
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
          <IconButton onClick={loadGroupMessages}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Group Messages Data Grid */}
      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'timestamp', sort: 'desc' }],
            },
          }}
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: alpha(GREEN, 0.08),
            },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewGroupMessageModal
        open={viewOpen}
        groupMessage={selectedGroupMessage}
        onClose={() => setViewOpen(false)}
      />
      <EditGroupMessageModal
        open={editOpen}
        groupMessage={selectedGroupMessage}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedGroupMessage}
        itemType="message"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default GroupConversationsTable;
