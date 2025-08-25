import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Box, Divider,
  Card, CardContent, Avatar, IconButton, Alert, Chip,
  InputAdornment, Paper
} from '@mui/material';
import {
  Group as GroupIcon, Close, Save, Person, People,
  Message, Edit, Cancel, CheckCircle, AccessTime
} from '@mui/icons-material';

const EditGroupMessageModal = ({ open, groupMessage, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: '',
    group_name: '',
    message: '',
    sender_name: '',
    member_count: 0,
    timestamp: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Helper function to format timestamp for datetime-local input
  const formatTimestampForInput = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DDTHH:MM (required for datetime-local input)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // ✅ Helper function to convert datetime-local input to MySQL format
  const formatTimestampForDatabase = (timestamp) => {
    if (!timestamp) return new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      
      // Convert to MySQL datetime format: YYYY-MM-DD HH:MM:SS
      return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      console.error('Error formatting timestamp for database:', error);
      return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
  };

  useEffect(() => {
    if (groupMessage) {
      // ✅ Editing existing message
      setForm({
        id: groupMessage.id || '',
        group_name: groupMessage.group_name || groupMessage.groupName || '',
        message: groupMessage.message || '',
        sender_name: groupMessage.sender_name || groupMessage.senderName || '',
        member_count: groupMessage.member_count || groupMessage.memberCount || 0,
        timestamp: formatTimestampForInput(groupMessage.timestamp) || formatTimestampForInput(new Date()),
      });
    } else {
      // ✅ Creating new message
      const now = new Date();
      setForm({
        id: '',
        group_name: '',
        message: '',
        sender_name: '',
        member_count: 0,
        timestamp: formatTimestampForInput(now),
      });
    }
    
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setShowSuccess(false);
  }, [groupMessage, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Group name validation
    if (!form.group_name.trim()) {
      newErrors.group_name = 'Group name is required';
    } else if (form.group_name.trim().length < 2) {
      newErrors.group_name = 'Group name must be at least 2 characters';
    } else if (form.group_name.trim().length > 100) {
      newErrors.group_name = 'Group name must be less than 100 characters';
    } else if (!/^[A-Za-z0-9\s&.-]+$/.test(form.group_name.trim())) {
      newErrors.group_name = 'Group name contains invalid characters';
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 1) {
      newErrors.message = 'Message cannot be empty';
    } else if (form.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    // Sender name validation
    if (!form.sender_name.trim()) {
      newErrors.sender_name = 'Sender name is required';
    } else if (form.sender_name.trim().length < 2) {
      newErrors.sender_name = 'Sender name must be at least 2 characters';
    } else if (form.sender_name.trim().length > 100) {
      newErrors.sender_name = 'Sender name must be less than 100 characters';
    } else if (!/^[A-Za-z\s]+$/.test(form.sender_name.trim())) {
      newErrors.sender_name = 'Sender name should contain only letters and spaces';
    }

    // Member count validation
    const memberCount = parseInt(form.member_count);
    if (isNaN(memberCount) || memberCount < 0 || memberCount > 1000) {
      newErrors.member_count = 'Member count must be between 0 and 1000';
    }

    // Timestamp validation
    if (!form.timestamp) {
      newErrors.timestamp = 'Timestamp is required';
    } else {
      const date = new Date(form.timestamp);
      if (isNaN(date.getTime())) {
        newErrors.timestamp = 'Invalid timestamp format';
      }
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
      // ✅ Prepare payload with proper timestamp formatting
      const payload = {
        ...form,
        member_count: parseInt(form.member_count) || 0,
        timestamp: formatTimestampForDatabase(form.timestamp)
      };

      console.log('📤 Submitting group message:', payload);
      await onSave(payload);
      
      setShowSuccess(true);
      
      // Close modal after showing success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving group message:', error);
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getMemberCountColor = (count) => {
    if (count >= 50) return 'success';
    if (count >= 20) return 'warning';
    return 'info';
  };

  // ✅ Format display time
  const formatDisplayTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '';
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
          borderRadius: 4, 
          maxHeight: '95vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        } 
      }}
    >
      <DialogTitle sx={{ pb: 2, position: 'relative', bgcolor: 'transparent' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            sx={{ 
              bgcolor: groupMessage ? 'warning.main' : 'success.main',
              width: 64, 
              height: 64,
              boxShadow: 4
            }}
          >
            {groupMessage ? <Edit fontSize="large" /> : <GroupIcon fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="700" color="primary.main">
              {groupMessage ? 'Edit Group Message' : 'Create Group Message'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {groupMessage ? `Editing message ${groupMessage.id}` : 'Create new group message'}
            </Typography>
            {groupMessage && (
              <Chip 
                label={`ID: ${groupMessage.id}`}
                size="small" 
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 16, 
            top: 16,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'background.paper', mx: 2, borderRadius: 3 }}>
        {/* Success Alert */}
        {showSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircle />}
          >
            Group message {groupMessage ? 'updated' : 'created'} successfully!
          </Alert>
        )}

        {/* Progress indicator for editing mode */}
        {groupMessage && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Editing:</strong> {groupMessage.group_name || groupMessage.groupName}
            </Typography>
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Group Information Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'primary.50' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 'bold'
            }}>
              <GroupIcon />
              Group Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  name="group_name"
                  label="Group Name"
                  value={form.group_name}
                  onChange={handleChange}
                  error={!!getFieldError('group_name')}
                  helperText={getFieldError('group_name') || 'Enter a descriptive group name'}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'background.paper'
                    } 
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="member_count"
                  label="Member Count"
                  type="number"
                  value={form.member_count}
                  onChange={handleChange}
                  error={!!getFieldError('member_count')}
                  helperText={getFieldError('member_count') || 'Number of group members'}
                  inputProps={{ min: 0, max: 1000 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People color={getMemberCountColor(form.member_count)} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'background.paper'
                    } 
                  }}
                />
              </Grid>
            </Grid>

            {/* Member Count Indicator */}
            <Box mt={2}>
              <Chip 
                label={`${form.member_count} members`}
                color={getMemberCountColor(form.member_count)}
                icon={<People />}
                variant="outlined"
              />
            </Box>
          </Paper>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          {/* Message Information Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'success.50' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'success.main',
              fontWeight: 'bold'
            }}>
              <Message />
              Message Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="sender_name"
                  label="Sender Name"
                  value={form.sender_name}
                  onChange={handleChange}
                  error={!!getFieldError('sender_name')}
                  helperText={getFieldError('sender_name') || 'Name of the message sender'}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'background.paper'
                    } 
                  }}
                />
              </Grid>
              {/* ✅ TIME FIELD - This was missing! */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="timestamp"
                  label="Message Time"
                  type="datetime-local"
                  value={form.timestamp}
                  onChange={handleChange}
                  error={!!getFieldError('timestamp')}
                  helperText={getFieldError('timestamp') || 'When the message was sent'}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime color="info" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'background.paper'
                    } 
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="message"
                  label="Message Content"
                  multiline
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  error={!!getFieldError('message')}
                  helperText={
                    getFieldError('message') || 
                    `${form.message.length}/1000 characters`
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Message color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'background.paper'
                    },
                    '& .MuiInputBase-inputMultiline': {
                      lineHeight: 1.6
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* ✅ Time Display */}
            {form.timestamp && (
              <Box mt={2}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    <AccessTime fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    <strong>Scheduled for:</strong> {formatDisplayTime(form.timestamp)}
                  </Typography>
                </Alert>
              </Box>
            )}

            {/* Message Preview */}
            {form.message && (
              <Box mt={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Message Preview:
                </Typography>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  border: '2px dashed',
                  borderColor: 'success.200',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {form.message}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50', gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          disabled={isSubmitting}
          startIcon={<Cancel />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CheckCircle /> : <Save />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            minWidth: 160,
            background: groupMessage 
              ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
              : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            '&:hover': {
              background: groupMessage
                ? 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
                : 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
            },
            '&:disabled': {
              background: 'grey.300'
            }
          }}
        >
          {isSubmitting 
            ? 'Saving...' 
            : (groupMessage ? 'Update Message' : 'Create Message')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGroupMessageModal;
