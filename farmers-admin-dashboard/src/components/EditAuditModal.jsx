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
const AUDIT_TYPES = [
  'Internal Audit', 'External Audit', 'Regulatory Inspection', 'Customer Audit',
  'Supplier Audit', 'Environmental Audit', 'Safety Audit', 'Quality Audit'
];

const AUDIT_STATUS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'];

const EditAuditModal = ({ open, audit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    audit_type: '',
    auditor: '',
    audit_firm: '',
    scheduled_date: '',
    completed_date: '',
    duration: '',
    status: 'Scheduled',
    findings: '',
    corrective_actions: '',
    score: '',
    audit_scope: '',
    audit_criteria: '',
    non_conformities: '',
    recommendations: '',
    follow_up_date: '',
    cost: '',
    report_path: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (audit) {
      setFormData({ 
        ...audit,
        scheduled_date: audit.scheduled_date ? audit.scheduled_date.slice(0, 10) : '',
        completed_date: audit.completed_date ? audit.completed_date.slice(0, 10) : '',
        follow_up_date: audit.follow_up_date ? audit.follow_up_date.slice(0, 10) : '',
        duration: audit.duration?.toString() || '',
        score: audit.score?.toString() || '',
        cost: audit.cost?.toString() || ''
      });
    } else {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      setFormData({
        id: `AUD${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        audit_type: '',
        auditor: '',
        audit_firm: '',
        scheduled_date: nextWeek.toISOString().slice(0, 10),
        completed_date: '',
        duration: '',
        status: 'Scheduled',
        findings: '',
        corrective_actions: '',
        score: '',
        audit_scope: '',
        audit_criteria: '',
        non_conformities: '',
        recommendations: '',
        follow_up_date: '',
        cost: '',
        report_path: ''
      });
    }
    setErrors({});
  }, [audit, open]);

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
      case 'audit_type':
        if (!value.trim()) error = 'Audit type is required';
        break;
      case 'auditor':
        if (!value.trim()) error = 'Auditor is required';
        else if (value.length < 2 || value.length > 100) error = 'Auditor name must be 2-100 characters';
        break;
      case 'scheduled_date':
        if (!value.trim()) error = 'Scheduled date is required';
        break;
      case 'audit_scope':
        if (!value.trim()) error = 'Audit scope is required';
        break;
      case 'duration':
        if (value && (isNaN(value) || Number(value) < 0 || Number(value) > 365)) {
          error = 'Duration must be between 0-365 days';
        }
        break;
      case 'score':
        if (value && (isNaN(value) || Number(value) < 0 || Number(value) > 100)) {
          error = 'Score must be between 0-100';
        }
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
      'audit_type', 'auditor', 'scheduled_date', 'audit_scope'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    // Check if completed date is after scheduled date when status is Completed
    if (formData.status === 'Completed' && formData.completed_date && formData.scheduled_date) {
      if (new Date(formData.completed_date) < new Date(formData.scheduled_date)) {
        setErrors(prev => ({ ...prev, completed_date: 'Completed date should not be before scheduled date' }));
      }
    }

    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid) {
      // Convert numeric fields back to numbers if provided
      const saveData = {
        ...formData,
        duration: formData.duration ? Number(formData.duration) : null,
        score: formData.score ? Number(formData.score) : null,
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
        {audit ? 'Edit Audit Record' : 'Schedule New Audit'}
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
              label="Audit ID" 
              value={formData.id} 
              onChange={handleChange('id')} 
              fullWidth 
              required
              disabled={!!audit} // Disable editing ID for existing audits
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
                {AUDIT_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.audit_type}>
              <InputLabel>Audit Type</InputLabel>
              <Select 
                value={formData.audit_type} 
                onChange={handleChange('audit_type')}
                label="Audit Type"
              >
                {AUDIT_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.audit_type && <FormHelperText>{errors.audit_type}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Auditor" 
              value={formData.auditor} 
              onChange={handleChange('auditor')} 
              fullWidth 
              required
              error={!!errors.auditor}
              helperText={errors.auditor}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Audit Firm" 
              value={formData.audit_firm} 
              onChange={handleChange('audit_firm')} 
              fullWidth 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Duration (days)" 
              value={formData.duration} 
              onChange={handleChange('duration')} 
              fullWidth 
              type="number"
              error={!!errors.duration}
              helperText={errors.duration}
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
              label="Scheduled Date"
              type="date"
              value={formData.scheduled_date}
              onChange={handleChange('scheduled_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.scheduled_date}
              helperText={errors.scheduled_date}
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
              label="Follow-up Date"
              type="date"
              value={formData.follow_up_date}
              onChange={handleChange('follow_up_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Score (0-100)" 
              value={formData.score} 
              onChange={handleChange('score')} 
              fullWidth 
              type="number"
              error={!!errors.score}
              helperText={errors.score}
            />
          </Grid>

          {/* Scope and Criteria */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Scope & Criteria
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Audit Scope" 
              value={formData.audit_scope} 
              onChange={handleChange('audit_scope')} 
              fullWidth 
              required
              multiline
              rows={2}
              placeholder="Define the scope of this audit..."
              error={!!errors.audit_scope}
              helperText={errors.audit_scope}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Audit Criteria" 
              value={formData.audit_criteria} 
              onChange={handleChange('audit_criteria')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Define the audit criteria..."
            />
          </Grid>

          {/* Findings and Actions */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Findings & Actions (Optional)
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Findings" 
              value={formData.findings} 
              onChange={handleChange('findings')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Document audit findings..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Corrective Actions" 
              value={formData.corrective_actions} 
              onChange={handleChange('corrective_actions')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Required corrective actions..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Non-Conformities" 
              value={formData.non_conformities} 
              onChange={handleChange('non_conformities')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="List any non-conformities found..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Recommendations" 
              value={formData.recommendations} 
              onChange={handleChange('recommendations')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Audit recommendations..."
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
            <TextField 
              label="Report Path" 
              value={formData.report_path} 
              onChange={handleChange('report_path')} 
              fullWidth 
              placeholder="Path to audit report..."
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
          {audit ? 'Save Changes' : 'Schedule Audit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAuditModal;
