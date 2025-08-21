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
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Alert,
  Chip,
  Stack,
  FormHelperText,
  InputAdornment,
  Zoom,
  Fade,
} from '@mui/material';
import { 
  Agriculture, 
  Close, 
  Save, 
  Person,
  Badge,
  Category,
  CalendarToday,
  PriorityHigh,
  Message as MessageIcon,
  Star,
  Cancel,
} from '@mui/icons-material';

const FEEDBACK_TYPES = ['Complaint', 'Suggestion', 'Compliment', 'Quality Issue', 'Service Request'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const FEEDBACK_STATUS = ['Open', 'In Review', 'Resolved', 'Closed'];

const EditFarmerFeedbackModal = ({ open, feedback, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: '',
    farmer_name: '',
    farmer_id: '',
    feedback_type: '',
    rating: 0,
    message: '',
    date: '',
    priority: 'Medium',
    status: 'Open',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (feedback) {
      setForm({
        id: feedback.id || '',
        farmer_name: feedback.farmer_name || '',
        farmer_id: feedback.farmer_id || '',
        feedback_type: feedback.feedback_type || '',
        rating: feedback.rating || 0,
        message: feedback.message || '',
        date: feedback.date ? feedback.date.split('T')[0] : '',
        priority: feedback.priority || 'Medium',
        status: feedback.status || 'Open',
      });
    } else {
      // Reset form for new feedback
      const today = new Date().toISOString().split('T')[0];
      setForm({
        id: '',
        farmer_name: '',
        farmer_id: '',
        feedback_type: '',
        rating: 0,
        message: '',
        date: today,
        priority: 'Medium',
        status: 'Open',
      });
    }
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [feedback, open]);

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

  const handleRatingChange = (newValue) => {
    setForm({ ...form, rating: newValue || 0 });
    setTouched({ ...touched, rating: true });
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.farmer_name.trim()) {
      newErrors.farmer_name = 'Farmer name is required';
    } else if (form.farmer_name.trim().length < 2) {
      newErrors.farmer_name = 'Farmer name must be at least 2 characters';
    }

    if (!form.farmer_id.trim()) {
      newErrors.farmer_id = 'Farmer ID is required';
    } else if (!/^FARM[0-9]{4}$/.test(form.farmer_id)) {
      newErrors.farmer_id = 'Farmer ID must be in format FARM0001';
    }

    if (!form.feedback_type) {
      newErrors.feedback_type = 'Feedback type is required';
    }

    if (form.rating === 0) {
      newErrors.rating = 'Rating is required';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (form.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    if (!form.date) {
      newErrors.date = 'Date is required';
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
        // Generate ID for new feedback
        id: feedback ? form.id : `FB${String(Date.now()).slice(-3).padStart(3, '0')}`
      };

      await onSave(payload);
    } catch (error) {
      console.error('Error saving feedback:', error);
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
      case 'Open': return 'info';
      case 'In Review': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
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
                {feedback ? 'Edit Farmer Feedback' : 'Add Farmer Feedback'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {feedback ? `Editing feedback ${feedback.id}` : 'Create new farmer feedback entry'}
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
            {feedback && (
              <Fade in={true}>
                <Alert 
                  severity="info" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  icon={<MessageIcon />}
                >
                  <Typography fontWeight="600">
                    Editing existing feedback from {feedback.farmer_name}
                  </Typography>
                </Alert>
              </Fade>
            )}

            <Grid container spacing={3}>
              {/* Farmer Information Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <Person />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Farmer Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="farmer_name"
                          label="Farmer Name"
                          value={form.farmer_name}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('farmer_name')}
                          helperText={getFieldError('farmer_name') || 'Enter the full name of the farmer'}
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                            }
                          }}
                        />
                      </Grid>
                      
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
                          helperText={getFieldError('farmer_id') || 'Format: FARM followed by 4 digits'}
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Badge color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2, fontFamily: 'monospace' }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Feedback Details Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                        <Category />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Feedback Details
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="feedback_type"
                          label="Feedback Type"
                          select
                          value={form.feedback_type}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('feedback_type')}
                          helperText={getFieldError('feedback_type') || 'Select the type of feedback'}
                          disabled={isSubmitting}
                          InputProps={{ sx: { borderRadius: 2 } }}
                        >
                          {FEEDBACK_TYPES.map(type => (
                            <MenuItem key={type} value={type}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Typography>{type}</Typography>
                                {form.feedback_type === type && (
                                  <Chip size="small" label="Selected" color="primary" />
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="date"
                          label="Date"
                          type="date"
                          value={form.date}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('date')}
                          helperText={getFieldError('date') || 'When was this feedback received?'}
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
                      
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            fontWeight="500" 
                            gutterBottom
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <Star color="action" />
                            Satisfaction Rating *
                          </Typography>
                          <Box 
                            sx={{ 
                              p: 2, 
                              border: getFieldError('rating') ? '1px solid red' : '1px solid #e0e0e0',
                              borderRadius: 2,
                              bgcolor: 'white'
                            }}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Rating
                                value={form.rating}
                                onChange={(event, newValue) => handleRatingChange(newValue)}
                                size="large"
                                disabled={isSubmitting}
                              />
                              <Chip 
                                label={form.rating > 0 ? `${form.rating}/5` : 'Not rated'}
                                color={form.rating > 3 ? 'success' : form.rating > 1 ? 'warning' : 'error'}
                                variant={form.rating > 0 ? 'filled' : 'outlined'}
                              />
                            </Stack>
                          </Box>
                          {getFieldError('rating') && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {getFieldError('rating')}
                            </FormHelperText>
                          )}
                        </Box>
                      </Grid>
                      
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
                          helperText="Set the priority level for this feedback"
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
                          label="Status"
                          select
                          value={form.status}
                          onChange={handleChange}
                          fullWidth
                          disabled={isSubmitting}
                          InputProps={{ sx: { borderRadius: 2 } }}
                          helperText="Current status of this feedback"
                        >
                          {FEEDBACK_STATUS.map(status => (
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

              {/* Message Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                        <MessageIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Feedback Message
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <TextField
                      name="message"
                      label="Detailed Message"
                      value={form.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      multiline
                      rows={6}
                      error={!!getFieldError('message')}
                      helperText={
                        getFieldError('message') || 
                        `${form.message.length}/1000 characters (minimum 10 required)`
                      }
                      placeholder="Please provide detailed feedback. What went well? What could be improved? Any specific suggestions?"
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
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
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
              }
            }}
          >
            {isSubmitting ? 'Saving...' : (feedback ? 'Update Feedback' : 'Add Feedback')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditFarmerFeedbackModal;
