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
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';

import {
  Announcement as AnnouncementIcon,
  Close,
  TrendingUp,
  Category,
  PriorityHigh,
  Publish,
  Drafts,
  Archive,
} from '@mui/icons-material';

const ViewAnnouncementModal = ({ open, announcement, onClose }) => {
  if (!announcement) return null;

  const formatDateTime = (timestamp) =>
    timestamp
      ? new Date(timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : 'N/A';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'success';
      case 'Draft':
        return 'warning';
      case 'Archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Published':
        return <Publish fontSize="small" color="success" />;
      case 'Draft':
        return <Drafts fontSize="small" color="warning" />;
      case 'Archived':
        return <Archive fontSize="small" color="disabled" />;
      default:
        return <AnnouncementIcon fontSize="small" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ pb: 1, position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AnnouncementIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              Announcement Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {announcement.id} • {formatDateTime(announcement.publish_date)}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status Overview Card */}
        <Card sx={{ mb: 3, backgroundColor: 'grey.100' }}>
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>{getStatusIcon(announcement.status)}</Grid>
              <Grid item xs>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {announcement.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Chip
                  label={announcement.priority}
                  size="small"
                  color={getPriorityColor(announcement.priority)}
                  icon={
                    announcement.priority === 'High' ? (
                      <PriorityHigh fontSize="small" />
                    ) : undefined
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Announcement Information Section */}
        <Box mb={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Category fontSize="small" />
            Announcement Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Target Audience
              </Typography>
              <Chip
                label={announcement.target_audience}
                color="primary"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Views
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <TrendingUp fontSize="small" color="action" />
                <Typography variant="body1" fontWeight="600">
                  {announcement.views || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Published Date
              </Typography>
              <Typography variant="body1">
                {formatDateTime(announcement.publish_date)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Announcement Content Section */}
        <Box mb={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AnnouncementIcon fontSize="small" />
            Announcement Content
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {announcement.content}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Metadata Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Announcement ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {announcement.id}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Published On
              </Typography>
              <Typography variant="body1">
                {formatDateTime(announcement.publish_date)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Current Priority
              </Typography>
              <Chip
                label={announcement.priority}
                size="small"
                color={getPriorityColor(announcement.priority)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAnnouncementModal;
