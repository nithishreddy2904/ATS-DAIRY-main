import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Box,
} from '@mui/material';

const RESULTS = ['Pass', 'Fail', 'Pending'];

const validateDecimal = (value) => {
  if (value === '') return true; // allow empty
  return /^\d+(\.\d{1,2})?$/.test(value);
};

const EditQualityControlModal = ({ open, record, onClose, onSave }) => {
  const isEdit = Boolean(record);

  const [formData, setFormData] = useState({
    batch_id: '',
    unit_id: '',
    test_date: '',
    fat: '',
    protein: '',
    moisture: '',
    ph: '',
    result: 'Pending',
    inspector: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record) {
      setFormData({
        batch_id: record.batch_id || '',
        unit_id: record.unit_id || '',
        test_date: record.test_date ? record.test_date.slice(0, 10) : '',
        fat: record.fat ?? '',
        protein: record.protein ?? '',
        moisture: record.moisture ?? '',
        ph: record.ph ?? '',
        result: record.result || 'Pending',
        inspector: record.inspector || '',
      });
      setErrors({});
    } else {
      setFormData({
        batch_id: '',
        unit_id: '',
        test_date: '',
        fat: '',
        protein: '',
        moisture: '',
        ph: '',
        result: 'Pending',
        inspector: '',
      });
      setErrors({});
    }
  }, [record, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (
      ['fat', 'protein', 'moisture', 'ph'].includes(field) &&
      value !== '' &&
      !validateDecimal(value)
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Invalid decimal number (up to 2 decimals allowed)',
      }));
    } else {
      setErrors((prev) => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.batch_id.trim()) errs.batch_id = 'Batch ID is required';
    if (!formData.unit_id.trim()) errs.unit_id = 'Unit ID is required';
    if (!formData.test_date) errs.test_date = 'Test Date is required';
    if (!formData.inspector.trim()) errs.inspector = 'Inspector name is required';
    if (formData.fat !== '' && !validateDecimal(formData.fat))
      errs.fat = 'Invalid fat value';
    if (formData.protein !== '' && !validateDecimal(formData.protein))
      errs.protein = 'Invalid protein value';
    if (formData.moisture !== '' && !validateDecimal(formData.moisture))
      errs.moisture = 'Invalid moisture value';
    if (formData.ph !== '' && !validateDecimal(formData.ph)) errs.ph = 'Invalid pH value';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({ id: record?.id, ...formData });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit' : 'Add'} Quality Control Record</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Batch ID"
                value={formData.batch_id}
                onChange={handleChange('batch_id')}
                error={Boolean(errors.batch_id)}
                helperText={errors.batch_id}
                fullWidth
                required
                autoFocus={!isEdit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit ID"
                value={formData.unit_id}
                onChange={handleChange('unit_id')}
                error={Boolean(errors.unit_id)}
                helperText={errors.unit_id}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Test Date"
                type="date"
                value={formData.test_date}
                onChange={handleChange('test_date')}
                error={Boolean(errors.test_date)}
                helperText={errors.test_date}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Fat (%)"
                value={formData.fat}
                onChange={handleChange('fat')}
                error={Boolean(errors.fat)}
                helperText={errors.fat}
                fullWidth
                inputProps={{ inputMode: 'decimal' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Protein (%)"
                value={formData.protein}
                onChange={handleChange('protein')}
                error={Boolean(errors.protein)}
                helperText={errors.protein}
                fullWidth
                inputProps={{ inputMode: 'decimal' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Moisture (%)"
                value={formData.moisture}
                onChange={handleChange('moisture')}
                error={Boolean(errors.moisture)}
                helperText={errors.moisture}
                fullWidth
                inputProps={{ inputMode: 'decimal' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="pH"
                value={formData.ph}
                onChange={handleChange('ph')}
                error={Boolean(errors.ph)}
                helperText={errors.ph}
                fullWidth
                inputProps={{ inputMode: 'decimal' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={Boolean(errors.result)}>
                <InputLabel id="result-select-label">Result</InputLabel>
                <Select
                  labelId="result-select-label"
                  value={formData.result}
                  label="Result"
                  onChange={handleChange('result')}
                >
                  {RESULTS.map((res) => (
                    <MenuItem key={res} value={res}>
                      {res}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Inspector"
                value={formData.inspector}
                onChange={handleChange('inspector')}
                error={Boolean(errors.inspector)}
                helperText={errors.inspector}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? 'Save Changes' : 'Add Record'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQualityControlModal;
