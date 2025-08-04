import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem
} from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Refresh
} from '@mui/icons-material';
import supplierService from '../services/supplierService';
import useSocket from '../hooks/useSocket';
import ViewSupplierModal from './ViewSupplierModal';
import EditSupplierModal from './EditSupplierModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const SuppliersTable = () => {
  const theme = useTheme();
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const socket = useSocket('http://localhost:5000');

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading suppliers...');
      const response = await supplierService.getAllSuppliers();
      console.log('Service response:', response);

      // Handle the response from our updated service
      if (response && response.success && Array.isArray(response.data)) {
        setSuppliers(response.data);
        setFilteredSuppliers(response.data);
        console.log('Suppliers set to state:', response.data);
        
        // Debug: Check if companyName and supplierType are present
        response.data.forEach((supplier, index) => {
          console.log(`Supplier ${index}:`, {
            id: supplier.id,
            companyName: supplier.companyName,
            supplierType: supplier.supplierType,
            contactPerson: supplier.contactPerson
          });
        });
      } else {
        console.warn('Invalid response structure:', response);
        setSuppliers([]);
        setFilteredSuppliers([]);
      }

    } catch (error) {
      console.error('Error loading suppliers:', error);
      setError(`Failed to load suppliers: ${error.message}`);
      setSuppliers([]);
      setFilteredSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchText) {
      const filtered = suppliers.filter(supplier =>
  Object.values(supplier).some(value =>
    value &&
    value
      .toString()
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )
);

      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(suppliers);
    }
  }, [searchText, suppliers]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('supplier:created', (payload) => {
      console.log('New supplier created:', payload);
      setSuppliers(prev => [payload.data, ...prev]);
    });

    socket.on('supplier:updated', (payload) => {
      console.log('Supplier updated:', payload);
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === payload.data.id ? payload.data : supplier
        )
      );
    });

    socket.on('supplier:deleted', (payload) => {
      console.log('Supplier deleted:', payload);
      setSuppliers(prev =>
        prev.filter(supplier => supplier.id !== payload.data.id)
      );
    });

    return () => {
      socket.off('connect');
      socket.off('supplier:created');
      socket.off('supplier:updated');
      socket.off('supplier:deleted');
    };
  }, [socket]);

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setViewModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setEditModalOpen(true);
  };

  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedSupplier) => {
    try {
      console.log('📝 Updating supplier:', updatedSupplier);
      await supplierService.updateSupplier(updatedSupplier.id, updatedSupplier);
      // Refresh the UI after successful edit
      await loadSuppliers();
      setEditModalOpen(false);
      setSelectedSupplier(null);
      console.log('✅ Supplier updated and UI refreshed successfully');
    } catch (error) {
      console.error('❌ Error updating supplier:', error);
      alert('Error updating supplier: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await supplierService.deleteSupplier(selectedSupplier.id);
      await loadSuppliers();
      setDeleteDialogOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Error deleting supplier: ' + error.message);
    }
  };

  const getSupplierTypeColor = (type) => {
    const colors = {
      'Feed Supplier': theme.palette.success.main,
      'Equipment Supplier': theme.palette.primary.main,
      'Packaging Supplier': theme.palette.warning.main,
      'Chemical Supplier': theme.palette.error.main,
      'Testing Services': theme.palette.info.main,
      'Logistics': theme.palette.secondary.main
    };
    return colors[type] || theme.palette.grey[500];
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Supplier ID',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontFamily: 'monospace'
          }}
        />
      )
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              fontSize: '0.875rem'
            }}
          >
            <BusinessIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} noWrap>
              {params.value || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'contactPerson',
      headerName: 'Contact Person',
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
              fontSize: '0.75rem'
            }}
          >
            {params.value?.charAt(0) || 'N'}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.value || 'N/A'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhoneIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'address',
      headerName: 'Location',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            <Typography 
              variant="body2" 
              noWrap 
              sx={{ 
                maxWidth: 160,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {params.value}
            </Typography>
          </Stack>
        </Tooltip>
      )
    },
    {
      field: 'supplierType',
      headerName: 'Type',
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(getSupplierTypeColor(params.value), 0.1),
            color: getSupplierTypeColor(params.value),
            fontWeight: 600,
            borderRadius: 1.5
          }}
        />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Active' ? 'success' :
            params.value === 'Inactive' ? 'error' : 'warning'
          }
          variant="filled"
          size="small"
          sx={{ 
            fontWeight: 600,
            borderRadius: 1.5
          }}
        />
      )
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value ? new Date(params.value).toLocaleDateString('en-IN') : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View Details">
              <Visibility />
            </Tooltip>
          }
          label="View"
          color="primary"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Edit">
              <Edit />
            </Tooltip>
          }
          label="Edit"
          color="warning"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete">
              <Delete />
            </Tooltip>
          }
          label="Delete"
          color="error"
          onClick={() => handleDelete(params.row)}
        />
      ]
    }
  ];

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        spacing={2}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading suppliers...
        </Typography>
      </Box>
    );
  }

  const StatsCard = ({ title, value, icon, color }) => (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 0 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BusinessIcon sx={{ color: 'warning.main', fontSize: 32 }} />
          <Typography 
            variant="h4" 
            fontWeight={700}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Suppliers Management
          </Typography>
        </Stack>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Suppliers"
              value={suppliers.length}
              icon={<BusinessIcon />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Suppliers"
              value={suppliers.filter(s => s.status === 'Active').length}
              icon={<PersonIcon />}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Showing Results"
              value={filteredSuppliers.length}
              icon={<SearchIcon />}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tooltip title="Refresh Data">
                    <IconButton 
                      onClick={loadSuppliers}
                      disabled={loading}
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2)
                        }
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    Refresh Data
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <IconButton color="inherit" size="small" onClick={loadSuppliers}>
              <Refresh />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search suppliers by company name, contact person, email, or type..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.8)
            }
          }}
        />
      </Box>

      {/* Data Grid */}
      <Paper 
        elevation={0}
        sx={{ 
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={filteredSuppliers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
          getRowId={(row) => row.id}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: alpha(theme.palette.divider, 0.08),
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha(theme.palette.warning.main, 0.02),
              borderColor: alpha(theme.palette.divider, 0.12),
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(theme.palette.warning.main, 0.04),
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: alpha(theme.palette.divider, 0.12),
            }
          }}
        />
      </Paper>

      {/* Modals */}
      <ViewSupplierModal
        open={viewModalOpen}
        supplier={selectedSupplier}
        onClose={() => setViewModalOpen(false)}
      />
      
      <EditSupplierModal
        open={editModalOpen}
        supplier={selectedSupplier}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Supplier"
        message={`Are you sure you want to delete supplier "${selectedSupplier?.companyName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default SuppliersTable;
