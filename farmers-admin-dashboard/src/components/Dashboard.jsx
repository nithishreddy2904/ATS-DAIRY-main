import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Agriculture as FarmersIcon,
  Business as SuppliersIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import farmerService from '../services/farmerService';
import supplierService from '../services/supplierService';
import useSocket from '../hooks/useSocket';

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeFarmers: 0,
    totalSuppliers: 0,
    activeSuppliers: 0
  });
  const [loading, setLoading] = useState(true);
  const socket = useSocket('http://localhost:5000');

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load farmers stats
      let farmers = [];
      try {
        const farmersResponse = await farmerService.getAllFarmers();
        farmers = farmersResponse?.data || [];
      } catch (farmerError) {
        console.warn('Failed to load farmers for stats:', farmerError);
      }

      // Load suppliers stats
      let suppliers = [];
      try {
        console.log('📡 Loading suppliers for dashboard stats...');
        const suppliersResponse = await supplierService.getAllSuppliers();
        console.log('📊 Suppliers response:', suppliersResponse);
        
        if (suppliersResponse && suppliersResponse.success && Array.isArray(suppliersResponse.data)) {
          suppliers = suppliersResponse.data;
        } else if (suppliersResponse && Array.isArray(suppliersResponse.data)) {
          suppliers = suppliersResponse.data;
        } else if (Array.isArray(suppliersResponse)) {
          suppliers = suppliersResponse;
        }
        
        console.log('📊 Suppliers loaded for stats:', suppliers.length, 'suppliers');
      } catch (supplierError) {
        console.warn('Failed to load suppliers for stats:', supplierError);
      }

      const newStats = {
        totalFarmers: farmers.length,
        activeFarmers: farmers.filter(f => f.status === 'Active').length,
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter(s => s.status === 'Active').length
      };
      
      console.log('📊 Dashboard stats calculated:', newStats);
      setStats(newStats);

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStats({
        totalFarmers: 0,
        activeFarmers: 0,
        totalSuppliers: 0,
        activeSuppliers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleDataChange = () => {
      loadStats();
    };

    socket.on('farmer:created', handleDataChange);
    socket.on('farmer:updated', handleDataChange);
    socket.on('farmer:deleted', handleDataChange);
    socket.on('supplier:created', handleDataChange);
    socket.on('supplier:updated', handleDataChange);
    socket.on('supplier:deleted', handleDataChange);

    return () => {
      socket.off('farmer:created', handleDataChange);
      socket.off('farmer:updated', handleDataChange);
      socket.off('farmer:deleted', handleDataChange);
      socket.off('supplier:created', handleDataChange);
      socket.off('supplier:updated', handleDataChange);
      socket.off('supplier:deleted', handleDataChange);
    };
  }, [socket]);

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: alpha(color, 0.3)
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box flex={1}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              fontWeight={500}
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={32} sx={{ color }} />
            ) : (
              <Typography 
                variant="h3" 
                fontWeight={700}
                sx={{ 
                  color,
                  mb: 1,
                  lineHeight: 1
                }}
              >
                {value}
              </Typography>
            )}
            {subtitle && (
              <Chip 
                label={subtitle}
                size="small"
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  borderColor: alpha(color, 0.3),
                  color: color,
                  backgroundColor: alpha(color, 0.05)
                }}
              />
            )}
          </Box>
          <Avatar
            sx={{ 
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  const InfoCard = ({ title, description, icon }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          backgroundColor: alpha(theme.palette.primary.main, 0.02)
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            width: 48,
            height: 48
          }}
        >
          {icon}
        </Avatar>
        <Box flex={1}>
          <Typography 
            variant="h6" 
            fontWeight={600} 
            sx={{ mb: 1, color: 'text.primary' }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 0 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <AssessmentIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography 
            variant="h4" 
            fontWeight={700}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Dashboard Overview
          </Typography>
        </Stack>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ maxWidth: 600 }}
        >
          Monitor your Dairy Operations data with real-time insights and analytics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Farmers"
            value={stats.totalFarmers}
            subtitle="Registered"
            icon={<FarmersIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Farmers"
            value={stats.activeFarmers}
            subtitle="Currently Active"
            icon={<PeopleIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers}
            subtitle="Registered"
            icon={<SuppliersIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Suppliers"
            value={stats.activeSuppliers}
            subtitle="Currently Active"
            icon={<TrendingUpIcon />}
            color={theme.palette.error.main}
          />
        </Grid>
      </Grid>

      {/* Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoCard
            title="Recent Activity"
            description="Real-time updates from your network. Monitor farmer registrations, supplier activities, and system changes as they happen."
            icon={<TrendingUpIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard
            title="Quick Actions"
            description="Manage your farmers and suppliers efficiently with streamlined workflows and automated processes."
            icon={<AssessmentIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
