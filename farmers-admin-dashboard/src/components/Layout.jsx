import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Avatar,
  Container,
  Paper,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Agriculture as FarmersIcon,
  Business as SuppliersIcon,
  LocalDrink as MilkIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Brightness6 as ThemeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import atsLogo from '../assets/logo.png.png';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced toggle function - preserving original functionality
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/', 
      color: '#1976d2',
      bgColor: 'rgba(25, 118, 210, 0.1)'
    },
    { 
      text: 'Farmers', 
      icon: <FarmersIcon />, 
      path: '/farmers',
      color: '#2e7d32',
      bgColor: 'rgba(46, 125, 50, 0.1)'
    },
    { 
      text: 'Suppliers', 
      icon: <SuppliersIcon />, 
      path: '/suppliers',
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.1)'
    },
    {
    text: 'Milk Entries',
    icon: <MilkIcon />,
    path: '/milk-entries',
    color: '#1565c0',
    bgColor: 'rgba(21, 101, 192, 0.1)'
  }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
      }}
    >
      {/* Enhanced Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5,
          minHeight: 80,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            src={atsLogo} 
            alt="ATS Logo" 
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              ATS System
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
              Management Portal
            </Typography>
          </Box>
        </Box>
        {!isMobile && (
          <Tooltip title="Collapse Sidebar">
            <IconButton 
              onClick={handleDrawerToggle}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

      {/* Enhanced Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&.Mui-selected': {
                    bgcolor: item.bgColor,
                    color: item.color,
                    fontWeight: 600,
                    boxShadow: `0 2px 8px ${item.color}20`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: item.color,
                      borderRadius: '0 4px 4px 0'
                    },
                    '&:hover': {
                      bgcolor: item.bgColor,
                      transform: 'translateX(4px)'
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)',
                    transform: 'translateX(2px)'
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? item.color : 'text.secondary',
                    minWidth: 40,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
                {isActive && (
                  <Chip 
                    size="small" 
                    sx={{ 
                      bgcolor: item.color,
                      color: 'white',
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

      {/* Enhanced Footer Section */}
      <Box sx={{ p: 2 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 1.5, 
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <AccountIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                System Administrator
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                <SettingsIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Theme">
              <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                <ThemeIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Enhanced AppBar with Advanced Styling */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { 
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' 
          },
          ml: { 
            md: desktopOpen ? `${drawerWidth}px` : 0 
          },
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: { xs: 80, sm: 90 }, 
            justifyContent: 'center',
            position: 'relative',
            px: { xs: 2, sm: 3 }
          }}
        >
          {/* Menu Toggle Button - Enhanced with Tooltip */}
          <Tooltip title={desktopOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                position: 'absolute',
                left: { xs: 16, sm: 24 },
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease',
                display: { md: desktopOpen && !isMobile ? 'none' : 'flex' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {/* Enhanced Centered Title */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="div" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '2rem', md: '2.125rem' },
                background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.025em'
              }}
            >
              MANAGEMENT PORTAL
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Advanced Data Management 
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - Temporary Variant (Preserved Functionality) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: '8px 0 24px rgba(0,0,0,0.12)'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer - Persistent Variant (Preserved Functionality) */}
      <Drawer
        variant="persistent"
        open={desktopOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Enhanced Main Content Area with Preserved Toggle Coordination */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
         width: { 
            xs: '100%',
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' 
          },
          ml: {
            xs: 0,
            md: desktopOpen ? `${drawerWidth}px` : 0
          },
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          position: 'relative',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.02) 0%, transparent 20%)',
            pointerEvents: 'none'
          }
        }}
      >
        {/* Toolbar Spacer */}
        <Toolbar sx={{ minHeight: { xs: 80, sm: 90 } }} />
        
        {/* Enhanced Content Container */}
        <Container 
          maxWidth={false} 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
              minHeight: 'calc(100vh - 140px)',
              position: 'relative'
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {children}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;