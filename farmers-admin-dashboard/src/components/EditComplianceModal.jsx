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
  FormHelperText,
} from '@mui/material';

// Constants from original Compliance page
const COMPLIANCE_TYPES = [
  'FSSAI License', 'ISO Certification', 'HACCP', 'Environmental Clearance',
  'Labor Compliance', 'Tax Compliance', 'Fire Safety', 'Pollution Control',
  'Quality Management', 'Food Safety', 'Waste Management', 'Energy Compliance'
];

const COMPLIANCE_STATUS = ['Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Expired', 'Renewed'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low', 'Critical'];

const EditComplianceModal = ({ open, record, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    due_date: '',
    completed_date: '',
    assigned_to: '',
    responsible_department: '',
    compliance_officer: '',
    regulatory_body: '',
    license_number: '',
    validity_period: '',
    renewal_date: '',
    cost: '',
    remarks: '',
    risk_level: 'Medium',
    business_impact: 'Medium'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record) {
      setFormData({ 
        ...record,
        due_date: record.due_date ? record.due_date.slice(0, 10) : '',
        completed_date: record.completed_date ? record.completed_date.slice(0, 10) : '',
        renewal_date: record.renewal_date ? record.renewal_date.slice(0, 10) : '',
        cost: record.cost?.toString() || ''
      });
    } else {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      setFormData({
        id: `COMP${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        type: '',
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        due_date: nextMonth.toISOString().slice(0, 10),
        completed_date: '',
        assigned_to: '',
        responsible_department: '',
        compliance_officer: '',
        regulatory_body: '',
        license_number: '',
        validity_period: '',
        renewal_date: '',
        cost: '',
        remarks: '',
        risk_level: 'Medium',
        business_impact: 'Medium'
      });
    }
    setErrors({});
  }, [record, open]);

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
      case 'type':
        if (!value.trim()) error = 'Compliance type is required';
        break;
      case 'title':
        if (!value.trim()) error = 'Title is required';
        else if (value.length < 5) error = 'Title must be at least 5 characters';
        break;
      case 'description':
        if (!value.trim()) error = 'Description is required';
        else if (value.length < 10) error = 'Description must be at least 10 characters';
        break;
      case 'due_date':
        if (!value.trim()) error = 'Due date is required';
        break;
      case 'assigned_to':
        if (!value.trim()) error = 'Assigned person is required';
        break;
      case 'responsible_department':
        if (!value.trim()) error = 'Responsible department is required';
        break;
      case 'cost':
        if (value && (isNaN(value) || Number(value) < 0)) {
          error = 'Cost must be a positive number';
        }
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    // Required field validations
    const requiredFields = [
      'type', 'title', 'description', 'due_date', 'assigned_to', 'responsible_department'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    // Check if completed date is after due date when status is Compliant
    if (formData.status === 'Compliant' && formData.completed_date && formData.due_date) {
      if (new Date(formData.completed_date) < new Date(formData.due_date)) {
        setErrors(prev => ({ ...prev, completed_date: 'Completed date should not be before due date' }));
      }
    }

    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid) {
      // Convert cost back to number if provided
      const saveData = {
        ...formData,
        cost: formData.cost ? Number(formData.cost) : null
      };
      onSave(saveData);
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {record ? 'Edit Compliance Record' : 'Add New Compliance Record'}
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
              label="Record ID" 
              value={formData.id} 
              onChange={handleChange('id')} 
              fullWidth 
              required
              disabled={!!record} // Disable editing ID for existing records
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.type}>
              <InputLabel>Compliance Type</InputLabel>
              <Select 
                value={formData.type} 
                onChange={handleChange('type')}
                label="Compliance Type"
              >
                {COMPLIANCE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Title" 
              value={formData.title} 
              onChange={handleChange('title')} 
              fullWidth 
              required
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Description" 
              value={formData.description} 
              onChange={handleChange('description')} 
              fullWidth 
              required
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select 
                value={formData.priority} 
                onChange={handleChange('priority')}
                label="Priority"
              >
                {PRIORITY_LEVELS.map(priority => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select 
                value={formData.status} 
                onChange={handleChange('status')}
                label="Status"
              >
                {COMPLIANCE_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Risk Level</InputLabel>
              <Select 
                value={formData.risk_level} 
                onChange={handleChange('risk_level')}
                label="Risk Level"
              >
                {PRIORITY_LEVELS.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Assignment Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Assignment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Assigned To" 
              value={formData.assigned_to} 
              onChange={handleChange('assigned_to')} 
              fullWidth 
              required
              error={!!errors.assigned_to}
              helperText={errors.assigned_to}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Responsible Department" 
              value={formData.responsible_department} 
              onChange={handleChange('responsible_department')} 
              fullWidth 
              required
              error={!!errors.responsible_department}
              helperText={errors.responsible_department}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Compliance Officer" 
              value={formData.compliance_officer} 
              onChange={handleChange('compliance_officer')} 
              fullWidth 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Regulatory Body" 
              value={formData.regulatory_body} 
              onChange={handleChange('regulatory_body')} 
              fullWidth 
            />
          </Grid>

          {/* Date Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Date Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={handleChange('due_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.due_date}
              helperText={errors.due_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Completed Date"
              type="date"
              value={formData.completed_date}
              onChange={handleChange('completed_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.completed_date}
              helperText={errors.completed_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Renewal Date"
              type="date"
              value={formData.renewal_date}
              onChange={handleChange('renewal_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
              label="License Number" 
              value={formData.license_number} 
              onChange={handleChange('license_number')} 
              fullWidth 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Validity Period" 
              value={formData.validity_period} 
              onChange={handleChange('validity_period')} 
              fullWidth 
              placeholder="e.g., 2 years"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Cost (₹)" 
              value={formData.cost} 
              onChange={handleChange('cost')} 
              fullWidth 
              type="number"
              error={!!errors.cost}
              helperText={errors.cost}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Business Impact</InputLabel>
              <Select 
                value={formData.business_impact} 
                onChange={handleChange('business_impact')}
                label="Business Impact"
              >
                {PRIORITY_LEVELS.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Remarks" 
              value={formData.remarks} 
              onChange={handleChange('remarks')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Any additional notes or comments..."
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
          {record ? 'Save Changes' : 'Add Record'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditComplianceModal;
