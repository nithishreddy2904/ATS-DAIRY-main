import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Rating,
  Paper,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import { 
  Agriculture, 
  Person, 
  Badge,
  Category, 
  CalendarToday, 
  PriorityHigh,
  Message as MessageIcon,
  Close,
  Star,
  AccessTime,
  Assignment,
} from '@mui/icons-material';

const ViewFarmerFeedbackModal = ({ open, feedback, onClose }) => {
  if (!feedback) return null;

  const formatDate = (date) => 
    date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'N/A';

  const getFeedbackTypeColor = (type) => {
    switch (type) {
      case 'Compliment': return 'success';
      case 'Suggestion': return 'info';
      case 'Complaint': return 'warning';
      case 'Quality Issue': return 'error';
      case 'Service Request': return 'primary';
      default: return 'default';
    }
  };

  const getFeedbackTypeIcon = (type) => {
    switch (type) {
      case 'Compliment': return '👍';
      case 'Suggestion': return '💡';
      case 'Complaint': return '⚠️';
      case 'Quality Issue': return '❌';
      case 'Service Request': return '🛠️';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'info';
      case 'In Review': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return '🔓';
      case 'In Review': return '🔍';
      case 'Resolved': return '✅';
      case 'Closed': return '🔒';
      default: return '📋';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Enhanced Header */}
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <Agriculture />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="600">
              Farmer Feedback Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              ID: {feedback.id} • {formatDate(feedback.date)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 1 }}>
          {/* Status Overview Card */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {getFeedbackTypeIcon(feedback.feedback_type)}
                    </Typography>
                    <Chip 
                      label={feedback.feedback_type} 
                      color={getFeedbackTypeColor(feedback.feedback_type)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary" gutterBottom>
                      Rating
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                      <Rating value={feedback.rating} readOnly size="large" />
                      <Typography variant="h6" fontWeight="600">
                        {feedback.rating}/5
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary" gutterBottom>
                      Priority
                    </Typography>
                    <Chip 
                      label={feedback.priority} 
                      color={getPriorityColor(feedback.priority)}
                      size="medium"
                      icon={<PriorityHigh />}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary" gutterBottom>
                      Status
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                      <Typography variant="h5">
                        {getStatusIcon(feedback.status)}
                      </Typography>
                      <Chip 
                        label={feedback.status} 
                        color={getStatusColor(feedback.status)}
                        size="medium"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Farmer Information Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    Farmer Information
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Farmer Name
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                          {feedback.farmer_name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                        <Badge fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Farmer ID
                        </Typography>
                        <Typography variant="h6" fontWeight="600" fontFamily="monospace">
                          {feedback.farmer_id}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Feedback Details Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                    <MessageIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    Feedback Details
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                        <Category fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Feedback Type
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {feedback.feedback_type}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <CalendarToday fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Date Submitted
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formatDate(feedback.date)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        <Star fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Satisfaction Rating
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Rating value={feedback.rating} readOnly size="small" />
                          <Typography variant="body1" fontWeight="600">
                            ({feedback.rating}/5)
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Message Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <MessageIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="primary.contrastText">
                    Feedback Message
                  </Typography>
                </Box>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'white', 
                  borderRadius: 2, 
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1.1rem',
                      color: 'text.primary'
                    }}
                  >
                    {feedback.message}
                  </Typography>
                </Paper>
              </Paper>
            </Grid>

            {/* Metadata Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom fontWeight="600">
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Assignment color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Feedback ID
                          </Typography>
                          <Typography variant="body1" fontFamily="monospace" fontWeight="600">
                            {feedback.id}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Submitted On
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {formatDate(feedback.date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PriorityHigh color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Current Priority
                          </Typography>
                          <Chip 
                            label={feedback.priority} 
                            color={getPriorityColor(feedback.priority)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: 'grey.50', borderRadius: '0 0 12px 12px' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewFarmerFeedbackModal;
