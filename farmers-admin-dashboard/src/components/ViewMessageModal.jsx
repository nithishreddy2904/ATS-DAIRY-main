import React, { useState } from 'react';
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
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';
import { 
  Message as MessageIcon, 
  Person, 
  Subject,
  CalendarToday, 
  PriorityHigh,
  Close,
  MarkEmailRead,
  MarkEmailUnread,
  Send,
  AccessTime,
} from '@mui/icons-material';

const ViewMessageModal = ({ open, message, onClose, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);


  if (!message) return null;

  const formatDateTime = (timestamp) => 
    timestamp ? new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : 'N/A';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Read': return 'success';
      case 'Delivered': return 'info';
      case 'Sent': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Read': return <MarkEmailRead />;
      case 'Delivered': case 'Sent': return <Send />;
      case 'Failed': return <MarkEmailUnread />;
      default: return <MessageIcon />;
    }
  };


const handleStatusUpdate = async (newStatus) => {
  try {
    setIsUpdating(true);
    await onStatusUpdate(message.id, newStatus);
    onClose();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status: ' + error.message);
  } finally {
    setIsUpdating(false);
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
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <MessageIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="600">
              Message Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              ID: {message.id} • {formatDateTime(message.timestamp)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Status Overview Card */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Avatar sx={{ 
                      bgcolor: getStatusColor(message.status) === 'error' ? 'error.main' : 
                               getStatusColor(message.status) === 'success' ? 'success.main' :
                               getStatusColor(message.status) === 'warning' ? 'warning.main' : 'info.main',
                      width: 64, 
                      height: 64, 
                      mx: 'auto', 
                      mb: 1 
                    }}>
                      {getStatusIcon(message.status)}
                    </Avatar>
                    <Chip 
                      label={message.status} 
                      color={getStatusColor(message.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary" gutterBottom>
                      Subject
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {message.subject}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary" gutterBottom>
                      Priority
                    </Typography>
                    <Chip 
                      label={message.priority} 
                      color={getPriorityColor(message.priority)}
                      size="medium"
                      icon={<PriorityHigh />}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Message Information Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <MessageIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    Message Information
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Farmer ID
                        </Typography>
                        <Typography variant="h6" fontWeight="600" fontFamily="monospace">
                          {message.farmer_id}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                        <Subject fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Message ID
                        </Typography>
                        <Typography variant="h6" fontWeight="600" fontFamily="monospace">
                          {message.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                        <AccessTime fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          Sent Time
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formatDateTime(message.timestamp)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Message Content Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <MessageIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="primary.contrastText">
                    Message Content
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
                    {message.message}
                  </Typography>
                </Paper>
              </Paper>
            </Grid>

            {/* Status Actions */}
            {message.status !== 'Read' && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, bgcolor: 'warning.light' }}>
                  <CardContent>
                    <Typography variant="h6" color="warning.contrastText" gutterBottom fontWeight="600">
                      Quick Actions
                    </Typography>
                    <Stack direction="row" spacing={2} mt={2}>
                     <Button
  variant="contained"
  color="success"
  startIcon={<MarkEmailRead />}
  onClick={() => handleStatusUpdate('Read')}
  disabled={isUpdating}
  sx={{ borderRadius: 2 }}
>
  {isUpdating ? 'Updating...' : 'Mark as Read'}
</Button>

                      {message.status === 'Sent' && (
                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<Send />}
                          onClick={() => handleStatusUpdate('Delivered')}
                          sx={{ borderRadius: 2 }}
                        >
                          Mark as Delivered
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}
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

export default ViewMessageModal;
