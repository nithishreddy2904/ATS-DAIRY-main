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
  Divider,
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import { 
  Message as MessageIcon, 
  Close, 
  Save, 
  Person,
  Subject,
  CalendarToday,
  PriorityHigh,
  Cancel,
  Send,
} from '@mui/icons-material';

const MESSAGE_STATUS = ['Sent', 'Delivered', 'Read', 'Failed'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

const EditMessageModal = ({ open, message, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: '',
    farmer_id: '',
    subject: '',
    message: '',
    timestamp: '',
    status: 'Sent',
    priority: 'Medium',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      setForm({
        id: message.id || '',
        farmer_id: message.farmer_id || '',
        subject: message.subject || '',
        message: message.message || '',
        timestamp: message.timestamp ? message.timestamp.slice(0, 16) : '',
        status: message.status || 'Sent',
        priority: message.priority || 'Medium',
      });
    } else {
      // Reset form for new message
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16);
      setForm({
        id: '',
        farmer_id: '',
        subject: '',
        message: '',
        timestamp: timestamp,
        status: 'Sent',
        priority: 'Medium',
      });
    }
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [message, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Mark field as touched
    setTouched({ ...touched, [name]: true });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.farmer_id.trim()) {
      newErrors.farmer_id = 'Farmer ID is required';
    } else if (!/^[A-Za-z]+[0-9]{4}$/.test(form.farmer_id)) {
      newErrors.farmer_id = 'Invalid farmer ID format (e.g., FARM0001)';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (form.subject.trim().length > 255) {
      newErrors.subject = 'Subject must be less than 255 characters';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 1) {
      newErrors.message = 'Message must be at least 1 character';
    } else if (form.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    if (!form.timestamp) {
      newErrors.timestamp = 'Timestamp is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allFieldsTouched = {};
    Object.keys(form).forEach(key => {
      allFieldsTouched[key] = true;
    });
    setTouched(allFieldsTouched);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...form,
        // Convert timestamp back to MySQL format
        timestamp: new Date(form.timestamp).toISOString().slice(0, 19).replace('T', ' '),
        // Generate ID for new message
        id: message ? form.id : `MSG${String(Date.now()).slice(-3).padStart(3, '0')}`
      };

      await onSave(payload);
    } catch (error) {
      console.error('Error saving message:', error);
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
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
      case 'Read': return 'success';
      case 'Delivered': return 'info';
      case 'Sent': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
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
          maxHeight: '95vh',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
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
                {message ? 'Edit Message' : 'Send New Message'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {message ? `Editing message ${message.id}` : 'Create new message to farmer'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }} disabled={isSubmitting}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, bgcolor: 'grey.50' }}>
          <Box sx={{ p: 3 }}>
            {/* Progress indicator for editing mode */}
            {message && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<MessageIcon />}
              >
                <Typography fontWeight="600">
                  Editing message to farmer {message.farmer_id}
                </Typography>
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Message Details Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <Person />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Message Details
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="farmer_id"
                          label="Farmer ID"
                          value={form.farmer_id}
                          onChange={handleChange}
                          fullWidth
                          required
                          placeholder="FARM0001"
                          error={!!getFieldError('farmer_id')}
                          helperText={getFieldError('farmer_id') || 'Format: Letters followed by 4 digits'}
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2, fontFamily: 'monospace' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="timestamp"
                          label="Date & Time"
                          type="datetime-local"
                          value={form.timestamp}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('timestamp')}
                          helperText={getFieldError('timestamp') || 'When to send this message'}
                          disabled={isSubmitting}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          name="subject"
                          label="Subject"
                          value={form.subject}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('subject')}
                          helperText={getFieldError('subject') || `${form.subject.length}/255 characters`}
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Subject color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                          placeholder="Enter message subject..."
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Message Content Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                        <MessageIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Message Content
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <TextField
                      name="message"
                      label="Message"
                      value={form.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      multiline
                      rows={6}
                      error={!!getFieldError('message')}
                      helperText={
                        getFieldError('message') || 
                        `${form.message.length}/1000 characters`
                      }
                      placeholder="Type your message to the farmer here..."
                      disabled={isSubmitting}
                      InputProps={{
                        sx: { 
                          borderRadius: 2,
                          '& textarea': {
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Status & Priority Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                        <PriorityHigh />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Status & Priority
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="priority"
                          label="Priority Level"
                          select
                          value={form.priority}
                          onChange={handleChange}
                          fullWidth
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PriorityHigh color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                          helperText="Set the priority level for this message"
                        >
                          {PRIORITY_LEVELS.map(priority => (
                            <MenuItem key={priority} value={priority}>
                              <Box display="flex" alignItems="center" gap={2} width="100%">
                                <Typography>{priority}</Typography>
                                <Chip 
                                  size="small" 
                                  label={priority}
                                  color={getPriorityColor(priority)}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="status"
                          label="Message Status"
                          select
                          value={form.status}
                          onChange={handleChange}
                          fullWidth
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Send color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                          helperText="Current status of this message"
                        >
                          {MESSAGE_STATUS.map(status => (
                            <MenuItem key={status} value={status}>
                              <Box display="flex" alignItems="center" gap={2} width="100%">
                                <Typography>{status}</Typography>
                                <Chip 
                                  size="small" 
                                  label={status}
                                  color={getStatusColor(status)}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            p: 3, 
            bgcolor: 'grey.50', 
            borderRadius: '0 0 12px 12px',
            gap: 2 
          }}
        >
          <Button 
            onClick={onClose} 
            variant="outlined"
            size="large"
            disabled={isSubmitting}
            startIcon={<Cancel />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? null : <Save />}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              }
            }}
          >
            {isSubmitting ? 'Saving...' : (message ? 'Update Message' : 'Send Message')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMessageModal;
