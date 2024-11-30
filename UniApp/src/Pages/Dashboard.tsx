import React, { useState } from 'react';
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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LogoDevIcon from '@mui/icons-material/LogoDev';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const drawerWidth = 80;
const subDrawerWidth = 240;

type MainMenuKey = 'D' | 'A' | 'S' | 'U';

type SubMenuItem = {
  label: string;
};

type SubMenus = {
  [Key in MainMenuKey]: SubMenuItem[];
};

const DashboardLayout: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MainMenuKey>('D');

  const mainMenuItems: Array<{ key: MainMenuKey, label: string, icon: React.ElementType }> = [
    { key: 'D', label: 'Dashboard', icon: DashboardIcon },
    { key: 'A', label: 'Analytics', icon: AnalyticsIcon },
    { key: 'S', label: 'Settings', icon: SettingsIcon },
    { key: 'U', label: 'Users', icon: PeopleIcon }
  ];

  const subMenus: SubMenus = {
    D: [
      { label: 'Overview' },
      { label: 'Performance' },
      { label: 'Metrics' }
    ],
    A: [
      { label: 'Trend Analysis' },
      { label: 'User Insights' },
      { label: 'Conversion Rates' }
    ],
    S: [
      { label: 'Account' },
      { label: 'Preferences' },
      { label: 'Security' }
    ],
    U: [
      { label: 'User List' },
      { label: 'Roles' },
      { label: 'Permissions' }
    ]
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
            },
          }}
        >
          <Toolbar>
            <LogoDevIcon
              sx={{
                margin: 'auto',
                fontSize: 40,
                color: 'primary.main'
              }}
            />
          </Toolbar>
          <List>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    selected={activeMenu === item.key}
                    onClick={() => setActiveMenu(item.key)}
                    sx={{
                      justifyContent: 'center',
                      minHeight: 64,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        }
                      }
                    }}
                  >
                    <Icon
                      color={activeMenu === item.key ? 'inherit' : 'action'}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: subDrawerWidth,
            flexShrink: 0,
            marginLeft: `${drawerWidth}px`,
            '& .MuiDrawer-paper': {
              width: subDrawerWidth,
              boxSizing: 'border-box',
              left: drawerWidth,
              backgroundColor: 'background.default',
              borderRight: 'none',
            },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {mainMenuItems.find(item => item.key === activeMenu)?.label}
            </Typography>
          </Toolbar>
          <List>
            {subMenus[activeMenu].map((subItem, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemText primary={subItem.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            width: `calc(100% - ${drawerWidth + subDrawerWidth}px)`,
            minHeight: '100vh'
          }}
        >
          <Toolbar />
          <Typography variant="h4" gutterBottom>
            {mainMenuItems.find(item => item.key === activeMenu)?.label} Content
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the main content area for the selected menu item.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;