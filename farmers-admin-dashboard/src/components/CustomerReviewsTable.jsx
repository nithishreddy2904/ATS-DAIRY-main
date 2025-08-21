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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Star,
  Visibility,
  Edit,
  Delete,
  Search,
  Refresh,
  Reply,
  FeedbackOutlined,
  ThumbUp,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
  Send,
} from '@mui/icons-material';

import reviewService from '../services/reviewService';
import useSocket from '../hooks/useSocket';
import ViewCustomerReviewModal from './ViewCustomerReviewModal';
import EditCustomerReviewModal from './EditCustomerReviewModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const BLUE = '#2196f3';

const fmtDate = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }) : '';

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return 'info';
    case 'In Progress': return 'warning';
    case 'Responded': return 'success';
    case 'Resolved': return 'success';
    case 'Escalated': return 'error';
    default: return 'default';
  }
};

const CustomerReviewsTable = () => {
  const theme = useTheme();

  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedReview, setSelectedReview] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Response Dialog State
  const [responseDialog, setResponseDialog] = useState({
    open: false,
    reviewId: '',
    customerName: '',
    subject: '',
    response: '',
    loading: false
  });

  // Load reviews from API
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reviewService.getAllReviews();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setReviews(list);
      setFiltered(list);
    } catch (e) {
      console.error('Failed to load reviews:', e);
      setError(`Failed to load reviews: ${e.message}`);
      setReviews([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews based on search text
  useEffect(() => {
    if (!searchText) {
      setFiltered(reviews);
      return;
    }
    const lower = searchText.toLowerCase();
    setFiltered(reviews.filter(review =>
      Object.values(review).some(value =>
        value && value.toString().toLowerCase().includes(lower)
      )
    ));
  }, [searchText, reviews]);

  // Setup socket for real-time sync
  const socket = useSocket('http://localhost:5000');
  useEffect(() => {
    if (!socket) return;
    socket.on('review:created', (payload) => setReviews(prev => [payload.data, ...prev]));
    socket.on('review:updated', (payload) =>
      setReviews(prev => prev.map(review => (review.id === payload.data.id ? payload.data : review))));
    socket.on('review:deleted', (payload) =>
      setReviews(prev => prev.filter(review => review.id !== payload.data.id)));
    return () => socket.offAny();
  }, [socket]);

  // CRUD Handlers
  const handleSave = async (review) => {
    try {
      if (reviews.some(r => r.id === review.id)) {
        await reviewService.updateReview(review.id, review);
      } else {
        await reviewService.createReview(review);
      }
      await loadReviews();
      setEditOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await reviewService.deleteReview(selectedReview.id);
      await loadReviews();
      setDeleteOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Response Handlers
  const handleOpenResponse = (review) => {
    setResponseDialog({
      open: true,
      reviewId: review.id,
      customerName: review.customer_name,
      subject: review.subject,
      response: review.response || '',
      loading: false
    });
  };

  const handleCloseResponse = () => {
    setResponseDialog({
      open: false,
      reviewId: '',
      customerName: '',
      subject: '',
      response: '',
      loading: false
    });
  };

  const handleResponseChange = (e) => {
    setResponseDialog({
      ...responseDialog,
      response: e.target.value
    });
  };

  const handleSaveResponse = async () => {
    if (!responseDialog.response.trim()) {
      alert('Please enter a response');
      return;
    }

    setResponseDialog({ ...responseDialog, loading: true });

    try {
      const reviewToUpdate = reviews.find(r => r.id === responseDialog.reviewId);
      if (!reviewToUpdate) {
        throw new Error('Review not found');
      }

      const updatedReview = {
        ...reviewToUpdate,
        response: responseDialog.response,
        response_date: new Date().toISOString().split('T')[0],
        status: reviewToUpdate.status === 'New' ? 'Responded' : reviewToUpdate.status
      };

      await reviewService.updateReview(responseDialog.reviewId, updatedReview);
      await loadReviews();
      handleCloseResponse();
    } catch (err) {
      console.error('Error saving response:', err);
      alert('Error saving response: ' + err.message);
    } finally {
      setResponseDialog({ ...responseDialog, loading: false });
    }
  };

  // Define columns
  const columns = [
  {
    field: 'id',
    headerName: 'Test ID',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography fontFamily="monospace">{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'customer_name',
    headerName: 'Customer',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{params.value}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>{params.row.customer_email}</Typography>
      </Box>
    ),
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 140,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip size="small" label={params.value} />
      </Box>
    ),
  },
  {
    field: 'rating',
    headerName: 'Rating',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Rating value={params.value} readOnly size="small" />
        <Typography variant="body2" sx={{ ml: 1 }}>{`(${params.value})`}</Typography>
      </Box>
    ),
  },
  {
    field: 'subject',
    headerName: 'Subject',
    flex: 1,
    minWidth: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body1" noWrap>{params.value}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>{params.row.comment}</Typography>
      </Box>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {fmtDate(params.value)}
      </Box>
    ),
  },
  {
    field: 'response_date',
    headerName: 'Response Date',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {fmtDate(params.value)}
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip size="small" label={params.value} color={getStatusColor(params.value)} />
      </Box>
    ),
  },
  {
    field: 'response',
    headerName: 'Response',
    width: 100,
    renderCell: (params) =>
      params.value ? (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip size="small" label="Replied" color="success" icon={<Reply fontSize="small" />} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip size="small" label="No Reply" color="default" />
        </Box>
      ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    width: 160,
    getActions: (params) => [
      <GridActionsCellItem key="view" icon={<Visibility color="primary" />} label="View" onClick={() => { setSelectedReview(params.row); setViewOpen(true); }} />,
      <GridActionsCellItem key="response" icon={<Reply color="info" />} label="Response" onClick={() => handleOpenResponse(params.row)} />,
      <GridActionsCellItem key="edit" icon={<Edit color="warning" />} label="Edit" onClick={() => { setSelectedReview(params.row); setEditOpen(true); }} />,
      <GridActionsCellItem key="delete" icon={<Delete color="error" />} label="Delete" onClick={() => { setSelectedReview(params.row); setDeleteOpen(true); }} />,
    ],
  },
];


  // Statistics
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const pendingReviews = reviews.filter(r => r.status === 'New' || r.status === 'In Progress').length;
  const resolvedReviews = reviews.filter(r => r.status === 'Responded' || r.status === 'Resolved').length;

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
        <Star sx={{ fontSize: 32, color: BLUE, mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: BLUE }}>
          Customer Reviews
        </Typography>
      </Box>

      {/* Alerts */}
      {pendingReviews > 0 && (
        <Stack spacing={1} mb={2}>
          <Alert severity="warning" icon={<Schedule />}>
            {pendingReviews} review(s) are pending response.
          </Alert>
        </Stack>
      )}

      {/* Stats */}
      <Grid container spacing={2} mb={2} width={900} display={'flex'} justifyContent="flex-start">
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Total Reviews" value={totalReviews} icon={<FeedbackOutlined />} color={BLUE} />
        </Grid>
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Avg Rating" value={avgRating.toFixed(1)} icon={<Star />} color={BLUE} />
        </Grid>
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Pending" value={pendingReviews} icon={<Schedule />} color={BLUE} alert={pendingReviews > 0} />
        </Grid>
        <Grid item xs={12} sm={3} width={180}>
          <StatCard title="Resolved" value={resolvedReviews} icon={<CheckCircle />} color={BLUE} />
        </Grid>
      </Grid>

      {/* Search & Refresh Toolbar */}
      <Box display="flex" gap={1} flexWrap="wrap"  mb={2}>
        <TextField
          size="small"
          placeholder="Search customer reviews…"
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
          <IconButton onClick={loadReviews}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Reviews Data Grid */}
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
            if (params.row.status === 'Escalated') return 'row-escalated';
            if (params.row.status === 'New' || params.row.status === 'In Progress') return 'row-pending';
            return '';
          }}
          sx={{
            '& .row-escalated': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
            '& .row-pending': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
          }}
        />
      </Paper>

      {/* Response Dialog */}
      <Dialog 
        open={responseDialog.open} 
        onClose={handleCloseResponse} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'primary.main', 
          color: 'white' 
        }}>
          <Reply />
          Respond to Review
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Customer: {responseDialog.customerName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Subject: {responseDialog.subject}
            </Typography>
          </Box>
          
          <TextField
            label="Your Response"
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            value={responseDialog.response}
            onChange={handleResponseChange}
            placeholder="Write your professional response to the customer..."
            helperText="This response will be sent to the customer and marked as 'Responded'"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseResponse} 
            variant="outlined" 
            sx={{ borderRadius: 2 }}
            disabled={responseDialog.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveResponse} 
            variant="contained" 
            startIcon={responseDialog.loading ? <CircularProgress size={20} /> : <Send />}
            sx={{ borderRadius: 2 }}
            disabled={responseDialog.loading || !responseDialog.response.trim()}
          >
            {responseDialog.loading ? 'Sending...' : 'Send Response'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Other Modals */}
      <ViewCustomerReviewModal
        open={viewOpen}
        review={selectedReview}
        onClose={() => setViewOpen(false)}
      />
      <EditCustomerReviewModal
        open={editOpen}
        review={selectedReview}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        item={selectedReview}
        itemType="review"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default CustomerReviewsTable;
