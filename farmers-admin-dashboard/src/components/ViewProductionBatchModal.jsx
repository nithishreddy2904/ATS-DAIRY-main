import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Divider,
  Box,
} from "@mui/material";

import { Factory, CalendarToday } from "@mui/icons-material";

const statusColors = {
  completed: "success",
  "in progress": "warning",
  "quality check": "info",
  approved: "success",
  rejected: "error",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN");
};

const ViewProductionBatchModal = ({ open, batch, onClose }) => {
  if (!batch) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Factory />
          Production Batch Details
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Batch ID
            </Typography>
            <Typography>{batch.batchId || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Processing Unit
            </Typography>
            <Typography>{batch.unitName || batch.unit || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Product
            </Typography>
            <Typography>{batch.product || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Quantity (L)
            </Typography>
            <Typography>{batch.quantity || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Production Date
            </Typography>
            <Typography>{formatDate(batch.date)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Chip
              label={batch.status || "Unknown"}
              color={statusColors[(batch.status || "").toLowerCase()] || "default"}
              size="small"
            />
          </Grid>
          {batch.quality && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Quality Notes
              </Typography>
              <Typography>{batch.quality}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductionBatchModal;
