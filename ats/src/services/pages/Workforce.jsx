import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Divider, Badge, LinearProgress, Tooltip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';

// Enhanced validation patterns
const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALARY_REGEX = /^\d+$/;
const ID_REGEX = /^[A-Z0-9]+$/;

// Department colors and icons
const DEPARTMENT_CONFIG = {
  'Production': { color: '#2196F3', icon: '🏭', bgColor: '#E3F2FD' },
  'Quality Control': { color: '#4CAF50', icon: '🔬', bgColor: '#E8F5E8' },
  'Processing': { color: '#FF9800', icon: '⚙️', bgColor: '#FFF3E0' },
  'Logistics': { color: '#9C27B0', icon: '🚛', bgColor: '#F3E5F5' },
  'Administration': { color: '#607D8B', icon: '📋', bgColor: '#ECEFF1' },
  'Maintenance': { color: '#795548', icon: '🔧', bgColor: '#EFEBE9' }
};

const Workforce = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const { 
  // Backend-connected employees (primary)
  employeesFromDB,
  employeesLoading,
  addEmployeeToDB,
  updateEmployeeInDB,
  deleteEmployeeFromDB,
  // Local employees (fallback)
  employees: localEmployees,
  setEmployees: setLocalEmployees
} = useAppContext();
  
   // Use backend data if available, otherwise use local data
const employees = Array.isArray(employeesFromDB) && employeesFromDB.length > 0 
  ? employeesFromDB 
  : Array.isArray(localEmployees) ? localEmployees : [];
const isUsingBackendData = Array.isArray(employeesFromDB) && employeesFromDB.length > 0;

console.log('🔍 Data source debug:', {
  employeesFromDB: employeesFromDB,
  employeesFromDBLength: employeesFromDB?.length || 0,
  localEmployees: localEmployees?.length || 0,
  isUsingBackendData,
  finalEmployeesCount: employees.length
});


  // Enhanced form state with additional attributes
  const [employeeForm, setEmployeeForm] = useState({
    id: '',
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    salary: '',
    joinDate: '',
    status: 'Active',
    address: '',
    emergencyContact: '',
    experience: '',
    qualification: '',
    bloodGroup: '',
    dateOfBirth: ''
  });

  const [editEmployeeIdx, setEditEmployeeIdx] = useState(null);
  const [editEmployeeForm, setEditEmployeeForm] = useState({
    id: '',
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    salary: '',
    joinDate: '',
    status: 'Active',
    address: '',
    emergencyContact: '',
    experience: '',
    qualification: '',
    bloodGroup: '',
    dateOfBirth: ''
  });

  // Enhanced validation states
  const [validationErrors, setValidationErrors] = useState({});

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Enhanced validation function
  const validateForm = (form) => {
    const errors = {};
    
    if (!form.id) errors.id = 'Employee ID is required';
    else if (!ID_REGEX.test(form.id)) errors.id = 'Invalid ID format (use letters and numbers)';
    
    if (!form.name) errors.name = 'Name is required';
    else if (!NAME_REGEX.test(form.name)) errors.name = 'Name should contain only letters and spaces';
    
    if (!form.phone) errors.phone = 'Phone is required';
    else if (!PHONE_REGEX.test(form.phone)) errors.phone = 'Phone must be 10 digits';
    
    if (!form.email) errors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) errors.email = 'Invalid email format';
    
    if (!form.salary) errors.salary = 'Salary is required';
    else if (!SALARY_REGEX.test(form.salary)) errors.salary = 'Salary must be a number';
    
    if (!form.department) errors.department = 'Department is required';
    if (!form.position) errors.position = 'Position is required';
    if (!form.joinDate) errors.joinDate = 'Join date is required';

    return errors;
  };

  // Handle form changes with validation
  const handleFormChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const setForm = isEdit ? setEditEmployeeForm : setEmployeeForm;
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

 // Enhanced add employee function
const handleAddEmployee = async (e) => {
  e.preventDefault();
  
  const errors = validateForm(employeeForm);
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  // Check for duplicate ID
  const existingEmployee = employees.find(emp => emp.id === employeeForm.id || emp.employeeId === employeeForm.id);
  if (existingEmployee) {
    setValidationErrors({ id: 'Employee ID already exists' });
    return;
  }

  try {
    console.log('➕ Adding employee, backend mode:', isUsingBackendData);
    
    if (isUsingBackendData) {
      console.log('💾 Adding to backend:', employeeForm);
      await addEmployeeToDB(employeeForm);
      console.log('✅ Successfully added to backend');
    } else {
      console.log('💾 Adding to local storage:', employeeForm);
      setLocalEmployees(prev => [employeeForm, ...prev]);
    }
    
    // Reset form
    setEmployeeForm({
      id: '', name: '', position: '', department: '', phone: '', email: '',
      salary: '', joinDate: '', status: 'Active', address: '', emergencyContact: '',
      experience: '', qualification: '', bloodGroup: '', dateOfBirth: ''
    });
    setValidationErrors({});
    
  } catch (error) {
    console.error('❌ Error adding employee:', error);
    alert('Error adding employee: ' + (error?.message || 'Unknown error'));
  }
};


