import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Link, Alert,
  InputAdornment, IconButton, Stack, Divider, Fade, Slide, Zoom
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  
import { useTheme } from '@mui/material/styles';
import atsLogo from '../../assets/logo.png.png';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();  // Added isAuthenticated
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const fullText = 'ASTROLITE TECH SOLUTION';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated,loading, navigate]);

  useEffect(() => {
    setMounted(true);
    
    // Typewriter effect with delay
    const startDelay = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayedText(fullText.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 100); // Typing speed

      return () => clearInterval(timer);
    }, 1000); // Start after 1 second

    return () => clearTimeout(startDelay);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!formData.email || !formData.password) {
    setError('Please fill in all fields');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError('Please enter a valid email address');
    return;
  }

  try {
    const success = await login(formData.email.trim(), formData.password);
    console.log('is Login success:', success);
    if (success) {
      navigate('/dashboard');
    }
  } catch (err) {
  setError('Incorrect email or password');   // NEW ─ shows invalid-creds message
  console.error('Login error:', err);
}
  };




  

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      p: 2,
      position: 'relative',
      overflow: 'hidden',
      '@keyframes float': {
        '0%, 100%': { 
          transform: 'translateY(0px)',
        },
        '50%': { 
          transform: 'translateY(-20px)',
        },
      },
      '@keyframes slideInFromLeft': {
        '0%': { transform: 'translateX(-100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
      },
      '@keyframes slideInFromRight': {
        '0%': { transform: 'translateX(100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
      },
      '@keyframes bounceIn': {
        '0%': { transform: 'scale(0.3)', opacity: 0 },
        '50%': { transform: 'scale(1.05)' },
        '70%': { transform: 'scale(0.9)' },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
      '@keyframes fadeInUp': {
        '0%': { transform: 'translateY(30px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      '@keyframes blink': {
        '0%, 50%': { opacity: 1 },
        '51%, 100%': { opacity: 0 },
      },
      '@keyframes typewriter': {
        '0%': { width: '0%' },
        '100%': { width: '100%' },
      },
    }}>
      {/* Circular background in top left */}
      <Box sx={{
        position: 'absolute',
        top: '-50px',
        left: '-50px',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0,
      }} />

      {/* Typewriter text in top-left corner */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '8%',
        zIndex: 0,
      }}>
        <Typography sx={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          lineHeight: 1.2,
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          '&::after': {
            content: '"|"',
            animation: 'blink 1s infinite',
            color: 'rgba(255, 255, 255, 0.8)',
            marginLeft: '2px',
          }
        }}>
          {displayedText}
        </Typography>
        <Typography sx={{
          fontSize: '1.2rem',
          fontWeight: '300',
          color: 'rgba(255, 255, 255, 0.7)',
          animation: 'fadeInUp 2s ease-out 3s both',
          marginTop: '1rem',
        }}>
          Excellence in Technology
        </Typography>
      </Box>

      <Fade in={mounted} timeout={1000}>
        <Paper elevation={24} sx={{
          p: 3,
          maxWidth: 350,
          width: '100%',
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          position: 'relative',
          zIndex: 1,
          animation: 'bounceIn 1s ease-out',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          mr: 8,
        }}>
          <Stack spacing={2.5} alignItems="center">
            {/* Animated Logo */}
            <Zoom in={mounted} timeout={1500}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                boxShadow: theme.shadows[8],
                transition: 'all 0.3s ease',
                animation: 'float 3s ease-in-out infinite',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                  boxShadow: theme.shadows[16],
                }
              }}>
                <img 
                  src={atsLogo} 
                  alt="ATS Tech Logo" 
                  style={{ 
                    width: '90%', 
                    height: '90%', 
                    objectFit: 'contain' 
                  }} 
                />
              </Box>
            </Zoom>
            
            {/* Animated Title */}
            <Slide direction="down" in={mounted} timeout={1000}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{
                  animation: 'fadeInUp 1s ease-out 0.5s both',
                }}>
                  ATS Tech
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  animation: 'fadeInUp 1s ease-out 0.7s both',
                }}>
                  Sign in to your account
                </Typography>
              </Box>
            </Slide>

            {/* Animated Error Alert */}
            {error && (
              <Slide direction="up" in={!!error} timeout={60_000}>
                <Alert severity="error" sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  animation: 'slideInFromLeft 2s ease-out',
                  fontSize: '1rem',
                }}>
                  {error}
                </Alert>
              </Slide>
            )}

            {/* Animated Login Form */}
            <Slide direction="up" in={mounted} timeout={1200}>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" sx={{ fontSize: '1.2rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        }
                      },
                      animation: 'slideInFromLeft 1s ease-out 0.9s both',
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" sx={{ fontSize: '1.2rem' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        }
                      },
                      animation: 'slideInFromRight 1s ease-out 1.1s both',
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="medium"
                    disabled={loading}
                    startIcon={<LoginIcon />}
                    sx={{
                      borderRadius: 3,
                      py: 1.2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      transition: 'all 0.3s ease',
                      animation: 'fadeInUp 1s ease-out 1.3s both',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                        transform: 'translateY(-3px)',
                        boxShadow: theme.shadows[12],
                      },
                      '&:active': {
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Stack>
              </Box>
            </Slide>

            <Divider sx={{ 
              width: '100%',
              animation: 'fadeInUp 1s ease-out 1.5s both',
            }} />

            {/* Animated Links */}
            <Slide direction="up" in={mounted} timeout={1600}>
              <Stack spacing={1.5} alignItems="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/forgot-password')}
                  sx={{ 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '0.85rem',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      color: 'primary.main',
                    }
                  }}
                >
                  Forgot your password?
                </Link>
                
                <Box sx={{
                  animation: 'fadeInUp 1s ease-out 1.7s both',
                }}>
                  <Typography variant="body2" color="text.secondary" component="span" sx={{ fontSize: '0.85rem' }}>
                    Don't have an account?{' '}
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/signup')}
                    sx={{ 
                      textDecoration: 'none', 
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        color: 'primary.main',
                      }
                    }}
                  >
                    Sign up
                  </Link>
                </Box>
              </Stack>
            </Slide>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
