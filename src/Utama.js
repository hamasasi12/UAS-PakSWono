import Mahasiswa from './mahasiswa';
import React from 'react';
import {
  CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Badge, Menu,
  MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle,
  ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon, BarChart as
  BarChartIcon, School as SchoolIcon
} from '@mui/icons-material';
import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

function App() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login')
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer"
              onClick={handleDrawerOpen} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            '& .MuiDrawer-paper': { position: 'revert-layer', whiteSpace: 'nowrap', width: 240, transition: 'width 0.3s', boxSizing: 'border-box' },
            '& .MuiDrawer-paperClose': { overflowX: 'hidden', transition: 'width 0.3s', width: 0 },
          }}
        >
          <Toolbar>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List>
            <ListItem button component={Link} to="/dashboard">

              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem button component={Link} to="/mahasiswa">
              
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="mahasiswa" />
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/dashboard" element={
              <div>
                <Typography variant="h4">Dashboard</Typography>
                <Typography paragraph>
                  This is the dashboard page.
                </Typography>
              </div>
            } />
            <Route path='/mahasiswa' element={<Mahasiswa/>}/>
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
