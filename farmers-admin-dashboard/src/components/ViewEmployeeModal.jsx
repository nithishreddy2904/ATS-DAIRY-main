import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Chip,
  Avatar,
  Box,
  Divider,
  alpha,
} from '@mui/material';
import { 
  Person, 
  Work, 
  Phone, 
  Email, 
  Business,
  CalendarToday,
  AttachMoney 
} from '@mui/icons-material';

// Department configuration (same as original)
const DEPARTMENT_CONFIG = {
  'Production': { color: '#2196F3', icon: '🏭', bgColor: '#E3F2FD' },
  'Quality Control': { color: '#4CAF50', icon: '🔬', bgColor: '#E8F5E8' },
  'Processing': { color: '#FF9800', icon: '⚙️', bgColor: '#FFF3E0' },
  'Logistics': { color: '#9C27B0', icon: '🚛', bgColor: '#F3E5F5' },
  'Administration': { color: '#607D8B', icon: '📋', bgColor: '#ECEFF1' },
  'Maintenance': { color: '#795548', icon: '🔧', bgColor: '#EFEBE9' }
};

const ViewEmployeeModal = ({ open, employee, onClose }) => {
  if (!employee) return null;

  const deptConfig = DEPARTMENT_CONFIG[employee.department] || { color: '#757575', icon: '👥', bgColor: '#F5F5F5' };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: deptConfig.color, width: 48, height: 48 }}>
            {employee.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">{employee.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {employee.position} - {employee.department}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee ID"
              value={employee.employee_id || employee.id}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              value={employee.name}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Position"
              value={employee.position}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Department
              </Typography>
              <Chip 
                label={employee.department}
                sx={{ 
                  bgcolor: deptConfig.bgColor,
                  color: deptConfig.color,
                  fontWeight: 'medium',
                  '& .MuiChip-label': { px: 2 }
                }}
                icon={<span style={{ fontSize: '16px' }}>{deptConfig.icon}</span>}
              />
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              value={employee.phone}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email Address"
              value={employee.email}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          {employee.address && (
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={employee.address}
                fullWidth
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {employee.emergency_contact && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Emergency Contact"
                value={employee.emergency_contact}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {/* Employment Details */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
              Employment Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Salary"
              value={`₹${Number(employee.salary || 0).toLocaleString()}`}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Join Date"
              value={formatDate(employee.join_date)}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={employee.status}
                color={employee.status === 'Active' ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Grid>

          {employee.experience && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience"
                value={employee.experience}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          )}

          {/* Additional Information */}
          {(employee.qualification || employee.blood_group || employee.date_of_birth) && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {employee.qualification && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Qualification"
                    value={employee.qualification}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {employee.blood_group && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Blood Group"
                    value={employee.blood_group}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}

              {employee.date_of_birth && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    value={formatDate(employee.date_of_birth)}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEmployeeModal;
