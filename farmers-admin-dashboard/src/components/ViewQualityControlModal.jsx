import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField
} from '@mui/material';

const ViewQualityControlModal = ({ open, record, onClose }) => {
  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>View Quality Control Record</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Batch ID"
              value={record.batch_id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Unit ID"
              value={record.unit_id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Test Date"
              value={record.test_date ? new Date(record.test_date).toLocaleDateString('en-IN') : ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Result"
              value={record.result}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Fat (%)"
              value={record.fat ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Protein (%)"
              value={record.protein ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Moisture (%)"
              value={record.moisture ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="pH"
              value={record.ph ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Inspector"
              value={record.inspector ?? ''}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewQualityControlModal;