import React from 'react';
import { Link } from 'react-router-dom';
import bg from '../assets/background.jpg';
import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import {
    School as SchoolIcon,
    LibraryBooks as LibraryBooksIcon,
    People as PeopleIcon,
    Assessment as AssessmentIcon,
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
} as const;

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <Card
        sx={{
            flex: '1 1 300px',
            maxWidth: '400px',
            backgroundColor: 'rgba(93, 35, 101, 0.1)',
            border: '1px solid rgba(129, 41, 143, 0.2)',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: darkTheme.palette.primary.light,
            },
        }}
    >
        <CardContent>
            <Stack spacing={2} alignItems="center">
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(93, 35, 101, 0.2)',
                        color: darkTheme.palette.primary.light,
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ color: 'white', textAlign: 'center' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center' }}>
                    {description}
                </Typography>
            </Stack>
        </CardContent>
    </Card>
);

const features = [
    {
        icon: <LibraryBooksIcon sx={{ fontSize: 40 }} />,
        title: 'Zarządzanie Kursami',
        description: 'Intuicyjny system zarządzania kursami, materiałami i harmonogramami zajęć.',
    },
    {
        icon: <PeopleIcon sx={{ fontSize: 40 }} />,
        title: 'Współpraca',
        description: 'Efektywna komunikacja między studentami, wykładowcami i administracją.',
    },
    {
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        title: 'Analityka',
        description: 'Zaawansowane narzędzia do śledzenia postępów i analizy wyników.',
    },
] as const;

const Landing = () => {
    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                bgcolor: darkTheme.palette.background.default,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <Box
                component="header"
                sx={{
                    py: 2,
                    px: 4,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <SchoolIcon
                                sx={{
                                    fontSize: 32,
                                    color: darkTheme.palette.primary.light
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{ color: darkTheme.palette.primary.light }}
                            >
                                UniManage
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                sx={{
                                    borderColor: darkTheme.palette.primary.main,
                                    color: darkTheme.palette.primary.main,
                                    '&:hover': {
                                        borderColor: darkTheme.palette.primary.light,
                                        color: darkTheme.palette.primary.light,
                                    },
                                }}
                            >
                                Zaloguj się
                            </Button>
                            <Button
                                component={Link}
                                to="/contact"
                                variant="contained"
                                sx={{
                                    bgcolor: darkTheme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: darkTheme.palette.primary.dark,
                                    },
                                }}
                            >
                                Rozpocznij
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box
                component="section"
                sx={{
                    pt: 12,
                    pb: 6,
                    background: `linear-gradient(rgba(93, 35, 101, 0.1), rgba(21, 21, 21, 0.9))`,
                    flex: '0 0 auto',
                }}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={6}
                        alignItems="center"
                    >
                        <Box flex="1">
                            <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
                                Zarządzaj uczelnią w sposób{' '}
                                <Box
                                    component="span"
                                    sx={{ color: darkTheme.palette.primary.light }}
                                >
                                    inteligentny
                                </Box>
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, color: 'grey.400' }}>
                                Kompleksowe rozwiązanie do zarządzania procesami akademickimi,
                                stworzone z myślą o nowoczesnej edukacji.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: darkTheme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: darkTheme.palette.primary.dark,
                                    },
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                Dowiedz się więcej
                            </Button>
                        </Box>
                        <Box
                            flex="1"
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '600px'
                            }}
                        >
                            <Box
                                sx={{
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -20,
                                        left: -20,
                                        right: 20,
                                        bottom: 20,
                                        border: `2px solid ${darkTheme.palette.primary.main}`,
                                        borderRadius: 2,
                                        zIndex: 0,
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={bg}
                                    alt="University Management"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: 2,
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Box
                component="section"
                sx={{
                    py: 8,
                    flex: '1 0 auto',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{ mb: 6, textAlign: 'center', fontWeight: 600 }}
                    >
                        Funkcjonalności
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={4}
                        alignItems={{ xs: 'center', md: 'stretch' }}
                        justifyContent="center"
                        sx={{ flexWrap: 'wrap' }}
                    >
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    mt: 'auto',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ color: 'grey.500', textAlign: 'center' }}>
                        © 2024 UniManage. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;