// Enhanced edit functions
// REPLACE handleEditEmployee function:
const handleEditEmployee = (idx) => {
  const selectedEmployee = employees[idx];
  console.log('📝 Editing employee:', selectedEmployee);
  
  // Store the database ID for backend operations, or index for local operations
  if (isUsingBackendData && selectedEmployee.id) {
    setEditEmployeeIdx(selectedEmployee.id); // Use database ID for backend
  } else {
    setEditEmployeeIdx(idx); // Use index for local operations
  }
  
  setEditEmployeeForm(selectedEmployee);
  setValidationErrors({});
};

// REPLACE handleSaveEdit function:
const handleSaveEdit = async () => {
  const errors = validateForm(editEmployeeForm);
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  try {
    if (isUsingBackendData) {
      console.log('💾 Updating employee in backend:', editEmployeeIdx, editEmployeeForm);
      await updateEmployeeInDB(editEmployeeIdx, editEmployeeForm);
    } else {
      console.log('💾 Updating employee locally:', editEmployeeIdx, editEmployeeForm);
      setLocalEmployees(prev => {
        const updated = [...prev];
        updated[editEmployeeIdx] = editEmployeeForm;
        return updated;
      });
    }
    
    setEditEmployeeIdx(null);
    setValidationErrors({});
    console.log('✅ Employee update successful');
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    alert('Error updating employee: ' + (error?.message || 'Unknown error'));
  }
};
 


const handleDeleteEmployee = async (idx) => {
  const employee = employees[idx];
  if (!employee) {
    console.warn('⚠️ Employee not found at index:', idx);
    return;
  }
  
  const confirmed = window.confirm(`Are you sure you want to delete "${employee.name}"?`);
  if (!confirmed) return;
  
  try {
    console.log('🗑️ Deleting employee, backend mode:', isUsingBackendData);
    
    if (isUsingBackendData && employee.id) {
      console.log('💾 Deleting from backend:', employee.id);
      await deleteEmployeeFromDB(employee.id);
      console.log('✅ Successfully deleted from backend');
    } else {
      console.log('💾 Deleting from local storage:', idx);
      setLocalEmployees(prev => prev.filter((_, i) => i !== idx));
    }
  } catch (error) {
    console.error('❌ Error deleting employee:', error);
    alert('Error deleting employee: ' + (error?.message || 'Unknown error'));
  }
};



  // View employee details
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setDetailsDialogOpen(true);
  };

  // Calculate statistics
  // Calculate statistics using active data source
