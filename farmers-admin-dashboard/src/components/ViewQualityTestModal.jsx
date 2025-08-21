import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Chip,
  Typography,
  Box,
  TextField,
  Avatar,
} from '@mui/material';
import {
  Science,
  Info,
  Assignment,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { CheckCircle } from '@mui/icons-material';

const ViewQualityTestModal = ({ open, qualityTest, onClose }) => {
  if (!qualityTest) return null;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })
      : 'N/A';

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B':
        return 'info';
      case 'C':
        return 'warning';
      case 'D':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>
              <CheckCircle />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {qualityTest.test_type || 'Quality Test'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Record ID: {qualityTest.id}
              </Typography>
            </Box>
          </Box>
          
          {/* Progress Bar */}
          <Box sx={{ 
            height: 4, 
            bgcolor: '#4caf50', 
            borderRadius: 2,
            mb: 3
          }} />
        </Box>

        {/* Basic Information Section */}
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
            <Info sx={{ mr: 1 }} />
            Basic Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Test ID"
                value={qualityTest.id}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Test Type"
                value={qualityTest.test_type || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={qualityTest.remarks || 'Quality test analysis'}
                variant="outlined"
                size="small"
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Overall Grade
              </Typography>
              <Chip
                label={qualityTest.overall_grade || 'N/A'}
                color={getGradeColor(qualityTest.overall_grade)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip
                label={qualityTest.status}
                color={getStatusColor(qualityTest.status)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Priority
              </Typography>
              <Chip
                label="Medium"
                color="info"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Test Results Section */}
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
            Test Results
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Batch ID"
                value={qualityTest.batch_id}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Sample ID"
                value={qualityTest.sample_id}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Farmer ID"
                value={qualityTest.farmer_id}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Fat Content (%)"
                value={qualityTest.fat_content || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Protein Content (%)"
                value={qualityTest.protein_content || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="SNF Content (%)"
                value={qualityTest.snf_content || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Date Information Section */}
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
            <CalendarToday sx={{ mr: 1 }} />
            Date Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Test Date"
                value={formatDate(qualityTest.test_date)}
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
                bgcolor: '#fff3e0',
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Due Date
                </Typography>
                <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {formatDate(qualityTest.test_date)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Additional Information Section */}
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
            Additional Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tested By"
                value={qualityTest.tested_by || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="pH Level"
                value={qualityTest.ph_level || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Bacteria Count"
                value={qualityTest.bacteria_count || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Adulteration"
                value={qualityTest.adulteration || 'N/A'}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>

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

export default ViewQualityTestModal;
