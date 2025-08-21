import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Rating,
  TextField,
  Avatar,
} from '@mui/material';
import { 
  Star, 
  Person, 
  Email, 
  CalendarToday, 
  Category,
  Info,
  Assignment,
  Reply
} from '@mui/icons-material';
import { CheckCircle } from '@mui/icons-material';

const ViewCustomerReviewModal = ({ open, review, onClose }) => {
  if (!review) return null;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }) : 'N/A';

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'In Progress': return 'warning';
      case 'Responded': case 'Resolved': return 'success';
      case 'Escalated': return 'error';
      default: return 'default';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#4caf50';
    if (rating >= 3) return '#ff9800';
    return '#f44336';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>
              <Star />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {review.subject || 'Customer Review'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review ID: {review.id || 'REV001'}
              </Typography>
            </Box>
          </Box>
          
          {/* Progress Bar */}
          <Box sx={{ 
            height: 4, 
            bgcolor: getRatingColor(review.rating), 
            borderRadius: 2,
            mb: 3
          }} />
        </Box>

        {/* Customer Information Section */}
        <Box sx={{ px: 3, mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2196f3', 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            <Person sx={{ mr: 1 }} />
            Customer Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={review.customer_name}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                value={review.customer_email}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Category
              </Typography>
              <Chip
                label={review.category}
                color="info"
                variant="outlined"
                icon={<Category />}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip
                label={review.status}
                color={getStatusColor(review.status)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({review.rating}/5)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Review Details Section */}
        <Box sx={{ px: 3, mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2196f3', 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            <Assignment sx={{ mr: 1 }} />
            Review Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Subject"
                value={review.subject}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Review Date"
                value={formatDate(review.date)}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Comment"
                value={review.comment}
                variant="outlined"
                size="small"
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Response Section */}
        {review.response && (
          <Box sx={{ px: 3, mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2196f3', 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              <Reply sx={{ mr: 1 }} />
              Response Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Response Date"
                  value={formatDate(review.response_date)}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1, 
                  p: 2, 
                  bgcolor: '#e8f5e8',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Response Status
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    Responded
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Response Message"
                  value={review.response}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Action Button */}
        <Box sx={{ p: 3, pt: 1, textAlign: 'right' }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            color="primary"
            sx={{ textTransform: 'uppercase' }}
          >
            CLOSE
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerReviewModal;
