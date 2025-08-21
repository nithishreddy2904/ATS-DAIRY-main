import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
} from '@mui/material';
import { Science } from '@mui/icons-material';

const TEST_TYPES = ['Routine Test', 'Special Test', 'Compliance Test', 'Research Test'];
const TEST_STATUS = ['Pending', 'In Progress', 'Completed', 'Failed'];
const QUALITY_GRADES = ['A+', 'A', 'B', 'C', 'D'];
const ADULTERATION_TYPES = ['None Detected', 'Water', 'Starch', 'Urea', 'Detergent', 'Salt'];

const EditQualityTestModal = ({ open, qualityTest, onSave, onClose }) => {
  const [form, setForm] = useState({
    batch_id: '',
    sample_id: '',
    farmer_id: '',
    test_date: '',
    test_type: 'Routine Test',
    fat_content: '',
    protein_content: '',
    lactose_content: '',
    snf_content: '',
    ph_level: '',
    bacteria_count: '',
    adulteration: 'None Detected',
    overall_grade: 'A+',
    status: 'Pending',
    remarks: '',
    tested_by: '',
  });

  useEffect(() => {
    if (qualityTest) {
      setForm({
        batch_id: qualityTest.batch_id || '',
        sample_id: qualityTest.sample_id || '',
        farmer_id: qualityTest.farmer_id || '',
        test_date: qualityTest.test_date ? qualityTest.test_date.split('T')[0] : '',
        test_type: qualityTest.test_type || 'Routine Test',
        fat_content: qualityTest.fat_content || '',
        protein_content: qualityTest.protein_content || '',
        lactose_content: qualityTest.lactose_content || '',
        snf_content: qualityTest.snf_content || '',
        ph_level: qualityTest.ph_level || '',
        bacteria_count: qualityTest.bacteria_count || '',
        adulteration: qualityTest.adulteration || 'None Detected',
        overall_grade: qualityTest.overall_grade || 'A+',
        status: qualityTest.status || 'Pending',
        remarks: qualityTest.remarks || '',
        tested_by: qualityTest.tested_by || '',
      });
    } else {
      // Reset form for new test
      setForm({
        batch_id: '',
        sample_id: '',
        farmer_id: '',
        test_date: '',
        test_type: 'Routine Test',
        fat_content: '',
        protein_content: '',
        lactose_content: '',
        snf_content: '',
        ph_level: '',
        bacteria_count: '',
        adulteration: 'None Detected',
        overall_grade: 'A+',
        status: 'Pending',
        remarks: '',
        tested_by: '',
      });
    }
  }, [qualityTest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = qualityTest ? { ...form, id: qualityTest.id } : form;
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Science color="primary" />
          {qualityTest ? 'Edit Quality Test' : 'Add Quality Test'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="batch_id"
                label="Batch ID"
                value={form.batch_id}
                onChange={handleChange}
                fullWidth
                required
                placeholder="BATCH0001"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="sample_id"
                label="Sample ID"
                value={form.sample_id}
                onChange={handleChange}
                fullWidth
                required
                placeholder="SAMPLE000001"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="farmer_id"
                label="Farmer ID"
                value={form.farmer_id}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="test_date"
                label="Test Date"
                type="date"
                value={form.test_date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="test_type"
                label="Test Type"
                select
                value={form.test_type}
                onChange={handleChange}
                fullWidth
                required
              >
                {TEST_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="tested_by"
                label="Tested By"
                value={form.tested_by}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Test Results */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Test Results</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="fat_content"
                label="Fat Content (%)"
                type="number"
                value={form.fat_content}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: "0.01", min: "0", max: "100" }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="protein_content"
                label="Protein Content (%)"
                type="number"
                value={form.protein_content}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: "0.01", min: "0", max: "100" }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="lactose_content"
                label="Lactose Content (%)"
                type="number"
                value={form.lactose_content}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: "0.01", min: "0", max: "100" }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="snf_content"
                label="SNF Content (%)"
                type="number"
                value={form.snf_content}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: "0.01", min: "0", max: "100" }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="ph_level"
                label="pH Level"
                type="number"
                value={form.ph_level}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: "0.01", min: "0", max: "14" }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="bacteria_count"
                label="Bacteria Count"
                type="number"
                value={form.bacteria_count}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: "0" }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="adulteration"
                label="Adulteration"
                select
                value={form.adulteration}
                onChange={handleChange}
                fullWidth
              >
                {ADULTERATION_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="overall_grade"
                label="Overall Grade"
                select
                value={form.overall_grade}
                onChange={handleChange}
                fullWidth
              >
                {QUALITY_GRADES.map(grade => (
                  <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status & Remarks */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Status & Remarks</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="status"
                label="Status"
                select
                value={form.status}
                onChange={handleChange}
                fullWidth
              >
                {TEST_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="remarks"
                label="Remarks"
                value={form.remarks}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Additional notes or observations..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {qualityTest ? 'Update Test' : 'Add Test'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditQualityTestModal;