const totalEmployees = employees ? employees.length : 0;
const activeEmployees = employees ? employees.filter(emp => emp.status === 'Active').length : 0;
const departmentCounts = employees ? employees.reduce((acc, emp) => {
  acc[emp.department] = (acc[emp.department] || 0) + 1;
  return acc;
}, {}) : {};
const avgSalary = employees && employees.length > 0 
  ? employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0) / employees.length 
  : 0;


  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <Paper elevation={4} sx={{
        background: isDark 
          ? 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)' 
          : 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
        color: 'white',
        p: 4,
        borderRadius: 4,
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <WorkIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Workforce Management
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage your team and employee information
              </Typography>
            </Box>
          </Stack>
        </Box>
        
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
      </Paper>

      {/* Equal-Sized Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3, height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center',py: 2.5,width: 250, height: 210 }}>
              <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {totalEmployees}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Total Employees
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Active partners
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="primary"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3, height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center',py: 2.5,width: 250, height: 210 }}>
              <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <Badge badgeContent={activeEmployees} color="success">
                  <WorkIcon fontSize="large" />
                </Badge>
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {activeEmployees}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Active Employees
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Currently working
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activeEmployees / totalEmployees) * 100} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3, height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center',py: 2.5,width: 250, height: 210 }}>
              <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="warning.main">
                {Object.keys(departmentCounts).length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Departments
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Different divisions
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3, height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center',py: 2.5,width: 250, height: 210 }}>
              <Avatar sx={{ bgcolor: '#9C27B0', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <AttachMoneyIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="secondary.main">
                ₹{(avgSalary / 1000).toFixed(0)}K
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Avg Salary
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Per employee
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={60} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Overview */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Department Overview
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(departmentCounts).map(([dept, count]) => {
            const config = DEPARTMENT_CONFIG[dept] || { color: '#757575', icon: '👥', bgColor: '#F5F5F5' };
            return (
              <Grid item xs={12} sm={6} md={4} key={dept}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: config.bgColor,
                    border: `2px solid ${config.color}20`
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: config.color, width: 40, height: 40 }}>
                      <Typography fontSize="1.2rem">{config.icon}</Typography>
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" color={config.color}>
                        {count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dept}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Inline Add Employee Form */}
      {/* Inline Add Employee Form with Enhanced Heading and Light Background */}
<Paper elevation={3} sx={{ 
  p: 3, 
  borderRadius: 3, 
  mb: 4,
  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(240,248,255,0.3)' // Very light background
}}>
  <Typography variant="h6" fontWeight="bold" sx={{ 
    mb: 3, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2,
    color: 'primary.main',
    fontSize: '1.3rem'
  }}>
    <PersonIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />
    Employee Registration Form
  </Typography>
  
  <Box component="form" onSubmit={handleAddEmployee}>
    <Grid container spacing={3}>
      {/* Basic Information */}
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
          Basic Information:
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
        sx={{ width: '140px' }}
          fullWidth
          label="Employee ID"
          name="id"
          value={employeeForm.id}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.id}
          helperText={validationErrors.id}
          required
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
        sx={ { width: '130px' }}
          fullWidth
          label="Full Name"
          name="name"
          value={employeeForm.name}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.name}
          helperText={validationErrors.name}
          required
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
        sx={ { width: '150px' }}
          select
          fullWidth
          label="Department"
          name="department"
          value={employeeForm.department}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.department}
          helperText={validationErrors.department}
          required
          size="small"
        >
          {Object.keys(DEPARTMENT_CONFIG).map(dept => (
            <MenuItem key={dept} value={dept}>
              {DEPARTMENT_CONFIG[dept].icon} {dept}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          sx={ { width: '160px' }}
          fullWidth
          label="Position"
          name="position"
          value={employeeForm.position}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.position}
          helperText={validationErrors.position}
          required
          size="small"
        />
      </Grid>

      {/* Contact Information */}
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1, mt: 0 }}>
          Contact Information:
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={employeeForm.phone}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.phone}
          helperText={validationErrors.phone}
          required
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={employeeForm.email}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.email}
          helperText={validationErrors.email}
          required
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Emergency Contact"
          name="emergencyContact"
          value={employeeForm.emergencyContact}
          onChange={(e) => handleFormChange(e)}
          size="small"
        />
      </Grid>

      {/* Employment Details */}
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1, mt: 0 }}>
          Employment Details:
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Salary"
          name="salary"
          value={employeeForm.salary}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.salary}
          helperText={validationErrors.salary}
          required
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          type="date"
          label="Join Date"
          name="joinDate"
          value={employeeForm.joinDate}
          onChange={(e) => handleFormChange(e)}
          error={!!validationErrors.joinDate}
          helperText={validationErrors.joinDate}
          InputLabelProps={{ shrink: true }}
          required
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={employeeForm.status}
          onChange={(e) => handleFormChange(e)}
          size="small"
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Experience (Years)"
          name="experience"
          value={employeeForm.experience}
          onChange={(e) => handleFormChange(e)}
          size="small"
        />
      </Grid>

      {/* Additional Information */}
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1, mt: 0 }}>
          Additional Information:
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Qualification"
          name="qualification"
          value={employeeForm.qualification}
          onChange={(e) => handleFormChange(e)}
          size="small"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
        sx={{ width: '150px' }}
          select
          fullWidth
          label="Blood Group"
          name="bloodGroup"
          value={employeeForm.bloodGroup}
          onChange={(e) => handleFormChange(e)}
          size="small"
        >
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
        </TextField>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          name="dateOfBirth"
          value={employeeForm.dateOfBirth}
          onChange={(e) => handleFormChange(e)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          multiline
          rows={1}
          value={employeeForm.address}
          onChange={(e) => handleFormChange(e)}
          size="small"
        />
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: 3, 
              px: 4, 
              py: 1.5, 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)'
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Grid>
    </Grid>
  </Box>
