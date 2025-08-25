import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Grid, Divider, Paper,
  Card, CardContent, Avatar, IconButton, Stack, Badge
} from '@mui/material';
import {
  Group as GroupIcon, Person, AccessTime, People, Close,
  Message, Send, Schedule, Visibility, TrendingUp
} from '@mui/icons-material';

const ViewGroupMessageModal = ({ open, groupMessage, onClose }) => {
  if (!groupMessage) return null;

  const formatDateTime = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }) : 'N/A';

  const getMemberCountColor = (count) => {
    if (count >= 50) return 'success';
    if (count >= 20) return 'warning';
    return 'info';
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
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        } 
      }}
    >
      {/* Enhanced Header */}
      <DialogTitle sx={{ pb: 2, position: 'relative', bgcolor: 'transparent' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 64, 
              height: 64,
              boxShadow: 3
            }}
          >
            <GroupIcon fontSize="large" />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h5" fontWeight="700" color="primary.main">
              Group Message Details
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              ID: {groupMessage.id} • {formatDateTime(groupMessage.timestamp)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip 
                icon={<Schedule fontSize="small" />}
                label="Active"
                size="small" 
                color="success"
                variant="outlined"
              />
              <Chip 
                icon={<Visibility fontSize="small" />}
                label="Public"
                size="small" 
                color="info"
                variant="outlined"
              />
            </Stack>
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
        {/* Group Overview Card */}
        <Card sx={{ 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: 4
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 72, 
                  height: 72,
                  backdropFilter: 'blur(10px)'
                }}>
                  <GroupIcon fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                  Group Name
                </Typography>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                  {groupMessage.group_name || groupMessage.groupName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <People fontSize="small" />
                    <Typography variant="body1" fontWeight="600">
                      {groupMessage.member_count || groupMessage.memberCount || 0} Members
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUp fontSize="small" />
                    <Typography variant="body1" fontWeight="600">
                      Active
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item>
                <Badge
                  badgeContent={groupMessage.member_count || groupMessage.memberCount || 0}
                  color="secondary"
                  max={999}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '1rem',
                      height: '32px',
                      minWidth: '32px',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    width: 56, 
                    height: 56 
                  }}>
                    <People fontSize="large" />
                  </Avatar>
                </Badge>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Message Information */}
        <Box mb={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            <Message fontSize="medium" />
            Message Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sender Details
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {groupMessage.sender_name || groupMessage.senderName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Message Sender
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Timestamp
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <AccessTime />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {formatDateTime(groupMessage.timestamp)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Message Sent
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        {/* Message Content */}
        <Box mb={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            <Send fontSize="medium" />
            Message Content
          </Typography>
          <Paper sx={{ 
            p: 3, 
            bgcolor: 'primary.50', 
            border: '2px solid',
            borderColor: 'primary.100',
            borderRadius: 3
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line', 
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.primary'
              }}
            >
              {groupMessage.message}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        {/* Statistics & Metadata */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            📊 Message Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: 'success.50',
                border: '1px solid',
                borderColor: 'success.200'
              }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                  <GroupIcon />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Message ID
                </Typography>
                <Typography variant="h6" fontWeight="bold" fontFamily="monospace">
                  {groupMessage.id}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: 'info.50',
                border: '1px solid',
                borderColor: 'info.200'
              }}>
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                  <People />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Total Members
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {groupMessage.member_count || groupMessage.memberCount || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: 'warning.50',
                border: '1px solid',
                borderColor: 'warning.200'
              }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                  <Person />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Sender
                </Typography>
                <Typography variant="body1" fontWeight="bold" noWrap>
                  {groupMessage.sender_name || groupMessage.senderName}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: 'secondary.50',
                border: '1px solid',
                borderColor: 'secondary.200'
              }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                  <Schedule />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label="Active" 
                  size="small" 
                  color="success" 
                  variant="filled"
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            minWidth: 120,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewGroupMessageModal;
