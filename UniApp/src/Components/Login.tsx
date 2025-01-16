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

interface LoginResponse {
    status: 'success' | 'error';
    data?: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            login: string;
            email: string;
            role: string;
            firstName: string;
            lastName: string;
            entity_id: number;
        };
    };
    message?: string;
}

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
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

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

            if (response.data.status === 'success' && response.data.data) {
                const { accessToken, refreshToken, user } = response.data.data;

                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                const defaultRoutes = {
                    employee: '/panel_uzytkownika/e/overview',
                    professor: '/panel_uzytkownika/p/overview',
                    student: '/panel_uzytkownika/d/overview'
                };

                const defaultRoute = defaultRoutes[user.role.toLowerCase() as keyof typeof defaultRoutes]
                    || '/panel_uzytkownika';

                navigate(defaultRoute);
            } else {
                setLoginError(response.data.message || 'Login failed');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Invalid credentials';
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
                            Zaloguj się
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1, color: 'grey.400' }}>
                            Wprowadź swoje dane by uzyskać dostęp do swojego konta.
                        </Typography>
                    </Box>

                    {loginError && (
                        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {loginError}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Login lub e-mail"
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
                                label="Hasło"
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
                                type="submit"
                                fullWidth
                                size="large"
                                variant="contained"
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
                                {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                                    LUB ZALOGUJ SIĘ ZA POMOCA
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
                        </Stack>
                    </form>

                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                        <Link
                            to="/auth/forgot-password"
                            style={{
                                textDecoration: 'none',
                                color: darkTheme.palette.primary.main,
                            }}
                        >
                            Zapomniałeś hasła?
                        </Link>
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Login;