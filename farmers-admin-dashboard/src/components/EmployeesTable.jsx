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
  Person,
  Work,
  Business,
} from '@mui/icons-material';

import employeeService from '../services/employeeService';
import useSocket from '../hooks/useSocket';
import ViewEmployeeModal from './ViewEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const TEAL = "#009688"; // Professional teal color for workforce management

// Department configuration (same as original Workforce page)
const DEPARTMENT_CONFIG = {
  'Production': { color: '#2196F3', icon: '🏭', bgColor: '#E3F2FD' },
  'Quality Control': { color: '#4CAF50', icon: '🔬', bgColor: '#E8F5E8' },
  'Processing': { color: '#FF9800', icon: '⚙️', bgColor: '#FFF3E0' },
  'Logistics': { color: '#9C27B0', icon: '🚛', bgColor: '#F3E5F5' },
  'Administration': { color: '#607D8B', icon: '📋', bgColor: '#ECEFF1' },
  'Maintenance': { color: '#795548', icon: '🔧', bgColor: '#EFEBE9' }
};

const EmployeesTable = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const socket = useSocket('http://localhost:5000');

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllEmployees();
      let employeesData = [];
      if (response && response.data) {
        employeesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        employeesData = response;
      }
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError(`Failed to load employees: ${err.message}`);
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = employees.filter(emp =>
        Object.values(emp).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchText, employees]);

  useEffect(() => {
    if (!socket) return;

    socket.on('employee:created', payload => {
      setEmployees(prev => [payload.data, ...prev]);
    });
    socket.on('employee:updated', payload => {
      setEmployees(prev =>
        prev.map(emp => (emp.id === payload.data.id ? payload.data : emp))
      );
    });
    socket.on('employee:deleted', payload => {
      setEmployees(prev => prev.filter(emp => emp.id !== payload.data.id));
    });

    return () => {
      socket.off('employee:created');
      socket.off('employee:updated');
      socket.off('employee:deleted');
    };
  }, [socket]);

  const handleView = employee => {
    setSelectedEmployee(employee);
    setViewModalOpen(true);
  };

  const handleEdit = employee => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleDelete = employee => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async updatedEmployee => {
    try {
      if (updatedEmployee.id) {
        await employeeService.updateEmployee(updatedEmployee.id, updatedEmployee);
      } else {
        await employeeService.createEmployee(updatedEmployee);
      }
      await loadEmployees();
      setEditModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error saving employee:', err);
      alert('Error saving employee: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await employeeService.deleteEmployee(selectedEmployee.id);
      await loadEmployees();
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Error deleting employee: ' + err.message);
    }
  };

  const columns = [
  { 
    field: 'employee_id', 
    headerName: 'Employee ID', 
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
    field: 'name', 
    headerName: 'Employee Name', 
    width: 200,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Avatar sx={{ bgcolor: TEAL, mr: 1, width: 32, height: 32 }}>
          {params.value?.charAt(0)}
        </Avatar>
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'position', 
    headerName: 'Position', 
    width: 160,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'department', 
    headerName: 'Department', 
    width: 150,
    renderCell: params => {
      const deptConfig = DEPARTMENT_CONFIG[params.value] || { color: '#757575', icon: '👥' };
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={params.value}
            size="small"
            sx={{ 
              bgcolor: alpha(deptConfig.color, 0.1),
              color: deptConfig.color,
              fontWeight: 'medium',
              '& .MuiChip-label': { px: 1 }
            }}
            icon={<span style={{ fontSize: '14px' }}>{deptConfig.icon}</span>}
          />
        </Box>
      );
    }
  },
  { 
    field: 'phone', 
    headerName: 'Phone', 
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
    field: 'email', 
    headerName: 'Email', 
    width: 200,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" color="primary.main">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'salary', 
    headerName: 'Salary', 
    width: 130,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" fontWeight="medium" color="success.main">
          ₹{Number(params.value || 0).toLocaleString()}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 100,
    renderCell: params => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip 
          label={params.value} 
          color={params.value === 'Active' ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      </Box>
    )
  },
  { 
    field: 'join_date', 
    headerName: 'Join Date', 
    width: 130,
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


  // StatCard component with teal accent
  const StatsCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        bgcolor: alpha(TEAL, 0.08),
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
      <Avatar sx={{ bgcolor: TEAL, color: "#fff", mr: 1 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: TEAL }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
    </Card>
  );

  // DepartmentCard component
  const DepartmentCard = ({ department, count, config }) => (
    <Card
      sx={{
        bgcolor: config.bgColor,
        borderRadius: 2,
        boxShadow: 0,
        minWidth: 120,
        textAlign: 'center',
        p: 1.5,
        border: `1px solid ${alpha(config.color, 0.2)}`
      }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        {config.icon}
      </Typography>
      <Typography variant="h6" sx={{ color: config.color, fontWeight: 'bold' }}>
        {count}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {department}
      </Typography>
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
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const avgSalary = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0) / employees.length 
    : 0;

  return (
    <Box p={2}>
      {/* Teal header bar with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Person sx={{ color: TEAL, fontSize: 32, mr: 1 }} />
        <Typography variant="h4" sx={{ color: TEAL, fontWeight: 600 }}>
          Employee Directory
        </Typography>
      </Box>

      {/* Stat cards: responsive row/column */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Total Employees"
            value={totalEmployees}
            icon={<Person />}
            color={TEAL}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Active Employees"
            value={activeEmployees}
            icon={<Work />}
            color={TEAL}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Departments"
            value={Object.keys(departmentCounts).length}
            icon={<Business />}
            color={TEAL}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            title="Avg Salary"
            value={`₹${(avgSalary / 1000).toFixed(0)}K`}
            icon={<Person />}
            color={TEAL}
          />
        </Grid>
      </Grid>

      {/* Department Overview */}
      {Object.keys(departmentCounts).length > 0 && (
        <Box mb={3}>
          <Typography variant="h5" gutterBottom sx={{ color: TEAL, fontWeight: 600 }}>
            Department Overview
          </Typography>
          <Grid container spacing={1.5}>
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const config = DEPARTMENT_CONFIG[dept] || { color: '#757575', icon: '👥', bgColor: '#F5F5F5' };
              return (
                <Grid item xs={6} sm={4} md={2} key={dept}>
                  <DepartmentCard 
                    department={dept}
                    count={count}
                    config={config}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Search bar + refresh */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap" >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search employees..."
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
            <IconButton onClick={loadEmployees}>
              <Refresh />
            </IconButton>
          </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          getRowId={row => row.id}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
        />
      </Paper>

      <ViewEmployeeModal
        open={viewModalOpen}
        employee={selectedEmployee}
        onClose={() => setViewModalOpen(false)}
      />
      <EditEmployeeModal
        open={editModalOpen}
        employee={selectedEmployee}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={selectedEmployee}
        itemType="employee"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default EmployeesTable;
