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
  Receipt,
  Warning,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';

import billService from '../services/billService';
import useSocket from '../hooks/useSocket';
import ViewBillModal from './ViewBillModal';
import EditBillModal from './EditBillModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const PURPLE = "#8e24aa"; // Same as Payments page

const BillsTable = () => {
  const theme = useTheme();
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedBill, setSelectedBill] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await billService.getAllBills();
      let billsData = [];
      if (response && response.data) {
        billsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        billsData = response;
      }
      setBills(billsData);
      setFilteredBills(billsData);
    } catch (err) {
      console.error('Error loading bills:', err);
      setError(`Failed to load bills: ${err.message}`);
      setBills([]);
      setFilteredBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = bills.filter(bill =>
        Object.values(bill).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredBills(filtered);
    } else {
      setFilteredBills(bills);
    }
  }, [searchText, bills]);

  useEffect(() => {
    if (!socket) return;

    socket.on('bill:created', payload => {
      setBills(prev => [payload.data, ...prev]);
    });
    socket.on('bill:updated', payload => {
      setBills(prev =>
        prev.map(bill => (bill.id === payload.data.id ? payload.data : bill))
      );
    });
    socket.on('bill:deleted', payload => {
      setBills(prev => prev.filter(bill => bill.id !== payload.data.id));
    });

    return () => {
      socket.off('bill:created');
      socket.off('bill:updated');
      socket.off('bill:deleted');
    };
  }, [socket]);

  const handleView = bill => {
    setSelectedBill(bill);
    setViewModalOpen(true);
  };

  const handleEdit = bill => {
    setSelectedBill(bill);
    setEditModalOpen(true);
  };

  const handleDelete = bill => {
    setSelectedBill(bill);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedBill => {
    try {
      if (updatedBill.id) {
        await billService.updateBill(updatedBill.id, updatedBill);
      } else {
        await billService.createBill(updatedBill);
      }
      await loadBills();
      setEditModalOpen(false);
      setSelectedBill(null);
    } catch (err) {
      console.error('Error saving bill:', err);
      alert('Error saving bill: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await billService.deleteBill(selectedBill.id);
      await loadBills();
      setDeleteDialogOpen(false);
      setSelectedBill(null);
    } catch (err) {
      console.error('Error deleting bill:', err);
      alert('Error deleting bill: ' + err.message);
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
    if (status === 'Paid') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle />;
      case 'Overdue': return <Error />;
      case 'Partially Paid': return <Warning />;
      case 'Unpaid': return <Schedule />;
      default: return <Receipt />;
    }
  };

  const columns = [
  { 
    field: 'bill_id', 
    headerName: 'Bill ID', 
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
    field: 'farmer_id', 
    headerName: 'Farmer ID', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace">
          {params.value}
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
        <Typography variant="body2" fontWeight="bold" color="error.main">
          ₹{Number(params.value || 0).toLocaleString()}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'bill_date', 
    headerName: 'Bill Date', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">
          {formatDateTime(params.value)}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'due_date', 
    headerName: 'Due Date', 
    width: 130,
    renderCell: params => {
      const isOverdueItem = isOverdue(params.value, params.row.status);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography 
            variant="body2" 
            color={isOverdueItem ? 'error.main' : 'text.primary'}
            fontWeight={isOverdueItem ? 'bold' : 'normal'}
          >
            {formatDateTime(params.value)}
          </Typography>
        </Box>
      );
    }
  },
  { 
    field: 'category', 
    headerName: 'Category', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            bgcolor: alpha(PURPLE, 0.1),
            color: PURPLE,
            fontWeight: 'medium'
          }}
        />
      </Box>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 140,
    renderCell: params => {
      const isOverdueItem = isOverdue(params.row.due_date, params.value);
      const status = isOverdueItem && params.value === 'Unpaid' ? 'Overdue' : params.value;
      const color = 
        status === 'Paid' ? 'success' :
        status === 'Overdue' ? 'error' :
        status === 'Partially Paid' ? 'warning' : 'default';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={status} 
            color={color} 
            size="small"
            variant="outlined"
            icon={getStatusIcon(status)}
          />
        </Box>
      );
    }
  },
  { 
    field: 'created_at', 
    headerName: 'Created Date', 
    width: 140,
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
  const StatsCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(PURPLE, 0.08),
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
      <Avatar sx={{ bgcolor: alert ? theme.palette.error.main : PURPLE, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: alert ? theme.palette.error.main : PURPLE }}>
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
  const totalBills = bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const paidBills = bills.filter(b => b.status === 'Paid').length;
  const unpaidBills = bills.filter(b => b.status === 'Unpaid').length;
  const overdueBills = bills.filter(b => isOverdue(b.due_date, b.status)).length;

  return (
    <Box p={2}>
      {/* Purple header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Receipt sx={{ color: PURPLE, fontSize: 32, mr: 1 }} />
        <Typography variant="h5" sx={{ color: PURPLE, fontWeight: 600 }}>
          Bills & Invoices
        </Typography>
      </Box>

      {/* Overdue bills alert */}
      {overdueBills > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          icon={<Warning />}
        >
          <Typography variant="body2">
            {overdueBills} bill(s) are overdue and require immediate attention.
          </Typography>
        </Alert>
      )}

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Bills"
            value={`₹${(totalBills / 1000).toFixed(0)}K`}
            icon={<Receipt />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Paid Bills"
            value={paidBills}
            icon={<CheckCircle />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Unpaid Bills"
            value={unpaidBills}
            icon={<Schedule />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Overdue Bills"
            value={overdueBills}
            icon={<Error />}
            alert={overdueBills > 0}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search bills..."
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
            <IconButton onClick={loadBills}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredBills}
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
            return '';
          }}
          sx={{
            '& .row-overdue': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        />
      </Paper>

      <ViewBillModal
        open={viewModalOpen}
        bill={selectedBill}
        onClose={() => setViewModalOpen(false)}
      />
      <EditBillModal
        open={editModalOpen}
        bill={selectedBill}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedBill}
        itemType="bill"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default BillsTable;
