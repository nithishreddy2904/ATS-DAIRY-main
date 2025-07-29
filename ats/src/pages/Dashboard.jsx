import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Grid, Paper, Tabs, Tab, Chip, IconButton, Button, Stack
} from '@mui/material';
import {
  TrendingUp, TrendingDown, LocalShipping, Store, People,
  Assessment, Nature, WorkOutline, AttachMoney, Star,
  MoreVert, Refresh, Download, FilterList,
  PersonAdd, LocalDrink, PointOfSale, Assessment as ReportIcon
} from '@mui/icons-material';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ReportGenerator from '../components/ReportGenerator';



// Helper function to filter data by time period
const filterDataByPeriod = (data, period, dateField = 'date') => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 0: // Daily (Today only)
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        return itemDateOnly.getTime() === today.getTime();
      });
    case 1: // Weekly (last 7 days including today)
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        return itemDateOnly >= weekAgo && itemDateOnly <= today;
      });
    case 2: // Monthly (current month)
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      });
    case 3: // Quarterly (current quarter)
      const currentQuarter = Math.floor(now.getMonth() / 3);
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        const itemQuarter = Math.floor(itemDate.getMonth() / 3);
        return itemQuarter === currentQuarter && itemDate.getFullYear() === now.getFullYear();
      });
    default:
      return data;
  }
};

// Generate production data from actual milk entries
const generateProductionDataFromMilkEntries = (period, milkEntries) => {
  const now = new Date();
  
  switch (period) {
    case 0: // Daily - Last 7 days from milk entries
      const dailyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayProduction = milkEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const entryDateOnly = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
            const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return entryDateOnly.getTime() === targetDateOnly.getTime();
          })
          .reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
        
        dailyData.push({
          month: dayName,
          production: dayProduction,
          target: 100,
          actualMilk: dayProduction
        });
      }
      return dailyData;
      
    case 1: // Weekly - Last 4 weeks from milk entries
      const weeklyData = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const weekProduction = milkEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= weekStart && entryDate <= weekEnd;
          })
          .reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
        
        weeklyData.push({
          month: `Week ${4 - i}`,
          production: weekProduction,
          target: 700,
          actualMilk: weekProduction
        });
      }
      return weeklyData;
      
    case 2: // Monthly - Last 6 months from milk entries
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        const monthName = month.toLocaleDateString('en-US', { month: 'short' });
        
        const monthProduction = milkEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === month.getMonth() && entryDate.getFullYear() === month.getFullYear();
          })
          .reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
        
        monthlyData.push({
          month: monthName,
          production: monthProduction,
          target: 3000,
          actualMilk: monthProduction
        });
      }
      return monthlyData;
      
    case 3: // Quarterly - Last 4 quarters from milk entries
      const quarterlyData = [];
      for (let i = 3; i >= 0; i--) {
        const quarter = new Date(now);
        quarter.setMonth(quarter.getMonth() - (i * 3));
        const quarterNum = Math.floor(quarter.getMonth() / 3) + 1;
        const quarterLabel = `Q${quarterNum} ${quarter.getFullYear()}`;
        
        const quarterProduction = milkEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const entryQuarter = Math.floor(entryDate.getMonth() / 3);
            const targetQuarter = Math.floor(quarter.getMonth() / 3);
            return entryQuarter === targetQuarter && entryDate.getFullYear() === quarter.getFullYear();
          })
          .reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
        
        quarterlyData.push({
          month: quarterLabel,
          production: quarterProduction,
          target: 9000,
          actualMilk: quarterProduction
        });
      }
      return quarterlyData;
    default:
      return [];
  }
};

