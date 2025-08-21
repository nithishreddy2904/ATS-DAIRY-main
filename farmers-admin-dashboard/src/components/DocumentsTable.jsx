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
  Description,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  InsertDriveFile,
  WarningAmber,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

import documentService from '../services/documentService';
import useSocket from '../hooks/useSocket';
import ViewDocumentModal from './ViewDocumentModal';
import EditDocumentModal from './EditDocumentModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const PURPLE = '#9c27b0';

// Helper function to format date string to readable format
const fmtDate = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }) : '';

const isExpired = (doc) => doc.expiry_date && new Date(doc.expiry_date) < new Date();

const isExpiringSoon = (doc) => {
  if (!doc.expiry_date) return false;
  const diff = (new Date(doc.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 30;
};

const DocumentsTable = () => {
  const theme = useTheme();

  const [docs, setDocs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load documents from API
  const loadDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await documentService.getAllDocuments();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setDocs(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load documents:', e);
      setError(`Failed to load documents: ${e.message}`);
      setDocs([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  // Filter documents based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(docs);
      return;
    }
    const lower = searchText.toLowerCase();
    setFiltered(docs.filter(doc =>
      Object.values(doc).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, docs]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('document:created', (payload) => setDocs(prev => [payload.data, ...prev]));
    socket.on('document:updated', (payload) =>
      setDocs(prev => prev.map(doc => (doc.id === payload.data.id ? payload.data : doc))));
    socket.on('document:deleted', (payload) =>
      setDocs(prev => prev.filter(doc => doc.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (doc) => {
    try {
      if (docs.some(d => d.id === doc.id)) {
        await documentService.updateDocument(doc.id, doc);
      } else {
        await documentService.createDocument(doc);
      }
      await loadDocs();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await documentService.deleteDocument(selectedDoc.id);
      await loadDocs();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Define columns
  const columns = [
  {
    field: 'id',
    headerName: 'Doc ID',
    width: 100,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'name',
    headerName: 'Document Name',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography fontWeight="medium">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 110,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip size="small" label={params.value} />
      </Box>
    ),
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'version',
    headerName: 'Ver.',
    width: 80,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value || '-'}</Typography>
      </Box>
    ),
  },
  {
    field: 'upload_date',
    headerName: 'Uploaded',
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{fmtDate(params.value)}</Typography>
      </Box>
    ),
  },
  {
    field: 'uploaded_by',
    headerName: 'Uploaded By',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'expiry_date',
    headerName: 'Expiry',
    width: 130,
    renderCell: (params) => {
      const row = params.row;
      if (!row.expiry_date) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip label="None" color="success" size="small" icon={<CheckCircle fontSize="small" />} />
          </Box>
        );
      }
      const label = fmtDate(row.expiry_date);
      if (isExpired(row)) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip label={label} color="error" size="small" icon={<ErrorIcon fontSize="small" />} />
          </Box>
        );
      }
      if (isExpiringSoon(row)) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip label={label} color="warning" size="small" icon={<WarningAmber fontSize="small" />} />
          </Box>
        );
      }
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip label={label} size="small" />
        </Box>
      );
    },
  },
  {
    field: 'size',
    headerName: 'Size',
    width: 90,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip size="small" label={params.value} />
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
        onClick={() => { setSelectedDoc(params.row); setViewOpen(true); }}
      />,
      <GridActionsCellItem
        key="edit"
        icon={<Edit color="warning" />}
        label="Edit"
        onClick={() => { setSelectedDoc(params.row); setEditOpen(true); }}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Delete color="error" />}
        label="Delete"
        onClick={() => { setSelectedDoc(params.row); setDeleteOpen(true); }}
      />,
    ],
  },
];


  const totalDocs = docs.length;
  const expiredDocs = docs.filter(isExpired).length;
  const expiringDocs = docs.filter(isExpiringSoon).length;

  const StatCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        p: 1,
        borderRadius: 2,
        boxShadow: 0,
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(color, 0.08),
        width: 170,
        display: 'flex',
        alignItems: 'center',
        p: 1,
        height: 100,
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
        <Description sx={{ fontSize: 32, color: PURPLE, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: PURPLE }}>
          Document Library
        </Typography>
      </Box>

      {/* Alerts */}
      {(expiredDocs > 0 || expiringDocs > 0) && (
        <Stack spacing={1} mb={2}>
          {expiredDocs > 0 && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {expiredDocs} document(s) have expired.
            </Alert>
          )}
          {expiringDocs > 0 && (
            <Alert severity="warning" icon={<WarningAmber />}>
              {expiringDocs} document(s) will expire within 30 days.
            </Alert>
          )}
        </Stack>
      )}

      {/* Stats */}
      <Grid
  container
  spacing={2}
  mb={2}
  width={640}
  display={'flex'}
  justifyContent="flex-start"
>
  <Grid item xs={12} sm={4}>
    <StatCard
      title="Total Docs"
      value={totalDocs}
      icon={<InsertDriveFile />}
      color={PURPLE}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <StatCard
      title="Expiring ≤30d"
      value={expiringDocs}
      icon={<WarningAmber />}
      color={PURPLE}
      alert={expiringDocs > 0}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <StatCard
      title="Expired"
      value={expiredDocs}
      icon={<ErrorIcon />}
      color={PURPLE}
      alert={expiredDocs > 0}
    />
  </Grid>
</Grid>


      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search documents…"
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
          <IconButton onClick={loadDocs}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Documents Data Grid */}
      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'upload_date', sort: 'desc' }],
            },
          }}
          getRowClassName={(params) => {
            if (isExpired(params.row)) return 'row-expired';
            if (isExpiringSoon(params.row)) return 'row-expiring';
            return '';
          }}
          sx={{
            '& .row-expired': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
            '& .row-expiring': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewDocumentModal
        open={viewOpen}
        document={selectedDoc}
        onClose={() => setViewOpen(false)}
      />
      <EditDocumentModal
        open={editOpen}
        document={selectedDoc}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedDoc}
        itemType="document"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default DocumentsTable;
