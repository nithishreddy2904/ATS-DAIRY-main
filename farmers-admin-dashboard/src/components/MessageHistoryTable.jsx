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
  Message as MessageIcon,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Send,
  MarkEmailRead,
  MarkEmailUnread,
  Schedule,
  CheckCircle,
  Error as ErrorIcon,
  PriorityHigh,
} from '@mui/icons-material';

import messageService from '../services/messageService';
import useSocket from '../hooks/useSocket';
import ViewMessageModal from './ViewMessageModal';
import EditMessageModal from './EditMessageModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const BLUE = '#2196f3';

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
    case 'Read': return 'success';
    case 'Delivered': return 'info';
    case 'Sent': return 'warning';
    case 'Failed': return 'error';
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

const MessageHistoryTable = () => {
  const theme = useTheme();

  const [messages, setMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load messages from API
  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await messageService.getAllMessages();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMessages(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load messages:', e);
      setError(`Failed to load messages: ${e.message}`);
      setMessages([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Filter messages based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(messages);
      return;
    }
    const lower = searchText.toLowerCase();
    setFiltered(messages.filter(message =>
      Object.values(message).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, messages]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('message:created', (payload) => setMessages(prev => [payload.data, ...prev]));
    socket.on('message:updated', (payload) =>
      setMessages(prev => prev.map(message => (message.id === payload.data.id ? payload.data : message))));
    socket.on('message:deleted', (payload) =>
      setMessages(prev => prev.filter(message => message.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (message) => {
    try {
      if (messages.some(m => m.id === message.id)) {
        await messageService.updateMessage(message.id, message);
      } else {
        await messageService.createMessage(message);
      }
      await loadMessages();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await messageService.deleteMessage(selectedMessage.id);
      await loadMessages();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Status update handler
// Enhanced Status update handler with better error handling
const handleStatusUpdate = async (messageId, newStatus) => {
  try {
    console.log(`Attempting to update message ${messageId} to status ${newStatus}`);
    setLoading(true);
    
    const response = await messageService.updateMessageStatus(messageId, newStatus);
    console.log('Status update response:', response);
    
    // Refresh messages
    await loadMessages();
    
    // Optional: Show success message
    console.log(`Message ${messageId} successfully marked as ${newStatus}`);
    
  } catch (err) {
    console.error('Status update failed:', err);
    
    // More specific error messages
    if (err.message.includes('CORS')) {
      alert('CORS Error: Please check if your backend server allows PATCH requests.');
    } else if (err.message.includes('Network Error')) {
      alert('Network Error: Please check if your backend server is running on http://localhost:5000');
    } else if (err.message.includes('404')) {
      alert('Message not found. It may have been deleted.');
    } else {
      alert('Error updating status: ' + err.message);
    }
  } finally {
    setLoading(false);
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
    field: 'farmer_id',
    headerName: 'Farmer ID',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography fontFamily="monospace" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'subject',
    headerName: 'Subject',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
        <Typography fontWeight="medium" noWrap>
          {params.value}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap fontSize="0.75rem">
          {params.row.message}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'timestamp',
    headerName: 'Time',
    width: 170,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body2">{fmtDateTime(params.value)}</Typography>
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
          icon={
            params.value === 'Read' ? <MarkEmailRead fontSize="small" /> :
            params.value === 'Failed' ? <ErrorIcon fontSize="small" /> :
            <MarkEmailUnread fontSize="small" />
          }
        />
      </Box>
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 200,
    getActions: (params) => {
      const actions = [
        <GridActionsCellItem
          key="view"
          icon={<Visibility color="primary" />}
          label="View"
          onClick={() => { setSelectedMessage(params.row); setViewOpen(true); }}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit color="warning" />}
          label="Edit"
          onClick={() => { setSelectedMessage(params.row); setEditOpen(true); }}
        />
      ];

      if (params.row.status !== 'Read') {
        actions.push(
          <GridActionsCellItem
            key="mark-read"
            icon={<MarkEmailRead color="success" />}
            label="Mark as Read"
            onClick={() => handleStatusUpdate(params.row.id, 'Read')}
          />
        );
      }

      if (params.row.status === 'Sent') {
        actions.push(
          <GridActionsCellItem
            key="mark-delivered"
            icon={<Send color="info" />}
            label="Mark as Delivered"
            onClick={() => handleStatusUpdate(params.row.id, 'Delivered')}
          />
        );
      }

      actions.push(
        <GridActionsCellItem
          key="delete"
          icon={<Delete color="error" />}
          label="Delete"
          onClick={() => { setSelectedMessage(params.row); setDeleteOpen(true); }}
        />
      );

      return actions;
    },
  },
];


  // Statistics
  const totalMessages = messages.length;
  const readMessages = messages.filter(m => m.status === 'Read').length;
  const pendingMessages = messages.filter(m => m.status === 'Sent' || m.status === 'Delivered').length;
  const failedMessages = messages.filter(m => m.status === 'Failed').length;

  const StatCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        p: 1,
        borderRadius: 2,
        boxShadow: 0,
        width:168,
        height:100,
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
        <MessageIcon sx={{ fontSize: 32, color: BLUE, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: BLUE }}>
          Message History
        </Typography>
      </Box>

      {/* Alerts */}
      {(pendingMessages > 0 || failedMessages > 0) && (
        <Stack spacing={1} mb={2}>
          {failedMessages > 0 && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {failedMessages} message(s) failed to deliver.
            </Alert>
          )}
          {pendingMessages > 0 && (
            <Alert severity="warning" icon={<Schedule />}>
              {pendingMessages} message(s) are pending acknowledgment.
            </Alert>
          )}
        </Stack>
      )}

      {/* Stats */}
      <Grid container spacing={2} mb={2} width={720} display={'flex'} justifyContent="flex-start">
        <Grid item xs={12} sm={3}>
          <StatCard title="Total Messages" value={totalMessages} icon={<MessageIcon />} color={BLUE} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatCard title="Read Messages" value={readMessages} icon={<MarkEmailRead />} color={BLUE} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatCard title="Pending" value={pendingMessages} icon={<Schedule />} color={BLUE} alert={pendingMessages > 0} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatCard title="Failed" value={failedMessages} icon={<ErrorIcon />} color={BLUE} alert={failedMessages > 0} />
        </Grid>
      </Grid>

      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search messages…"
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
          <IconButton onClick={loadMessages}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Messages Data Grid */}
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
          getRowClassName={(params) => {
            if (params.row.status === 'Failed') return 'row-failed';
            if (params.row.status === 'Sent' || params.row.status === 'Delivered') return 'row-pending';
            return '';
          }}
          sx={{
            '& .row-failed': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
            '& .row-pending': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewMessageModal
        open={viewOpen}
        message={selectedMessage}
        onClose={() => setViewOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
      <EditMessageModal
        open={editOpen}
        message={selectedMessage}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedMessage}
        itemType="message"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default MessageHistoryTable;
