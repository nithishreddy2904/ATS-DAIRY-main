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
  Verified,
  Warning,
  CheckCircle,
  Schedule,
  Error,
  SecurityUpdate,
} from '@mui/icons-material';

import certificationService from '../services/certificationService';
import useSocket from '../hooks/useSocket';
import ViewCertificationModal from './ViewCertificationModal';
import EditCertificationModal from './EditCertificationModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const GREEN = "#4caf50"; // Same as Compliance page certifications tab

const CertificationsTable = () => {
  const theme = useTheme();
  const [certifications, setCertifications] = useState([]);
  const [filteredCertifications, setFilteredCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedCertification, setSelectedCertification] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await certificationService.getAllCertifications();
      let certificationsData = [];
      if (response && response.data) {
        certificationsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        certificationsData = response;
      }
      setCertifications(certificationsData);
      setFilteredCertifications(certificationsData);
    } catch (err) {
      console.error('Error loading certifications:', err);
      setError(`Failed to load certifications: ${err.message}`);
      setCertifications([]);
      setFilteredCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = certifications.filter(cert =>
        Object.values(cert).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredCertifications(filtered);
    } else {
      setFilteredCertifications(certifications);
    }
  }, [searchText, certifications]);

  useEffect(() => {
    if (!socket) return;

    socket.on('certification:created', payload => {
      setCertifications(prev => [payload.data, ...prev]);
    });
    socket.on('certification:updated', payload => {
      setCertifications(prev =>
        prev.map(cert => (cert.id === payload.data.id ? payload.data : cert))
      );
    });
    socket.on('certification:deleted', payload => {
      setCertifications(prev => prev.filter(cert => cert.id !== payload.data.id));
    });

    return () => {
      socket.off('certification:created');
      socket.off('certification:updated');
      socket.off('certification:deleted');
    };
  }, [socket]);

  const handleView = certification => {
    setSelectedCertification(certification);
    setViewModalOpen(true);
  };

  const handleEdit = certification => {
    setSelectedCertification(certification);
    setEditModalOpen(true);
  };

  const handleDelete = certification => {
    setSelectedCertification(certification);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedCertification => {
    try {
      if (updatedCertification.id && certifications.find(c => c.id === updatedCertification.id)) {
        await certificationService.updateCertification(updatedCertification.id, updatedCertification);
      } else {
        await certificationService.createCertification(updatedCertification);
      }
      await loadCertifications();
      setEditModalOpen(false);
      setSelectedCertification(null);
    } catch (err) {
      console.error('Error saving certification:', err);
      alert('Error saving certification: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await certificationService.deleteCertification(selectedCertification.id);
      await loadCertifications();
      setDeleteDialogOpen(false);
      setSelectedCertification(null);
    } catch (err) {
      console.error('Error deleting certification:', err);
      alert('Error deleting certification: ' + err.message);
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

  const isExpiring = (expiryDate, status) => {
    if (status === 'Expired') return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle />;
      case 'Expired': return <Error />;
      case 'Pending Renewal': return <SecurityUpdate />;
      case 'Under Process': return <Schedule />;
      case 'Suspended': return <Warning />;
      case 'Cancelled': return <Error />;
      default: return <Verified />;
    }
  };

  const columns = [
  { 
    field: 'id', 
    headerName: 'Cert ID', 
    width: 100,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'name', 
    headerName: 'Certification Name', 
    width: 200,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'issuing_authority', 
    headerName: 'Issuing Authority', 
    width: 180,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value}</Typography>
      </Box>
    )
  },
  { 
    field: 'certificate_number', 
    headerName: 'Certificate No.', 
    width: 140,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontFamily="monospace" color="primary.main">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'issue_date', 
    headerName: 'Issue Date', 
    width: 120,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">
          {formatDateTime(params.value)}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'expiry_date', 
    headerName: 'Expiry Date', 
    width: 130,
    renderCell: params => {
      const expired = isExpired(params.value);
      const expiring = isExpiring(params.value, params.row.status);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography 
            variant="body2" 
            color={expired ? 'error.main' : expiring ? 'warning.main' : 'text.primary'}
            fontWeight={expired || expiring ? 'bold' : 'normal'}
          >
            {formatDateTime(params.value)}
          </Typography>
        </Box>
      );
    }
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 140,
    renderCell: params => {
      const expired = isExpired(params.row.expiry_date);
      const expiring = isExpiring(params.row.expiry_date, params.value);
      let color = 'default';
      let displayStatus = params.value;
      if (expired && params.value === 'Active') {
        color = 'error';
        displayStatus = 'Expired';
      } else if (expiring && params.value === 'Active') {
        color = 'warning';
        displayStatus = 'Expiring Soon';
      } else {
        color =
          params.value === 'Active'   ? 'success' :
          params.value === 'Expired' ||
          params.value === 'Cancelled' ? 'error' :
          params.value === 'Under Process' ? 'info' : 'warning';
      }
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={displayStatus} 
            color={color} 
            size="small"
            variant="outlined"
            icon={getStatusIcon(params.value)}
          />
        </Box>
      );
    }
  },
  { 
    field: 'accreditation_body', 
    headerName: 'Accreditation', 
    width: 150,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2">{params.value || 'N/A'}</Typography>
      </Box>
    )
  },
  { 
    field: 'cost', 
    headerName: 'Cost', 
    width: 120,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium" color="success.main">
          {params.value ? `₹${Number(params.value).toLocaleString()}` : 'N/A'}
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


  // StatCard component with green accent
  const StatsCard = ({ title, value, icon, color, alert = false }) => (
    <Card
      sx={{
        bgcolor: alert ? alpha(theme.palette.error.main, 0.08) : alpha(GREEN, 0.08),
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
      <Avatar sx={{ bgcolor: alert ? theme.palette.error.main : GREEN, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: alert ? theme.palette.error.main : GREEN }}>
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
  const totalCertifications = certifications.length;
  const activeCertifications = certifications.filter(c => c.status === 'Active').length;
  const expiredCertifications = certifications.filter(c => isExpired(c.expiry_date) || c.status === 'Expired').length;
  const expiringCertifications = certifications.filter(c => isExpiring(c.expiry_date, c.status)).length;
  const renewalRequired = certifications.filter(c => c.renewal_required === true || c.renewal_required === 1).length;

  return (
    <Box p={2}>
      {/* Green header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Verified sx={{ color: GREEN, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: GREEN, fontWeight: 600 }}>
          Active Certifications
        </Typography>
      </Box>

      {/* Certification alerts */}
      {(expiredCertifications > 0 || expiringCertifications > 0) && (
        <>
          {expiredCertifications > 0 && (
            <Alert 
              severity="error" 
              sx={{ mb: 1 }}
              icon={<Error />}
            >
              <Typography variant="body2">
                {expiredCertifications} certification(s) have expired and require immediate renewal.
              </Typography>
            </Alert>
          )}
          {expiringCertifications > 0 && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              icon={<Warning />}
            >
              <Typography variant="body2">
                {expiringCertifications} certification(s) are expiring within 30 days.
              </Typography>
            </Alert>
          )}
        </>
      )}

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Certificates"
            value={totalCertifications}
            icon={<Verified />}
            color={GREEN}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Active"
            value={activeCertifications}
            icon={<CheckCircle />}
            color={GREEN}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Expiring Soon"
            value={expiringCertifications}
            icon={<Warning />}
            alert={expiringCertifications > 0}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Expired"
            value={expiredCertifications}
            icon={<Error />}
            alert={expiredCertifications > 0}
          />
        </Grid>
      </Grid>

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search certifications..."
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
            <IconButton onClick={loadCertifications}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredCertifications}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'expiry_date', sort: 'asc' }],
            },
          }}
          getRowClassName={(params) => {
            if (isExpired(params.row.expiry_date)) {
              return 'row-expired';
            }
            if (isExpiring(params.row.expiry_date, params.row.status)) {
              return 'row-expiring';
            }
            return '';
          }}
          sx={{
            '& .row-expired': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
            '& .row-expiring': {
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
            },
          }}
        />
      </Paper>

      <ViewCertificationModal
        open={viewModalOpen}
        certification={selectedCertification}
        onClose={() => setViewModalOpen(false)}
      />
      <EditCertificationModal
        open={editModalOpen}
        certification={selectedCertification}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedCertification}
        itemType="certification"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default CertificationsTable;
