// src/styles/DashboardStyles.ts

export const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#5d2365',
      dark: '#a352b1',
      light: '#81298FFF',
    },
    background: {
      default: '#151515',
    }
  },
} as const;

export const drawerWidth = 74;
export const subDrawerWidth = 240;

export const styles = {
  mainDrawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1300,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: 'background.paper',
      zIndex: 1300,
    },
  },

  logo: {
    margin: 'auto',
    fontSize: 40,
    color: 'primary.main'
  },
  submenuItem:{
    borderRadius: '10px',
    margin: '10px 10px 0 10px',
    justifyContent: 'center',
  },
  menuButton: {
    borderRadius: '15px',
    margin: '5px',
    justifyContent: 'center',
    minHeight: 64,
    '&.Mui-selected': {
      backgroundColor: 'primary.main',
      color: 'white',
      '&:hover': {
        backgroundColor: 'primary.dark',
      }
    }
  },

  subDrawer: (isSubMenuOpen: boolean) => ({
    width: isSubMenuOpen ? subDrawerWidth : 0,
    flexShrink: 0,
    transition: 'width 0.3s ease-in-out',
    zIndex: 1200,
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      width: subDrawerWidth,
      boxSizing: 'border-box',
      left: drawerWidth,
      backgroundColor: 'background.default',
      transform: isSubMenuOpen ? 'translateX(0)' : `translateX(-${subDrawerWidth}px)`,
      transition: 'transform 0.3s ease-in-out',
      zIndex: 1200,
    },

  }),


  toggleButton: (isSubMenuOpen: boolean) => ({
    position: 'fixed',
    left: isSubMenuOpen ? `${drawerWidth + subDrawerWidth - 20}px` : `${drawerWidth - 20}px`,
    bottom: 20,
    backgroundColor: 'primary.main',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1500,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    transition: 'left 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  }),

  mainContent: (isMobile: boolean, isSubMenuOpen: boolean) => ({
    flexGrow: 1,
    bgcolor: 'background.default',
    p: 3,
    width: isMobile ? '100%' : `calc(100% - ${drawerWidth + (isSubMenuOpen ? subDrawerWidth : 0)}px)`,
    minHeight: '100vh',
    transition: 'width 0.3s ease-in-out',
    zIndex: 1100,
    mt: isMobile ? 8 : 0,
  }),

  mobileDrawer: {
    '& .MuiDrawer-paper': {
      width: '100%',
      bgcolor: 'background.default',
    },
  },

  mobileSubmenuItem: {
    pl: 4,
  },

  mobileMenuButton: {
    margin: '10px',
      width: '8%',
    mr: 2,
  },
};