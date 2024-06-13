import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle, ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon, School as SchoolIcon } from '@mui/icons-material';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

import Mahasiswa from './mahasiswa';
import DataAsset from './dataAsset';
import Tindaklanjut from './tindaklanjut';
import RequestUser from './requestuser';
import PermintaanPerbaikan from './permintaanPerbaikan';
import PermintaanMasuk from './permintaanmasuk';

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
    navigate('/login');
  };

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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} sx={{ mr: 2 }}>
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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            '& .MuiDrawer-paper': {
              position: 'relative',
              whiteSpace: 'nowrap',
              width: open ? 240 : 0,
              transition: 'width 0.3s',
              boxSizing: 'border-box',
            },
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
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Mahasiswa" />
            </ListItem>

            <ListItem button component={Link} to="/dataAsset">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Data Asset" />
            </ListItem>

            <ListItem button component={Link} to="/tindaklanjut">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Tindak Lanjut" />
            </ListItem>

            <ListItem button component={Link} to="/requestuser">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Request User" />
            </ListItem>

            <ListItem button component={Link} to="/permintaanPerbaikan">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Permintaan Perbaikan" />
            </ListItem>

            <ListItem button component={Link} to="/permintaanmasuk">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Permintaan Masuk" />
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
            <Route path="/mahasiswa" element={<Mahasiswa />} />
            <Route path="/dataAsset" element={<DataAsset />} />
            <Route path="/tindaklanjut" element={<Tindaklanjut />} />
            <Route path="/requestuser" element={<RequestUser />} />
            <Route path="/permintaanPerbaikan" element={<PermintaanPerbaikan />} />
            <Route path="/permintaanmasuk" element={<PermintaanMasuk />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
