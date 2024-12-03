import { useState, useEffect } from 'react';
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
import { darkTheme, styles } from './PageStyles/Dashboard.ts';

// Import your components
import Overview from '../Components/views/Pulpit/Overview';
import OverviewProfessor from '../Components/views/Pulpit/Prowadzacy/Overview';
import OverviewEmployee from '../Components/views/Pulpit/Pracownik/AdminDashboard.tsx';
import Performance from '../Components/views/Pulpit/Courses';
import Grades from '../Components/views/Pulpit/Grades';
import TrendAnalysis from '../Components/views/Analityka/TrendAnalysis';
import UserInsights from '../Components/views/Analityka/UserInsights';
import ConversionRates from '../Components/views/Analityka/ConversionRates';
import Account from '../Components/views/Ustawienia/Account';
import Preferences from '../Components/views/Ustawienia/Preferences';
import Security from '../Components/views/Ustawienia/Security';
import UserData from '../Components/views/Konto/UserData';
import Grades2 from '../Components/views/Konto/Grades';
import Permissions from '../Components/views/Konto/Permissions';

type MainMenuKey = 'D' | 'A' | 'S' | 'K' | 'P' | 'E';

interface User {
  role: 'student' | 'professor' | 'employee';
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
  const [user, setUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<MainMenuKey>('P');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('overview');
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<MainMenuKey | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUser({ role: decodedToken.role });
            console.log(decodedToken.role);
          // Set initial active menu based on role
          switch (decodedToken.role) {
            case 'Professor':
              setActiveMenu('P');
              break;
            case 'Student':
              setActiveMenu('D');
              break;
            case 'Employee':
              setActiveMenu('E');
              break;
            default:
              window.location.href = '/login';
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    };

    checkUserRole();
  }, []);

  const getMenuItemsByRole = (role: string) => {
    switch (role) {
      case 'Professor':
        return [
          { key: 'P' as MainMenuKey, label: 'Pulpit', icon: DashboardIcon },
          { key: 'K' as MainMenuKey, label: 'Konto', icon: PeopleIcon },
          { key: 'S' as MainMenuKey, label: 'Ustawienia', icon: SettingsIcon }
        ];
      case 'Student':
        return [
          { key: 'D' as MainMenuKey, label: 'Pulpit', icon: DashboardIcon },
          { key: 'K' as MainMenuKey, label: 'Konto', icon: PeopleIcon },
          { key: 'S' as MainMenuKey, label: 'Ustawienia', icon: SettingsIcon }
        ];
      case 'Employee':
        return [
          { key: 'E' as MainMenuKey, label: 'Pulpit', icon: DashboardIcon },
          { key: 'A' as MainMenuKey, label: 'Analytics', icon: AnalyticsIcon },
          { key: 'K' as MainMenuKey, label: 'Konto', icon: PeopleIcon },
          { key: 'S' as MainMenuKey, label: 'Ustawienia', icon: SettingsIcon }
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
      { label: 'Widok Główny', key: 'overview', component: OverviewProfessor },
      { label: 'Studenci', key: 'students', component: Performance },
      { label: 'Kursy', key: 'courses', component: Grades },
    ],
    D: [
      { label: 'Widok Główny', key: 'overview', component: Overview },
      { label: 'Moje Kursy', key: 'performance', component: Performance },
      { label: 'Moje Oceny', key: 'metrics', component: Grades }
    ],
    E: [
      { label: 'Widok Główny', key: 'overview', component: OverviewEmployee },
      { label: 'Użytkownicy', key: 'tasks', component: Performance },
      { label: 'Wydziały', key: 'reports', component: Grades },
      { label: 'Kierunki', key: 'kierunki', component: Grades },
      { label: 'Kursy', key: 'kursy', component: Grades },
      { label: 'Mail', key: 'mail', component: Grades }
    ],
    A: [
      { label: 'Trend Analysis', key: 'trends', component: TrendAnalysis },
      { label: 'User Insights', key: 'insights', component: UserInsights },
      { label: 'Conversion Rates', key: 'conversion', component: ConversionRates }
    ],
    S: [
      { label: 'Account', key: 'account', component: Account },
      { label: 'Preferences', key: 'preferences', component: Preferences },
      { label: 'Security', key: 'security', component: Security }
    ],
    K: [
      { label: 'Dane', key: 'data', component: UserData },
      { label: 'Wnioski', key: 'grades', component: Grades2 },
      { label: 'Płatności', key: 'permissions', component: Permissions }
    ]
  };

  const getSubheading = (menuKey: MainMenuKey): string => {
    switch(menuKey) {
      case 'D':
        return 'Panel studenta';
      case 'P':
        return 'Panel prowadzącego';
      case 'E':
        return 'Panel pracownika';
      case 'A':
        return 'Detailed analytics and insights';
      case 'S':
        return 'Manage your system settings';
      case 'K':
        return 'User account management';
      default:
        return '';
    }
  };

  const handleMenuClick = (menuKey: MainMenuKey) => {
    if (isMobile) {
      setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
    } else {
      setActiveMenu(menuKey);
      setActiveSubMenu(subMenus[menuKey][0].key);
    }
  };

  const handleSubMenuClick = (subMenuKey: string) => {
    setActiveSubMenu(subMenuKey);
    if (isMobile) {
      setMobileOpen(false);
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
        <Divider />
      </Box>
    </Paper>
  );

  const MobileDrawer = () => (
    <Box>
      <AppBar position="fixed" sx={{ width: '100%' }}>
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
            <MenuIcon />
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
        <Toolbar />
        <List>
          {mainMenuItems.map((item) => (
            <Box key={item.key}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleMenuClick(item.key)}>
                  <item.icon sx={{ mr: 2 }} />
                  <ListItemText primary={item.label} />
                  {expandedMenu === item.key ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedMenu === item.key} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {subMenus[item.key].map((subItem) => (
                    <ListItemButton
                      key={subItem.key}
                      sx={{ pl: 4 }}
                      onClick={() => handleSubMenuClick(subItem.key)}
                    >
                      <ListItemText primary={subItem.label} />
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
    window.location.href = '/login';
  };

  return (
    <>
      <Drawer variant="permanent" sx={{
        ...styles.mainDrawer,
        '& .MuiDrawer-paper': {
          ...styles.mainDrawer['& .MuiDrawer-paper'],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }
      }}>
        <Box>
          <Toolbar>
            <LogoDevIcon sx={styles.logo} />
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
                    <Icon color={activeMenu === item.key ? 'inherit' : 'action'} />
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
              <LogoutIcon color="action" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={styles.subDrawer(isSubMenuOpen)}
      >
        {/* Rest of the sub-drawer content remains the same */}
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
                onClick={() => handleSubMenuClick(subItem.key)}
              >
                <ListItemText primary={subItem.label} />
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
          <ChevronLeftIcon sx={{ fontSize: 25 }} /> :
          <ChevronRightIcon sx={{ fontSize: 25 }} />
        }
      </Box>
    </>
  );
};

  const renderActiveView = () => {
    const activeMenuItems = subMenus[activeMenu];
    const activeItem = activeMenuItems.find(item => item.key === activeSubMenu);
    if (activeItem) {
      const Component = activeItem.component;
      return (
        <Box>
          <SectionHeader />
          <Box sx={{ px: 4 }}>
            <Component />
          </Box>
        </Box>
      );
    }
    return null;
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', width: '100vw' }}>
        {isMobile ? <MobileDrawer /> : <DesktopDrawer />}
        <Box
          component="main"
          sx={{
            ...styles.mainContent(isMobile, isSubMenuOpen),
            pt: 0,
          }}
        >
          {renderActiveView()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;