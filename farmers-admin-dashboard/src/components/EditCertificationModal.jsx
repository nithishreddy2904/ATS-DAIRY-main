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
  FormControlLabel,
  Switch,
} from '@mui/material';

// Constants from original Compliance page
const CERTIFICATION_STATUS = ['Active', 'Expired', 'Pending Renewal', 'Under Process', 'Suspended', 'Cancelled'];

// Validation patterns (same as original)
const CERTIFICATE_ID_REGEX = /^[A-Z]{3}[0-9]{6}$/;

const EditCertificationModal = ({ open, certification, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    issuing_authority: '',
    certificate_number: '',
    issue_date: '',
    expiry_date: '',
    status: 'Active',
    renewal_required: false,
    document_path: '',
    scope: '',
    accreditation_body: '',
    surveillance_date: '',
    cost: '',
    validity_period: '',
    benefits: '',
    maintenance_requirements: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (certification) {
      setFormData({ 
        ...certification,
        issue_date: certification.issue_date ? certification.issue_date.slice(0, 10) : '',
        expiry_date: certification.expiry_date ? certification.expiry_date.slice(0, 10) : '',
        surveillance_date: certification.surveillance_date ? certification.surveillance_date.slice(0, 10) : '',
        cost: certification.cost?.toString() || '',
        renewal_required: certification.renewal_required === true || certification.renewal_required === 1
      });
    } else {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      
      setFormData({
        id: `CERT${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        name: '',
        issuing_authority: '',
        certificate_number: '',
        issue_date: today.toISOString().slice(0, 10),
        expiry_date: nextYear.toISOString().slice(0, 10),
        status: 'Active',
        renewal_required: false,
        document_path: '',
        scope: '',
        accreditation_body: '',
        surveillance_date: '',
        cost: '',
        validity_period: '',
        benefits: '',
        maintenance_requirements: ''
      });
    }
    setErrors({});
  }, [certification, open]);

  const handleChange = field => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
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
      case 'name':
        if (!value.trim()) error = 'Certification name is required';
        else if (value.length < 2 || value.length > 200) error = 'Name must be 2-200 characters';
        break;
      case 'issuing_authority':
        if (!value.trim()) error = 'Issuing authority is required';
        else if (value.length < 2 || value.length > 200) error = 'Issuing authority must be 2-200 characters';
        break;
      case 'certificate_number':
        if (!value.trim()) error = 'Certificate number is required';
        else if (!CERTIFICATE_ID_REGEX.test(value)) error = 'Format: ABC123456 (3 letters + 6 digits)';
        break;
      case 'issue_date':
        if (!value.trim()) error = 'Issue date is required';
        break;
      case 'expiry_date':
        if (!value.trim()) error = 'Expiry date is required';
        else if (formData.issue_date && new Date(value) <= new Date(formData.issue_date)) {
          error = 'Expiry date must be after issue date';
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
      'name', 'issuing_authority', 'certificate_number', 'issue_date', 'expiry_date'
    ];

    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    // Check if expiry date is after issue date
    if (formData.issue_date && formData.expiry_date) {
      if (new Date(formData.expiry_date) <= new Date(formData.issue_date)) {
        setErrors(prev => ({ ...prev, expiry_date: 'Expiry date must be after issue date' }));
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
        {certification ? 'Edit Certification' : 'Add New Certification'}
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
              label="Certification ID" 
              value={formData.id} 
              onChange={handleChange('id')} 
              fullWidth 
              required
              disabled={!!certification} // Disable editing ID for existing certifications
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
                {CERTIFICATION_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Certification Name" 
              value={formData.name} 
              onChange={handleChange('name')} 
              fullWidth 
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Issuing Authority" 
              value={formData.issuing_authority} 
              onChange={handleChange('issuing_authority')} 
              fullWidth 
              required
              error={!!errors.issuing_authority}
              helperText={errors.issuing_authority}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Certificate Number" 
              value={formData.certificate_number} 
              onChange={handleChange('certificate_number')} 
              fullWidth 
              required
              placeholder="ABC123456"
              error={!!errors.certificate_number}
              helperText={errors.certificate_number}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Accreditation Body" 
              value={formData.accreditation_body} 
              onChange={handleChange('accreditation_body')} 
              fullWidth 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.renewal_required} 
                  onChange={handleChange('renewal_required')}
                />
              }
              label="Renewal Required"
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
              label="Issue Date"
              type="date"
              value={formData.issue_date}
              onChange={handleChange('issue_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.issue_date}
              helperText={errors.issue_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Expiry Date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange('expiry_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.expiry_date}
              helperText={errors.expiry_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Surveillance Date"
              type="date"
              value={formData.surveillance_date}
              onChange={handleChange('surveillance_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Validity Period" 
              value={formData.validity_period} 
              onChange={handleChange('validity_period')} 
              fullWidth 
              placeholder="e.g., 3 years"
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
              label="Document Path" 
              value={formData.document_path} 
              onChange={handleChange('document_path')} 
              fullWidth 
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Scope" 
              value={formData.scope} 
              onChange={handleChange('scope')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Enter certification scope..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Benefits" 
              value={formData.benefits} 
              onChange={handleChange('benefits')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Enter certification benefits..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              label="Maintenance Requirements" 
              value={formData.maintenance_requirements} 
              onChange={handleChange('maintenance_requirements')} 
              fullWidth 
              multiline
              rows={2}
              placeholder="Enter maintenance requirements..."
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
          {certification ? 'Save Changes' : 'Add Certification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCertificationModal;
