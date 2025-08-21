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
  Box,
  Rating,
  Divider,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const REVIEW_CATEGORIES = [
  'Product Quality', 'Service', 'Delivery', 'Pricing', 'Customer Support', 'Overall Experience'
];

const REVIEW_STATUS = ['New', 'In Progress', 'Responded', 'Resolved', 'Escalated'];

const EditCustomerReviewModal = ({ open, review, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: '',
    customer_name: '',
    customer_email: '',
    category: '',
    rating: 0,
    subject: '',
    comment: '',
    date: '',
    status: 'New',
    response: '',
    response_date: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (review) {
      setForm({
        id: review.id || '',
        customer_name: review.customer_name || '',
        customer_email: review.customer_email || '',
        category: review.category || '',
        rating: review.rating || 0,
        subject: review.subject || '',
        comment: review.comment || '',
        date: review.date ? review.date.split('T')[0] : '',
        status: review.status || 'New',
        response: review.response || '',
        response_date: review.response_date ? review.response_date.split('T') : '',
      });
    } else {
      // Reset form for new review
      setForm({
        id: '',
        customer_name: '',
        customer_email: '',
        category: '',
        rating: 0,
        subject: '',
        comment: '',
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        response: '',
        response_date: '',
      });
    }
    setErrors({});
  }, [review, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRatingChange = (newValue) => {
    setForm({ ...form, rating: newValue || 0 });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.customer_name.trim()) newErrors.customer_name = 'Customer name is required';
    if (!form.customer_email.trim()) newErrors.customer_email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.customer_email)) newErrors.customer_email = 'Email is invalid';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.rating === 0) newErrors.rating = 'Rating is required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.comment.trim()) newErrors.comment = 'Comment is required';
    if (!form.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      // If response is being added for the first time, set response_date
      response_date: form.response && !review?.response ? 
        new Date().toISOString().split('T')[0] : form.response_date,
      // Auto-update status when response is added
      status: form.response && form.status === 'New' ? 'Responded' : form.status
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="primary" />
          {review ? 'Edit Customer Review' : 'Add Customer Review'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Customer Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Customer Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="customer_name"
                label="Customer Name"
                value={form.customer_name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.customer_name}
                helperText={errors.customer_name}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="customer_email"
                label="Email"
                type="email"
                value={form.customer_email}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.customer_email}
                helperText={errors.customer_email}
              />
            </Grid>

            {/* Review Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Review Details</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="category"
                label="Category"
                select
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.category}
                helperText={errors.category}
              >
                {REVIEW_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                name="date"
                label="Review Date"
                type="date"
                value={form.date}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

             <Grid item xs={6}>
              <TextField
                name="response_date"
                label="Response Date"
                type="date"
                value={form.response_date}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rating *
                </Typography>
                <Rating
                  value={form.rating}
                  onChange={(event, newValue) => handleRatingChange(newValue)}
                  size="large"
                />
                {errors.rating && (
                  <Typography variant="caption" color="error" display="block">
                    {errors.rating}
                  </Typography>
                )}
              </Box>
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
                {REVIEW_STATUS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="subject"
                label="Subject"
                value={form.subject}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.subject}
                helperText={errors.subject}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="comment"
                label="Comment"
                value={form.comment}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
                error={!!errors.comment}
                helperText={errors.comment}
              />
            </Grid>

            {/* Response Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Response (Optional)</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="response"
                label="Response"
                value={form.response}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Write your response to the customer..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {review ? 'Update Review' : 'Add Review'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCustomerReviewModal;
