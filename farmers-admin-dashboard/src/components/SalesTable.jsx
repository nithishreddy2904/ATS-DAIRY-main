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
  AttachMoney,
} from '@mui/icons-material';

import salesService from '../services/salesService';
import retailerService from '../services/retailerService';
import useSocket from '../hooks/useSocket';
import ViewSaleModal from './ViewSaleModal';
import EditSaleModal from './EditSaleModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const GREEN = "#4caf50"; // Same as SalesRetailers second tab

const SalesTable = () => {
  const theme = useTheme();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedSale, setSelectedSale] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await salesService.getAllSales();
      let salesData = [];
      if (response && response.data) {
        salesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        salesData = response;
      }
      setSales(salesData);
      setFilteredSales(salesData);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError(`Failed to load sales: ${err.message}`);
      setSales([]);
      setFilteredSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRetailers = async () => {
    try {
      const response = await retailerService.getAllRetailers();
      let retailersData = [];
      if (response && response.data) {
        retailersData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        retailersData = response;
      }
      setRetailers(retailersData);
    } catch (err) {
      console.error('Error loading retailers:', err);
    }
  };

  useEffect(() => {
    loadSales();
    loadRetailers();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = sales.filter(s =>
        Object.values(s).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  }, [searchText, sales]);

  useEffect(() => {
    if (!socket) return;

    socket.on('sale:created', payload => {
      setSales(prev => [payload.data, ...prev]);
    });
    socket.on('sale:updated', payload => {
      setSales(prev =>
        prev.map(s => (s.id === payload.data.id ? payload.data : s))
      );
    });
    socket.on('sale:deleted', payload => {
      setSales(prev => prev.filter(s => s.id !== payload.data.id));
    });

    return () => {
      socket.off('sale:created');
      socket.off('sale:updated');
      socket.off('sale:deleted');
    };
  }, [socket]);

  const handleView = sale => {
    setSelectedSale(sale);
    setViewModalOpen(true);
  };

  const handleEdit = sale => {
    setSelectedSale(sale);
    setEditModalOpen(true);
  };

  const handleDelete = sale => {
    setSelectedSale(sale);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedSale => {
    try {
      if (updatedSale.id) {
        await salesService.updateSale(updatedSale.id, updatedSale);
      } else {
        await salesService.createSale(updatedSale);
      }
      await loadSales();
      setEditModalOpen(false);
      setSelectedSale(null);
    } catch (err) {
      console.error('Error saving sale:', err);
      alert('Error saving sale: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await salesService.deleteSale(selectedSale.id);
      await loadSales();
      setDeleteDialogOpen(false);
      setSelectedSale(null);
    } catch (err) {
      console.error('Error deleting sale:', err);
      alert('Error deleting sale: ' + err.message);
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

  const columns = [
  { 
    field: 'date', 
    headerName: 'Sale Date', 
    width: 170,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium">
          {formatDateTime(params.value)}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'retailer', 
    headerName: 'Retailer', 
    width: 220,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Avatar sx={{ bgcolor: GREEN, mr: 1, width: 32, height: 32 }}>
          {params.value?.charAt(0)}
        </Avatar>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'amount', 
    headerName: 'Amount', 
    width: 170,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="bold" color="success.main">
          ₹{Number(params.value || 0).toLocaleString()}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'created_at', 
    headerName: 'Recorded Date', 
    width: 170,
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
    width: 170,
    getActions: params => [
      <GridActionsCellItem icon={<Visibility color="primary" />} label="View" onClick={() => handleView(params.row)} />,
      <GridActionsCellItem icon={<Edit color="warning" />} label="Edit" onClick={() => handleEdit(params.row)} />,
      <GridActionsCellItem icon={<Delete color="error" />} label="Delete" onClick={() => handleDelete(params.row)} />
    ]
  }
];


  // StatCard component with green accent
  const StatsCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        bgcolor: alpha(GREEN, 0.08),
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
      <Avatar sx={{ bgcolor: GREEN, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: GREEN }}>{value}</Typography>
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
  const totalSales = sales.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const avgSale = sales.length > 0 ? totalSales / sales.length : 0;
  const todaySales = sales.filter(s => {
    const today = new Date().toDateString();
    const saleDate = new Date(s.date).toDateString();
    return today === saleDate;
  }).length;

  // Get current month sales
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  }).reduce((sum, s) => sum + Number(s.amount || 0), 0);

  return (
    <Box p={2}>
      {/* Green header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <AttachMoney sx={{ color: GREEN, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: GREEN, fontWeight: 600 }}>
          Sales Records
        </Typography>
      </Box>

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Sales"
            value={`₹${(totalSales / 1000).toFixed(0)}K`}
            icon={<AttachMoney />}
            color={GREEN}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Records"
            value={sales.length}
            icon={<AttachMoney />}
            color={GREEN}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Avg Sale"
            value={`₹${(avgSale / 1000).toFixed(1)}K`}
            icon={<AttachMoney />}
            color={GREEN}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="This Month"
            value={`₹${(monthSales / 1000).toFixed(0)}K`}
            icon={<AttachMoney />}
            color={GREEN}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh  */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search sales..."
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
            <IconButton onClick={loadSales}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredSales}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
          }}
        />
      </Paper>

      <ViewSaleModal
        open={viewModalOpen}
        sale={selectedSale}
        onClose={() => setViewModalOpen(false)}
      />
      <EditSaleModal
        open={editModalOpen}
        sale={selectedSale}
        retailers={retailers}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedSale}
        itemType="sale"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default SalesTable;
