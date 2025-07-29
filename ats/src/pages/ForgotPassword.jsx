// ats/src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Link, Alert,
  InputAdornment, Stack, Fade, Slide, Zoom
} from '@mui/material';
import { Email, Send, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';                 // ⬅️  NEW – shared Axios instance
import atsLogo from '../assets/logo.png.png';

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation helpers
  const [mounted, setMounted]       = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'ASTROLITE TECH SOLUTION';

  /* --------------------  Typewriter + mount effect  -------------------- */
  useEffect(() => {
    setMounted(true);

    const startDelay = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayedText(fullText.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }, 1_000);

    return () => clearTimeout(startDelay);
  }, []);

  /* -----------------------------  Submit  ------------------------------ */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });

      setSent(true);
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      console.error('Forgot-password error:', err);
      if (err.response?.status === 404) {
        setError('No account found with this email.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================  RENDER  =========================== */
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
        '0%,100%': { transform: 'translateY(0)' },
        '50%':     { transform: 'translateY(-20px)' }
      },
      '@keyframes blink': {
        '0%,50%':  { opacity: 1 },
        '51%,100%':{ opacity: 0 }
      },
      '@keyframes fadeInUp': {
        '0%': { transform: 'translateY(30px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 }
      }
    }}>
      {/* Floating circle */}
      <Box sx={{
        position: 'absolute',
        top: -50, left: -50,
        width: 300, height: 300,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Typewriter heading */}
      <Box sx={{ position: 'absolute', top: '15%', left: '8%', zIndex: 0 }}>
        <Typography sx={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          fontFamily: 'monospace',
          '&::after': {
            content: '"|"',
            ml: 0.5,
            color: 'rgba(255,255,255,0.8)',
            animation: 'blink 1s infinite'
          }
        }}>
          {displayedText}
        </Typography>

        <Typography sx={{
          fontSize: '1.2rem',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.7)',
          mt: 1,
          animation: 'fadeInUp 2s ease-out 3s both'
        }}>
          Excellence in Technology
        </Typography>
      </Box>

      {/* Main card */}
      <Fade in={mounted} timeout={1_000}>
        <Paper elevation={24} sx={{
          p: 3, mr: 8,
          maxWidth: 350, width: '100%',
          borderRadius: 4,
          backdropFilter: 'blur(20px)',
          background: theme.palette.mode === 'dark'
            ? 'rgba(30,30,30,0.95)'
            : 'rgba(255,255,255,0.95)',
          border: `1px solid ${theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.1)'}`,
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <Stack spacing={2.5} alignItems="center">

            {/* Logo */}
            <Zoom in={mounted} timeout={1_500}>
              <Box sx={{
                width: 80, height: 80, borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid', borderColor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'white',
                boxShadow: theme.shadows[8],
                animation: 'float 3s ease-in-out infinite',
                '&:hover': { transform: 'scale(1.1)', boxShadow: theme.shadows[16] }
              }}>
                <img src={atsLogo} alt="ATS Logo"
                     style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
              </Box>
            </Zoom>

            {/* Heading */}
            <Slide direction="down" in={mounted} timeout={1_000}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold" color="primary"
                            sx={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}>
                  Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary"
                            sx={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}>
                  Enter your email to receive reset instructions
                </Typography>
              </Box>
            </Slide>

            {/* Success / error alerts */}
            {message && (
              <Slide direction="up" in timeout={500}>
                <Alert severity="success" sx={{ width: '100%', fontSize: '0.85rem' }}>
                  {message}
                </Alert>
              </Slide>
            )}

            {error && (
              <Slide direction="up" in timeout={500}>
                <Alert severity="error" sx={{ width: '100%', fontSize: '0.85rem' }}>
                  {error}
                </Alert>
              </Slide>
            )}

            {/* Form or CTA */}
            {!sent ? (
              <Slide direction="up" in={mounted} timeout={1_200}>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" sx={{ fontSize: '1.2rem' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[4]
                          }
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      startIcon={<Send />}
                      disabled={loading}
                      sx={{
                        borderRadius: 3, py: 1.2,
                        background: 'linear-gradient(45deg,#667eea 30%,#764ba2 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg,#5a67d8 30%,#6b46c1 90%)',
                          transform: 'translateY(-3px)',
                          boxShadow: theme.shadows[12]
                        }
                      }}
                    >
                      {loading ? 'Sending…' : 'Send Reset Instructions'}
                    </Button>
                  </Stack>
                </Box>
              </Slide>
            ) : (
              <Slide direction="up" in timeout={1_000}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: 3, py: 1.2,
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[4] }
                  }}
                >
                  Back to Login
                </Button>
              </Slide>
            )}

            {/* Back link if form still visible */}
            {!sent && (
              <Slide direction="up" in timeout={1_400}>
                <Link
                  component="button"
                  onClick={() => navigate('/login')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    fontSize: '0.85rem',
                    '&:hover': { transform: 'scale(1.05)', color: 'primary.main' }
                  }}
                >
                  <ArrowBack fontSize="small" /> Back to Login
                </Link>
              </Slide>
            )}
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ForgotPassword;