// Generate revenue data from actual sales
const generateRevenueDataFromSales = (sales, period) => {
  const now = new Date();
  const periods = period === 0 ? 7 : period === 1 ? 4 : period === 2 ? 6 : 4;
  const data = [];
  
  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date();
    let label, periodSales;
    
    switch (period) {
      case 0: // Daily
        date.setDate(date.getDate() - i);
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
        periodSales = sales.filter(sale => {
          const saleDate = new Date(sale.date);
          const saleDateOnly = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());
          const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          return saleDateOnly.getTime() === targetDateOnly.getTime();
        }).reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        break;
      case 1: // Weekly
        date.setDate(date.getDate() - (i * 7));
        label = `Week ${periods - i}`;
        periodSales = sales.filter(sale => {
          const saleDate = new Date(sale.date);
          const weekStart = new Date(date);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          return saleDate >= weekStart && saleDate <= weekEnd;
        }).reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        break;
      case 2: // Monthly
        date.setMonth(date.getMonth() - i);
        label = date.toLocaleDateString('en-US', { month: 'short' });
        periodSales = sales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
        }).reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        break;
      case 3: // Quarterly
        date.setMonth(date.getMonth() - (i * 3));
        label = `Q${Math.floor(date.getMonth() / 3) + 1}`;
        periodSales = sales.filter(sale => {
          const saleDate = new Date(sale.date);
          const quarter = Math.floor(saleDate.getMonth() / 3);
          const currentQuarter = Math.floor(date.getMonth() / 3);
          return quarter === currentQuarter && saleDate.getFullYear() === date.getFullYear();
        }).reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        break;
      default:
        label = 'Unknown';
        periodSales = 0;
    }

    data.push({
      month: label,
      revenue: periodSales,
      expenses: periodSales * 0.65
    });
  }
  
  return data;
};


