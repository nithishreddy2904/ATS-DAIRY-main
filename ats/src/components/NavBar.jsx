import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  AppBar, Toolbar, Typography, Box, IconButton, Avatar, InputBase, Button,
  Menu, MenuItem, FormControl, FormControlLabel, Radio, RadioGroup,
  Divider, ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import atsLogo from '../assets/logo.png.png';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NavBar = ({ onBurgerClick }) => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  
  // Language state
  const [language, setLanguage] = useState('English');
  const [languageAnchor, setLanguageAnchor] = useState(null);
  
  // Profile menu state
  const [profileAnchor, setProfileAnchor] = useState(null);

  // Language options
  const languages = ['English', 'Telugu', 'Tamil', 'Hindi'];

  // Handle language change
  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    handleLanguageClose();
  };

  // Handle profile menu
  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
        color: theme.palette.mode === 'dark' ? '#fff' : '#2c3e50',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: theme.palette.mode === 'dark' 
          ? '2px solid #6c63ff' 
          : '2px solid #e3f2fd',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(108, 99, 255, 0.3)'
          : '0 4px 20px rgba(33, 150, 243, 0.15)',
        backdropFilter: 'blur(10px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(108, 99, 255, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(33, 150, 243, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(33, 150, 243, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left: Logo and Menu Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            border: '3px solid',
            borderColor: theme.palette.mode === 'dark' ? '#6c63ff' : '#2196f3',
            borderRadius: 5,
            p: '6px',
            mr: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, rgba(108, 99, 255, 0.1) 0%, rgba(108, 99, 255, 0.05) 100%)'
              : 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
              transform: 'scale(1.05)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 15px rgba(108, 99, 255, 0.4)'
                : '0 4px 15px rgba(33, 150, 243, 0.3)',
            }
          }}>
            <img src={atsLogo} alt="ATS Logo" style={{ height: 66,width: 140 }} />
          </Box>
          
          <IconButton
            color="inherit"
            onClick={onBurgerClick}
            edge="start"
            sx={{
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(108, 99, 255, 0.15)' 
                : 'rgba(33, 150, 243, 0.1)',
              color: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 2px 10px rgba(108, 99, 255, 0.3)'
                : '0 2px 10px rgba(33, 150, 243, 0.2)',
              mr: 3,
              transition: 'all 0.3s ease',
              border: '2px solid',
              borderColor: theme.palette.mode === 'dark' ? '#6c63ff' : '#2196f3',
              '&:hover': { 
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(108, 99, 255, 0.25)' 
                  : 'rgba(33, 150, 243, 0.15)',
                borderColor: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 15px rgba(108, 99, 255, 0.4)'
                  : '0 4px 15px rgba(33, 150, 243, 0.3)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Right: Search bar and profile section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, ml: 25 }}>
          {/* Search bar */}
          <Box sx={{
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(45, 45, 45, 0.8)' 
              : 'rgba(248, 249, 250, 0.9)',
            px: 2,
            py: 0.5,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            mr: 20,
            flexGrow: 1,
            maxWidth: 400,
            border: theme.palette.mode === 'dark' 
              ? '2px solid rgba(108, 99, 255, 0.3)' 
              : '2px solid rgba(33, 150, 243, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? '#6c63ff' : '#2196f3',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 15px rgba(108, 99, 255, 0.2)'
                : '0 4px 15px rgba(33, 150, 243, 0.15)',
            }
          }}>
            <Box sx={{
              border: '2px solid',
              borderColor: theme.palette.mode === 'dark' ? '#6c63ff' : '#2196f3',
              borderRadius: 2,
              p: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              transition: 'all 0.3s ease',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(108, 99, 255, 0.1)' 
                : 'rgba(33, 150, 243, 0.1)',
              '&:hover': {
                borderColor: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
                transform: 'scale(1.1)',
              }
            }}>
              <SearchIcon sx={{ 
                color: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2', 
                fontSize: 20 
              }} />
            </Box>
            <InputBase 
              placeholder="Search…" 
              sx={{ 
                width: '100%',
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                '& ::placeholder': {
                  color: theme.palette.mode === 'dark' ? '#aaa' : '#888',
                }
              }} 
            />
          </Box>
          
          {/* Language Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={handleLanguageClick}
            sx={{ 
              mr: 2, 
              textTransform: 'none', 
              borderRadius: 3,
              borderColor: theme.palette.mode === 'dark' ? '#6c63ff' : '#2196f3',
              color: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(108, 99, 255, 0.1)' 
                : 'rgba(33, 150, 243, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(108, 99, 255, 0.2)' 
                  : 'rgba(33, 150, 243, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}
            startIcon={<LanguageIcon />}
          >
            {language}
          </Button>
          
          {/* Language Menu */}
          <Menu
            anchorEl={languageAnchor}
            open={Boolean(languageAnchor)}
            onClose={handleLanguageClose}
            PaperProps={{
              sx: {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(45, 45, 45, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                border: theme.palette.mode === 'dark' 
                  ? '2px solid #6c63ff' 
                  : '2px solid #2196f3',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 25px rgba(108, 99, 255, 0.3)'
                  : '0 8px 25px rgba(33, 150, 243, 0.2)',
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Select Language
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup value={language} onChange={handleLanguageChange}>
                  {languages.map((lang) => (
                    <FormControlLabel
                      key={lang}
                      value={lang}
                      control={<Radio size="small" />}
                      label={lang}
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                        '& .MuiFormControlLabel-label': { fontSize: '14px' }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Menu>
          
          {/* Notifications */}
          <IconButton sx={{ 
            mr: 1, 
            color: 'inherit',
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(108, 99, 255, 0.1)' 
              : 'rgba(33, 150, 243, 0.05)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(108, 99, 255, 0.2)' 
                : 'rgba(33, 150, 243, 0.1)',
              transform: 'scale(1.1)',
            }
          }}>
            <NotificationsIcon />
          </IconButton>
          
          {/* Dark Mode Toggle */}
          <IconButton 
            onClick={toggleColorMode} 
            sx={{ 
              mr: 2, 
              color: 'inherit',
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(108, 99, 255, 0.15)' 
                : 'rgba(33, 150, 243, 0.1)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(108, 99, 255, 0.25)' 
                  : 'rgba(33, 150, 243, 0.15)',
                transform: 'rotate(180deg)',
              }
            }}
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          
          {/* Profile Avatar and Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleProfileClick}>
            <Avatar sx={{ 
              ml: 1, 
              bgcolor: '#4caf50',
              border: '2px solid',
              borderColor: theme.palette.mode === 'dark' ? '#6c63ff' : '#2196f3',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 15px rgba(108, 99, 255, 0.4)'
                  : '0 4px 15px rgba(33, 150, 243, 0.3)',
              }
            }}>
              {user?.avatar}
            </Avatar>
            <Typography sx={{ 
              ml: 1, 
              fontWeight: 600,
              color: theme.palette.mode === 'dark' ? '#8576ff' : '#1976d2',
            }}>
              {user?.name}
            </Typography>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(45, 45, 45, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                border: theme.palette.mode === 'dark' 
                  ? '2px solid #6c63ff' 
                  : '2px solid #2196f3',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 25px rgba(108, 99, 255, 0.3)'
                  : '0 8px 25px rgba(33, 150, 243, 0.2)',
                minWidth: 200
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  onBurgerClick: PropTypes.func.isRequired,
};

export default NavBar;
