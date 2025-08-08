import React, { useState, useEffect } from "react";

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
  Box,
  Typography,
} from "@mui/material";

const PRODUCT_TYPES = ["Milk", "Cheese", "Butter", "Yogurt", "Cream", "Powder"];
const STATUS_OPTIONS = [
  "In Progress",
  "Completed",
  "Quality Check",
  "Approved",
  "Rejected",
];

const EditProductionBatchModal = ({ open, batch, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    batchId: "",
    unit: "",
    product: "",
    quantity: "",
    date: "",
    status: "In Progress",
    quality: "",
  });

  useEffect(() => {
    if (batch) {
      setFormData({
        batchId: batch.batchId || "",
        unit: batch.unit || "",
        product: batch.product || "",
        quantity: batch.quantity || "",
        date: batch.date ? batch.date.split("T")[0] : "",
        status: batch.status || "In Progress",
        quality: batch.quality || "",
      });
    }
  }, [batch]);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  // Simple validation example
  const validate = () => {
    if (
      !formData.batchId ||
      !formData.unit ||
      !formData.product ||
      !formData.quantity ||
      !formData.date ||
      !formData.status ||
      !formData.quality
    )
      return false;
    return true;
  };

  const handleSave = () => {
    if (!validate()) {
      alert("Please fill all mandatory fields");
      return;
    }
    const toSave = {
      id: batch.id, // Include the ID for update
      batch_id: formData.batchId, // Map batchId → batch_id
      unit: formData.unit || null,
      product: formData.product || null,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      date: formData.date || null,
      status: formData.status || null,
      quality: formData.quality || null,
    };

    onSave(toSave);

  };

  if (!batch) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
      <DialogTitle>Edit Production Batch</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Batch ID"
              value={formData.batchId}
              onChange={handleChange("batchId")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Processing Unit"
              value={formData.unit}
              onChange={handleChange("unit")}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Product</InputLabel>
              <Select
                value={formData.product}
                onChange={handleChange("product")}
                label="Product"
              >
                {PRODUCT_TYPES.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity (L/Kg)"
              type="number"
              inputProps={{
                min: 0,
                step: 0.1,
              }}
              value={formData.quantity}
              onChange={handleChange("quantity")}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Production Date"
              type="date"
              value={formData.date}
              onChange={handleChange("date")}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange("status")}
                label="Status"
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Quality Notes"
              value={formData.quality}
              onChange={handleChange("quality")}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductionBatchModal;
