import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Settings, Logout, FilterList, Search } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { setLogout } from '../../state';
import Parser from '../parser';
import Filters from '../filters';
import { SettingsDialog } from './settings';
import logo from '../../assets/logo_full.png';

const drawerWidth = 260;

const ResponsiveNavbar = () => {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const handleButtonClick = (index: number) => {
    setSelectedButton(index);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
      <Box>
        <Toolbar>
          <Link to="/home" style={{ display: 'block', maxWidth: '90%', maxHeight: '90%' }}>
            <img src={logo} alt="logo" style={{ display: 'block', width: '100%', height: '100%' }} />
          </Link>
        </Toolbar>
        <Divider />
        <List>
          <ListItemButton selected={selectedButton === 0} onClick={() => handleButtonClick(0)}>
            <ListItemIcon>
              <Search />
            </ListItemIcon>
            <ListItemText primary={'Parser'} />
          </ListItemButton>
          <ListItemButton selected={selectedButton === 1} onClick={() => handleButtonClick(1)}>
            <ListItemIcon>
              <FilterList />
            </ListItemIcon>
            <ListItemText primary={'Filters'} />
          </ListItemButton>
        </List>
      </Box>

      <Box>
        <Divider />
        <List>
          <ListItemButton onClick={handleClickOpen}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={'Settings'} />
          </ListItemButton>
          <ListItemButton onClick={() => dispatch(setLogout())}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selectedButton === 0 ? 'Parser' : null}
            {selectedButton === 1 ? 'Filters' : null}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100%',
        }}
      >
        <Toolbar />
        <Box>
          {selectedButton === 0 ? <Parser /> : null}
          {selectedButton === 1 ? <Filters /> : null}
        </Box>

        <SettingsDialog open={open} onClose={handleClose} />
      </Box>
    </Box>
  );
};

export default ResponsiveNavbar;
