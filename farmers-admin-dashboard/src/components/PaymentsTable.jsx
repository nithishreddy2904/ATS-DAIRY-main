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
  Payment,
  AccountBalance,
  CreditCard,
  TrendingUp,
} from '@mui/icons-material';

import paymentService from '../services/paymentService';
import useSocket from '../hooks/useSocket';
import ViewPaymentModal from './ViewPaymentModal';
import EditPaymentModal from './EditPaymentModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const PURPLE = "#8e24aa"; // Same as Payments page

const PaymentsTable = () => {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getAllPayments();
      let paymentsData = [];
      if (response && response.data) {
        paymentsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        paymentsData = response;
      }
      setPayments(paymentsData);
      setFilteredPayments(paymentsData);
    } catch (err) {
      console.error('Error loading payments:', err);
      setError(`Failed to load payments: ${err.message}`);
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = payments.filter(payment =>
        Object.values(payment).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [searchText, payments]);

  useEffect(() => {
    if (!socket) return;

    socket.on('payment:created', payload => {
      setPayments(prev => [payload.data, ...prev]);
    });
    socket.on('payment:updated', payload => {
      setPayments(prev =>
        prev.map(payment => (payment.id === payload.data.id ? payload.data : payment))
      );
    });
    socket.on('payment:deleted', payload => {
      setPayments(prev => prev.filter(payment => payment.id !== payload.data.id));
    });

    return () => {
      socket.off('payment:created');
      socket.off('payment:updated');
      socket.off('payment:deleted');
    };
  }, [socket]);

  const handleView = payment => {
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  const handleEdit = payment => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleDelete = payment => {
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedPayment => {
    try {
      if (updatedPayment.id) {
        await paymentService.updatePayment(updatedPayment.id, updatedPayment);
      } else {
        await paymentService.createPayment(updatedPayment);
      }
      await loadPayments();
      setEditModalOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error('Error saving payment:', err);
      alert('Error saving payment: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await paymentService.deletePayment(selectedPayment.id);
      await loadPayments();
      setDeleteDialogOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Error deleting payment: ' + err.message);
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

  const getPaymentModeIcon = (mode) => {
    switch (mode) {
      case 'Bank Transfer': return <AccountBalance />;
      case 'Cash': return <Payment />;
      case 'Check': return <Payment />;
      case 'UPI': return <CreditCard />;
      case 'Digital Wallet': return <CreditCard />;
      default: return <Payment />;
    }
  };

 const columns = [
  { 
    field: 'farmer_id', 
    headerName: 'Farmer ID', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'payment_date', 
    headerName: 'Payment Date', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium">
          {formatDateTime(params.value)}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'amount', 
    headerName: 'Amount', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="bold" color="success.main">
          ₹{Number(params.value || 0).toLocaleString()}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'payment_mode', 
    headerName: 'Payment Mode', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <Avatar sx={{ bgcolor: PURPLE, width: 24, height: 24 }}>
          {React.cloneElement(getPaymentModeIcon(params.value), { sx: { fontSize: 14 } })}
        </Avatar>
        <Typography variant="body2">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: params => {
      const color = 
        params.value === 'Completed' ? 'success' :
        params.value === 'Failed' ? 'error' :
        params.value === 'Processing' ? 'info' : 'warning';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={params.value} 
            color={color} 
            size="small"
            variant="outlined"
          />
        </Box>
      );
    }
  },
  { 
    field: 'transaction_id', 
    headerName: 'Transaction ID', 
    width: 160,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace" color="primary.main">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'created_at', 
    headerName: 'Recorded Date', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString('en-IN') : ''}
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


  // StatCard component with purple accent
  const StatsCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        bgcolor: alpha(PURPLE, 0.08),
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
      <Avatar sx={{ bgcolor: PURPLE, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: PURPLE }}>{value}</Typography>
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
  const totalPayments = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;

  // Get current month payments
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.payment_date);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  }).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <Box p={2}>
      {/* Purple header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Payment sx={{ color: PURPLE, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: PURPLE, fontWeight: 600 }}>
          Payment Records
        </Typography>
      </Box>

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Payments"
            value={`₹${(totalPayments / 1000).toFixed(0)}K`}
            icon={<Payment />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Completed"
            value={completedPayments}
            icon={<TrendingUp />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Pending"
            value={pendingPayments}
            icon={<Payment />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="This Month"
            value={`₹${(monthlyPayments / 1000).toFixed(0)}K`}
            icon={<Payment />}
            color={PURPLE}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search payments..."
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
            <IconButton onClick={loadPayments}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredPayments}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'payment_date', sort: 'desc' }],
            },
          }}
        />
      </Paper>

      <ViewPaymentModal
        open={viewModalOpen}
        payment={selectedPayment}
        onClose={() => setViewModalOpen(false)}
      />
      <EditPaymentModal
        open={editModalOpen}
        payment={selectedPayment}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedPayment}
        itemType="payment"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default PaymentsTable;
