import {useState, useEffect} from 'react';
import {useNavigate, useLocation, Routes, Route} from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    CssBaseline,
    ThemeProvider,
    createTheme,
    useMediaQuery,
    AppBar,
    IconButton,
    Collapse,
    Divider,
    Paper,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {darkTheme, styles} from './PageStyles/Dashboard';

import Overview from '../Components/views/Pulpit/Student/Overview.tsx';
import StudentSearch from '../Components/utility/StudentSearch';
import OverviewProfessor from '../Components/views/Pulpit/Prowadzacy/Overview';
import OverviewEmployee from '../Components/views/Pulpit/Pracownik/AdminDashboard';
import Performance from '../Components/views/Pulpit/Student/Courses.tsx';
import Grades from '../Components/views/Pulpit/Student/Grades.tsx';
import StudentCourses from '../Components/views/Pulpit/Student/Courses.tsx';
import Faculties from '../Components/views/Pulpit/Faculties.tsx';
import Programs from '../Components/views/Pulpit/Programs.tsx';
import Courses from '../Components/views/Pulpit/Courses.tsx';
import TrendAnalysis from '../Components/views/Analityka/TrendAnalysis';
import UserInsights from '../Components/views/Analityka/UserInsights';
import ConversionRates from '../Components/views/Analityka/ConversionRates';
import Preferences from '../Components/views/Ustawienia/Preferences';
import UserData from '../Components/views/Konto/UserData';
import Grades2 from '../Components/views/Konto/Grades';
import Permissions from '../Components/views/Konto/Permissions';

type MainMenuKey = 'D' | 'A' | 'S' | 'K' | 'P' | 'E'| 'PO';

interface User {
    role: 'student' | 'professor' | 'admin';
}

type SubMenuItem = {
    label: string;
    key: string;
    component: React.ComponentType;
};

type SubMenus = {
    [Key in MainMenuKey]: SubMenuItem[];
};

const theme = createTheme(darkTheme);

