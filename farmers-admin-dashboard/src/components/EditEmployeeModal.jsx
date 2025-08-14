import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
  Divider,
  Box,
} from '@mui/material';

// Department configuration and validation patterns (same as original)
const DEPARTMENT_CONFIG = {
  'Production': { color: '#2196F3', icon: '🏭', bgColor: '#E3F2FD' },
  'Quality Control': { color: '#4CAF50', icon: '🔬', bgColor: '#E8F5E8' },
  'Processing': { color: '#FF9800', icon: '⚙️', bgColor: '#FFF3E0' },
  'Logistics': { color: '#9C27B0', icon: '🚛', bgColor: '#F3E5F5' },
  'Administration': { color: '#607D8B', icon: '📋', bgColor: '#ECEFF1' },
  'Maintenance': { color: '#795548', icon: '🔧', bgColor: '#EFEBE9' }
};

// Validation patterns (same as original Workforce page)
const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALARY_REGEX = /^\d+$/;
const ID_REGEX = /^[A-Z0-9]+$/;

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EditEmployeeModal = ({ open, employee, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    salary: '',
    join_date: '',
    status: 'Active',
    address: '',
    emergency_contact: '',
    experience: '',
    qualification: '',
    blood_group: '',
    date_of_birth: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({ 
        ...employee,
        salary: employee.salary?.toString() || '',
        join_date: employee.join_date ? employee.join_date.slice(0, 10) : '',
        date_of_birth: employee.date_of_birth ? employee.date_of_birth.slice(0, 10) : '',
        // Handle both employee_id and id fields
        employee_id: employee.employee_id || employee.id || ''
      });
    } else {
      setFormData({
        employee_id: '',
        name: '',
        position: '',
        department: '',
        phone: '',
        email: '',
        salary: '',
        join_date: new Date().toISOString().slice(0, 10),
        status: 'Active',
        address: '',
        emergency_contact: '',
        experience: '',
        qualification: '',
        blood_group: '',
        date_of_birth: ''
      });
    }
    setErrors({});
  }, [employee, open]);

  const handleChange = field => e => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time validation
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'employee_id':
        if (!value.trim()) error = 'Employee ID is required';
        else if (!ID_REGEX.test(value)) error = 'Invalid ID format (use letters and numbers)';
        break;
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (!NAME_REGEX.test(value)) error = 'Name should contain only letters and spaces';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!PHONE_REGEX.test(value)) error = 'Phone must be 10 digits';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!EMAIL_REGEX.test(value)) error = 'Invalid email format';
        break;
      case 'salary':
        if (!value.trim()) error = 'Salary is required';
        else if (!SALARY_REGEX.test(value)) error = 'Salary must be a number';
        break;
      case 'department':
        if (!value.trim()) error = 'Department is required';
        break;
      case 'position':
        if (!value.trim()) error = 'Position is required';
        break;
      case 'join_date':
        if (!value.trim()) error = 'Join date is required';
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    const requiredFields = [
      'employee_id', 'name', 'position', 'department', 
      'phone', 'email', 'salary', 'join_date'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    // Check for duplicate ID (if creating new employee)
    // Note: This would typically be handled by the backend

    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid) {
      // Convert salary back to number
      const saveData = {
        ...formData,
        salary: Number(formData.salary)
      };
      onSave(saveData);
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        <Grid container spacing={2}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Employee ID" 
              value={formData.employee_id} 
              onChange={handleChange('employee_id')} 
              fullWidth 
              required
              error={!!errors.employee_id}
              helperText={errors.employee_id}
              disabled={!!employee} // Disable editing ID for existing employees
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Full Name" 
              value={formData.name} 
              onChange={handleChange('name')} 
              fullWidth 
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select 
                value={formData.department} 
                onChange={handleChange('department')}
                label="Department"
              >
                {Object.keys(DEPARTMENT_CONFIG).map(dept => (
                  <MenuItem key={dept} value={dept}>
                    {DEPARTMENT_CONFIG[dept].icon} {dept}
                  </MenuItem>
                ))}
              </Select>
              {errors.department && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.department}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Position" 
              value={formData.position} 
              onChange={handleChange('position')} 
              fullWidth 
              required
              error={!!errors.position}
              helperText={errors.position}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Phone Number" 
              value={formData.phone} 
              onChange={handleChange('phone')} 
              fullWidth 
              required
              inputProps={{ maxLength: 10 }}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Email Address" 
              value={formData.email} 
              onChange={handleChange('email')} 
              fullWidth 
              required
              type="email"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Address" 
              value={formData.address} 
              onChange={handleChange('address')} 
              fullWidth 
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Emergency Contact" 
              value={formData.emergency_contact} 
              onChange={handleChange('emergency_contact')} 
              fullWidth 
            />
          </Grid>

          {/* Employment Details */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Employment Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Salary (₹)" 
              value={formData.salary} 
              onChange={handleChange('salary')} 
              fullWidth 
              type="number"
              required
              error={!!errors.salary}
              helperText={errors.salary}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Join Date"
              type="date"
              value={formData.join_date}
              onChange={handleChange('join_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.join_date}
              helperText={errors.join_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select 
                value={formData.status} 
                onChange={handleChange('status')}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Experience" 
              value={formData.experience} 
              onChange={handleChange('experience')} 
              fullWidth 
              placeholder="e.g., 5 years"
            />
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Qualification" 
              value={formData.qualification} 
              onChange={handleChange('qualification')} 
              fullWidth 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Blood Group</InputLabel>
              <Select 
                value={formData.blood_group} 
                onChange={handleChange('blood_group')}
                label="Blood Group"
              >
                {BLOOD_GROUPS.map(group => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange('date_of_birth')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {hasErrors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the validation errors above.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={hasErrors}>
          {employee ? 'Save Changes' : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeModal;
