import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isTokenValid } from '../authUtils.tsx';
import background from '../assets/background.jpg';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
} from '@mui/icons-material';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#5d2365',
      dark: '#a352b1',
      light: '#81298F',
    },
    background: {
      default: '#151515',
    }
  },
};

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (isTokenValid(token) && user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/panel_uzytkownika');
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setLoginError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:3001/api/auth/login',
        {
          login: username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/panel_uzytkownika');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Invalid credentials';
        setLoginError(message);
      } else {
        setLoginError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        bgcolor: darkTheme.palette.background.default,
      }}
    >
      {/* Left side - Image/Testimonial */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          backgroundImage: `linear-gradient(rgba(93, 35, 101, 0.8), rgba(21, 21, 21, 0.9)), url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon sx={{ fontSize: 32, color: darkTheme.palette.primary.light }} />
          <Typography variant="h6" sx={{ color: darkTheme.palette.primary.light }}>
            UniManage
          </Typography>
        </Box>

        <Box>
          <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
            Welcome to UniManage
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, maxWidth: '80%', color: 'grey.300' }}>
            "Transform your academic journey with our comprehensive university management system."
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Prof. John Smith
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          © 2024 UniManage. All rights reserved.
        </Typography>
      </Box>

      {/* Right side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          bgcolor: darkTheme.palette.background.default,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ mb: 1, color: 'white' }}>
              Sign in
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: 'grey.400' }}>
              Enter your credentials to access your account
            </Typography>
          </Box>

          {loginError && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {loginError}
            </Typography>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Username or Email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setLoginError('');
              }}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkTheme.palette.primary.light,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkTheme.palette.primary.main,
                  },
                  // Add this for input text color
                  '& input': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'grey.500',
                  '&.Mui-focused': {
                    color: darkTheme.palette.primary.main,
                  },
                },
              }}
            />

                        <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError('');
              }}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkTheme.palette.primary.light,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkTheme.palette.primary.main,
                  },
                  // Add this for input text color
                  '& input': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'grey.500',
                  '&.Mui-focused': {
                    color: darkTheme.palette.primary.main,
                  },
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'grey.500' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                bgcolor: darkTheme.palette.primary.main,
                '&:hover': {
                  bgcolor: darkTheme.palette.primary.dark,
                },
                '&:disabled': {
                  bgcolor: 'rgba(93, 35, 101, 0.5)',
                },
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'grey.500' }}>
                OR CONTINUE WITH
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                startIcon={<GoogleIcon />}
                disabled={isLoading}
                sx={{
                  borderColor: darkTheme.palette.primary.main,
                  color: darkTheme.palette.primary.main,
                  '&:hover': {
                    borderColor: darkTheme.palette.primary.light,
                    color: darkTheme.palette.primary.light,
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                startIcon={<GitHubIcon />}
                disabled={isLoading}
                sx={{
                  borderColor: darkTheme.palette.primary.main,
                  color: darkTheme.palette.primary.main,
                  '&:hover': {
                    borderColor: darkTheme.palette.primary.light,
                    color: darkTheme.palette.primary.light,
                  },
                }}
              >
                GitHub
              </Button>
            </Stack>

            <Typography variant="body2" align="center">
              <Link
                to="/auth/forgot-password"
                style={{
                  textDecoration: 'none',
                  color: darkTheme.palette.primary.main,
                }}
              >
                Forgot password?
              </Link>
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;