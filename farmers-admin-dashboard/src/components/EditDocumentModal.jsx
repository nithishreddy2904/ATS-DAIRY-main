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

// Constants from original Compliance page and backend validation
const DOCUMENT_TYPES = ['License', 'Certificate', 'Report', 'Policy', 'Procedure', 'Record', 'Manual'];
const DOCUMENT_CATEGORIES = [
  'Quality Control', 'Environmental', 'Safety', 'Financial', 'Legal',
  'Operational', 'Regulatory', 'Training', 'Emergency'
];
const DOCUMENT_STATUS = ['Active', 'Expired', 'Under Review'];

const EditDocumentModal = ({ open, document, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: '',
    category: '',
    upload_date: '',
    expiry_date: '',
    status: 'Active',
    size: '',
    version: '1.0',
    uploaded_by: '',
    reviewed_by: '',
    approved_by: '',
    file_path: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (document) {
      setFormData({
        ...document,
        upload_date: document.upload_date ? document.upload_date.slice(0, 10) : '',
        expiry_date: document.expiry_date ? document.expiry_date.slice(0, 10) : '',
        size: document.size?.toString() || '',
        version: document.version || '1.0'
      });
    } else {
      const today = new Date();
      setFormData({
        id: `DOC${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        name: '',
        type: DOCUMENT_TYPES[0],
        category: DOCUMENT_CATEGORIES,
        upload_date: today.toISOString().slice(0, 10),
        expiry_date: '',
        status: 'Active',
        size: '',
        version: '1.0',
        uploaded_by: '',
        reviewed_by: '',
        approved_by: '',
        file_path: '',
        description: ''
      });
    }
    setErrors({});
  }, [document, open]);

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
      case 'id':
        if (!value.trim()) {
          error = 'Document ID is required';
        } else if (!/^DOC[0-9]{3}$/.test(value)) {
          error = 'ID must be in format DOC001';
        }
        break;
      case 'name':
        if (!value.trim()) {
          error = 'Document name is required';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.length > 255) {
          error = 'Name must not exceed 255 characters';
        }
        break;
      case 'type':
        if (!value.trim()) error = 'Document type is required';
        break;
      case 'category':
        if (!value.trim()) error = 'Category is required';
        break;
      case 'upload_date':
        if (!value.trim()) error = 'Upload date is required';
        break;
      case 'expiry_date':
        if (value && formData.upload_date && new Date(value) <= new Date(formData.upload_date)) {
          error = 'Expiry date must be after upload date';
        }
        break;
      case 'uploaded_by':
        if (!value.trim()) {
          error = 'Uploaded by is required';
        } else if (value.length < 2 || value.length > 100) {
          error = 'Uploaded by must be 2-100 characters';
        }
        break;
      case 'reviewed_by':
        if (value && (value.length < 2 || value.length > 100)) {
          error = 'Reviewed by must be 2-100 characters';
        }
        break;
      case 'approved_by':
        if (value && (value.length < 2 || value.length > 100)) {
          error = 'Approved by must be 2-100 characters';
        }
        break;
      case 'size':
        if (value && value.length > 50) {
          error = 'Size must not exceed 50 characters';
        }
        break;
      case 'version':
        if (value && value.length > 20) {
          error = 'Version must not exceed 20 characters';
        }
        break;
      case 'file_path':
        if (value && value.length > 500) {
          error = 'File path must not exceed 500 characters';
        }
        break;
      case 'description':
        if (value && value.length > 1000) {
          error = 'Description must not exceed 1000 characters';
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
    const requiredFields = ['id', 'name', 'type', 'category', 'upload_date', 'uploaded_by'];
    
    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });

    // Check if expiry date is after upload date
    if (formData.expiry_date && formData.upload_date) {
      if (new Date(formData.expiry_date) <= new Date(formData.upload_date)) {
        setErrors(prev => ({ 
          ...prev, 
          expiry_date: 'Expiry date must be after upload date' 
        }));
      }
    }

    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid) {
      // Clean up data for saving
      const saveData = {
        ...formData,
        // Ensure empty strings for optional fields are handled properly
        reviewed_by: formData.reviewed_by || null,
        approved_by: formData.approved_by || null,
        expiry_date: formData.expiry_date || null,
        file_path: formData.file_path || null,
        description: formData.description || null,
        size: formData.size || null
      };
      
      onSave(saveData);
    }
  };

  if (!open) return null;

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
        {document ? 'Edit Document' : 'Upload New Document'}
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        <Grid container spacing={2}>
          {/* Basic Document Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              Document Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Document ID *"
              value={formData.id}
              onChange={handleChange('id')}
              fullWidth
              disabled={!!document} // Disable editing ID for existing documents
              error={!!errors.id}
              helperText={errors.id || 'Format: DOC001'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              label="Document Name *"
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Document Type *</InputLabel>
              <Select
                value={formData.type}
                label="Document Type *"
                onChange={handleChange('type')}
              >
                {DOCUMENT_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.category}
                label="Category *"
                onChange={handleChange('category')}
              >
                {DOCUMENT_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleChange('status')}
              >
                {DOCUMENT_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* File Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              File Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Upload Date *"
              type="date"
              value={formData.upload_date}
              onChange={handleChange('upload_date')}
              fullWidth
              error={!!errors.upload_date}
              helperText={errors.upload_date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Expiry Date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange('expiry_date')}
              fullWidth
              error={!!errors.expiry_date}
              helperText={errors.expiry_date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Version"
              value={formData.version}
              onChange={handleChange('version')}
              fullWidth
              error={!!errors.version}
              helperText={errors.version}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="File Size"
              value={formData.size}
              onChange={handleChange('size')}
              fullWidth
              error={!!errors.size}
              helperText={errors.size || 'e.g., 2.5 MB'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="File Path"
              value={formData.file_path}
              onChange={handleChange('file_path')}
              fullWidth
              error={!!errors.file_path}
              helperText={errors.file_path}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* People Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              People & Approval
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Uploaded By *"
              value={formData.uploaded_by}
              onChange={handleChange('uploaded_by')}
              fullWidth
              error={!!errors.uploaded_by}
              helperText={errors.uploaded_by}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Reviewed By"
              value={formData.reviewed_by}
              onChange={handleChange('reviewed_by')}
              fullWidth
              error={!!errors.reviewed_by}
              helperText={errors.reviewed_by}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Approved By"
              value={formData.approved_by}
              onChange={handleChange('approved_by')}
              fullWidth
              error={!!errors.approved_by}
              helperText={errors.approved_by}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
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

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ borderRadius: 2 }}
          disabled={hasErrors}
        >
          {document ? 'Save Changes' : 'Upload Document'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDocumentModal;