const DashboardLayout: React.FC = () => {
    console.log('DashboardLayout component mounted');
    const [user, setUser] = useState<User | null>(null);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<MainMenuKey | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getActiveMenusFromPath = () => {
        const path = location.pathname.split('/').filter(Boolean);
        const relevantPath = path.slice(path.indexOf('panel_uzytkownika') + 1);
        const mainMenu = relevantPath[0]?.toUpperCase() as MainMenuKey || 'D';
        const subMenu = relevantPath[1] || 'overview';
        return {mainMenu, subMenu};
    };

    const {mainMenu: activeMenu, subMenu: activeSubMenu} = getActiveMenusFromPath();
    type UserRole = 'Professor' | 'Student' | 'Admin';
    useEffect(() => {
        const checkUserRole = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decodedToken = JSON.parse(atob(token.split('.')[1])) as { role: UserRole };
                    setUser({role: decodedToken.role.toLowerCase() as 'student' | 'professor' | 'admin'});
                    console.log(decodedToken.role);
                    const defaultRoutes = {
                        Professor: '/panel_uzytkownika/p/overview',
                        Student: '/panel_uzytkownika/d/overview',
                        Admin: '/panel_uzytkownika/e/overview'
                    };
                    console.log(decodedToken.role);
                    if (location.pathname === '/panel_uzytkownika') {
                        navigate(defaultRoutes[decodedToken.role] || '/panel_uzytkownika/d/overview');
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        checkUserRole();
    }, [navigate, location.pathname]);

    const getMenuItemsByRole = (role: string) => {
        switch (role.toLowerCase()) {
            case 'proferssor':
                return [
                    {key: 'P' as MainMenuKey, label: 'Pulpit', icon: DashboardIcon},
                    {key: 'S' as MainMenuKey, label: 'Ustawienia', icon: SettingsIcon}
                ];
            case 'student':
                return [
                    {key: 'D' as MainMenuKey, label: 'Pulpit', icon: DashboardIcon},
                    {key: 'K' as MainMenuKey, label: 'Dla Studentów', icon: PeopleIcon},
                    {key: 'S' as MainMenuKey, label: 'Ustawienia', icon: SettingsIcon}
                ];
            case 'admin':
                return [
                    {key: 'E' as MainMenuKey, label: 'Pulpit', icon: DashboardIcon},
                    {key: 'A' as MainMenuKey, label: 'Wyszukiwarka', icon: AnalyticsIcon},
                    {key: 'K' as MainMenuKey, label: 'Dla studentów', icon: PeopleIcon},
                    {key: 'S' as MainMenuKey, label: 'Ustawienia', icon: SettingsIcon}
                ];
            default:
                return [];
        }
    };

    if (!user) {
        return <Box>Loading...</Box>;
    }

    const mainMenuItems = getMenuItemsByRole(user.role);

    if (!mainMenuItems.length) {
        return <Box>Unauthorized access</Box>;
    }

    const subMenus: SubMenus = {
        P: [
            {label: 'Widok Główny', key: 'overview', component: OverviewProfessor},
            {label: 'Studenci', key: 'students', component: Performance},
            {label: 'Kursy', key: 'courses', component: Grades},
        ],
        D: [
            {label: 'Widok Główny', key: 'overview', component: Overview},
            {label: 'Moje Kursy', key: 'performance', component: StudentCourses},
            {label: 'Moje Oceny', key: 'metrics', component: Grades}
        ],
        E: [
            {label: 'Widok Główny', key: 'overview', component: OverviewEmployee},
            {label: 'Pracownicy', key: 'tasks', component: Performance},
            {label: 'Studenci', key: 'users', component: StudentSearch},
            {label: 'Wydziały', key: 'wydzialy', component: Faculties},
            {label: 'Kierunki', key: 'kierunki', component: Programs},
            {label: 'Kursy', key: 'kursy', component: Courses},
            {label: 'Mail', key: 'mail', component: Grades}
        ],
        A: [
            {label: 'Studenci', key: 'students', component: TrendAnalysis},
            {label: 'Prowadzacy', key: 'professors', component: UserInsights},
            {label: 'Kursy', key: 'courses', component: ConversionRates},
            {label: 'Wydzialy', key: 'faculties', component: ConversionRates},
            {label: 'Kierunki', key: 'programs', component: ConversionRates}
        ],
        S: [
            {label: 'Konto', key: 'account', component: UserData},
            {label: 'Preferencje', key: 'preferences', component: Preferences},
        ],
        K: [
            {label: 'Podania i Wnioski', key: 'podania', component: UserData},
            {label: 'Płatności', key: 'platnosci', component: Grades2},
            {label: 'Rejestracja', key: 'rejestracja', component: Permissions},
            {label: 'Ankiety', key: 'ankiety', component: Permissions}
        ],
        PO: [
            {label: 'Pomoc', key: 'pomoc', component: Permissions}
        ]
    };

    const handleMenuClick = (menuKey: MainMenuKey) => {
        if (isMobile) {
            setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
        } else {
            const defaultSubMenu = subMenus[menuKey][0].key;
            navigate(`/panel_uzytkownika/${menuKey.toLowerCase()}/${defaultSubMenu}`);
        }
    };

    const handleSubMenuClick = (menuKey: MainMenuKey, subMenuKey: string) => {
        navigate(`/panel_uzytkownika/${menuKey.toLowerCase()}/${subMenuKey}`);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const getSubheading = (menuKey: MainMenuKey): string => {
        switch (menuKey) {
            case 'D':
                return 'Panel studenta';
            case 'P':
                return 'Panel prowadzącego';
            case 'E':
                return 'Panel pracownika';
            case 'A':
                return 'Wyszukaj podmioty';
            case 'S':
                return 'Zarzadzaj swoim kontem.';
            case 'K':
                return 'Zarzadzaj swoimi studiami.';
            default:
                return '';
        }
    };

    const SectionHeader = () => (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                mb: 3,
                backgroundColor: 'transparent',
                height: '10%',
            }}
        >
            <Box
                sx={{
                    px: 4,
                    py: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                <Typography variant="h4" component="h1" fontWeight="500">
                    {mainMenuItems.find(item => item.key === activeMenu)?.label}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {getSubheading(activeMenu)}
                </Typography>
            </Box>
            <Box
                sx={{
                    mx: 'auto',
                    width: '95%',
                    mt: 1
                }}
            >
                <Divider/>
            </Box>
        </Paper>
    );

    const MobileDrawer = () => (
        <Box>
            <AppBar position="fixed" sx={{width: '100%'}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{
                            margin: '10px',
                            width: '40px',
                            mr: 2,
                            display: 'flex',
                            padding: 1,
                            position: mobileOpen ? 'fixed' : 'relative',
                            zIndex: 1400,
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '80%',
                        maxWidth: '300px',
                        bgcolor: 'background.default',
                    },
                }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <Toolbar/>
                <List>
                    {mainMenuItems.map((item) => (
                        <Box key={item.key}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleMenuClick(item.key)}>
                                    <item.icon sx={{mr: 2}}/>
                                    <ListItemText primary={item.label}/>
                                    {expandedMenu === item.key ? <ExpandLess/> : <ExpandMore/>}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={expandedMenu === item.key} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {subMenus[item.key].map((subItem) => (
                                        <ListItemButton
                                            key={subItem.key}
                                            sx={{pl: 4}}
                                            onClick={() => handleSubMenuClick(item.key, subItem.key)}
                                        >
                                            <ListItemText primary={subItem.label}/>
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            </Drawer>
        </Box>
    );

    const DesktopDrawer = () => {
        const handleLogout = () => {
            localStorage.removeItem('authToken');
            navigate('/login');
        };

        return (
            <>
                <Drawer
                    variant="permanent"
                    sx={{
                        ...styles.mainDrawer,
                        '& .MuiDrawer-paper': {
                            ...styles.mainDrawer['& .MuiDrawer-paper'],
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    }}
                >
                    <Box>
                        <Toolbar>
                            <LogoDevIcon sx={styles.logo}/>
                        </Toolbar>
                        <List>
                            {mainMenuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <ListItem key={item.key} disablePadding>
                                        <ListItemButton
                                            selected={activeMenu === item.key}
                                            onClick={() => handleMenuClick(item.key)}
                                            sx={styles.menuButton}
                                        >
                                            <Icon color={activeMenu === item.key ? 'inherit' : 'action'}/>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    ...styles.menuButton,
                                    mb: 2
                                }}
                            >
                                <LogoutIcon color="action"/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>

                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={styles.subDrawer(isSubMenuOpen)}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            {mainMenuItems.find(item => item.key === activeMenu)?.label}
                        </Typography>
                    </Toolbar>
                    <List>
                        {subMenus[activeMenu].map((subItem) => (
                            <ListItem key={subItem.key} disablePadding>
                                <ListItemButton
                                    sx={styles.submenuItem}
                                    selected={activeSubMenu === subItem.key}
                                    onClick={() => handleSubMenuClick(activeMenu, subItem.key)}
                                >
                                    <ListItemText primary={subItem.label}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <Box
                    sx={styles.toggleButton(isSubMenuOpen)}
                    onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                >
                    {isSubMenuOpen ?
                        <ChevronLeftIcon sx={{fontSize: 25}}/> :
                        <ChevronRightIcon sx={{fontSize: 25}}/>
                    }
                </Box>
            </>
        );
    };

    const renderRoutes = () => (
        <Routes>
            {Object.entries(subMenus).map(([menuKey, subItems]) => (
                subItems.map(subItem => (
                    <Route
                        key={`${menuKey}-${subItem.key}`}
                        path={`/${menuKey.toLowerCase()}/${subItem.key}`}
                        element={
                            <Box>
                                <SectionHeader/>
                                <Box sx={{px: 4, width: "100%", padding: '5px', margin: '0px' }}>
                                    <subItem.component/>
                                </Box>
                            </Box>
                        }
                    />
                ))
            ))}

        </Routes>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{display: 'flex', width: '100vw'}}>
                {isMobile ? <MobileDrawer/> : <DesktopDrawer/>}
                <Box
                    component="main"
                    sx={{
                        ...styles.mainContent(isMobile, isSubMenuOpen),
                        pt: 0,
                    }}
                >
                    {renderRoutes()}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DashboardLayout;