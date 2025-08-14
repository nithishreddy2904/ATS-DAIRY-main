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
  Store,
} from '@mui/icons-material';

import retailerService from '../services/retailerService';
import useSocket from '../hooks/useSocket';
import ViewRetailerModal from './ViewRetailerModal';
import EditRetailerModal from './EditRetailerModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const PURPLE = "#6c63ff"; // Same as SalesRetailers first tab

const RetailersTable = () => {
  const theme = useTheme();
  const [retailers, setRetailers] = useState([]);
  const [filteredRetailers, setFilteredRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadRetailers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await retailerService.getAllRetailers();
      let retailersData = [];
      if (response && response.data) {
        retailersData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        retailersData = response;
      }
      setRetailers(retailersData);
      setFilteredRetailers(retailersData);
    } catch (err) {
      console.error('Error loading retailers:', err);
      setError(`Failed to load retailers: ${err.message}`);
      setRetailers([]);
      setFilteredRetailers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRetailers();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = retailers.filter(r =>
        Object.values(r).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredRetailers(filtered);
    } else {
      setFilteredRetailers(retailers);
    }
  }, [searchText, retailers]);

  useEffect(() => {
    if (!socket) return;

    socket.on('retailer:created', payload => {
      setRetailers(prev => [payload.data, ...prev]);
    });
    socket.on('retailer:updated', payload => {
      setRetailers(prev =>
        prev.map(r => (r.id === payload.data.id ? payload.data : r))
      );
    });
    socket.on('retailer:deleted', payload => {
      setRetailers(prev => prev.filter(r => r.id !== payload.data.id));
    });

    return () => {
      socket.off('retailer:created');
      socket.off('retailer:updated');
      socket.off('retailer:deleted');
    };
  }, [socket]);

  const handleView = retailer => {
    setSelectedRetailer(retailer);
    setViewModalOpen(true);
  };

  const handleEdit = retailer => {
    setSelectedRetailer(retailer);
    setEditModalOpen(true);
  };

  const handleDelete = retailer => {
    setSelectedRetailer(retailer);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedRetailer => {
    try {
      if (updatedRetailer.id) {
        await retailerService.updateRetailer(updatedRetailer.id, updatedRetailer);
      } else {
        await retailerService.createRetailer(updatedRetailer);
      }
      await loadRetailers();
      setEditModalOpen(false);
      setSelectedRetailer(null);
    } catch (err) {
      console.error('Error saving retailer:', err);
      alert('Error saving retailer: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await retailerService.deleteRetailer(selectedRetailer.id);
      await loadRetailers();
      setDeleteDialogOpen(false);
      setSelectedRetailer(null);
    } catch (err) {
      console.error('Error deleting retailer:', err);
      alert('Error deleting retailer: ' + err.message);
    }
  };

  const columns = [
  { 
    field: 'name', 
    headerName: 'Retailer Name', 
    width: 200,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Avatar sx={{ bgcolor: PURPLE, mr: 1, width: 32, height: 32 }}>
          {params.value?.charAt(0)}
        </Avatar>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'location', 
    headerName: 'Location', 
    width: 180,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    )
  },
  { 
    field: 'contact', 
    headerName: 'Contact', 
    width: 140,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'total_sales', 
    headerName: 'Total Sales', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium" color="success.main">
          ₹{Number(params.value || 0).toLocaleString()}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'created_at', 
    headerName: 'Joined Date', 
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
  const totalSales = retailers.reduce((sum, r) => sum + Number(r.total_sales || 0), 0);
  const avgSales = retailers.length > 0 ? totalSales / retailers.length : 0;
  const topRetailer = retailers.length > 0 
    ? retailers.reduce((a, b) => 
        (Number(a.total_sales || 0) > Number(b.total_sales || 0)) ? a : b
      ).name 
    : 'None';

  return (
    <Box p={2}>
      {/* Purple header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Store sx={{ color: PURPLE, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: PURPLE, fontWeight: 600 }}>
          Retailers Directory
        </Typography>
      </Box>

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Retailers"
            value={retailers.length}
            icon={<Store />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Sales"
            value={`₹${(totalSales / 1000).toFixed(0)}K`}
            icon={<Store />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Avg Sales"
            value={`₹${(avgSales / 1000).toFixed(1)}K`}
            icon={<Store />}
            color={PURPLE}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Top Performer"
            value={topRetailer.length > 15 ? topRetailer.substring(0, 15) + '...' : topRetailer}
            icon={<Store />}
            color={PURPLE}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh*/}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search retailers..."
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
            <IconButton onClick={loadRetailers}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredRetailers}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'total_sales', sort: 'desc' }],
            },
          }}
        />
      </Paper>

      <ViewRetailerModal
        open={viewModalOpen}
        retailer={selectedRetailer}
        onClose={() => setViewModalOpen(false)}
      />
      <EditRetailerModal
        open={editModalOpen}
        retailer={selectedRetailer}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedRetailer}
        itemType="retailer"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default RetailersTable;