</Paper>


      {/* Enhanced Employee Table */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
        }}>
          <Typography variant="h6" fontWeight="bold">
            Employee Directory
          </Typography>
        </Box>
        
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Employee
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Position
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Department
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Salary
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {/* Employee Table Body with Loading State */}
<TableBody>
  {employeesLoading ? (
    <TableRow>
      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
        <Typography>Loading employees...</Typography>
      </TableCell>
    </TableRow>
  ) : employees.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            No employees found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {isUsingBackendData ? 'No employees in database' : 'Start by adding your first employee using the form above'}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  ) : (
    employees.map((employee, idx) => {
      const deptConfig = DEPARTMENT_CONFIG[employee.department] || { color: '#757575', icon: '👥' };
      return (
        <TableRow key={employee.id || employee.employeeId || idx} hover>
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: deptConfig.color, width: 40, height: 40 }}>
                {employee.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography fontWeight="bold">{employee.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {employee.id || employee.employeeId}
                </Typography>
              </Box>
            </Stack>
          </TableCell>
          <TableCell>
            <Typography fontWeight="medium">{employee.position}</Typography>
          </TableCell>
          <TableCell>
            <Chip 
              label={employee.department} 
              size="small" 
              sx={{ 
                bgcolor: deptConfig.bgColor,
                color: deptConfig.color,
                fontWeight: 'bold'
              }}
            />
          </TableCell>
          <TableCell>
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon fontSize="small" color="action" />
                {employee.phone}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon fontSize="small" color="action" />
                {employee.email}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Typography fontWeight="bold" color="success.main">
              ₹{Number(employee.salary).toLocaleString()}
            </Typography>
          </TableCell>
          <TableCell>
            <Chip 
              label={employee.status} 
              color={employee.status === 'Active' ? 'success' : 'error'} 
              size="small" 
            />
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1}>
              <Tooltip title="View Details">
                <IconButton 
                  color="info" 
                  onClick={() => handleViewDetails(employee)}
                  sx={{ borderRadius: 2 }}
                  size="small"
                >
                  <PersonIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton 
                  color="primary" 
                  onClick={() => handleEditEmployee(idx)}
                  sx={{ borderRadius: 2 }}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton 
                  color="error" 
                  onClick={() => handleDeleteEmployee(idx)}
                  sx={{ borderRadius: 2 }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        </TableRow>
      );
    })
  )}
</TableBody>


          </Table>
        </TableContainer>
      </Paper>

      {/* Enhanced Edit Employee Dialog */}
      <Dialog 
        open={editEmployeeIdx !== null} 
        onClose={() => setEditEmployeeIdx(null)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          fontWeight: 'bold', 
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <EditIcon />
          Edit Employee
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Same form structure as Add Dialog but with editEmployeeForm */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="id"
                value={editEmployeeForm.id}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.id}
                helperText={validationErrors.id}
                disabled
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={editEmployeeForm.name}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                name="department"
                value={editEmployeeForm.department}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.department}
                helperText={validationErrors.department}
                required
              >
                {Object.keys(DEPARTMENT_CONFIG).map(dept => (
                  <MenuItem key={dept} value={dept}>
                    {DEPARTMENT_CONFIG[dept].icon} {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={editEmployeeForm.position}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.position}
                helperText={validationErrors.position}
                required
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2, mt: 2 }}>
                Contact Information
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={editEmployeeForm.phone}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={editEmployeeForm.email}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={editEmployeeForm.address}
                onChange={(e) => handleFormChange(e, true)}
              />
            </Grid>

            {/* Employment Details */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2, mt: 2 }}>
                Employment Details
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                value={editEmployeeForm.salary}
                onChange={(e) => handleFormChange(e, true)}
                error={!!validationErrors.salary}
                helperText={validationErrors.salary}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={editEmployeeForm.status}
                onChange={(e) => handleFormChange(e, true)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setEditEmployeeIdx(null)} 
            variant="outlined" 
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            sx={{ borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          fontWeight: 'bold', 
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <PersonIcon />
          Employee Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedEmployee && (
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: DEPARTMENT_CONFIG[selectedEmployee.department]?.color || '#757575'
                  }}
                >
                  <Typography variant="h4">{selectedEmployee.name?.charAt(0)}</Typography>
                </Avatar>
                <Typography variant="h5" fontWeight="bold">{selectedEmployee.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{selectedEmployee.position}</Typography>
                <Chip 
                  label={selectedEmployee.department} 
                  color="primary" 
                  sx={{ mt: 1 }} 
                />
              </Box>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Employee ID</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedEmployee.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={selectedEmployee.status} 
                    color={selectedEmployee.status === 'Active' ? 'success' : 'error'} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedEmployee.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedEmployee.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Salary</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹{Number(selectedEmployee.salary).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Join Date</Typography>
                  <Typography variant="body1">{selectedEmployee.joinDate}</Typography>
                </Grid>
              </Grid>

              {selectedEmployee.address && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1">{selectedEmployee.address}</Typography>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDetailsDialogOpen(false)} 
            variant="contained" 
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workforce;
