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
  Announcement as AnnouncementIcon, 
  Close, 
  Save, 
  Person,
  Category,
  CalendarToday,
  PriorityHigh,
  Cancel,
  Publish,
} from '@mui/icons-material';

const TARGET_AUDIENCE = ['All Farmers', 'Quality Team', 'Logistics Team', 'Management', 'Suppliers'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const ANNOUNCEMENT_STATUS = ['Draft', 'Published', 'Archived'];

const EditAnnouncementModal = ({ open, announcement, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: '',
    title: '',
    content: '',
    target_audience: 'All Farmers',
    priority: 'Medium',
    publish_date: '',
    status: 'Draft',
    views: 0,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (announcement) {
      setForm({
        id: announcement.id || '',
        title: announcement.title || '',
        content: announcement.content || '',
        target_audience: announcement.target_audience || 'All Farmers',
        priority: announcement.priority || 'Medium',
        publish_date: announcement.publish_date ? announcement.publish_date.split('T')[0] : '',
        status: announcement.status || 'Draft',
        views: announcement.views || 0,
      });
    } else {
      // Reset form for new announcement
      const today = new Date().toISOString().split('T');
      setForm({
        id: '',
        title: '',
        content: '',
        target_audience: 'All Farmers',
        priority: 'Medium',
        publish_date: today,
        status: 'Draft',
        views: 0,
      });
    }
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [announcement, open]);

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

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (form.title.trim().length > 150) {
      newErrors.title = 'Title must be less than 150 characters';
    }

    if (!form.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (form.content.trim().length < 5) {
      newErrors.content = 'Content must be at least 5 characters';
    }

    if (!form.target_audience) {
      newErrors.target_audience = 'Target audience is required';
    }

    if (!form.publish_date) {
      newErrors.publish_date = 'Publish date is required';
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
        // Generate ID for new announcement
        id: announcement ? form.id : `ANN${String(Date.now()).slice(-3).padStart(3, '0')}`
      };

      await onSave(payload);
    } catch (error) {
      console.error('Error saving announcement:', error);
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
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'default';
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
              <AnnouncementIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600">
                {announcement ? 'Edit Announcement' : 'Create Announcement'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {announcement ? `Editing announcement ${announcement.id}` : 'Create new announcement'}
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
            {announcement && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<AnnouncementIcon />}
              >
                <Typography fontWeight="600">
                  Editing announcement: {announcement.title}
                </Typography>
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <AnnouncementIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Basic Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          name="title"
                          label="Title"
                          value={form.title}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('title')}
                          helperText={getFieldError('title') || `${form.title.length}/150 characters`}
                          disabled={isSubmitting}
                          placeholder="Enter announcement title..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Category color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="target_audience"
                          label="Target Audience"
                          select
                          value={form.target_audience}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('target_audience')}
                          helperText={getFieldError('target_audience') || 'Select target audience'}
                          disabled={isSubmitting}
                          InputProps={{ sx: { borderRadius: 2 } }}
                        >
                          {TARGET_AUDIENCE.map(audience => (
                            <MenuItem key={audience} value={audience}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Typography>{audience}</Typography>
                                {form.target_audience === audience && (
                                  <Chip size="small" label="Selected" color="primary" />
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="publish_date"
                          label="Publish Date"
                          type="date"
                          value={form.publish_date}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!getFieldError('publish_date')}
                          helperText={getFieldError('publish_date') || 'When to publish this announcement'}
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Content Section */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                        <AnnouncementIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        Announcement Content
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <TextField
                      name="content"
                      label="Content"
                      value={form.content}
                      onChange={handleChange}
                      fullWidth
                      required
                      multiline
                      rows={6}
                      error={!!getFieldError('content')}
                      helperText={
                        getFieldError('content') || 
                        `${form.content.length} characters (minimum 5 required)`
                      }
                      placeholder="Write your announcement content here..."
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
                      <Grid item xs={12} md={4}>
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
                          helperText="Set the priority level for this announcement"
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
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="status"
                          label="Status"
                          select
                          value={form.status}
                          onChange={handleChange}
                          fullWidth
                          disabled={isSubmitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Publish color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                          helperText="Current status of this announcement"
                        >
                          {ANNOUNCEMENT_STATUS.map(status => (
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
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="views"
                          label="Views"
                          type="number"
                          value={form.views}
                          onChange={handleChange}
                          fullWidth
                          disabled={isSubmitting}
                          InputProps={{ sx: { borderRadius: 2 } }}
                          helperText="Number of views (auto-updated)"
                        />
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
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
              }
            }}
          >
            {isSubmitting ? 'Saving...' : (announcement ? 'Update Announcement' : 'Create Announcement')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAnnouncementModal;
