// src/components/DashboardLayout.tsx
import { useState } from 'react';
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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { darkTheme, styles } from './PageStyles/Dashboard.ts';

import Overview from '../Components/views/Pulpit/Overview.tsx';
import Performance from '../Components/views/Pulpit/Courses.tsx';
import Grades from '../Components/views/Pulpit/Grades.tsx';
import TrendAnalysis from '../Components/views/Analityka/TrendAnalysis';
import UserInsights from '../Components/views/Analityka/UserInsights';
import ConversionRates from '../Components/views/Analityka/ConversionRates';
import Account from '../Components/views/Ustawienia/Account';
import Preferences from '../Components/views/Ustawienia/Preferences';
import Security from '../Components/views/Ustawienia/Security';
import UserData from '../Components/views/Konto/UserData';
import Grades2 from '../Components/views/Konto/Grades';
import Permissions from '../Components/views/Konto/Permissions';

type MainMenuKey = 'D' | 'A' | 'S' | 'K';

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
  const [activeMenu, setActiveMenu] = useState<MainMenuKey>('D');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('overview');
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<MainMenuKey | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mainMenuItems: Array<{ key: MainMenuKey, label: string, icon: React.ElementType }> = [
    { key: 'D', label: 'Pulpit', icon: DashboardIcon },
    { key: 'A', label: 'Analytics', icon: AnalyticsIcon },
    { key: 'S', label: 'Ustawienia', icon: SettingsIcon },
    { key: 'K', label: 'Konto', icon: PeopleIcon }
  ];

  const subMenus: SubMenus = {
    D: [
      { label: 'Overview', key: 'overview', component: Overview },
      { label: 'Performance', key: 'performance', component: Performance },
      { label: 'Oceny', key: 'metrics', component: Grades }
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
      { label: 'Oceny', key: 'grades', component: Grades2 },
      { label: 'Uprawnienia', key: 'permissions', component: Permissions }
    ]
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
          width: '80%', // Changed from 100% to 80%
          maxWidth: '300px',
          bgcolor: 'background.default',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better for mobile performance
      }}
    >
      <Toolbar /> {/* Spacer for AppBar */}
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

  const DesktopDrawer = () => (
    <>
      <Drawer variant="permanent" sx={styles.mainDrawer}>
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

  const renderActiveView = () => {
    const activeMenuItems = subMenus[activeMenu];
    const activeItem = activeMenuItems.find(item => item.key === activeSubMenu);
    if (activeItem) {
      const Component = activeItem.component;
      return <Component />;
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
          sx={styles.mainContent(isMobile, isSubMenuOpen)}
        >
          {renderActiveView()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;