import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
} from '@mui/material';

const ViewProcessingUnitModal = ({ open, unit, onClose }) => {
  if (!unit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>View Processing Unit Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Unit ID
            </Typography>
            <Typography variant="body1">{unit.unit_id || '-'}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Name
            </Typography>
            <Typography variant="body1">{unit.name || '-'}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Type
            </Typography>
            {unit.type ? (
              <Chip label={unit.type} size="small" color="primary" />
            ) : (
              <Typography variant="body1">-</Typography>
            )}
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Location
            </Typography>
            <Typography variant="body1">{unit.location || '-'}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Manager
            </Typography>
            <Typography variant="body1">{unit.manager || '-'}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Capacity (L)
            </Typography>
            <Typography variant="body1">
              {unit.capacity != null ? unit.capacity : '-'}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            {unit.status ? (
              <Chip
                label={unit.status}
                size="small"
                color={
                  unit.status === 'Active'
                    ? 'success'
                    : unit.status === 'Maintenance'
                    ? 'warning'
                    : unit.status === 'Inactive'
                    ? 'error'
                    : 'default'
                }
              />
            ) : (
              <Typography variant="body1">-</Typography>
            )}
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Contact
            </Typography>
            <Typography variant="body1">{unit.contact || '-'}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProcessingUnitModal;