const MetricTile = ({ title, value, change, icon, color, subtitle, onClick, isClickable = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { milkEntries, salesFromDB, salesLoading } = useAppContext();
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        background: isDark
          ? 'linear-gradient(45deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
          : `linear-gradient(45deg, ${color}08 0%, ${color}03 100%)`,
        borderLeft: `6px solid ${color}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.3s',
        '&:hover': isClickable
          ? { boxShadow: `0 4px 20px ${color}30`, transform: 'scale(1.03)' }
          : {},
      }}
      onClick={isClickable ? onClick : undefined}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : `${color}15`,
            border: isDark ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 44,
            minHeight: 44,
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? '#fff' : '#222', mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Box>
      </Stack>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 'auto', pt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: color,
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: 0.5,
            background: isDark ? 'rgba(255,255,255,0.06)' : `${color}10`,
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            display: 'inline-block',
          }}
        >
          {change}
        </Typography>
      </Box>
      {isClickable && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            color: color,
            fontWeight: 'bold',
            textAlign: 'center',
            opacity: 0.8,
            display: 'block',
          }}
        >
          Click to view details →
        </Typography>
      )}
    </Paper>
  );
};

MetricTile.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['up', 'down']).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
  isClickable: PropTypes.bool,
};

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  // PULL ALL DATA FROM APPCONTEXT INCLUDING NETWORK GROWTH DATA
  const { 
    farmers, 
    suppliers, 
    milkEntries, 
    inventoryItems, 
    salesFromDB,           
    salesLoading,
    qualityTests,
    labQualityTests,
    generateQualityDistribution,
    generateNetworkGrowthData,
    calculateSustainabilityIndex
  } = useAppContext();

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  // Filter data based on selected time period
  const filteredMilkEntries = useMemo(() => filterDataByPeriod(milkEntries, tabIndex), [milkEntries, tabIndex]);
  const filteredSales = useMemo(() => filterDataByPeriod(salesFromDB, tabIndex), [salesFromDB, tabIndex]);

  // Calculate real-time metrics from filtered data
  const totalMilkCollection = filteredMilkEntries.reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
  const activeFarmers = farmers.filter(f => f.status === 'Active').length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;

  // Calculate total revenue from filtered sales
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
  const monthlyTarget = 1500000;
  const revenuePercentage = ((totalRevenue / monthlyTarget) * 100).toFixed(1);

  // Calculate revenue trend
  const revenueChange = '8.7';
  const revenueTrend = 'up';

  // Get calculated metrics from context
  const sustainabilityIndex = calculateSustainabilityIndex;

  // Generate quality distribution from Quality Tests
  const qualityDistribution = useMemo(() => {
  const distribution = generateQualityDistribution;
  console.log('📈 Dashboard quality distribution:', distribution);
  console.log('📋 Backend labQualityTests count:', labQualityTests?.length || 0);
  return distribution;
}, [generateQualityDistribution, labQualityTests]);

  // MODIFIED: Generate network growth data from actual farmers and suppliers
  const networkGrowthData = useMemo(() => generateNetworkGrowthData, [generateNetworkGrowthData]);

  // Generate all chart data from AppContext data
  const productionData = useMemo(() => generateProductionDataFromMilkEntries(tabIndex, milkEntries), [tabIndex, milkEntries]);
  const dynamicRevenueData = useMemo(() => generateRevenueDataFromSales(salesFromDB, tabIndex), [salesFromDB, tabIndex]);

  // Quick Action Handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'addFarmer':
        navigate('/farmers-suppliers');
        break;
      case 'recordMilk':
        navigate('/milk-collection');
        break;
      case 'recordSale':
        navigate('/sales-retailers');
        break;
      case 'generateReport':
        setReportDialogOpen(true);
        break;
      case 'viewInventory':
        navigate('/inventory');
        break;
      case 'qualityTest':
        navigate('/quality-test');
        break;
      case 'manageSuppliers':
        navigate('/farmers-suppliers');
        break;
      case 'processPayments':
        navigate('/payments-bills');
        break;
      default:
        break;
    }
  };

  // Metric Card Click Handlers
  const handleMetricClick = (metricType) => {
    switch (metricType) {
      case 'employeeSatisfaction':
        navigate('/workforce-management');
        break;
      case 'sustainability':
        navigate('/compliance-certification');
        break;
      case 'processingEfficiency':
        navigate('/processing-units');
        break;
      case 'qualityDistribution':
        navigate('/quality-test');
        break;
      case 'networkGrowth':
        navigate('/farmers-suppliers');
        break;
      default:
        break;
    }
  };

  // Remove employeeSatisfaction and processingEfficiency from metrics
  const metrics = [
    {
      title: 'Milk Collection',
      value: `${totalMilkCollection.toFixed(1)}L`,
      change: '+12.5%',
      trend: 'up',
      icon: <LocalShipping />,
      color: '#2196f3',
      subtitle: `From ${activeFarmers} active farmers (${filteredMilkEntries.length} entries)`
    },
    {
      title: 'Revenue',
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      change: `+${revenueChange}%`,
      trend: revenueTrend,
      icon: <AttachMoney />,
      color: '#4caf50',
      subtitle: `Target: ₹${(monthlyTarget / 100000).toFixed(0)}L (${revenuePercentage}% achieved)`
    },
    {
      title: 'Active Farmers',
      value: activeFarmers.toString(),
      change: '+4.2%',
      trend: 'up',
      icon: <People />,
      color: '#ff9800',
      subtitle: `${farmers.length} total registered`
    },
    {
      title: 'Inventory Items',
      value: inventoryItems.length.toString(),
      change: '+2.1%',
      trend: 'up',
      icon: <Star />,
      color: '#9c27b0',
      subtitle: `${totalInventoryValue.toFixed(0)} total quantity`
    },
    {
      title: 'Active Suppliers',
      value: activeSuppliers.toString(),
      change: '+6.3%',
      trend: 'up',
      icon: <Store />,
      color: '#00bcd4',
      subtitle: `${suppliers.length} total partnerships`
    },
    {
      title: 'Sustainability Index',
      value: `${sustainabilityIndex}%`,
      change: '+5.4%',
      trend: 'up',
      icon: <Nature />,
      color: '#8bc34a',
      subtitle: 'Carbon footprint reduced',
      isClickable: true,
      onClick: () => handleMetricClick('sustainability')
    }
  ];

  const periodLabels = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

  // Extended Quick Actions list
  const quickActions = [
    { label: 'Add New Farmer', icon: <PersonAdd />, action: 'addFarmer' },
    { label: 'Record Milk Collection', icon: <LocalDrink />, action: 'recordMilk' },
    { label: 'Record New Sale', icon: <PointOfSale />, action: 'recordSale' },
    { label: 'Generate Report', icon: <ReportIcon />, action: 'generateReport' },
    { label: 'View Inventory', icon: <Store />, action: 'viewInventory' },
    { label: 'Quality Testing', icon: <Assessment />, action: 'qualityTest' },
    { label: 'Manage Suppliers', icon: <LocalShipping />, action: 'manageSuppliers' },
    { label: 'Process Payments', icon: <AttachMoney />, action: 'processPayments' }
  ];

  return (
    <Box sx={{ 
      p: 0, 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Header Panel */}
      <Paper elevation={10} sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderRadius: 0,
        p: 3,
        mt: 3,
        mb: 3,
        color: '#000000',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderTop: '4px solid #5a67d8',
        width: '100%'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ mb: 0, letterSpacing: '-2px', color: '#000000' }}>
              Dairy Operations Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, mb: 0, fontWeight: 300, color: '#000000' }}>
              Real-time business intelligence dashboard
            </Typography>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: '#000000',
                  fontWeight: 200,
                  minWidth: 120,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                },
                '& .Mui-selected': { color: '#333333 !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#000000', height: 3 }
              }}
            >
              <Tab label="Daily" />
              <Tab label="Weekly" />
              <Tab label="Monthly" />
              <Tab label="Quarterly" />
            </Tabs>
          </Box>
          <Stack direction="row" spacing={1}>
          </Stack>
        </Stack>
      </Paper>

      {/* Scrollable Content */}
      <Box sx={{ pb: 2 }}>
        {/* Metrics Cards - 3 per row */}
        <Box sx={{ width: '100%', px: 13, mb: 2, maxWidth: '1200px', mx: 'auto' }}>
          <Grid container spacing={8}>
            {metrics.map((metric, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={idx}>
                <MetricTile {...metric} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Charts Section - ALL DATA FROM APPCONTEXT */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1, px: 0 }}>
          {/* Production Analytics Panel - DATA FROM MILK ENTRIES */}
          <Box sx={{ flex: '2' }}>
            <Paper elevation={0} sx={{
              height: 350,
              borderRadius: 2,
              borderTop: '4px solid #2196f3',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper'
            }}>
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Milk Production Analytics ({periodLabels[tabIndex]})
                  </Typography>
                  <Chip 
                    label={`${milkEntries.length} Total Entries`} 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                  />
                </Stack>
                <ResponsiveContainer width="100%" height={270}>
                  <AreaChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#f0f0f0'} />
                    <XAxis dataKey="month" stroke={isDark ? '#aaa' : '#666'} />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#333' : 'white',
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: isDark ? '#fff' : 'inherit'
                      }}
                      formatter={(value, name) => [`${value}L`, name]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="production"
                      stroke="#2196f3"
                      fill="url(#colorProduction)"
                      strokeWidth={3}
                      name="Actual Milk Production (L)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#ff9800"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target (L)"
                    />
                    <defs>
                      <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2196f3" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2196f3" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          {/* Quality Distribution Panel - LINKED TO QUALITY TEST PAGE */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={0} sx={{
              height: 350,
              borderRadius: 2,
              borderTop: '4px solid #4caf50',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                borderTop: '6px solid #4caf50'
              }
            }}
            onClick={() => handleMetricClick('qualityDistribution')}
            >
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Quality Distribution
                  </Typography>
                  <Chip 
                    label={`${labQualityTests.length} Tests`} 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                  />
                </Stack>
                <Typography variant="caption" sx={{ 
                  color: '#4caf50', 
                  fontWeight: 'bold',
                  display: 'block',
                  mb: 2
                }}>
                  Click to view Quality Test details →
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={qualityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {qualityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#333' : 'white',
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        color: isDark ? '#fff' : 'inherit'
                      }}
                      formatter={(value) => [`${value}%`, 'Quality']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {qualityDistribution.map((item, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" sx={{ mb: 1 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1, mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.9rem' }}>{item.name}</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{item.value}%</Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Revenue and Growth Panels - DATA FROM SALES AND FARMERS/SUPPLIERS */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1, px: 0 }}>
          {/* Financial Overview Panel - DATA FROM SALES */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={0} sx={{
              height: 284,
              borderRadius: 2,
              borderTop: '4px solid #ff9800',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper'
            }}>
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Financial Overview ({periodLabels[tabIndex]})
                  </Typography>
                  <Chip 
                    label={`${salesFromDB.length} Total Sales`} 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                  />
                </Stack>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={dynamicRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#f0f0f0'} />
                    <XAxis dataKey="month" stroke={isDark ? '#aaa' : '#666'} />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#333' : 'white',
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        borderRadius: 8,
                        color: isDark ? '#fff' : 'inherit'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#4caf50" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                    {/* <Bar dataKey="expenses" fill="#f44336" name="Expenses (₹)" radius={[4, 4, 0, 0]} /> */}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          {/* Network Expansion Panel - DATA FROM FARMERS AND SUPPLIERS */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={0} sx={{
              height: 280,
              borderRadius: 2,
              borderTop: '4px solid #9c27b0',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                borderTop: '6px solid #9c27b0'
              }
            }}
            onClick={() => handleMetricClick('networkGrowth')}
            >
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Network Growth
                  </Typography>
                  <Chip 
                    label={`${farmers.length + suppliers.length} Total`} 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                  />
                </Stack>
                <Typography variant="caption" sx={{ 
                  color: '#9c27b0', 
                  fontWeight: 'bold',
                  display: 'block',
                  mb: 1
                }}>
                  Click to manage Farmers & Suppliers →
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={networkGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#f0f0f0'} />
                    <XAxis dataKey="month" stroke={isDark ? '#aaa' : '#666'} />
                    <YAxis stroke={isDark ? '#aaa' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#333' : 'white',
                        border: isDark ? '1px solid #555' : '1px solid #e0e0e0',
                        borderRadius: 8,
                        color: isDark ? '#fff' : 'inherit'
                      }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="farmers"
                      stroke="#2196f3"
                      strokeWidth={3}
                      name="Total Farmers"
                      dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="suppliers"
                      stroke="#4caf50"
                      strokeWidth={3}
                      name="Total Suppliers"
                      dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalNetwork"
                      stroke="#9c27b0"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Combined Network"
                      dot={{ fill: '#9c27b0', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Bottom Section - Enhanced Quick Actions with Scrolling */}
        <Box sx={{ display: 'flex', gap: 2, px: 0 }}>
          {/* Quick Actions Panel */}
          <Box sx={{ flex: '1' }}>
            <Paper elevation={0} sx={{
              borderRadius: 2,
              borderTop: '4px solid #00bcd4',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper',
              p: 3,
              height: 250,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(0,188,212,0.2)' : 'rgba(0,188,212,0.15)',
                  border: '1px solid rgba(0,188,212,0.3)'
                }}>
                  <Assessment sx={{ color: '#00bcd4', fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  Quick Actions
                </Typography>
              </Stack>
              
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#00bcd4',
                  borderRadius: '3px',
                  '&:hover': {
                    background: '#00acc1',
                  },
                },
              }}>
                <Stack spacing={1.5}>
                  {quickActions.map((action, index) => (
                    <Button 
                      key={index}
                      variant="outlined" 
                      fullWidth 
                      startIcon={action.icon}
                      onClick={() => handleQuickAction(action.action)}
                      sx={{
                        justifyContent: 'flex-start',
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1.2,
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        borderColor: '#00bcd4',
                        color: isDark ? '#00bcd4' : '#006064',
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(0,188,212,0.08)',
                          borderColor: '#00acc1',
                          transform: 'translateX(4px)',
                          boxShadow: '0 2px 8px rgba(0,188,212,0.15)'
                        },
                        transition: 'all 0.3s ease',
                        minHeight: '40px'
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Recent Activity Panel */}
          <Box sx={{ flex: '2' }}>
            <Paper elevation={0} sx={{
              borderRadius: 2,
              borderTop: '4px solid #795548',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              bgcolor: 'background.paper',
              p: 3,
              height: 250,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Recent Activity ({periodLabels[tabIndex]})
              </Typography>
              <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                {[
                  { action: `New farmer ${farmers[farmers.length - 1]?.name || 'Unknown'} registered`, time: '2 minutes ago', type: 'success' },
                  { action: `Milk collected: ${totalMilkCollection.toFixed(1)}L in this period`, time: '15 minutes ago', type: 'info' },
                  { action: `Revenue: ₹${(totalRevenue / 1000).toFixed(1)}K generated`, time: '30 minutes ago', type: 'success' },
                  { action: `${filteredSales.length} sales transactions recorded`, time: '1 hour ago', type: 'info' },
                  { action: `${filteredMilkEntries.length} milk collection entries`, time: '2 hours ago', type: 'info' },
                  { action: `${labQualityTests.length} quality tests completed`, time: '3 hours ago', type: 'success' },
                  { action: `Network grew to ${farmers.length + suppliers.length} partners`, time: '4 hours ago', type: 'success' },
                ].map((activity, idx) => (
                  <Stack key={idx} direction="row" alignItems="center" sx={{ py: 1 }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: activity.type === 'success' ? '#4caf50' :
                        activity.type === 'warning' ? '#ff9800' : '#2196f3',
                      mr: 2,
                      flexShrink: 0
                    }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="500">{activity.action}</Typography>
                      <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Report Generator Dialog */}
      <ReportGenerator 
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      />
    </Box>
  );
};

export default Dashboard;
